import React from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  ArrowLeftCircle,
  ArrowRight,
  Palette,

  Copy,
  RefreshCw,
  Droplet,
  Download,
  Settings
} from 'lucide-react';

export default function Guide({ pageData = {} }) {
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
            <a href="/colors"
              className="flex items-center text-gray-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeftCircle className="w-5 h-5 mr-2" />
              <span>{t('common.backButton')}</span>
            </a>
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
              <a href="/colors"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {pageData.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <Settings className="w-10 h-10 text-blue-500 mr-4 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.what.card1.title}
                  </h3>
                  <p className="text-gray-600">
                    {pageData.sections?.what.card1.content}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <Palette className="w-10 h-10 text-blue-500 mr-4 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.what.card2.title}
                  </h3>
                  <p className="text-gray-600">
                    {pageData.sections?.what.card2.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.how.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {pageData.sections?.how.content}
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-4 shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.how.step1.title}
                  </h3>
                  <p className="text-gray-600">{pageData.sections?.how.step1.content}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-4 shrink-0">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.how.step2.title}
                  </h3>
                  <p className="text-gray-600">
                    {pageData.sections?.how.step2.content}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center mr-4 shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.how.step3.title}
                  </h3>
                  <p className="text-gray-600">{pageData.sections?.how.step3.content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {pageData.sections?.features.title}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {pageData.sections?.features.content}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <RefreshCw className="w-10 h-10 text-blue-500 mr-4 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.features.card1.title}
                  </h3>
                  <p className="text-gray-600">
                    {pageData.sections?.features.card1.content}
                  </p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
                <Copy className="w-10 h-10 text-blue-500 mr-4 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">
                    {pageData.sections?.features.card2.title}
                  </h3>
                  <p className="text-gray-600">
                    {pageData.sections?.features.card2.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-xl p-12 shadow-md">
            <h2 className="text-2xl font-bold mb-4">{pageData.title}</h2>
            <p className="text-gray-600 mb-8">{pageData.description}</p>
            <a href="/colors"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {pageData.cta}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`).then(
    (module) => module.default
  );

  return {
    props: {
      pageData: common.tools.colors.colorGuide || {},
    },
  };
}
