import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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

  const generateUrls = () => {
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

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
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
        <meta property="og:url" content="https://mkt-box.vercel.app/utm" />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <h1 className="text-2xl font-bold mb-6">{pageData.title || 'UTM 생성기'}</h1>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              <span className="text-red-500">*</span> {urlData.label || '랜딩페이지 주소'}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={urlData.placeholder || 'http:// 또는 https://를 포함한 전체 URL을 입력해주세요'}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              <span className="text-red-500">*</span> {pageData.inputs?.sources.label || 'UTM Source (유입 채널)'}
              <span className="text-sm text-gray-500 ml-2">{pageData.inputs?.sources.subLabel || '(중복 체크 가능)'}</span>
            </label>
            <div className="space-y-2 mb-4">
              {sources.map((source, index) => (
                <label key={source.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={source.checked}
                    onChange={() => handleSourceCheck(index)}
                    className="rounded"
                  />
                  <span>{source.label}</span>
                </label>
              ))}
            </div>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
                placeholder={pageData.inputs?.sources.placeholder || '기타 소스 입력'}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addCustomSource}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {pageData.buttons?.add || '추가'}
              </button>
            </div>
            {customSources.length > 0 && (
              <div className="space-y-2">
                {customSources.map((source, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>{source}</span>
                    <button
                      onClick={() => removeCustomSource(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block mb-2 font-medium">
              <span className="text-red-500">*</span> {pageData.inputs?.mediums.label || 'UTM Medium (유입 매체)'}
              <span className="text-sm text-gray-500 ml-2">{pageData.inputs?.mediums.subLabel || '(중복 체크 가능)'}</span>
            </label>
            <div className="space-y-2 mb-4">
              {mediums.map((medium, index) => (
                <label key={medium.value} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={medium.checked}
                    onChange={() => handleMediumCheck(index)}
                    className="rounded"
                  />
                  <span>{medium.label}</span>
                </label>
              ))}
            </div>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newMedium}
                onChange={(e) => setNewMedium(e.target.value)}
                placeholder={pageData.inputs?.mediums.placeholder || '기타 매체 입력'}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addCustomMedium}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {pageData.buttons?.add || '추가'}
              </button>
            </div>
            {customMediums.length > 0 && (
              <div className="space-y-2">
                {customMediums.map((medium, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span>{medium}</span>
                    <button
                      onClick={() => removeCustomMedium(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-2">{pageData.inputs?.campaign || 'Campaign (캠페인명)'}</label>
              <input
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder={pageData.inputs?.campaignPlaceholder || 'campaign_name'}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">{pageData.inputs?.content || 'Content (소재)'}</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={pageData.inputs?.contentPlaceholder || 'banner_a'}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">{pageData.inputs?.term || 'Term (검색어)'}</label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={pageData.inputs?.termPlaceholder || 'keyword'}
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
            onClick={generateUrls}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {pageData.buttons?.generate || 'UTM URL 생성하기'}
          </button>

          {generatedUrls.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{pageData.results?.title || '생성된 URL 목록'}</h2>
                <button
                  onClick={downloadExcel}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  {pageData.buttons?.excel || '엑셀 다운로드'}
                </button>
              </div>
              <div className="space-y-2">
                {copyMessage && (
                  <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
                    {copyMessage}
                  </div>
                )}
                {generatedUrls.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded">
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
      pageData: common.tools.utm || {}, // 수정된 부분
    },
  };
}
