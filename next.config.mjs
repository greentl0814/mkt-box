/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ];
  },
};

export default nextConfig;
