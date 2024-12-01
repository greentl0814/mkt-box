import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function TextCounter() {
 const [text, setText] = useState('');

 // 전체 글자수
 const totalCount = text.length;

 // 공백 제외 글자수
 const noSpaceCount = text.replace(/\s/g, '').length;

 // 바이트 계산 (2바이트, 3바이트)
 const getByteLength = (str, bytePerKorean) => {
   let byte = 0;
   for (let i = 0; i < str.length; i++) {
     const charCode = str.charCodeAt(i);
     if (charCode <= 0x7F) {
       byte += 1; // 영어, 숫자, 기본 특수문자
     } else {
       byte += bytePerKorean; // 한글, 기타 유니코드
     }
   }
   return byte;
 };

 const byteCount2 = getByteLength(text, 2);
 const byteCount3 = getByteLength(text, 3);

 return (
   <>
     <Head>
       <title>글자수 세기 - Marketing Tools</title>
       <meta name="description" content="텍스트의 전체 글자수, 공백 제외 글자수, 바이트 수를 실시간으로 확인하세요." />
     </Head>

     <div className="p-8 max-w-4xl mx-auto">
       <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
         ← 메인으로 돌아가기
       </Link>

       <h1 className="text-2xl font-bold mb-6">글자수 세기</h1>

       <div className="space-y-6">
         <div>
           <textarea
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="텍스트를 입력하세요."
             className="w-full h-60 p-4 border rounded resize-none"
           />
         </div>

         <div className="bg-gray-50 p-4 rounded flex gap-8">
           <div>
             <div className="text-sm text-gray-600">전체 글자수</div>
             <div className="text-2xl font-bold">{totalCount}</div>
           </div>
           <div>
             <div className="text-sm text-gray-600">공백 제외</div>
             <div className="text-2xl font-bold">{noSpaceCount}</div>
           </div>
           <div>
             <div className="text-sm text-gray-600">바이트 수 (2byte)</div>
             <div className="text-2xl font-bold">{byteCount2}</div>
           </div>
           <div>
             <div className="text-sm text-gray-600">바이트 수 (3byte)</div>
             <div className="text-2xl font-bold">{byteCount3}</div>
           </div>
         </div>

         {/* 바이트 계산 설명 */}
         <div className="bg-blue-50 p-4 rounded space-y-2 text-sm text-gray-700">
           <p className="font-medium">바이트 계산 기준</p>
           <ul className="list-disc list-inside space-y-1">
             <li>영어/숫자/기본 특수문자: 1바이트</li>
             <li>한글: 인코딩 방식에 따라 2바이트 또는 3바이트</li>
           </ul>

           <p className="font-medium mt-4">인코딩별 한글 바이트 수</p>
           <ul className="list-disc list-inside space-y-1">
             <li>UTF-8: 3바이트 (유니코드 문자를 효율적으로 처리하는 가변 길이 인코딩)</li>
             <li>EUC-KR: 2바이트 (과거 한글 전용 인코딩)</li>
             <li>UTF-16: 2바이트 (모든 유니코드 문자를 2바이트로 처리)</li>
           </ul>

           <p className="font-medium mt-4">플랫폼별 기준</p>
           <ul className="list-disc list-inside space-y-1">
             <li>네이버/카카오 광고: 일반적으로 2바이트 기준 사용</li>
             <li>구글/페이스북 광고: 글자 수로만 제한 (바이트 수 무관)</li>
           </ul>
         </div>
       </div>
     </div>
   </>
 );
}
