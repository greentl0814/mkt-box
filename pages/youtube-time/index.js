// pages/youtube-time.js
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function YouTubeTime() {
 const [url, setUrl] = useState('');
 const [hours, setHours] = useState('');
 const [minutes, setMinutes] = useState('');
 const [seconds, setSeconds] = useState('');
 const [generatedUrls, setGeneratedUrls] = useState([]);
 const [error, setError] = useState('');
 const [copyMessage, setCopyMessage] = useState('');

 const validateYouTubeUrl = (url) => {
   const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
   return regExp.test(url);
 };

 const extractVideoId = (url) => {
   const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
   const match = url.match(regExp);
   return match ? match[1] : null;
 };

 const generateUrl = () => {
   if (!url) {
     setError('YouTube URL을 입력해주세요');
     return;
   }

   if (!validateYouTubeUrl(url)) {
     setError('올바른 YouTube URL이 아닙니다');
     return;
   }

   if (!hours && !minutes && !seconds) {
     setError('시간을 입력해주세요');
     return;
   }

   const totalSeconds = (parseInt(hours || 0) * 3600) +
                       (parseInt(minutes || 0) * 60) +
                       parseInt(seconds || 0);

   if (totalSeconds === 0) {
     setError('0초는 입력할 수 없습니다');
     return;
   }

   const videoId = extractVideoId(url);
   const newUrl = `https://youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;

   setGeneratedUrls([
     {
       originalTime: `${hours ? hours + '시간 ' : ''}${minutes ? minutes + '분 ' : ''}${seconds ? seconds + '초' : ''}`,
       url: newUrl
     },
     ...generatedUrls
   ]);
   setError('');
 };

 const copyToClipboard = (url) => {
   navigator.clipboard.writeText(url);
   setCopyMessage('URL이 복사되었습니다!');
   setTimeout(() => {
     setCopyMessage('');
   }, 2000);
 };

 return (
   <>
     <Head>
       <title>YouTube 타임스탬프 URL 생성기 - Marketing Tools</title>
       <meta name="description" content="YouTube 동영상의 특정 시간대로 바로 이동하는 URL을 생성합니다." />
     </Head>

     <div className="p-8 max-w-4xl mx-auto">
       <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
         ← 메인으로 돌아가기
       </Link>

       <h1 className="text-2xl font-bold mb-6">YouTube 타임스탬프 URL 생성기</h1>

       <div className="space-y-6">
         {/* URL 입력 */}
         <div>
           <label className="block mb-2 font-medium">YouTube URL</label>
           <input
             type="text"
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             placeholder="https://www.youtube.com/watch?v=..."
             className="w-full p-2 border rounded"
           />
         </div>

         {/* 시간 입력 */}
         <div className="grid grid-cols-3 gap-4">
           <div>
             <label className="block mb-2 font-medium">시간</label>
             <input
               type="number"
               min="0"
               value={hours}
               onChange={(e) => setHours(e.target.value)}
               placeholder="0"
               className="w-full p-2 border rounded"
             />
           </div>
           <div>
             <label className="block mb-2 font-medium">분</label>
             <input
               type="number"
               min="0"
               max="59"
               value={minutes}
               onChange={(e) => setMinutes(e.target.value)}
               placeholder="0"
               className="w-full p-2 border rounded"
             />
           </div>
           <div>
             <label className="block mb-2 font-medium">초</label>
             <input
               type="number"
               min="0"
               max="59"
               value={seconds}
               onChange={(e) => setSeconds(e.target.value)}
               placeholder="0"
               className="w-full p-2 border rounded"
             />
           </div>
         </div>

         {error && (
           <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
             {error}
           </div>
         )}

         <button
           onClick={generateUrl}
           className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
         >
           타임스탬프 URL 생성하기
         </button>

         {/* 생성된 URL 목록 */}
         {generatedUrls.length > 0 && (
           <div className="mt-8">
             <h2 className="text-xl font-bold mb-4">생성된 URL 목록</h2>
             <div className="space-y-4">
               {copyMessage && (
                 <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
                   {copyMessage}
                 </div>
               )}
               {generatedUrls.map((item, index) => (
                 <div key={index} className="bg-gray-50 p-4 rounded">
                   <div className="text-sm text-gray-600 mb-2">
                     이동 시간: {item.originalTime}
                   </div>
                   <div className="flex items-center gap-2">
                     <div className="flex-1 break-all">
                       {item.url}
                     </div>
                     <button
                       onClick={() => copyToClipboard(item.url)}
                       className="text-blue-500 hover:text-blue-700 px-3"
                     >
                       📋
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         )}
       </div>
     </div>
   </>
 );
}
