import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Link2, Youtube, Type, BarChart2, FileCode } from 'lucide-react';

export default function Home() {
 const tools = [
   {
     id: 'utm',
     title: 'UTM 생성기',
     description: '마케팅 채널별 링크를 추적하고 분석하기 위한 UTM 코드를 쉽게 생성하세요.',
     icon: <FileCode className="w-6 h-6" />,
     link: '/utm'
   },
   {
     id: 'youtube',
     title: '유튜브 썸네일 추출기',
     description: '유튜브 영상의 썸네일 이미지를 다양한 해상도로 추출할 수 있습니다.',
     icon: <Youtube className="w-6 h-6" />,
     link: '/youtube'
   },
   {
     id: 'url',
     title: 'URL 단축기',
     description: '긴 URL을 간단하게 줄여서 관리와 공유를 더 쉽게 만들어줍니다.',
     icon: <Link2 className="w-6 h-6" />,
     link: '/url'
   },
   {
     id: 'text',
     title: '텍스트 분석기',
     description: '텍스트의 글자수와 바이트를 실시간으로 체크하고 분석합니다.',
     icon: <Type className="w-6 h-6" />,
     link: '/text'
   },
   {
     id: 'analytics',
     title: '광고 성과 분석',
     description: 'ROAS, CPC, CTR 등 주요 광고 지표를 분석하고 성과를 측정합니다.',
     icon: <BarChart2 className="w-6 h-6" />,
     link: '/analytics'
   }
 ];

 return (
   <>
     <Head>
       <title>마케팅 도구 모음 - 실용적인 마케팅 툴 모음</title>
       <meta name="description" content="UTM 생성, 썸네일 추출, URL 단축 등 마케터에게 필요한 다양한 도구를 제공합니다." />
     </Head>

     <main className="container mx-auto px-4 py-8">
       <h1 className="text-3xl font-bold text-center mb-8">
         마케터를 위한 Tool Box
       </h1>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {tools.map((tool) => (
           <div
             key={tool.id}
             className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
           >
             <div className="flex items-center mb-4">
               <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                 {tool.icon}
               </div>
               <h2 className="text-xl font-semibold ml-3">{tool.title}</h2>
             </div>
             <p className="text-gray-600 mb-4 min-h-[48px]">{tool.description}</p>
             <Link
               href={tool.link}
               className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full text-center"
             >
               도구 사용하기
             </Link>
           </div>
         ))}
       </div>
     </main>
   </>
 );
}
