import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  BarChart3,
  Target,
  Settings,
  ArrowRight,
  LineChart,
  Tag,
  List,
  AlertCircle,
  ArrowLeftCircle
} from 'lucide-react';

export default function UTMGuide({ pageData = {} }) {
  const { t } = useTranslation();

  const Parameter = ({ icon, title, description, example }) => (
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-blue-500">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600 mb-3">{description}</p>
          <div className="bg-gray-50 p-3 rounded-md">
            <code className="text-sm text-blue-600">Example: {example}</code>
          </div>
        </div>
      </div>
    </div>
  );

  const BestPracticeCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3 mb-3">
        <div className="text-blue-500">{icon}</div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  return (
    <>
      <Head>
        <title>{pageData.head?.title || 'UTM 태그 가이드 - Marketing Tools'}</title>
        <meta name="description" content={pageData.head?.description} />
        <meta name="keywords" content={pageData.head?.keywords} />
        <meta property="og:title" content={pageData.head?.ogTitle} />
        <meta property="og:description" content={pageData.head?.ogDescription} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/utm" className="flex items-center text-gray-600 hover:text-blue-500 transition-colors">
              <ArrowLeftCircle className="w-5 h-5 mr-2" />
              <span>{t('common.backButton')}</span>
            </Link>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-xl p-8 mb-12 shadow-md">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold mb-6 text-gray-900">
                {pageData.title || 'UTM 태그 완벽 가이드'}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {pageData.sections?.what.content}
              </p>
              <Link
                href="/utm"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {pageData.cta || 'UTM 생성기 사용하기'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Why UTM Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.why.title || 'UTM을 사용해야 하는 이유'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                디지털 마케팅의 성공을 위한 필수 도구, UTM 태그의 주요 장점을 알아보세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">트래픽 소스 추적</h3>
                <p className="text-gray-600">방문자의 유입 경로를 정확하게 파악하여 효과적인 채널 분석</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Target className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">마케팅 효과 측정</h3>
                <p className="text-gray-600">각 캠페인의 성과를 정확하게 측정하여 ROI 최적화</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <LineChart className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">데이터 기반 의사결정</h3>
                <p className="text-gray-600">정확한 데이터를 바탕으로 마케팅 전략 수립</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Settings className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">예산 최적화</h3>
                <p className="text-gray-600">효과적인 채널에 집중 투자하여 마케팅 예산 최적화</p>
              </div>
            </div>
          </div>

          {/* Parameters Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.parameters.title || 'UTM 매개변수 설명'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                각 매개변수의 역할과 사용법을 이해하여 정확한 트래킹을 설정하세요.
              </p>
            </div>

            <div className="grid gap-6">
              <Parameter
                icon={<Tag className="w-6 h-6" />}
                title="utm_source"
                description={pageData.sections?.parameters.source}
                example="facebook"
              />
              <Parameter
                icon={<BarChart3 className="w-6 h-6" />}
                title="utm_medium"
                description={pageData.sections?.parameters.medium}
                example="cpc"
              />
              <Parameter
                icon={<Target className="w-6 h-6" />}
                title="utm_campaign"
                description={pageData.sections?.parameters.campaign}
                example="spring_sale_2024"
              />
              <Parameter
                icon={<List className="w-6 h-6" />}
                title="utm_content"
                description={pageData.sections?.parameters.content}
                example="banner_top"
              />
              <Parameter
                icon={<AlertCircle className="w-6 h-6" />}
                title="utm_term"
                description={pageData.sections?.parameters.term}
                example="running_shoes"
              />
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.bestPractices.title || '모범 사례'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                효과적인 UTM 태그 설정을 위한 베스트 프랙티스를 알아보세요.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <BestPracticeCard
                icon={<Settings className="w-5 h-5" />}
                title="일관된 명명 규칙"
                description="모든 캠페인에서 동일한 형식과 규칙을 사용하여 데이터 일관성 유지"
              />
              <BestPracticeCard
                icon={<AlertCircle className="w-5 h-5" />}
                title="소문자 사용"
                description="모든 매개변수 값에 소문자를 사용하여 추적 오류 방지"
              />
              <BestPracticeCard
                icon={<List className="w-5 h-5" />}
                title="언더스코어 활용"
                description="공백이나 특수문자 대신 언더스코어(_)를 사용하여 가독성 향상"
              />
              <BestPracticeCard
                icon={<Tag className="w-5 h-5" />}
                title="간단명료한 이름"
                description="이해하기 쉽고 명확한 이름을 사용하여 팀 협업 효율성 증대"
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-xl p-12 shadow-md">
            <h2 className="text-2xl font-bold mb-4">지금 바로 UTM 태그를 생성해보세요</h2>
            <p className="text-gray-600 mb-8">
              간편하고 빠른 UTM 생성기로 마케팅 캠페인 추적을 시작하세요.
            </p>
            <Link
              href="/utm"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {pageData.cta || 'UTM 생성기 사용하기'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
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
      pageData: common.tools.utmGuide || {},
    },
  };
}
