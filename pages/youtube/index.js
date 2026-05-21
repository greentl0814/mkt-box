import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Download } from 'lucide-react';

export default function YoutubeThumbnail({ pageData }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);
  const [error, setError] = useState('');

  const getVideoId = (url) => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === 'youtu.be') {
        return videoUrl.pathname.slice(1);
      }
      if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
        return videoUrl.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  };

  const getThumbnails = () => {
    if (!url) {
      setError(pageData.errors.urlRequired);
      return;
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      setError(pageData.errors.invalidUrl);
      return;
    }

    setThumbnails({
      max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    });
    setError('');
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `youtube-thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // 실패시 새 탭으로 열기
      window.open(url, '_blank');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getThumbnails();
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content={pageData.head.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/youtube" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/youtube" />
        <meta property="og:title" content={pageData.head.ogTitle} />
        <meta property="og:description" content={pageData.head.ogDescription} />
        <meta property="og:image" content={pageData.head.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.head.ogTitle} />
        <meta name="twitter:description" content={pageData.head.ogDescription} />
        <meta name="twitter:image" content={pageData.head.ogImage} />
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": pageData.head.ogTitle,
          "url": "https://www.mktbox.co.kr/youtube",
          "description": pageData.head.ogDescription,
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" }
        })}} />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
          <div className="mb-8 md:mb-12 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {pageData.title || 'YouTube 썸네일 추출기'}
              </h1>
              <a href="/youtube/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{pageData.guideLink || '썸네일 추출 가이드'}</span>
                <span>→</span>
              </a>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              유튜브 영상의 썸네일 이미지를 다양한 고품질 해상도로 쉽고 빠르게 추출해 보세요.
            </p>
          </div>

          {/* 입력 폼 (3XL 글라스모피즘 카드) */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  {pageData.inputs.urlLabel}
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={pageData.inputs.urlPlaceholder}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 font-bold whitespace-nowrap shadow-sm"
                  >
                    {pageData.buttons.extract}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-700 px-5 py-4 rounded-2xl font-semibold mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* 썸네일 결과 */}
          {thumbnails && (
            <div className="space-y-6 animate-fade-in">
              {/* 최대 해상도 */}
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100/80 flex justify-between items-center">
                  <h3 className="font-bold text-slate-850 flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-blue-600 rounded-full"></span>
                    {pageData.thumbnails.max.title}
                  </h3>
                  <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-xs font-bold">{pageData.thumbnails.max.resolution}</span>
                </div>
                <div className="p-6">
                  <div className="relative group rounded-2xl overflow-hidden border border-slate-100 shadow-sm mb-4">
                    <img src={thumbnails.max} alt="최대 해상도 썸네일" className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-[1.01]" />
                  </div>
                  <button
                    onClick={() => downloadImage(thumbnails.max)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-5 rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    {pageData.buttons.download}
                  </button>
                </div>
              </div>

              {/* 기타 해상도 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                  <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100/80 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {pageData.thumbnails.high.title}
                    </h3>
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{pageData.thumbnails.high.resolution}</span>
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-45px)] justify-between">
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm mb-3">
                      <img src={thumbnails.high} alt="고해상도 썸네일" className="w-full h-auto object-cover" />
                    </div>
                    <button
                      onClick={() => downloadImage(thumbnails.high)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-3 rounded-xl hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] transition-all duration-300 text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {pageData.buttons.download}
                    </button>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                  <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100/80 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {pageData.thumbnails.medium.title}
                    </h3>
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{pageData.thumbnails.medium.resolution}</span>
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-45px)] justify-between">
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm mb-3">
                      <img src={thumbnails.medium} alt="중간 해상도 썸네일" className="w-full h-auto object-cover" />
                    </div>
                    <button
                      onClick={() => downloadImage(thumbnails.medium)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-3 rounded-xl hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] transition-all duration-300 text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {pageData.buttons.download}
                    </button>
                  </div>
                </div>

                <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm overflow-hidden hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                  <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100/80 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">
                      {pageData.thumbnails.standard.title}
                    </h3>
                    <span className="bg-pink-50 text-pink-700 border border-pink-100 px-2 py-0.5 rounded-full text-[10px] font-extrabold">{pageData.thumbnails.standard.resolution}</span>
                  </div>
                  <div className="p-4 flex flex-col h-[calc(100%-45px)] justify-between">
                    <div className="rounded-xl overflow-hidden border border-slate-100 shadow-sm mb-3">
                      <img src={thumbnails.default} alt="기본 해상도 썸네일" className="w-full h-auto object-cover" />
                    </div>
                    <button
                      onClick={() => downloadImage(thumbnails.default)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-3 rounded-xl hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] transition-all duration-300 text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      {pageData.buttons.download}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`).then(
    (module) => module.default
  );

  return {
    props: {
      pageData: common.tools.youtube,
    },
  };
}
