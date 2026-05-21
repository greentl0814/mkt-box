import React, { useState } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Calculator } from 'lucide-react';

export default function Analytics() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('roas');

  // ROAS 분석을 위한 상태
  const [adCost, setAdCost] = useState('');
  const [revenue, setRevenue] = useState('');

  // 광고 효율 분석을 위한 상태
  const [impressions, setImpressions] = useState('');
  const [clicks, setClicks] = useState('');

  // 전환 분석을 위한 상태
  const [visits, setVisits] = useState('');
  const [conversions, setConversions] = useState('');

  // 탭이 변경될 때 모든 입력값 초기화
  const resetValues = () => {
    setAdCost('');
    setRevenue('');
    setImpressions('');
    setClicks('');
    setVisits('');
    setConversions('');
  };

  // 탭 변경 시 초기화 추가
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetValues();
  };

  // 숫자에 천단위 콤마 추가
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 각종 계산 함수들
  const calculateROAS = () => {
    if (!adCost || !revenue) return 0;
    return ((revenue / adCost) * 100).toFixed(2);
  };

  const calculateCPC = () => {
    if (!adCost || !clicks) return 0;
    return (adCost / clicks).toFixed(2);
  };

  const calculateCPM = () => {
    if (!adCost || !impressions) return 0;
    return ((adCost / impressions) * 1000).toFixed(2);
  };

  const calculateCTR = () => {
    if (!impressions || !clicks) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const calculateCVR = () => {
    if (!visits || !conversions) return 0;
    return ((conversions / visits) * 100).toFixed(2);
  };

  const calculateCPA = () => {
    if (!adCost || !conversions) return 0;
    return (adCost / conversions).toFixed(2);
  };

  const renderROASAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          {t('tools.analytics.tabs.roas')}
        </h3>
        <p className="text-slate-500 mb-6 text-xs md:text-sm font-medium leading-relaxed">
          {t('tools.analytics.sections.roas.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.revenue')}</label>
            <input
              type="text"
              value={revenue ? formatNumber(revenue) : ''}
              onChange={(e) => setRevenue(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.revenuePlaceholder')}
            />
          </div>
        </div>
        {adCost && revenue && (
          <div className="mt-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm animate-fade-in">
            <div className="font-bold text-blue-900 mb-2 text-sm">{t('tools.analytics.sections.roas.analysisResult')}</div>
            <div className="text-slate-800 font-semibold flex flex-wrap items-center gap-2 text-sm md:text-base">
              <span>
                {t('tools.analytics.sections.roas.results.value', {
                  value: calculateROAS()
                })}
              </span>
              {parseFloat(calculateROAS()) >= 100 ?
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full text-xs font-bold">{t('tools.analytics.sections.roas.profitMessage')}</span> :
                <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-0.5 rounded-full text-xs font-bold">{t('tools.analytics.sections.roas.lossMessage')}</span>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEfficiencyAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          {t('tools.analytics.tabs.efficiency')}
        </h3>
        <div className="bg-amber-50/60 backdrop-blur border border-amber-100/60 rounded-2xl p-4 mb-6">
          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
            {t('tools.analytics.sections.efficiency.descriptions.0')}<br />
            {t('tools.analytics.sections.efficiency.descriptions.1')}<br />
            {t('tools.analytics.sections.efficiency.descriptions.2')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.impressions')}</label>
            <input
              type="text"
              value={impressions ? formatNumber(impressions) : ''}
              onChange={(e) => setImpressions(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.impressionsPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.clicks')}</label>
            <input
              type="text"
              value={clicks ? formatNumber(clicks) : ''}
              onChange={(e) => setClicks(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.clicksPlaceholder')}
            />
          </div>
        </div>

        {adCost && impressions && clicks && (
          <div className="mt-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3 animate-fade-in">
            <div className="font-bold text-blue-900 mb-2 text-sm">{t('tools.analytics.analysisResult')}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100/20">
                <div className="text-xl md:text-2xl font-black text-blue-700 tracking-tight">
                  ₩{formatNumber(calculateCPC())}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">CPC (클릭당 비용)</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100/20">
                <div className="text-xl md:text-2xl font-black text-indigo-700 tracking-tight">
                  ₩{formatNumber(calculateCPM())}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">CPM (1,000회 노출당 비용)</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100/20">
                <div className="text-xl md:text-2xl font-black text-purple-700 tracking-tight">
                  {calculateCTR()}%
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">CTR (클릭률)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversionAnalysis = () => (
    <div className="space-y-6">
      <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          {t('tools.analytics.tabs.conversion')}
        </h3>
        <div className="bg-amber-50/60 backdrop-blur border border-amber-100/60 rounded-2xl p-4 mb-6">
          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
            {t('tools.analytics.sections.conversion.descriptions.0')}<br />
            {t('tools.analytics.sections.conversion.descriptions.1')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.visits')}</label>
            <input
              type="text"
              value={visits ? formatNumber(visits) : ''}
              onChange={(e) => setVisits(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.visitsPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2.5">{t('tools.analytics.inputs.conversions')}</label>
            <input
              type="text"
              value={conversions ? formatNumber(conversions) : ''}
              onChange={(e) => setConversions(e.target.value.replace(/,/g, ''))}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
              placeholder={t('tools.analytics.inputs.conversionsPlaceholder')}
            />
          </div>
        </div>

        {visits && conversions && adCost && (
          <div className="mt-6 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm space-y-3 animate-fade-in">
            <div className="font-bold text-blue-900 mb-2 text-sm">{t('tools.analytics.analysisResult')}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100/20">
                <div className="text-xl md:text-2xl font-black text-blue-700 tracking-tight">
                  {calculateCVR()}%
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">CVR (전환율)</div>
              </div>
              <div className="bg-white/60 p-4 rounded-xl border border-blue-100/20">
                <div className="text-xl md:text-2xl font-black text-indigo-700 tracking-tight">
                  ₩{formatNumber(calculateCPA())}
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">CPA (전환당 비용)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{t('tools.analytics.head.title')}</title>
        <meta name="description" content={t('tools.analytics.head.description')} />
        <meta name="keywords" content="ROAS 계산기, 광고 성과 분석, CPC 계산, CTR 계산, CPM 계산, CVR 계산, CPA 계산, 마케팅 지표, 광고 효율, 광고비 계산" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/analytics" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/analytics" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/analytics" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/analytics" />
        <meta property="og:title" content={t('tools.analytics.head.title')} />
        <meta property="og:description" content={t('tools.analytics.head.description')} />
        <meta property="og:site_name" content="MKT Box" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('tools.analytics.head.title')} />
        <meta name="twitter:description" content={t('tools.analytics.head.description')} />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "광고 성과 분석기",
            "url": "https://www.mktbox.co.kr/analytics",
            "description": "ROAS, CPC, CPM, CTR, CVR, CPA 등 광고 성과 지표를 무료로 계산하세요.",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["ROAS 계산", "CPC/CPM 계산", "CTR 분석", "CVR/CPA 계산"],
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
          {/* 히어로 배너 */}
          <div className="mb-8 md:mb-12 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {t('tools.analytics.title')}
              </h1>
              <a href="/analytics/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{t('tools.analytics.guideLink')}</span>
                <span>→</span>
              </a>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              마케팅 광고 성과 및 효율 지표를 손쉽게 분석하고 관리하세요.
            </p>
          </div>

          {/* 탭 메뉴 (글라스모피즘 알약형 메뉴 바) */}
          <div className="bg-white/80 backdrop-blur border border-slate-100/60 rounded-3xl p-1.5 shadow-sm mb-8 flex flex-col sm:flex-row gap-1">
            <button
              className={`flex-1 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'roas'
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60'
              }`}
              onClick={() => handleTabChange('roas')}
            >
              {t('tools.analytics.tabs.roas')}
            </button>
            <button
              className={`flex-1 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'efficiency'
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60'
              }`}
              onClick={() => handleTabChange('efficiency')}
            >
              {t('tools.analytics.tabs.efficiency')}
            </button>
            <button
              className={`flex-1 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all duration-300 ${
                activeTab === 'conversion'
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50/60'
              }`}
              onClick={() => handleTabChange('conversion')}
            >
              {t('tools.analytics.tabs.conversion')}
            </button>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="transition-all duration-300">
            {activeTab === 'roas' && renderROASAnalysis()}
            {activeTab === 'efficiency' && renderEfficiencyAnalysis()}
            {activeTab === 'conversion' && renderConversionAnalysis()}
          </div>
        </div>
      </div>
    </>
  );
}
