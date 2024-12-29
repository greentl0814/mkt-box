// _document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 기본 메타태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="mktbox" />
        <meta name="keywords" content="마케팅 도구, UTM 생성기, 유튜브 썸네일, URL 단축, 텍스트 분석, 광고 성과 분석, 마케터 도구" />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />

        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Marketing Tools",
              "description": "마케팅 도구 모음 - UTM 생성기, 유튜브 도구 등",
              "url": "https://mktbox.co.kr",
              "applicationCategory": "BusinessApplication"
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
