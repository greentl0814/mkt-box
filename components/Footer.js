// components/Footer.js
import Link from 'next/link';

export default function Footer() {
 return (
   <footer className="border-t mt-12 py-6 bg-gray-50">
     <div className="container mx-auto px-4">
       <div className="flex justify-center space-x-6 text-sm text-gray-600">
         <Link
           href="/privacy-policy"
           className="hover:text-gray-900"
         >
           개인정보처리방침
         </Link>
         <Link
           href="/terms"
           className="hover:text-gray-900"
         >
           이용약관
         </Link>
       </div>
       <p className="text-center text-sm text-gray-500 mt-4">
         © {new Date().getFullYear()} Marketing Tools. All rights reserved.
       </p>
     </div>
   </footer>
 );
}
