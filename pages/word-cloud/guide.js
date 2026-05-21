import React from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  ArrowLeftCircle,
  ArrowRight,
  CloudLightning,
  Filter,
  List,
  Image as ImageIcon
} from 'lucide-react';

export default function WordCloudGuide({ pageData = {} }) {
  const { t } = useTranslation();

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  const UsageStep = ({ number, title, description }) => (
    <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
          {number}
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>{pageData.head?.title || '워드클라우드 생성 가이드 - Marketing Tools'}</title>
        <meta name="description" content={pageData.head?.description || '텍스트 키워드를 시각적으로 한눈에 분석하고 워드클라우드로 구현하는 방법을 알아보세요.'} />
        <meta name="keywords" content={pageData.head?.keywords || '워드클라우드, 키워드 분석, 단어 빈도, 시각화'} />
        <meta property="og:title" content={pageData.head?.ogTitle || '워드클라우드 생성 가이드'} />
        <meta property="og:description" content={pageData.head?.ogDescription || '워드클라우드 시각화 방법과 활용 가이드'} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-4">
            <a href="/word-cloud"
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftCircle className="w-5 h-5" />
              <span>{t('common.backButton')}</span>
            </a>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 mb-12 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <CloudLightning className="w-10 h-10 text-indigo-500" />
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {pageData.title}
                </h1>
              </div>
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {pageData.description}
              </p>
              <a href="/word-cloud"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm"
              >
                <span>{pageData.cta}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          {/* What Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.what.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {pageData.sections?.what.content}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<CloudLightning className="w-6 h-6" />}
                title={pageData.sections?.what.card1.title}
                description={pageData.sections?.what.card1.content}
              />
              <FeatureCard
                icon={<Filter className="w-6 h-6" />}
                title={pageData.sections?.what.card2.title}
                description={pageData.sections?.what.card2.content}
              />
            </div>
          </div>

          {/* How Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.how.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {pageData.sections?.how.content}
              </p>
            </div>
            <div className="grid gap-5">
              <UsageStep
                number="1"
                title={pageData.sections?.how.step1.title}
                description={pageData.sections?.how.step1.content}
              />
              <UsageStep
                number="2"
                title={pageData.sections?.how.step2.title}
                description={pageData.sections?.how.step2.content}
              />
              <UsageStep
                number="3"
                title={pageData.sections?.how.step3.title}
                description={pageData.sections?.how.step3.content}
              />
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.features.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {pageData.sections?.features.content}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<List className="w-6 h-6" />}
                title={pageData.sections?.features.card1.title}
                description={pageData.sections?.features.card1.content}
              />
              <FeatureCard
                icon={<ImageIcon className="w-6 h-6" />}
                title={pageData.sections?.features.card2.title}
                description={pageData.sections?.features.card2.content}
              />
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">{pageData.title}</h2>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed max-w-xl mx-auto">{pageData.description}</p>
            <a href="/word-cloud"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm"
            >
              <span>{pageData.cta}</span>
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
      pageData: common.tools.wordCloud.wordCloudGuide || {},
    },
  };
}
