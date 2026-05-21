import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { FileText, ArrowRight, HelpCircle } from 'lucide-react';

export default function TextCounter({ pageData }) {
  const { t } = useTranslation();
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
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content="글자수 세기, 문자 수 계산, 바이트 계산, 텍스트 분석, 글자수 제한, 한글 바이트, 복사 글자수, 광고 문구 작성" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/text" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/text" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/text" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/text" />
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
            "name": "텍스트 분석기 - 글자수 세기",
            "url": "https://www.mktbox.co.kr/text",
            "description": "텍스트의 글자 수와 바이트를 실시간으로 계산합니다. UTF-8, EUC-KR 바이트 확인 가능.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["전체 글자수", "공백 제외 글자수", "2바이트 계산 (EUC-KR)", "3바이트 계산 (UTF-8)"],
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
                <FileText className="w-8 h-8 text-blue-600" />
                {pageData.title}
              </h1>
              <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                텍스트의 글자 수와 바이트를 실시간으로 편리하게 계산하세요.
              </p>
            </div>
            <a href="/text/guide"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white/80 border border-slate-100/80 backdrop-blur rounded-2xl hover:shadow-[0_8px_16px_rgba(0,0,0,0.02)] transition-all duration-300 self-start md:self-auto"
            >
              <span>{pageData.guideLink}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 통계 결과 대시보드 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-blue-50/50 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-blue-50">
                <div className="text-xs font-bold text-slate-500 mb-1">{pageData.stats.total}</div>
                <div className="text-2xl md:text-3xl font-black text-blue-600">{totalCount.toLocaleString()}</div>
              </div>
              <div className="bg-emerald-50/50 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-emerald-50">
                <div className="text-xs font-bold text-slate-500 mb-1">{pageData.stats.noSpace}</div>
                <div className="text-2xl md:text-3xl font-black text-emerald-600">{noSpaceCount.toLocaleString()}</div>
              </div>
              <div className="bg-purple-50/50 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-purple-50">
                <div className="text-xs font-bold text-slate-500 mb-1">{pageData.stats.byte2}</div>
                <div className="text-2xl md:text-3xl font-black text-purple-600">{byteCount2.toLocaleString()}</div>
              </div>
              <div className="bg-orange-50/50 rounded-2xl p-4 text-center transition-all duration-300 hover:bg-orange-50">
                <div className="text-xs font-bold text-slate-500 mb-1">{pageData.stats.byte3}</div>
                <div className="text-2xl md:text-3xl font-black text-orange-600">{byteCount3.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* 텍스트 입력 영역 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <div className="flex justify-between items-center mb-4">
              <label className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                텍스트 입력
              </label>
              {text && (
                <button
                  onClick={() => setText('')}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                >
                  초기화
                </button>
              )}
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={pageData.placeholder}
              className="w-full h-80 p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl resize-none text-slate-800 placeholder-slate-400 font-medium text-sm leading-relaxed transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80"
            />
          </div>

          {/* 바이트 계산 설명 가이드 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50/20 rounded-2xl p-5 border border-blue-50/50">
              <div className="flex items-center gap-2 text-blue-900 font-bold mb-3">
                <HelpCircle className="w-4 h-4 shrink-0 text-blue-500" />
                <p className="text-sm">{pageData.info.byteStandard.title}</p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500">•</span>
                  <span>{pageData.info.byteStandard.basic}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-blue-500">•</span>
                  <span>{pageData.info.byteStandard.korean}</span>
                </li>
              </ul>
            </div>

            <div className="bg-purple-50/20 rounded-2xl p-5 border border-purple-50/50">
              <div className="flex items-center gap-2 text-purple-900 font-bold mb-3">
                <HelpCircle className="w-4 h-4 shrink-0 text-purple-500" />
                <p className="text-sm">{pageData.info.encoding.title}</p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500">•</span>
                  <span>{pageData.info.encoding.utf8}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500">•</span>
                  <span>{pageData.info.encoding.euckr}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-purple-500">•</span>
                  <span>{pageData.info.encoding.utf16}</span>
                </li>
              </ul>
            </div>

            <div className="bg-orange-50/20 rounded-2xl p-5 border border-orange-50/50">
              <div className="flex items-center gap-2 text-orange-900 font-bold mb-3">
                <HelpCircle className="w-4 h-4 shrink-0 text-orange-500" />
                <p className="text-sm">{pageData.info.platform.title}</p>
              </div>
              <ul className="space-y-2 text-xs font-semibold text-slate-600 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-500">•</span>
                  <span>{pageData.info.platform.naver}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-orange-500">•</span>
                  <span>{pageData.info.platform.google}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  // common.json 파일 로드
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.text);

  return {
    props: {
      pageData,
    },
  };
}
