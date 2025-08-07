// pages/_app.js

import "../styles/globals.css";
import { useState, useEffect } from 'react'; // useState 추가
import { useRouter } from "next/router";
import Script from "next/script";
import Head from "next/head";
import Footer from "../components/Footer";

const ADSENSE_CLIENT_ID = 'ca-pub-6071061687711848';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  // ✅ 스크립트 로딩 상태를 추적하는 state 추가
  const [isAdScriptLoaded, setIsAdScriptLoaded] = useState(false);

  useEffect(() => {
    // ✅ 광고 스크립트가 로드된 후에만 라우터 이벤트를 감지하도록 수정
    if (!isAdScriptLoaded) {
      return; // 스크립트가 로드되지 않았으면 아무것도 하지 않음
    }

    const handleRouteChange = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error("Failed to push to adsbygoogle", err);
      }
    };

    // 최초 로딩 시 한 번 실행 (첫 페이지 광고를 위해)
    handleRouteChange();

    // 그 후 페이지 변경 시마다 실행
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
    // isAdScriptLoaded 상태가 true로 바뀔 때 이 useEffect가 실행됨
  }, [isAdScriptLoaded, router.events]);


  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="canonical"
          href={`https://www.mktbox.co.kr${router.asPath}`}
        />
        {/*
          로컬 테스트 시에도 광고를 확인하고 싶다면,
          아래 라인의 `process.env.NODE_ENV === 'production'` 부분을 잠시 지우고 테스트하세요.
          단, 배포 전에는 다시 원상복구 하는 것이 좋습니다.
        */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            // ✅ 스크립트 로딩이 완료되면 isAdScriptLoaded 상태를 true로 변경
            onLoad={() => setIsAdScriptLoaded(true)}
          />
        )}
      </Head>

      {/* --- 구글 애널리틱스 코드 (변경 없음) --- */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-T0EEHV122X"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-T0EEHV122X');
        `}
      </Script>

      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default MyApp;
