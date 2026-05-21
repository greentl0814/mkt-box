import React from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
 ArrowLeftCircle,
 ArrowRight,
 BarChart,
 TrendingUp,
 PieChart,
 LineChart,
 Activity,
 Target
} from 'lucide-react';

export default function AnalyticsGuide({ pageData = {} }) {
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

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-4">
            <a
              href="/analytics"
              className="inline-flex items-center text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeftCircle className="w-5 h-5 mr-2" />
              <span>{t('common.backButton')}</span>
            </a>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white/80 backdrop-blur border border-slate-100/60 rounded-[32px] p-8 md:p-12 mb-12 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-black mb-6 text-slate-900 tracking-tight leading-tight">
                {pageData.title}
              </h1>
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {pageData.description}
              </p>
              <a
                href="/analytics"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300"
              >
                {pageData.cta}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          {/* What Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {pageData.sections?.what.title}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed">
                {pageData.sections?.what.content}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.01)] transition-shadow flex items-start">
                <div className="p-3 bg-blue-50 rounded-2xl mr-4 shrink-0">
                  <BarChart className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base md:text-lg mb-1.5">
                    {pageData.sections?.what.card1.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {pageData.sections?.what.card1.content}
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.01)] transition-shadow flex items-start">
                <div className="p-3 bg-indigo-50 rounded-2xl mr-4 shrink-0">
                  <TrendingUp className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base md:text-lg mb-1.5">
                    {pageData.sections?.what.card2.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {pageData.sections?.what.card2.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {pageData.sections?.how.title}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed">
                {pageData.sections?.how.content}
              </p>
            </div>
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center mr-4 shrink-0 shadow-sm text-sm">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">
                    {pageData.sections?.how.step1.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">{pageData.sections?.how.step1.content}</p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center mr-4 shrink-0 shadow-sm text-sm">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">
                    {pageData.sections?.how.step2.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {pageData.sections?.how.step2.content}
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm flex items-start">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center mr-4 shrink-0 shadow-sm text-sm">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1">
                    {pageData.sections?.how.step3.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">{pageData.sections?.how.step3.content}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
                {pageData.sections?.features.title}
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed">
                {pageData.sections?.features.content}
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.01)] transition-shadow flex items-start">
                <div className="p-3 bg-emerald-50 rounded-2xl mr-4 shrink-0">
                  <Activity className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base md:text-lg mb-1.5">
                    {pageData.sections?.features.card1.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {pageData.sections?.features.card1.content}
                  </p>
                </div>
              </div>
              <div className="bg-white/95 backdrop-blur border border-slate-100/85 p-6 rounded-[24px] shadow-sm hover:shadow-[0_15px_30px_rgba(0,0,0,0.01)] transition-shadow flex items-start">
                <div className="p-3 bg-purple-50 rounded-2xl mr-4 shrink-0">
                  <Target className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base md:text-lg mb-1.5">
                    {pageData.sections?.features.card2.title}
                  </h3>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                    {pageData.sections?.features.card2.content}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-3 tracking-tight">{pageData.title}</h2>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mb-8 max-w-md mx-auto leading-relaxed">{pageData.description}</p>
            <a
              href="/analytics"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300"
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
     pageData: common.tools.analytics.analyticsGuide || {},
   },
 };
}
