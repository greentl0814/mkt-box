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
        // 알림창이나 꼬리표 없이 pikk의 기능 페이지로 직행
        source: '/youtube-comments',
        destination: 'https://pikk.co.kr/tools/youtube',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
