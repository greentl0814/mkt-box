import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 기본 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="mkt-box" />
        <meta name="keywords" content="마케팅 도구, UTM 생성기, 유튜브 썸네일, URL 단축, 텍스트 분석, 광고 성과 분석, 마케터 도구" />

        {/* Open Graph 기본 태그 */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="마케터를 위한 Tool Box" />
        <meta property="og:url" content="https://mkt-box.vercel.app" />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
