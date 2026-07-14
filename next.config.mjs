/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 기존 사이트의 다국어 설정 유지
  i18n: {
    locales: ['ko', 'en'],
    defaultLocale: 'ko',
    localeDetection: false
  },
  async redirects() {
    return [
      {
        // 1. Vercel 기본 도메인(mkt-box.vercel.app) 접속 시 공식 도메인으로 강제 이동
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

      // ==========================================
      // [순차적 이전] 완료된 도구 핀셋 리다이렉트 (301 적용)
      // ==========================================

      // 1. 유튜브 댓글 다운로드 이전
      {
        source: '/youtube-comments',
        destination: 'https://pikk.co.kr/tools/youtube',
        statusCode: 301,
        locale: false, // Next.js가 자동으로 언어 접두사를 붙이는 것을 방지
      },
      {
        // 기존 영문 경로로 접속한 유저/크롤러도 pikk 한국어 페이지로 점수 이전
        source: '/en/youtube-comments',
        destination: 'https://pikk.co.kr/tools/youtube',
        statusCode: 301,
        locale: false,
      },

      // 2. 유튜브 썸네일 다운로드 이전
      {
        source: '/youtube',
        destination: 'https://pikk.co.kr/tools/thumbnail',
        statusCode: 301,
        locale: false,
      },
      {
        source: '/en/youtube',
        destination: 'https://pikk.co.kr/tools/thumbnail',
        statusCode: 301,
        locale: false,
      },

      // 3. UTM 빌더 이전
      {
        source: '/utm',
        destination: 'https://pikk.co.kr/tools/utm',
        statusCode: 301,
        locale: false,
      },
      {
        source: '/en/utm',
        destination: 'https://pikk.co.kr/tools/utm',
        statusCode: 301,
        locale: false,
      },

      // 4. 글자수 세기 이전
      {
        source: '/text',
        destination: 'https://pikk.co.kr/tools/wordcount',
        statusCode: 301,
        locale: false,
      },
      {
        source: '/en/text',
        destination: 'https://pikk.co.kr/tools/wordcount',
        statusCode: 301,
        locale: false,
      },
    ];
  },
};

export default nextConfig;
