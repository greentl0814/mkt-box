import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy, Link as LinkIcon, ArrowRight, Sparkles } from 'lucide-react';

export default function URLShortener({ pageData }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url) {
      setError(pageData.messages.error.empty);
      return;
    }

    if (!validateUrl(url)) {
      setError(pageData.messages.error.invalid);
      return;
    }

    try {
      // 자체 API 라우트를 통해 URL 단축 (CORS 문제 해결)
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Shortening failed');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setError('');
    } catch (error) {
      setError(pageData.messages.error.failed);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopyMessage(pageData.messages.success);
    setTimeout(() => {
      setCopyMessage('');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content="URL 단축, 단축 URL, 링크 단축, 간단URL, URL 단축기, 단축 링크 생성, 링크 관리, URL shortener" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/url" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/url" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/url" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/url" />
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
            "name": "URL 단축기",
            "url": "https://www.mktbox.co.kr/url",
            "description": "긴 URL을 짧게 줄여서 관리와 공유를 편리하게 하세요.",
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

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                <LinkIcon className="w-8 h-8 text-blue-600 animate-pulse" />
                {pageData.title}
              </h1>
              <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                복잡하고 긴 URL을 클릭 한 번으로 간결하고 깔끔한 단축 링크로 변환하세요.
              </p>
            </div>
            <a href="/url/guide"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white/80 border border-slate-100/80 backdrop-blur rounded-2xl hover:shadow-[0_8px_16px_rgba(0,0,0,0.02)] transition-all duration-300 self-start md:self-auto"
            >
              <span>{pageData.guideLink}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                {pageData.inputs.urlLabel}
              </label>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={pageData.inputs.placeholder}
                  className="flex-1 p-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 font-semibold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80"
                />
                <button
                  onClick={shortenUrl}
                  className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <LinkIcon className="w-4 h-4" />
                  {pageData.buttons.shorten}
                </button>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50/80 border border-red-200/80 backdrop-blur text-red-600 px-5 py-4 rounded-2xl mb-8 font-semibold text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* 결과 */}
          {shortUrl && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-slate-100/80 bg-slate-50/50">
                <h3 className="font-bold text-slate-850">{pageData.results.title}</h3>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <input
                    type="text"
                    value={shortUrl}
                    readOnly
                    className="w-full md:flex-1 p-4 bg-slate-100/60 border border-slate-200/80 rounded-2xl text-slate-700 font-bold text-sm select-all focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="w-full md:w-auto px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl hover:shadow-[0_8px_16px_rgba(16,185,129,0.15)] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <Copy className="w-4 h-4" />
                    {pageData.buttons.copy}
                  </button>
                </div>
                {copyMessage && (
                  <div className="mt-3 text-sm font-bold text-emerald-600 flex items-center gap-1">
                    <span>✓</span>
                    <span>{copyMessage}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.url);

  return {
    props: {
      pageData,
    },
  };
}
