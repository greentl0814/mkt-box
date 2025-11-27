import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Download } from 'lucide-react';

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

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `youtube-thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // 실패시 새 탭으로 열기
      window.open(url, '_blank');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getThumbnails();
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
      </Head>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">{pageData.title || 'YouTube 썸네일 추출기'}</h1>
            <Link
              href="/youtube/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink || '썸네일 추출 가이드'}</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-gray-600">
            유튜브 영상의 썸네일 이미지를 다양한 해상도로 추출할 수 있습니다.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {pageData.inputs.urlLabel}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={pageData.inputs.urlPlaceholder}
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                >
                  {pageData.buttons.extract}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 썸네일 결과 */}
        {thumbnails && (
          <div className="space-y-6">
            {/* 최대 해상도 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  {pageData.thumbnails.max.title} <span className="text-gray-500 text-sm font-normal">{pageData.thumbnails.max.resolution}</span>
                </h3>
              </div>
              <div className="p-6">
                <img src={thumbnails.max} alt="최대 해상도 썸네일" className="w-full rounded-lg mb-4" />
                <button
                  onClick={() => downloadImage(thumbnails.max)}
                  className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {pageData.buttons.download}
                </button>
              </div>
            </div>

            {/* 기타 해상도 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {pageData.thumbnails.high.title} <span className="text-gray-500 text-xs font-normal">{pageData.thumbnails.high.resolution}</span>
                  </h3>
                </div>
                <div className="p-4">
                  <img src={thumbnails.high} alt="고해상도 썸네일" className="w-full rounded mb-3" />
                  <button
                    onClick={() => downloadImage(thumbnails.high)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {pageData.buttons.download}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {pageData.thumbnails.medium.title} <span className="text-gray-500 text-xs font-normal">{pageData.thumbnails.medium.resolution}</span>
                  </h3>
                </div>
                <div className="p-4">
                  <img src={thumbnails.medium} alt="중간 해상도 썸네일" className="w-full rounded mb-3" />
                  <button
                    onClick={() => downloadImage(thumbnails.medium)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {pageData.buttons.download}
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {pageData.thumbnails.standard.title} <span className="text-gray-500 text-xs font-normal">{pageData.thumbnails.standard.resolution}</span>
                  </h3>
                </div>
                <div className="p-4">
                  <img src={thumbnails.default} alt="기본 해상도 썸네일" className="w-full rounded mb-3" />
                  <button
                    onClick={() => downloadImage(thumbnails.default)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    {pageData.buttons.download}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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
