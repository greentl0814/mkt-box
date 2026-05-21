import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';

import { Download, Plus, X, ArrowRight, CloudLightning } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function WordCloudGenerator({ pageData }) {
  const { t, locale } = useTranslation();
  const [text, setText] = useState('');
  const [wordFrequency, setWordFrequency] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const defaultStopWords = useMemo(() => {
    const englishStopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    const koreanStopWords = ['이', '그', '저', '이것', '저것', '그것', '을', '를', '이다', '있다', '하다', '및', '또는'];

    if (locale === 'ko') {
      return new Set([...englishStopWords, ...koreanStopWords]);
    } else {
      return new Set(englishStopWords);
    }
  }, [locale]);

  const [customStopWords, setCustomStopWords] = useState(new Set());

  const addStopWord = (e) => {
    e.preventDefault();
    const trimmedWord = newStopWord.trim();
    if (!trimmedWord) {
      setError(pageData.errors.emptyStopWord);
      return;
    }
    if (defaultStopWords.has(trimmedWord) || customStopWords.has(trimmedWord)) {
      setError(pageData.errors.duplicateStopWord);
      return;
    }

    const updatedStopWords = new Set(customStopWords);
    updatedStopWords.add(trimmedWord.toLowerCase());
    setCustomStopWords(updatedStopWords);
    setNewStopWord('');
    setError('');

    if (text) {
      analyzeText(text, updatedStopWords);
    }
  };

  const removeStopWord = (word) => {
    const updatedStopWords = new Set(customStopWords);
    updatedStopWords.delete(word);
    setCustomStopWords(updatedStopWords);
    if (text) {
      analyzeText(text, updatedStopWords);
    }
  };

  const analyzeText = (inputText, currentCustomStopWords = customStopWords) => {
    if (!inputText.trim()) {
      setWordFrequency({});
      return;
    }

    const words = inputText.toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 1 &&
        !defaultStopWords.has(word) &&
        !currentCustomStopWords.has(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    setWordFrequency(frequency);
  };

  useEffect(() => {
    if (text) {
      analyzeText(text);
    }
  }, [text, customStopWords]);

  const renderWordCloud = () => {
    const words = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);

    const maxFreq = Math.max(...words.map(([_, freq]) => freq));

    return (
      <div className="p-8 bg-slate-50/50 rounded-2xl min-h-[400px] flex flex-wrap gap-4 justify-center items-center">
        {words.map(([word, freq]) => {
          const fontSize = Math.max(12, Math.floor((freq / maxFreq) * 48));
          const opacity = 0.3 + (freq / maxFreq) * 0.7;

          return (
            <span
              key={word}
              style={{
                fontSize: `${fontSize}px`,
                opacity,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
              }}
              className="inline-block px-2 cursor-pointer hover:scale-110 transition-transform font-bold"
              title={`${word}: ${freq}${pageData.frequency}`}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  const saveAsImage = () => {
    const cloudElement = document.getElementById('word-cloud-container');
    if (!cloudElement) return;

    html2canvas(cloudElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'wordcloud.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content={pageData.head.keywords} />
        <meta property="og:title" content={pageData.head.ogTitle} />
        <meta property="og:description" content={pageData.head.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/word-cloud" />
        <meta property="og:site_name" content="MKT Box" />
        <link rel="canonical" href="https://www.mktbox.co.kr/word-cloud" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/word-cloud" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/word-cloud" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageData.head.ogTitle} />
        <meta name="twitter:description" content={pageData.head.ogDescription} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "워드클라우드 생성기",
            "url": "https://www.mktbox.co.kr/word-cloud",
            "description": "텍스트 데이터를 시각적인 워드클라우드로 변환하세요. 단어 빈도 분석 제공.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["단어 빈도 분석", "워드클라우드 시각화", "정지어 설정", "이미지 다운로드"],
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
                <CloudLightning className="w-8 h-8 text-indigo-600" />
                {pageData.title}
              </h1>
              <p className="text-slate-500 font-medium mt-2 leading-relaxed">
                텍스트에서 가장 많이 등장하는 주요 키워드를 시각적으로 한눈에 분석하세요.
              </p>
            </div>
            <a href="/word-cloud/guide"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 bg-white/80 border border-slate-100/80 backdrop-blur rounded-2xl hover:shadow-[0_8px_16px_rgba(0,0,0,0.02)] transition-all duration-300 self-start md:self-auto"
            >
              <span>{pageData.guideLink}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* 제외 단어 설정 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-4">
                {pageData.stopword.label}
                <span className="text-xs font-semibold text-slate-400 ml-2">{pageData.stopword.subLabel}</span>
              </label>

              <div className="mb-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/80">
                <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{pageData.stopword.defaultTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(defaultStopWords).map(word => (
                    <span key={word} className="bg-slate-200/60 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {word}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2.5 mb-4">
                <input
                  type="text"
                  value={newStopWord}
                  onChange={(e) => setNewStopWord(e.target.value)}
                  placeholder={pageData.stopword.placeholder}
                  className="flex-1 p-3 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 font-medium text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80"
                />
                <button
                  onClick={addStopWord}
                  className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_8px_16px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  {pageData.buttons.add}
                </button>
              </div>

              {customStopWords.size > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {Array.from(customStopWords).map(word => (
                    <div
                      key={word}
                      className="flex items-center gap-1.5 bg-blue-50/50 border border-blue-100/50 px-3 py-1.5 rounded-xl transition-all hover:bg-blue-50"
                    >
                      <span className="text-xs font-bold text-blue-600">{word}</span>
                      <button
                        onClick={() => removeStopWord(word)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 텍스트 입력 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <div>
              <label className="block text-base font-bold text-slate-800 mb-4">
                <span className="text-red-500">*</span> {pageData.inputs.text.label}
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={pageData.inputs.text.placeholder}
                className="w-full p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl min-h-[220px] text-slate-800 placeholder-slate-400 font-medium text-sm leading-relaxed transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80 resize-none"
              />
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50/80 border border-red-200/80 backdrop-blur text-red-600 px-5 py-4 rounded-2xl mb-8 font-semibold text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* 워드 클라우드 결과 */}
          {Object.keys(wordFrequency).length > 0 && (
            <div className="space-y-8">
              {/* 워드 클라우드 */}
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-slate-100/80 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-850">{pageData.result.title}</h3>
                  <button
                    onClick={saveAsImage}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-2.5 px-4 rounded-xl hover:shadow-[0_8px_16px_rgba(16,185,129,0.15)] transition-all duration-300 font-bold text-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {pageData.buttons.saveImage}
                  </button>
                </div>

                <div id="word-cloud-container" className="p-6 md:p-8">
                  {renderWordCloud()}
                </div>
              </div>

              {/* 빈도수 목록 */}
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-slate-100/80 bg-slate-50/50">
                  <h3 className="font-bold text-slate-850">{pageData.result.subTitle}</h3>
                </div>
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(wordFrequency)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 20)
                      .map(([word, freq]) => (
                        <div key={word} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 transition-all hover:bg-slate-50">
                          <span className="font-bold text-slate-700 text-sm">{word}</span>
                          <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">{freq}{pageData.result.frequency}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {copyMessage && (
        <div className="fixed bottom-4 right-4 bg-slate-900/90 backdrop-blur text-white px-4 py-2.5 rounded-xl shadow-lg z-50 text-xs font-bold border border-slate-800">
          {copyMessage}
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);

  return {
    props: {
      pageData: common.tools.wordCloud,
    },
  };
}
