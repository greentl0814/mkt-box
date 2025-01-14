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

  return (
    <>
      <Head>
        <title>{pageData.head?.title}</title>
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
                {pageData.title}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {pageData.description}
              </p>
              <Link
                href="/utm"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {pageData.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* What Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.what.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {pageData.sections?.what.content}
              </p>
            </div>
          </div>

          {/* Why Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.why.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {pageData.sections?.why.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <BarChart3 className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{pageData.sections?.why.cards.traffic.title}</h3>
                <p className="text-gray-600">{pageData.sections?.why.cards.traffic.description}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Target className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{pageData.sections?.why.cards.marketing.title}</h3>
                <p className="text-gray-600">{pageData.sections?.why.cards.marketing.description}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <LineChart className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{pageData.sections?.why.cards.data.title}</h3>
                <p className="text-gray-600">{pageData.sections?.why.cards.data.description}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <Settings className="w-10 h-10 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">{pageData.sections?.why.cards.budget.title}</h3>
                <p className="text-gray-600">{pageData.sections?.why.cards.budget.description}</p>
              </div>
            </div>
          </div>

          {/* Parameters Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.parameters.title}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <Tag className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">utm_source</h3>
                    <p className="text-gray-600 mb-3">{pageData.sections?.parameters.source}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-blue-600">Example: facebook</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <BarChart3 className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">utm_medium</h3>
                    <p className="text-gray-600 mb-3">{pageData.sections?.parameters.medium}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-blue-600">Example: cpc</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <Target className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">utm_campaign</h3>
                    <p className="text-gray-600 mb-3">{pageData.sections?.parameters.campaign}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-blue-600">Example: spring_sale</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <List className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">utm_content</h3>
                    <p className="text-gray-600 mb-3">{pageData.sections?.parameters.content}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-blue-600">Example: banner_top</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex items-start space-x-4">
                  <AlertCircle className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">utm_term</h3>
                    <p className="text-gray-600 mb-3">{pageData.sections?.parameters.term}</p>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <code className="text-sm text-blue-600">Example: running_shoes</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.bestPractices.title}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {pageData.sections?.bestPractices.tips.map((tip, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center space-x-3 mb-3">
                    <Settings className="w-5 h-5 text-blue-500" />
                    <h3 className="font-semibold">{tip}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-xl p-12 shadow-md">
            <h2 className="text-2xl font-bold mb-4">{pageData.title}</h2>
            <p className="text-gray-600 mb-8">{pageData.description}</p>
            <Link
              href="/utm"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {pageData.cta}
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
      pageData: common.tools.utmGuide || {}, // 경로 수정
    },
  };
}
