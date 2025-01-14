import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function YoutubeThumbnail({ pageData }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);
  const [error, setError] = useState('');

  const getVideoId = (url) => {
    try {
      const videoUrl = new URL(url);
      if (videoUrl.hostname === 'youtu.be') {
        return videoUrl.pathname.slice(1);
      }
      if (videoUrl.hostname === 'www.youtube.com' || videoUrl.hostname === 'youtube.com') {
        return videoUrl.searchParams.get('v');
      }
      return null;
    } catch {
      return null;
    }
  };

  const getThumbnails = () => {
    if (!url) {
      setError(pageData.errors.urlRequired);
      return;
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      setError(pageData.errors.invalidUrl);
      return;
    }

    setThumbnails({
      max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    });
    setError('');
  };

  const downloadImage = (url) => {
    window.open(url, '_blank');
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{pageData.title || 'YouTube 썸네일 추출기'}</h1>
          <Link
            href="/youtube/guide" 
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <span>{pageData.guideLink || '썸네일 추출 가이드'}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              {pageData.inputs.urlLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={pageData.inputs.urlPlaceholder}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={getThumbnails}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {pageData.buttons.extract}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {thumbnails && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">
                  {pageData.thumbnails.max.title} {pageData.thumbnails.max.resolution}
                </h3>
                <div className="border rounded p-4">
                  <img src={thumbnails.max} alt="최대 해상도 썸네일" className="w-full" />
                  <div className="mt-2">
                    <button
                      onClick={() => downloadImage(thumbnails.max)}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      {pageData.buttons.download}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">
                    {pageData.thumbnails.high.title} {pageData.thumbnails.high.resolution}
                  </h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.high} alt="고해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.high)}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {pageData.buttons.download}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    {pageData.thumbnails.medium.title} {pageData.thumbnails.medium.resolution}
                  </h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.medium} alt="중간 해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.medium)}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {pageData.buttons.download}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    {pageData.thumbnails.standard.title} {pageData.thumbnails.standard.resolution}
                  </h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.default} alt="기본 해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.default)}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        {pageData.buttons.download}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
      pageData: common.tools.youtube,
    },
  };
}
