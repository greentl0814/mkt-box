import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
    <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="text-red-500 shrink-0">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );

  const UsageStep = ({ number, title, description }) => (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-start space-x-4">
        <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
          {number}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
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

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/youtube" className="flex items-center text-gray-600 hover:text-red-500 transition-colors">
              <ArrowLeftCircle className="w-5 h-5 mr-2" />
              <span>{t('common.backButton')}</span>
            </Link>
            <LanguageSelector />
          </div>

          {/* Hero Section */}
          <div className="bg-white rounded-xl p-8 mb-12 shadow-md">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-6">
                <Youtube className="w-10 h-10 text-red-500" />
                <h1 className="text-4xl font-bold text-gray-900">
                  {pageData.title || 'YouTube 썸네일 추출기 가이드'}
                </h1>
              </div>
              <p className="text-xl text-gray-600 mb-8">
                {pageData.description || 'YouTube 동영상의 썸네일을 다양한 해상도로 추출하고 활용하는 방법을 알아보세요.'}
              </p>
              <Link
                href="/youtube"
                className="inline-flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                {/* 썸네일 추출하기 -> 썸네일 추출기로 이동 */}
                {t("tools.youtube.buttons.extract")}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.features.title")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
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
              <h2 className="text-3xl font-bold mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.usage.title")}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t("tools.youtube.youtubeThumbnailGuide.sections.usage.description")}
              </p>
            </div>

            <div className="grid gap-6">
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
          <div className="bg-white rounded-xl p-8 mb-12 shadow-md">
            <h2 className="text-3xl font-bold mb-6">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.title")}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.blogPosting.title")}</h3>
                <p className="text-gray-600">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.blogPosting.description")}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.socialMedia.title")}</h3>
                <p className="text-gray-600">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.socialMedia.description")}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.presentation.title")}</h3>
                <p className="text-gray-600">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.presentation.description")}
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">{t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.marketing.title")}</h3>
                <p className="text-gray-600">
                  {t("tools.youtube.youtubeThumbnailGuide.sections.useCases.cards.marketing.description")}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-xl p-12 shadow-md">
            <h2 className="text-2xl font-bold mb-4">{t("tools.youtube.youtubeThumbnailGuide.sections.cta.title")}</h2>
            <p className="text-gray-600 mb-8">
              {t("tools.youtube.youtubeThumbnailGuide.sections.cta.description")}
            </p>
            <Link
              href="/youtube"
              className="inline-flex items-center px-8 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              {/* 썸네일 추출기 사용하기 -> 썸네일 추출기로 이동 */}
              {t("tools.youtube.buttons.extract")}
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
      pageData: common.tools.youtube.youtubeThumbnailGuide || {},
    },
  };
}
