import "../styles/globals.css";
import Footer from "../components/Footer";
import AdSenseLayout from "../components/AdSenseLayout";
import Script from "next/script";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
 const router = useRouter();

 useEffect(() => {
   const handleRouteChange = (url) => {
     console.log('🔄 Route changed to:', url);
     
     setTimeout(() => {
       try {
         if (typeof window !== 'undefined' && window.adsbygoogle) {
           const existingAds = document.querySelectorAll('.adsbygoogle');
           console.log('📢 Found existing ads for refresh:', existingAds.length);
           
           existingAds.forEach((ad, index) => {
             const hasStatus = ad.hasAttribute('data-adsbygoogle-status');
             if (hasStatus) {
               console.log(`🔄 Refreshing ad ${index + 1}`);
               ad.removeAttribute('data-adsbygoogle-status');
               ad.innerHTML = '';
               
               // 개별 광고 새로고침
               setTimeout(() => {
                 (window.adsbygoogle = window.adsbygoogle || []).push({});
               }, 100);
             }
           });
         }
       } catch (e) {
         console.error('❌ AdSense refresh error:', e);
       }
     }, 300);
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
       <AdSenseLayout>
         <Component {...pageProps} />
       </AdSenseLayout>
     </main>
     <Footer />
   </div>
 );
}

export default MyApp;
