// pages/_app.js

import "../styles/globals.css";
import { useEffect } from 'react'; // useEffect 추가
import { useRouter } from "next/router"; // useRouter는 이미 있음
import Script from "next/script";
import Head from "next/head";
import Footer from "../components/Footer";

// ✅ 애드센스 게시자 ID (본인 것으로 다시 한번 확인)
const ADSENSE_CLIENT_ID = 'ca-pub-6071061687711848';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // ✅ SPA 페이지 이동 시 광고를 새로고침하는 로직
  useEffect(() => {
    const handleRouteChange = (url) => {
      // 프로덕션 환경에서만 실행
      if (process.env.NODE_ENV === 'production') {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.error("Failed to push to adsbygoogle", err);
        }
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);


  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="canonical"
          href={`https://www.mktbox.co.kr${router.asPath}`}
        />
        {/* ✅ 애드센스 자동 광고 스크립트 (next/script로 최적화) */}
        {process.env.NODE_ENV === 'production' && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
          />
        )}
      </Head>

      {/* --- 기존 구글 애널리틱스 코드는 그대로 유지 --- */}
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
