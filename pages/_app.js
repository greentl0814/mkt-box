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
     console.log('🪟 Window object exists:', typeof window !== 'undefined');
     console.log('📢 AdSense object exists:', !!(typeof window !== 'undefined' && window.adsbygoogle));
     
     try {
       if (typeof window !== 'undefined') {
         if (window.adsbygoogle) {
           console.log('📢 AdSense array length before push:', window.adsbygoogle.length);
           (window.adsbygoogle = window.adsbygoogle || []).push({});
           console.log('✅ AdSense push executed successfully');
           console.log('📢 AdSense array length after push:', window.adsbygoogle.length);
         } else {
           console.log('❌ AdSense not loaded yet');
         }
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
     <Script
       src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6071061687711848"
       strategy="afterInteractive"
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
