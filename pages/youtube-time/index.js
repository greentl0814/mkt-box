import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{pageData.title}</h1>
          {/* 가이드 페이지 링크 수정 */}
          <Link href="/youtube-time/guide" className="text-blue-500 hover:text-blue-700 flex items-center">
            <span>{pageData.guideLink || '유튜브 시간 링크 가이드'}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              {pageData.inputs.url.label}
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={pageData.inputs.url.placeholder}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 font-medium">
                {pageData.inputs.hours.label}
              </label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                {pageData.inputs.minutes.label}
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="0"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                {pageData.inputs.seconds.label}
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(e.target.value)}
                placeholder="0"
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <button
            onClick={generateUrl}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {pageData.buttons.generate}
          </button>

          {generatedUrls.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">
                {pageData.results.title}
              </h2>
              <div className="space-y-4">
                {copyMessage && (
                  <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
                    {copyMessage}
                  </div>
                )}
                {generatedUrls.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded">
                    <div className="text-sm text-gray-600 mb-2">
                      {pageData.results.jumpTime.replace(
                        '{time}',
                        item.originalTime
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 break-all">
                        {item.url}
                      </div>
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="text-blue-500 hover:text-blue-700 px-3"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))}
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
      pageData: common.tools.youtubeTime,
    },
  };
}
