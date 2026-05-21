import React from 'react';
import Head from 'next/head';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import {
  Image,
  Download,
  MonitorPlay,
  ArrowRight,
  ImagePlus,
  Maximize2,
  Share2,
  ArrowLeftCircle,
  Youtube
} from 'lucide-react';

export default function YoutubeThumbnailGuide({ pageData = {} }) {
  const { t } = useTranslation();

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">{icon}</div>
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
        <title>{pageData.head?.title || 'YouTube 썸네일 추출기 가이드 - Marketing Tools'}</title>
        <meta name="description" content={pageData.head?.description || 'YouTube 동영상의 썸네일을 손쉽게 추출하는 방법을 알아보세요.'} />
        <meta name="keywords" content={pageData.head?.keywords || 'YouTube 썸네일, 썸네일 추출, YouTube 마케팅, 콘텐츠 제작'} />
        <meta property="og:title" content={pageData.head?.ogTitle || 'YouTube 썸네일 추출기 가이드'} />
        <meta property="og:description" content={pageData.head?.ogDescription || 'YouTube 썸네일 추출 방법과 활용 가이드'} />
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
            <a href="/youtube" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeftCircle className="w-5 h-5" />
              <span>{t('common.backButton')}</span>
            </a>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 mb-12 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <Youtube className="w-10 h-10 text-red-500" />
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                  {pageData.title || 'YouTube 썸네일 추출기 가이드'}
                </h1>
              </div>
              <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8">
                {pageData.description || 'YouTube 동영상의 썸네일을 다양한 해상도로 추출하고 활용하는 방법을 알아보세요.'}
              </p>
              <a
                href="/youtube"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm"
              >
                <span>{t("tools.youtube.buttons.extract")}</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.features.title")}</h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {t("tools.youtube.youtubeThumbnailGuide.sections.features.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<Maximize2 className="w-6 h-6" />}
                title={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.resolution.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.resolution.description")}
              />
              <FeatureCard
                icon={<Download className="w-6 h-6" />}
                title={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.download.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.download.description")}
              />
              <FeatureCard
                icon={<Share2 className="w-6 h-6" />}
                title={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.directUrl.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.directUrl.description")}
              />
              <FeatureCard
                icon={<ImagePlus className="w-6 h-6" />}
                title={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.preview.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.features.cards.preview.description")}
              />
            </div>
          </div>

          {/* Usage Steps */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.usage.title")}</h2>
              <div className="w-12 h-1 bg-blue-600 rounded-full mx-auto mb-6"></div>
              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                {t("tools.youtube.youtubeThumbnailGuide.sections.usage.description")}
              </p>
            </div>

            <div className="grid gap-5">
              <UsageStep
                number="1"
                title={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.urlPreparation.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.urlPreparation.description")}
              />
              <UsageStep
                number="2"
                title={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.urlInput.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.urlInput.description")}
              />
              <UsageStep
                number="3"
                title={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.resolutionSelection.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.resolutionSelection.description")}
              />
              <UsageStep
                number="4"
                title={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.download.title")}
                description={t("tools.youtube.youtubeThumbnailGuide.sections.usage.steps.download.description")}
              />
            </div>
          </div>

          {/* Use Cases */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 mb-12 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.title")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.blogPosting.title")}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.blogPosting.description")}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.socialMedia.title")}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.socialMedia.description")}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.presentation.title")}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.presentation.description")}
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-slate-800">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.marketing.title")}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.marketing.description")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 md:p-12 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.cta.title")}</h2>
            <p className="text-slate-600 font-medium mb-8 leading-relaxed max-w-xl mx-auto">
              {t("tools.youtube.youtubeThumbnailGuide.sections.cta.description")}
            </p>
            <a
              href="/youtube"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 shadow-sm"
            >
              <span>{t("tools.youtube.buttons.extract")}</span>
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
      pageData: common.tools.youtube.youtubeThumbnailGuide || {},
    },
  };
}
