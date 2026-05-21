import React from 'react';
import Head from 'next/head';
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

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-4">
            <a href="/utm" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeftCircle className="w-5 h-5" />
              <span>{t('common.backButton')}</span>
            </a>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 mb-12 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight mb-6">
                {pageData.title}
              </h1>
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {pageData.description}
              </p>
              <a
                href="/utm"
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
          </div>

          {/* Why Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.why.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {pageData.sections?.why.subtitle}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 font-bold">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2.5">{pageData.sections?.why.cards.traffic.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{pageData.sections?.why.cards.traffic.description}</p>
              </div>
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-5 font-bold">
                  <Target className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2.5">{pageData.sections?.why.cards.marketing.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{pageData.sections?.why.cards.marketing.description}</p>
              </div>
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-5 font-bold">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2.5">{pageData.sections?.why.cards.data.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{pageData.sections?.why.cards.data.description}</p>
              </div>
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 mb-5 font-bold">
                  <Settings className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2.5">{pageData.sections?.why.cards.budget.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{pageData.sections?.why.cards.budget.description}</p>
              </div>
            </div>
          </div>

          {/* Parameters Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.parameters.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
            </div>

            <div className="space-y-5">
              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">utm_source</h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">{pageData.sections?.parameters.source}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                      <code className="text-xs md:text-sm text-blue-600 font-bold">Example: facebook</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">utm_medium</h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">{pageData.sections?.parameters.medium}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                      <code className="text-xs md:text-sm text-indigo-600 font-bold">Example: cpc</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">utm_campaign</h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">{pageData.sections?.parameters.campaign}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                      <code className="text-xs md:text-sm text-purple-600 font-bold">Example: spring_sale</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 font-bold shrink-0">
                    <List className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">utm_content</h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">{pageData.sections?.parameters.content}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                      <code className="text-xs md:text-sm text-pink-600 font-bold">Example: banner_top</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg mb-2">utm_term</h3>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed mb-3">{pageData.sections?.parameters.term}</p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 inline-block">
                      <code className="text-xs md:text-sm text-amber-600 font-bold">Example: running_shoes</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Best Practices Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">
                {pageData.sections?.bestPractices.title}
              </h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {pageData.sections?.bestPractices.tips.map((tip, index) => (
                <div key={index} className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-relaxed">{tip}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">{pageData.title}</h2>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed max-w-xl mx-auto">{pageData.description}</p>
            <a
              href="/utm"
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
  const common = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);

  return {
    props: {
      pageData: common.tools.utmGuide || {}, // 경로 수정
    },
  };
}
