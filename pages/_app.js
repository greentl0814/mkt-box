import "../styles/globals.css"; 
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
 return (
   <div className="min-h-screen flex flex-col">
     <main className="flex-grow">
       <Component {...pageProps} />
     </main>
     <Footer />
   </div>
 );
}

export default MyApp;
