// pages/terms.js
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
 return (
   <>
     <Head>
       <title>이용약관 - Marketing Tools</title>
       <meta name="description" content="Marketing Tools의 이용약관입니다." />
     </Head>

     <div className="container mx-auto px-4 py-8 max-w-4xl">
       <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
         ← 메인으로 돌아가기
       </Link>

       <h1 className="text-3xl font-bold mb-8">이용약관</h1>

       <div className="prose max-w-none">
         <p className="mb-4">
           Marketing Tools(이하 '사이트')의 서비스 이용과 관련하여 필요한 사항을 규정합니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">1. 목적</h2>
         <p className="mb-4">
           이 약관은 사이트가 제공하는 모든 서비스의 이용 조건 및 절차, 이용자와 사이트의 권리, 의무, 책임 등을 규정하는 것을 목적으로 합니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">2. 서비스 이용</h2>
         <ul className="list-disc pl-6 mb-4">
           <li>사이트는 별도의 회원 가입 없이 무료로 서비스를 제공합니다.</li>
           <li>서비스는 웹브라우저를 통해 제공되며, 브라우저 종류 및 버전에 따라 일부 기능이 제한될 수 있습니다.</li>
           <li>사이트는 서비스 향상을 위해 사전 고지 없이 서비스 내용을 변경할 수 있습니다.</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">3. 이용자의 의무</h2>
         <ul className="list-disc pl-6 mb-4">
           <li>이용자는 서비스 이용 시 관련 법령과 이 약관의 규정을 준수해야 합니다.</li>
           <li>이용자는 서비스를 이용하여 얻은 정보를 무단으로 복제, 배포할 수 없습니다.</li>
           <li>이용자는 서비스의 안정적 운영을 방해하는 행위를 해서는 안 됩니다.</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">4. 면책조항</h2>
         <ul className="list-disc pl-6 mb-4">
           <li>사이트는 무료로 제공되는 서비스 이용과 관련하여 발생한 손해에 대해 책임을 지지 않습니다.</li>
           <li>천재지변, 기술적 결함 등으로 인한 서비스 제공 중단에 대해 책임을 지지 않습니다.</li>
           <li>사이트가 제공하는 도구를 통해 생성된 결과물의 활용은 이용자의 책임입니다.</li>
         </ul>

         <h2 className="text-2xl font-semibold mt-8 mb-4">5. 저작권</h2>
         <p className="mb-4">
           사이트가 제공하는 모든 서비스, 정보, 디자인 등에 대한 저작권은 사이트에 귀속됩니다.
           이용자는 비상업적 목적으로 서비스를 이용할 수 있으나, 사이트의 동의 없이 이를 상업적으로 이용할 수 없습니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">6. 약관의 변경</h2>
         <p className="mb-4">
           사이트는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 사이트를 통해 공지합니다.
           변경된 약관에 동의하지 않는 이용자는 서비스 이용을 중단할 수 있습니다.
         </p>

         <h2 className="text-2xl font-semibold mt-8 mb-4">7. 분쟁해결</h2>
         <p className="mb-4">
           서비스 이용으로 발생한 분쟁은 관련 법령에 따라 처리되며,
           분쟁 발생 시 양 당사자는 상호 협의하여 분쟁 해결을 위해 노력합니다.
         </p>

         <p className="mt-8 text-gray-600">
           시행일자: 2024년 12월 1일
         </p>
       </div>
     </div>
   </>
 );
}
