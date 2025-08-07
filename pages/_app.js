import "../styles/globals.css";
import Footer from "../components/Footer";
import Script from "next/script";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
 const router = useRouter();

 useEffect(() => {
   const handleRouteChange = (url) => {
     console.log('🔄 Route changed to:', url);
     
     // 페이지 로드 후 충분한 시간 대기
     setTimeout(() => {
       try {
         if (typeof window !== 'undefined' && window.adsbygoogle) {
           const existingAds = document.querySelectorAll('.adsbygoogle');
           console.log('📢 Found existing ads:', existingAds.length);
           
           if (existingAds.length > 0) {
             existingAds.forEach((ad, index) => {
               const hasStatus = ad.hasAttribute('data-adsbygoogle-status');
               console.log(`🔧 Processing ad ${index + 1}: status=${hasStatus}`);
               
               // 이미 처리된 광고만 초기화
               if (hasStatus) {
                 ad.removeAttribute('data-adsbygoogle-status');
                 ad.innerHTML = '';
               }
             });
             
             // AdSense 자동광고 새로고침
             setTimeout(() => {
               try {
                 console.log('🔄 Refreshing AdSense...');
                 (window.adsbygoogle = window.adsbygoogle || []).push({});
                 console.log('✅ AdSense refresh completed');
               } catch (e) {
                 console.error('❌ AdSense refresh error:', e);
               }
             }, 200);
           }
         } else {
           console.log('❌ AdSense not ready yet');
         }
       } catch (e) {
         console.error('❌ Route change handler error:', e);
       }
     }, 500);
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
       <meta name="google-adsense-account" content="ca-pub-6071061687711848" />
       <link
         rel="canonical"
         href={`https://www.mktbox.co.kr${router.asPath}`}
       />
       <script
         async
         src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6071061687711848"
         crossOrigin="anonymous"
       />
     </Head>
     {/* Google Analytics */}
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
