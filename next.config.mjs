/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localeDetection: false
  },
  async redirects() {
    return [
      {
        // Vercel 도메인을 mktbox.co.kr로 강제 이동
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'mkt-box.vercel.app',
          },
        ],
        destination: 'https://www.mktbox.co.kr/:path*',
        statusCode: 301
      },
      {
        // 1. 유튜브 댓글 다운로드 이전
        source: '/youtube-comments',
        destination: 'https://pikk.co.kr/tools/youtube',
        permanent: true,
      },
      {
        // 2. 유튜브 썸네일 다운로드 이전 (신규 추가)
        source: '/youtube',
        destination: 'https://pikk.co.kr/tools/thumbnail',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
