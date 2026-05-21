export default function RedirectPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-500 font-semibold text-sm">자체 클라우드 데이터베이스를 확인 중입니다...</p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { code } = context.params;

  // Cloudflare D1 환경변수 로드
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (!accountId || !databaseId || !apiToken) {
    console.error('Cloudflare D1 environment variables are not set.');
    return {
      redirect: {
        destination: '/url?error=db_config',
        permanent: false,
      },
    };
  }

  try {
    // Cloudflare D1 HTTP API를 통해 원본 URL을 원격 조회
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: 'SELECT original_url FROM mktbox_links WHERE code = ? LIMIT 1',
          params: [code],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`D1 API redirect check failed: ${response.status}`);
    }

    const json = await response.json();
    
    if (json.success && json.result && json.result[0] && json.result[0].results && json.result[0].results.length > 0) {
      const originalUrl = json.result[0].results[0].original_url;
      
      // HTTP 307 임시 리다이렉션을 통해 브라우저를 원본 페이지로 순간 이동
      return {
        redirect: {
          destination: originalUrl,
          permanent: false,
        },
      };
    }

    // 일치하는 단축 코드가 데이터베이스에 없는 경우
    return {
      redirect: {
        destination: '/url?error=not_found',
        permanent: false,
      },
    };
  } catch (error) {
    console.error('Cloudflare D1 redirect system error:', error);
    return {
      redirect: {
        destination: '/url?error=system',
        permanent: false,
      },
    };
  }
}
