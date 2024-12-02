// pages/privacy-policy.js
import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
 return (
   <>
     <Head>
       <title>개인정보처리방침 - Marketing Tools</title>
       <meta name="description" content="Marketing Tools의 개인정보처리방침입니다." />
     </Head>

     <div className="container mx-auto px-4 py-8 max-w-4xl">
       <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
         ← 메인으로 돌아가기
       </Link>

       <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

       <div className="prose max-w-none">
         <p className="mb-4">
           Marketing Tools(이하 &apos;사이트&apos;)는 이용자의 프라이버시를 존중하며, 관련 법령을 준수하기 위해 다음과 같은 처리방침을 두고 있습니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">1. 수집하는 정보</h2>
         <p className="mb-4">
           사이트는 별도의 회원가입 없이 무료로 서비스를 제공하고 있으며, 최소한의 정보만을 수집합니다:
         </p>
         <ul className="list-disc pl-6 mb-4">
           <li>자동 수집 정보: 방문 기록, IP 주소</li>
           <li>Google Analytics를 통한 사이트 이용 통계</li>
           <li>광고 서비스 제공을 위한 쿠키 정보</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">2. 수집 목적</h2>
         <ul className="list-disc pl-6 mb-4">
           <li>사이트 이용 현황 파악 및 서비스 개선</li>
           <li>맞춤형 광고 제공</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">3. 쿠키 사용</h2>
         <p className="mb-4">
           이 사이트는 Google Analytics 및 광고 서비스 제공을 위해 쿠키를 사용합니다.
           브라우저 설정에서 쿠키 사용을 거부할 수 있으며, 이 경우 일부 서비스 이용에 제한이 있을 수 있습니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">4. 정보 보안</h2>
         <p className="mb-4">
           사이트는 이용자의 개인정보 보호를 위해 다음과 같은 기본적인 보안 조치를 취하고 있습니다:
         </p>
         <ul className="list-disc pl-6 mb-4">
           <li>SSL 보안 프로토콜 사용</li>
           <li>개인정보가 포함된 데이터 수집 제한</li>
           <li>자동 수집되는 정보의 최소화</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">5. 문의</h2>
         <p className="mb-4">
           개인정보 처리방침에 대한 문의사항은 다음 이메일로 연락주시기 바랍니다:<br />
           이메일: kj0815@gmail.com
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">6. 개인정보처리방침 변경</h2>
         <p className="mb-4">
           이 개인정보처리방침은 2024년 12월 1일부터 적용되며, 변경사항이 있을 경우 사이트를 통해 공지하겠습니다.
         </p>
       </div>
     </div>
   </>
 );
}
