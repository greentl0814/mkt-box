import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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
      <div>
        <h3 className="text-lg font-medium mb-4">{t('tools.analytics.tabs.roas')}</h3>
        <p className="text-gray-600 mb-4">
          {t('tools.analytics.sections.roas.description')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.revenue')}</label>
            <input
              type="text"
              value={revenue ? formatNumber(revenue) : ''}
              onChange={(e) => setRevenue(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.revenuePlaceholder')}
            />
          </div>
        </div>
        {adCost && revenue && (
          <div className="mt-4 bg-blue-50 p-4 rounded">
            <div className="font-medium">{t('tools.analytics.sections.roas.analysisResult')}</div>
            <div>
              {t('tools.analytics.sections.roas.results.value', {
                value: calculateROAS()
              })}
              {calculateROAS() >= 100 ?
                <span className="text-green-600 ml-2">{t('tools.analytics.sections.roas.profitMessage')}</span> :
                <span className="text-red-600 ml-2">{t('tools.analytics.sections.roas.lossMessage')}</span>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderEfficiencyAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t('tools.analytics.tabs.efficiency')}</h3>
        <div className="bg-yellow-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">
            {t('tools.analytics.sections.efficiency.descriptions.0')}<br />
            {t('tools.analytics.sections.efficiency.descriptions.1')}<br />
            {t('tools.analytics.sections.efficiency.descriptions.2')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.impressions')}</label>
            <input
              type="text"
              value={impressions ? formatNumber(impressions) : ''}
              onChange={(e) => setImpressions(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.impressionsPlaceholder')}
            />
          </div>
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.clicks')}</label>
            <input
              type="text"
              value={clicks ? formatNumber(clicks) : ''}
              onChange={(e) => setClicks(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.clicksPlaceholder')}
            />
          </div>
        </div>

        {adCost && impressions && clicks && (
          <div className="mt-4 bg-blue-50 p-4 rounded space-y-2">
            <div className="font-medium">{t('tools.analytics.analysisResult')}</div>
            <div>
              {t('tools.analytics.sections.efficiency.results.cpc', {
                value: formatNumber(calculateCPC())
              })}
            </div>
            <div>
              {t('tools.analytics.sections.efficiency.results.cpm', {
                value: formatNumber(calculateCPM())
              })}
            </div>
            <div>
              {t('tools.analytics.sections.efficiency.results.ctr', {
                value: calculateCTR()
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversionAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">{t('tools.analytics.tabs.conversion')}</h3>
        <div className="bg-yellow-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">
            {t('tools.analytics.sections.conversion.descriptions.0')}<br />
            {t('tools.analytics.sections.conversion.descriptions.1')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.adCost')}</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.adCostPlaceholder')}
            />
          </div>
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.visits')}</label>
            <input
              type="text"
              value={visits ? formatNumber(visits) : ''}
              onChange={(e) => setVisits(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.visitsPlaceholder')}
            />
          </div>
          <div>
            <label className="block mb-2">{t('tools.analytics.inputs.conversions')}</label>
            <input
              type="text"
              value={conversions ? formatNumber(conversions) : ''}
              onChange={(e) => setConversions(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder={t('tools.analytics.inputs.conversionsPlaceholder')}
            />
          </div>
        </div>

        {visits && conversions && adCost && (
          <div className="mt-4 bg-blue-50 p-4 rounded space-y-2">
            <div className="font-medium">{t('tools.analytics.analysisResult')}</div>
            <div>
              {t('tools.analytics.sections.conversion.results.cvr', {
                value: calculateCVR()
              })}
            </div>
            <div>
              {t('tools.analytics.sections.conversion.results.cpa', {
                value: formatNumber(calculateCPA())
              })}
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
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <h1 className="text-2xl font-bold mb-6">{t('tools.analytics.title')}</h1>

        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'roas' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('roas')}
          >
            {t('tools.analytics.tabs.roas')}
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'efficiency' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('efficiency')}
          >
            {t('tools.analytics.tabs.efficiency')}
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'conversion' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('conversion')}
          >
            {t('tools.analytics.tabs.conversion')}
          </button>
        </div>

        {activeTab === 'roas' && renderROASAnalysis()}
        {activeTab === 'efficiency' && renderEfficiencyAnalysis()}
        {activeTab === 'conversion' && renderConversionAnalysis()}
      </div>
    </>
  );
}
