export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Cloudflare D1 환경변수 체크
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    console.error('Missing Cloudflare D1 environment variables.');
    return res.status(500).json({
      error: 'Database configuration is incomplete. Please setup Cloudflare D1 variables.'
    });
  }

  // URL 정규화 (프로토콜 누락 시 기본값 추가)
  let normalizedUrl = url.trim();
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = 'http://' + normalizedUrl;
  }

  // 6자리 임의 영숫자 단축 코드 생성 함수
  function generateShortCode() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Cloudflare D1 HTTP API 쿼리 헬퍼
  async function runD1Query(sql, params = []) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`D1 Query API error: ${response.status} - ${errorText}`);
    }

    const json = await response.json();
    if (!json.success) {
      throw new Error(`D1 SQL failure: ${JSON.stringify(json.errors)}`);
    }

    return json.result[0];
  }

  try {
    // 1. 이미 등록되어 있는 원본 URL인지 조회 (중복 등록 방지)
    const selectQuery = 'SELECT code FROM mktbox_links WHERE original_url = ? LIMIT 1';
    const selectResult = await runD1Query(selectQuery, [normalizedUrl]);
    
    let shortCode = null;
    if (selectResult && selectResult.results && selectResult.results.length > 0) {
      shortCode = selectResult.results[0].code;
    }

    // 2. 신규 등록일 경우 새로운 코드 생성 및 Insert
    if (!shortCode) {
      let attempts = 0;
      while (attempts < 10) {
        const potentialCode = generateShortCode();
        // 코드 중복 조회
        const codeCheckQuery = 'SELECT code FROM mktbox_links WHERE code = ? LIMIT 1';
        const checkResult = await runD1Query(codeCheckQuery, [potentialCode]);
        
        if (!checkResult || !checkResult.results || checkResult.results.length === 0) {
          shortCode = potentialCode;
          break;
        }
        attempts++;
      }

      if (!shortCode) {
        throw new Error('Failed to generate unique short code');
      }

      // D1 Database 테이블에 신규 행 삽입
      const insertQuery = 'INSERT INTO mktbox_links (code, original_url, created_at) VALUES (?, ?, ?)';
      await runD1Query(insertQuery, [shortCode, normalizedUrl, new Date().toISOString()]);
    }

    // 3. 호출 도메인을 동적으로 감지하여 완성형 단축 링크 리턴
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host || 'mktbox.co.kr';
    const shortUrl = `${protocol}://${host}/s/${shortCode}`;

    return res.status(200).json({ shortUrl });
  } catch (error) {
    console.error('Cloudflare D1 URL shortening error:', error);
    res.status(500).json({ error: 'Failed to process URL shortening internally via D1' });
  }
}
