import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy, Clock } from 'lucide-react';

export default function YoutubeTime({ pageData }) {
  const { t } = useTranslation();
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
      setError(pageData.errors.urlRequired);
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError(pageData.errors.invalidUrl);
      return;
    }

    if (!hours && !minutes && !seconds) {
      setError(pageData.errors.timeRequired);
      return;
    }

    const totalSeconds =
      parseInt(hours || 0) * 3600 +
      parseInt(minutes || 0) * 60 +
      parseInt(seconds || 0);

    if (totalSeconds === 0) {
      setError(pageData.errors.zeroTime);
      return;
    }

    const videoId = extractVideoId(url);
    const newUrl = `https://youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;

    setGeneratedUrls([
      {
        originalTime: `${hours ? hours + ' ' + pageData.inputs.hours.label + ' ' : ''
          }${minutes ? minutes + ' ' + pageData.inputs.minutes.label + ' ' : ''
          }${seconds ? seconds + ' ' + pageData.inputs.seconds.label : ''}`,
        url: newUrl,
      },
      ...generatedUrls,
    ]);
    setError('');
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopyMessage(pageData.copyMessage);
    setTimeout(() => {
      setCopyMessage('');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content="유튜브 타임스탬프, 유튜브 시간 링크, 동영상 구간 공유, 유튜브 특정 시간대, youtube timestamp, 유튜브 챗터, 동영상 타임라인" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/youtube-time" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/youtube-time" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/youtube-time" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/youtube-time" />
        <meta property="og:title" content={pageData.head.title} />
        <meta property="og:description" content={pageData.head.description} />
        <meta property="og:site_name" content="MKT Box" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageData.head.title} />
        <meta name="twitter:description" content={pageData.head.description} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "유튜브 타임스탬프 링크 생성기",
            "url": "https://www.mktbox.co.kr/youtube-time",
            "description": "유튜브 동영상의 특정 시간대로 바로 이동하는 링크를 생성하세요.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "inLanguage": ["ko", "en"]
          })}}
        />
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
                {pageData.title}
              </h1>
              <a href="/youtube-time/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{pageData.guideLink || '유튜브 시간 링크 가이드'}</span>
                <span>→</span>
              </a>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              유튜브 영상의 특정 시간대로 바로 순간 이동할 수 있는 타임스탬프 단축 링크를 만들어 보세요.
            </p>
          </div>

          {/* 입력 폼 (3XL 글라스모피즘 카드) */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 mb-6">
            <div className="space-y-6">
              {/* URL 입력 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  {pageData.inputs.url.label}
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={pageData.inputs.url.placeholder}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* 시간 입력 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>재생 시작 시간 설정</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 pl-1">
                      {pageData.inputs.hours.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-bold text-slate-800 placeholder-slate-400 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 pl-1">
                      {pageData.inputs.minutes.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutes}
                      onChange={(e) => setMinutes(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-bold text-slate-800 placeholder-slate-400 text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 pl-1">
                      {pageData.inputs.seconds.label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={seconds}
                      onChange={(e) => setSeconds(e.target.value)}
                      placeholder="0"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-bold text-slate-800 placeholder-slate-400 text-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-700 px-5 py-4 rounded-2xl font-semibold mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* 생성 버튼 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm mb-6">
            <button
              onClick={generateUrl}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 px-5 rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              {pageData.buttons.generate}
            </button>
          </div>

          {/* 생성된 URL 결과 */}
          {generatedUrls.length > 0 && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 animate-fade-in">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-slate-100">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                <h2 className="text-xl md:text-2xl font-black text-slate-900">
                  {pageData.results.title}
                </h2>
              </div>
              
              {copyMessage && (
                <div className="fixed bottom-4 right-4 bg-slate-900/95 backdrop-blur text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 border border-slate-800 animate-slide-up flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  {copyMessage}
                </div>
              )}

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {generatedUrls.map((item, index) => (
                  <div key={index} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 backdrop-blur hover:bg-slate-50/80 transition-all duration-200 flex items-start gap-4 justify-between">
                    <div className="flex-1 break-all text-sm font-medium text-slate-700 leading-relaxed pr-2">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-extrabold border border-blue-100/50">
                          {pageData.results.jumpTime.replace(
                            '{time}',
                            item.originalTime
                          )}
                        </span>
                      </div>
                      <span className="select-all">{item.url}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="text-blue-600 hover:text-blue-700 p-2.5 bg-blue-50/50 hover:bg-blue-50 rounded-xl transition-all duration-200 flex-shrink-0 border border-blue-100/20 shadow-sm"
                      title="URL 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
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

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`).then(
    (module) => module.default
  );

  return {
    props: {
      pageData: common.tools.youtubeTime,
    },
  };
}
