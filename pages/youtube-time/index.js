import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy, Clock } from 'lucide-react';

export default function YoutubeTime({ pageData }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [generatedUrls, setGeneratedUrls] = useState([]);
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const validateYouTubeUrl = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    return regExp.test(url);
  };

  const extractVideoId = (url) => {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const generateUrl = () => {
    if (!url) {
      setError(pageData.errors.urlRequired);
      return;
    }

    if (!validateYouTubeUrl(url)) {
      setError(pageData.errors.invalidUrl);
      return;
    }

    if (!hours && !minutes && !seconds) {
      setError(pageData.errors.timeRequired);
      return;
    }

    const totalSeconds =
      parseInt(hours || 0) * 3600 +
      parseInt(minutes || 0) * 60 +
      parseInt(seconds || 0);

    if (totalSeconds === 0) {
      setError(pageData.errors.zeroTime);
      return;
    }

    const videoId = extractVideoId(url);
    const newUrl = `https://youtube.com/watch?v=${videoId}&t=${totalSeconds}s`;

    setGeneratedUrls([
      {
        originalTime: `${hours ? hours + ' ' + pageData.inputs.hours.label + ' ' : ''
          }${minutes ? minutes + ' ' + pageData.inputs.minutes.label + ' ' : ''
          }${seconds ? seconds + ' ' + pageData.inputs.seconds.label : ''}`,
        url: newUrl,
      },
      ...generatedUrls,
    ]);
    setError('');
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    setCopyMessage(pageData.copyMessage);
    setTimeout(() => {
      setCopyMessage('');
    }, 2000);
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
            <h1 className="text-3xl font-bold">{pageData.title}</h1>
            <Link
              href="/youtube-time/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink || '유튜브 시간 링크 가이드'}</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-gray-600">
            유튜브 영상의 특정 시간대로 바로 이동하는 링크를 생성하세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div className="space-y-6">
            {/* URL 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {pageData.inputs.url.label}
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={pageData.inputs.url.placeholder}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 시간 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                재생 시작 시간
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {pageData.inputs.hours.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {pageData.inputs.minutes.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    {pageData.inputs.seconds.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 생성 버튼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <button
            onClick={generateUrl}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {pageData.buttons.generate}
          </button>
        </div>

        {/* 생성된 URL 결과 */}
        {generatedUrls.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {pageData.results.title}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {copyMessage && (
                <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
                  {copyMessage}
                </div>
              )}
              {generatedUrls.map((item, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="text-sm text-gray-600 mb-2">
                    {pageData.results.jumpTime.replace(
                      '{time}',
                      item.originalTime
                    )}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 break-all text-sm text-gray-700">
                      {item.url}
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.url)}
                      className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors flex-shrink-0"
                      title="URL 복사"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
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
      pageData: common.tools.youtubeTime,
    },
  };
}
