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
     
     try {
       if (typeof window !== 'undefined') {
         // 기존 광고 요소들의 data-adsbygoogle-status 초기화
         const existingAds = document.querySelectorAll('.adsbygoogle');
         console.log('📢 Found existing ads:', existingAds.length);
         
         existingAds.forEach((ad, index) => {
           console.log(`🔧 Processing ad ${index + 1}:`, {
             hasStatus: ad.hasAttribute('data-adsbygoogle-status'),
             status: ad.getAttribute('data-adsbygoogle-status'),
             innerHTML: ad.innerHTML.length
           });
           
           // 광고 상태 초기화
           ad.removeAttribute('data-adsbygoogle-status');
           ad.innerHTML = '';
         });
         
         // 잠시 대기 후 AdSense 새로고침
         setTimeout(() => {
           if (window.adsbygoogle) {
             // 각 광고 요소에 대해 개별적으로 push
             existingAds.forEach((ad, index) => {
               try {
                 console.log(`🔄 Refreshing ad ${index + 1}...`);
                 (window.adsbygoogle = window.adsbygoogle || []).push({});
               } catch (e) {
                 console.error(`❌ Error refreshing ad ${index + 1}:`, e);
               }
             });
             console.log('✅ AdSense refresh completed for all ads');
           }
         }, 100);
       }
     } catch (e) {
       console.error('❌ AdSense refresh error:', e);
     }
   };

   console.log('🎯 Setting up route change listener');
   router.events.on('routeChangeComplete', handleRouteChange);
   
   return () => {
     console.log('🧹 Cleaning up route change listener');
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

     {/* Google AdSense */}
     <script
       async
       src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6071061687711848"
       crossOrigin="anonymous"
     />

     <main className="flex-grow">
       <Component {...pageProps} />
     </main>
     <Footer />
   </div>
 );
}

export default MyApp;
