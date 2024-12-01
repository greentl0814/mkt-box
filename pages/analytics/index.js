import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Analytics() {
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
        <h3 className="text-lg font-medium mb-4">ROAS 분석</h3>
        <p className="text-gray-600 mb-4">
          ROAS(Return On Ad Spend)는 광고 투자 대비 매출액의 비율을 나타내는 지표입니다.
          예를 들어, ROAS 500%는 광고비 1만원 당 5만원의 매출이 발생했다는 의미입니다.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">광고비</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="광고 비용을 입력하세요"
            />
          </div>
          <div>
            <label className="block mb-2">매출액</label>
            <input
              type="text"
              value={revenue ? formatNumber(revenue) : ''}
              onChange={(e) => setRevenue(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="매출액을 입력하세요"
            />
          </div>
        </div>
        {adCost && revenue && (
          <div className="mt-4 bg-blue-50 p-4 rounded">
            <div className="font-medium">분석 결과</div>
            <div>
              ROAS: {calculateROAS()}%
              {calculateROAS() >= 100 ?
                <span className="text-green-600 ml-2">✓ 수익이 발생하고 있습니다</span> :
                <span className="text-red-600 ml-2">! 손실이 발생하고 있습니다</span>
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
        <h3 className="text-lg font-medium mb-4">광고 효율 분석</h3>
        <div className="bg-yellow-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">
            • CPC (Cost Per Click): 클릭당 평균 비용<br />
            • CPM (Cost Per Mile): 1000회 노출당 비용<br />
            • CTR (Click Through Rate): 노출 대비 클릭률
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">광고비</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="광고 비용을 입력하세요"
            />
          </div>
          <div>
            <label className="block mb-2">노출수</label>
            <input
              type="text"
              value={impressions ? formatNumber(impressions) : ''}
              onChange={(e) => setImpressions(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="총 노출 횟수"
            />
          </div>
          <div>
            <label className="block mb-2">클릭수</label>
            <input
              type="text"
              value={clicks ? formatNumber(clicks) : ''}
              onChange={(e) => setClicks(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="총 클릭 횟수"
            />
          </div>
        </div>

        {adCost && impressions && clicks && (
          <div className="mt-4 bg-blue-50 p-4 rounded space-y-2">
            <div className="font-medium">분석 결과</div>
            <div>
              CPC (클릭당 비용): {formatNumber(calculateCPC())}원
            </div>
            <div>
              CPM (1000회 노출당 비용): {formatNumber(calculateCPM())}원
            </div>
            <div>
              CTR (클릭률): {calculateCTR()}%
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversionAnalysis = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">전환 분석</h3>
        <div className="bg-yellow-50 p-4 rounded mb-6">
          <p className="text-sm text-gray-600">
            • CVR (Conversion Rate): 방문자의 전환율<br />
            • CPA (Cost Per Action): 전환당 비용
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">광고비</label>
            <input
              type="text"
              value={adCost ? formatNumber(adCost) : ''}
              onChange={(e) => setAdCost(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="광고 비용을 입력하세요"
            />
          </div>
          <div>
            <label className="block mb-2">방문수</label>
            <input
              type="text"
              value={visits ? formatNumber(visits) : ''}
              onChange={(e) => setVisits(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="총 방문자 수"
            />
          </div>
          <div>
            <label className="block mb-2">전환수</label>
            <input
              type="text"
              value={conversions ? formatNumber(conversions) : ''}
              onChange={(e) => setConversions(e.target.value.replace(/,/g, ''))}
              className="w-full p-2 border rounded"
              placeholder="총 전환 수"
            />
          </div>
        </div>

        {visits && conversions && adCost && (
          <div className="mt-4 bg-blue-50 p-4 rounded space-y-2">
            <div className="font-medium">분석 결과</div>
            <div>
              CVR (전환율): {calculateCVR()}%
            </div>
            <div>
              CPA (전환당 비용): {formatNumber(calculateCPA())}원
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>광고 성과 분석 - Marketing Tools</title>
        <meta name="description" content="ROAS, CPC, CTR 등 주요 광고 지표를 분석하고 성과를 측정합니다." />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl font-bold mb-6">광고 성과 분석</h1>

        {/* 탭 메뉴 */}
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 ${activeTab === 'roas' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('roas')}
          >
            ROAS 분석
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'efficiency' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('efficiency')}
          >
            광고 효율 분석
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'conversion' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
            onClick={() => handleTabChange('conversion')}
          >
            전환 분석
          </button>
        </div>

        {/* 탭 내용 */}
        {activeTab === 'roas' && renderROASAnalysis()}
        {activeTab === 'efficiency' && renderEfficiencyAnalysis()}
        {activeTab === 'conversion' && renderConversionAnalysis()}
      </div>
    </>
  );
}
