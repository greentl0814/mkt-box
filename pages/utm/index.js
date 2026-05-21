import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy, Download, Plus, X } from 'lucide-react';

export default function UTMGenerator({ pageData = {} }) {
  console.log("pageData:", pageData);
  const { t } = useTranslation();
  
  const defaultSources = [
    { label: pageData.sources?.google || 'Google', value: 'google', checked: false },
    { label: pageData.sources?.naver || 'Naver', value: 'naver', checked: false },
    { label: pageData.sources?.facebook || 'Facebook', value: 'facebook', checked: false },
    { label: pageData.sources?.instagram || 'Instagram', value: 'instagram', checked: false },
    { label: pageData.sources?.kakao || 'Kakao', value: 'kakao', checked: false }
  ];

  const defaultMediums = [
    { label: pageData.mediums?.cpc || 'CPC', value: 'cpc', checked: false },
    { label: pageData.mediums?.display || 'Display', value: 'display', checked: false },
    { label: pageData.mediums?.social || 'Social', value: 'social', checked: false },
    { label: pageData.mediums?.email || 'Email', value: 'email', checked: false }
  ];

  const [url, setUrl] = useState('');
  const [sources, setSources] = useState(defaultSources);
  const [customSources, setCustomSources] = useState([]);
  const [newSource, setNewSource] = useState('');
  const [mediums, setMediums] = useState(defaultMediums);
  const [customMediums, setCustomMediums] = useState([]);
  const [newMedium, setNewMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [content, setContent] = useState('');
  const [term, setTerm] = useState('');
  const [generatedUrls, setGeneratedUrls] = useState([]);
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

  const handleSourceCheck = (index) => {
    setSources(sources.map((source, i) =>
      i === index ? { ...source, checked: !source.checked } : source
    ));
  };

  const handleMediumCheck = (index) => {
    setMediums(mediums.map((medium, i) =>
      i === index ? { ...medium, checked: !medium.checked } : medium
    ));
  };

  const addCustomSource = () => {
    if (newSource.trim()) {
      setCustomSources([...customSources, newSource.trim()]);
      setNewSource('');
    }
  };

  const addCustomMedium = () => {
    if (newMedium.trim()) {
      setCustomMediums([...customMediums, newMedium.trim()]);
      setNewMedium('');
    }
  };

  const removeCustomSource = (index) => {
    setCustomSources(customSources.filter((_, i) => i !== index));
  };

  const removeCustomMedium = (index) => {
    setCustomMediums(customMediums.filter((_, i) => i !== index));
  };

  const handleGenerateUrls = () => {
    if (!url) {
      setError(pageData.errors?.urlRequired || '랜딩페이지 주소를 입력해주세요');
      return;
    }
    if (!validateUrl(url)) {
      setError(pageData.errors?.invalidUrl || '올바른 URL 형식이 아닙니다');
      return;
    }

    const selectedSources = [
      ...sources.filter(s => s.checked).map(s => s.value),
      ...customSources
    ];

    const selectedMediums = [
      ...mediums.filter(m => m.checked).map(m => m.value),
      ...customMediums
    ];

    if (selectedSources.length === 0 || selectedMediums.length === 0) {
      setError(pageData.errors?.sourceOrMediumRequired || '소스와 매체를 하나 이상 선택해주세요');
      return;
    }

    const results = [];
    selectedSources.forEach(source => {
      selectedMediums.forEach(medium => {
        const params = new URLSearchParams();
        params.append('utm_source', source);
        params.append('utm_medium', medium);
        if (campaign) params.append('utm_campaign', campaign);
        if (content) params.append('utm_content', content);
        if (term) params.append('utm_term', term);

        const fullUrl = `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`;
        results.push({
          source,
          medium,
          campaign,
          content,
          term,
          url: fullUrl
        });
      });
    });

    setGeneratedUrls(results);
    setError('');
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopyMessage(pageData.messages?.copy || 'URL이 복사되었습니다!');
    setTimeout(() => {
       setCopyMessage('');
    }, 2000);
  };

  const downloadExcel = () => {
    const headers = [
      pageData.excel?.source || 'Source',
      pageData.excel?.medium || 'Medium',
      pageData.excel?.campaign || 'Campaign',
      pageData.excel?.content || 'Content',
      pageData.excel?.term || 'Term',
      pageData.excel?.fullUrl || 'Full URL'
    ];
    const csvContent = [
      headers.join(','),
      ...generatedUrls.map(item =>
        [
          item.source,
          item.medium,
          item.campaign || '',
          item.content || '',
          item.term || '',
          item.url
        ].join(',')
      )
    ].join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'utm_urls.csv';
    link.click();
  };

  const inputsData = pageData.inputs || {};
  const urlData = inputsData.url || {};

  return (
    <>
      <Head>
        <title>{pageData.head?.title || 'UTM 생성기 - Marketing Tools'}</title>
        <meta name="description" content={pageData.head?.description || 'UTM 태그를 쉽고 빠르게 생성하세요. 여러 소스와 매체를 한 번에 처리할 수 있는 무료 UTM 생성기입니다.'} />
        <meta name="keywords" content={pageData.head?.keywords || 'UTM 생성기, UTM builder, UTM 태그, 마케팅 도구, URL 추적'} />
        <meta property="og:title" content={pageData.head?.ogTitle || 'UTM 생성기 - Marketing Tools'} />
        <meta property="og:description" content={pageData.head?.ogDescription || 'UTM 태그를 쉽고 빠르게 생성하세요. 여러 소스와 매체를 한 번에 처리할 수 있는 무료 UTM 생성기입니다.'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/utm" />
        <link rel="canonical" href="https://www.mktbox.co.kr/utm" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/utm" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/utm" />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
          {/* 헤더 히어로 배너 */}
          <div className="mb-8 md:mb-12 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {pageData.title || 'UTM 생성기'}
              </h1>
              <a
                href="/utm/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{pageData.guideLink || 'UTM 태그 가이드'}</span>
                <span>→</span>
              </a>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              {pageData.description || '마케팅 캠페인 추적을 위한 UTM 파라미터를 쉽고 빠르게 생성하세요.'}
            </p>
          </div>

          {/* 입력 폼 (3XL 글라스모피즘 카드) */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 mb-6">
            <div className="space-y-6">
              {/* 랜딩페이지 주소 */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  <span className="text-red-500 font-black mr-1">*</span> {urlData.label || '랜딩페이지 주소'}
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={urlData.placeholder || 'http:// 또는 https://를 포함한 전체 URL을 입력해주세요'}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* UTM Source */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  <span className="text-red-500 font-black mr-1">*</span> {pageData.inputs?.sources?.label || 'UTM Source (유입 채널)'}
                  <span className="text-xs font-bold text-slate-400 ml-2">{pageData.inputs?.sources?.subLabel || '(중복 체크 가능)'}</span>
                </label>
                
                {/* 칩 스타일의 소스 선택 */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {sources.map((source, index) => (
                    <label
                      key={source.value}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                        source.checked
                          ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-bold shadow-sm shadow-blue-500/5'
                          : 'bg-white/50 border-slate-200/60 text-slate-600 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm">{source.label}</span>
                      <input
                        type="checkbox"
                        checked={source.checked}
                        onChange={() => handleSourceCheck(index)}
                        className="rounded text-blue-600 focus:ring-blue-500/10 border-slate-300 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                {/* 커스텀 소스 추가 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    placeholder={pageData.inputs?.sources?.placeholder || '기타 소스 입력'}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
                  <button
                    onClick={addCustomSource}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-bold whitespace-nowrap shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {pageData.buttons?.add || '추가'}
                  </button>
                </div>

                {/* 커스텀 소스 뱃지 */}
                {customSources.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {customSources.map((source, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100 animate-fade-in"
                      >
                        {source}
                        <button
                          onClick={() => removeCustomSource(index)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-0.5 hover:bg-blue-100/50 rounded-full"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* UTM Medium */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  <span className="text-red-500 font-black mr-1">*</span> {pageData.inputs?.mediums?.label || 'UTM Medium (유입 매체)'}
                  <span className="text-xs font-bold text-slate-400 ml-2">{pageData.inputs?.mediums?.subLabel || '(중복 체크 가능)'}</span>
                </label>
                
                {/* 칩 스타일의 매체 선택 */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {mediums.map((medium, index) => (
                    <label
                      key={medium.value}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
                        medium.checked
                          ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-bold shadow-sm shadow-blue-500/5'
                          : 'bg-white/50 border-slate-200/60 text-slate-600 hover:bg-slate-50/80 hover:border-slate-300'
                      }`}
                    >
                      <span className="text-sm">{medium.label}</span>
                      <input
                        type="checkbox"
                        checked={medium.checked}
                        onChange={() => handleMediumCheck(index)}
                        className="rounded text-blue-600 focus:ring-blue-500/10 border-slate-300 w-4 h-4 cursor-pointer"
                      />
                    </label>
                  ))}
                </div>

                {/* 커스텀 매체 추가 */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMedium}
                    onChange={(e) => setNewMedium(e.target.value)}
                    placeholder={pageData.inputs?.mediums?.placeholder || '기타 매체 입력'}
                    className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
                  <button
                    onClick={addCustomMedium}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 flex items-center gap-2 font-bold whitespace-nowrap shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {pageData.buttons?.add || '추가'}
                  </button>
                </div>

                {/* 커스텀 매체 뱃지 */}
                {customMediums.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {customMediums.map((medium, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100 animate-fade-in"
                      >
                        {medium}
                        <button
                          onClick={() => removeCustomMedium(index)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-0.5 hover:bg-blue-100/50 rounded-full"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 선택적 파라미터 (캠페인, 소재, 키워드) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100/80 pt-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2.5">
                    {pageData.inputs?.campaign || 'Campaign (캠페인명)'}
                  </label>
                  <input
                    type="text"
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder={pageData.inputs?.campaignPlaceholder || 'campaign_name'}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2.5">
                    {pageData.inputs?.content || 'Content (소재)'}
                  </label>
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={pageData.inputs?.contentPlaceholder || 'banner_a'}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2.5">
                    {pageData.inputs?.term || 'Term (검색어)'}
                  </label>
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={pageData.inputs?.termPlaceholder || 'keyword'}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                  />
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
              onClick={handleGenerateUrls}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-5 rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              {pageData.buttons?.generate || 'UTM URL 생성하기'}
            </button>
          </div>

          {/* 생성 결과 목록 */}
          {generatedUrls.length > 0 && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                  {pageData.results?.title || '생성된 URL 목록'} ({generatedUrls.length}개)
                </h2>
                <button
                  onClick={downloadExcel}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl hover:shadow-[0_8px_16px_rgba(16,185,129,0.15)] transition-all duration-300 flex items-center gap-2 font-bold text-sm shadow-sm self-start sm:self-auto"
                >
                  <Download className="w-4 h-4" />
                  {pageData.buttons?.excel || '엑셀 다운로드'}
                </button>
              </div>

              {copyMessage && (
                <div className="fixed bottom-4 right-4 bg-slate-900/95 backdrop-blur text-white text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl z-50 border border-slate-800 animate-slide-up flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  {copyMessage}
                </div>
              )}

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {generatedUrls.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/30 backdrop-blur hover:bg-slate-50/80 transition-all duration-200 flex items-start gap-4 justify-between"
                  >
                    <div className="flex-1 break-all text-sm font-medium text-slate-700 leading-relaxed pr-2">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-extrabold border border-blue-100/50">
                          {item.source}
                        </span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-extrabold border border-indigo-100/50">
                          {item.medium}
                        </span>
                        {item.campaign && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-extrabold">
                            {item.campaign}
                          </span>
                        )}
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
  const common = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);

  return {
    props: {
      pageData: common.tools.utm || {},
    },
  };
}
