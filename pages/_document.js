import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  // 도메인 설정 중앙화
  const DOMAIN = 'https://www.mktbox.co.kr'

  // 도구 목록 중앙화
  const tools = [
    {
      name: "UTM 생성기",
      description: "마케팅 채널별 링크 추적을 위한 UTM 태그를 쉽게 생성",
      path: "/utm"
    },
    {
      name: "유튜브 썸네일 추출기",
      description: "유튜브 영상의 고화질 썸네일 이미지 다운로드",
      path: "/youtube"
    },
    {
      name: "유튜브 댓글 추출기",
      description: "유튜브 영상의 댓글을 엑셀 파일로 추출하여 분석",
      path: "/youtube-comments"
    },
    {
      name: "유튜브 타임스탬프",
      description: "유튜브 동영상의 특정 시간대로 이동하는 링크 생성",
      path: "/youtube-time"
    },
    {
      name: "URL 단축기",
      description: "긴 URL을 짧게 줄여서 관리와 공유를 편리하게",
      path: "/url"
    },
    {
      name: "텍스트 분석기",
      description: "텍스트의 글자수와 바이트를 실시간으로 분석",
      path: "/text"
    },
    {
      name: "광고 성과 분석",
      description: "ROAS, CPC, CTR 등 광고 성과 지표 계산",
      path: "/analytics"
    },
    {
      name: "워드클라우드 생성기",
      description: "텍스트 데이터를 시각적인 워드클라우드로 변환",
      path: "/word-cloud"
    },
    {
      name: "컬러 팔레트",
      description: "브랜드에 맞는 완벽한 컬러 조합 생성",
      path: "/colors"
    }
  ]

  // 기능 목록 생성
  const featureList = tools.map(tool => `${tool.name} - ${tool.description}`)

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
        <meta name="keywords" content="마케팅 도구, UTM 생성기, 유튜브 썸네일 추출, 유튜브 댓글 추출, 유튜브 타임스탬프, URL 단축, 텍스트 분석, 광고 성과 분석, 워드클라우드, 컬러 팔레트, marketing tools, UTM generator, YouTube thumbnail extractor, URL shortener, text analysis, ROAS calculator, word cloud generator, color palette" />

        {/* 다국어 설정 */}
        <link rel="alternate" hrefLang="ko" href={DOMAIN} />
        <link rel="alternate" hrefLang="en" href={`${DOMAIN}/en`} />
        <link rel="alternate" hrefLang="x-default" href={DOMAIN} />

        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* JSON-LD 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Marketing Tools",
              "description": "마케터를 위한 필수 도구 모음 - UTM 생성기, 유튜브 도구, URL 단축기 등 무료로 제공",
              "url": DOMAIN,
              "applicationCategory": "BusinessApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "featureList": featureList,
              "availableLanguage": ["Korean", "English"]
            })
          }}
        />

        {/* 도구별 JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": tools.map(tool => ({
                "@type": "SoftwareApplication",
                "name": tool.name,
                "applicationCategory": "BusinessApplication",
                "description": tool.description,
                "url": `${DOMAIN}${tool.path}`
              }))
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
