import "../styles/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdSenseLayout from "../components/AdSenseLayout";
import Script from "next/script";
import Head from "next/head";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
 const router = useRouter();

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

     {/* Kakao Ad Script */}
     <Script
       src="//t1.daumcdn.net/kas/static/ba.min.js"
       strategy="afterInteractive"
       async
     />

     <Header />
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
