export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const response = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    );

    if (!response.ok) {
      throw new Error('Shortening failed');
    }

    const shortUrl = await response.text();

    // 에러 메시지 체크 (is.gd는 에러시 텍스트로 반환)
    if (shortUrl.includes('Error:')) {
      throw new Error(shortUrl);
    }

    res.status(200).json({ shortUrl });
  } catch (error) {
    console.error('URL shortening error:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
}
