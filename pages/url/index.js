import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Copy, Link as LinkIcon } from 'lucide-react';

export default function URLShortener({ pageData }) {
  const { t } = useTranslation();
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!url) {
      setError(pageData.messages.error.empty);
      return;
    }

    if (!validateUrl(url)) {
      setError(pageData.messages.error.invalid);
      return;
    }

    try {
      // 자체 API 라우트를 통해 URL 단축 (CORS 문제 해결)
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Shortening failed');
      }

      const data = await response.json();
      setShortUrl(data.shortUrl);
      setError('');
    } catch (error) {
      setError(pageData.messages.error.failed);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopyMessage(pageData.messages.success);
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
              href="/url/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink}</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-gray-600">
            긴 URL을 짧고 간단하게 변환하여 공유하세요.
          </p>
        </div>

        {/* 입력 폼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {pageData.inputs.urlLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={pageData.inputs.placeholder}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={shortenUrl}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                {pageData.buttons.shorten}
              </button>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 결과 */}
        {shortUrl && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">{pageData.results.title}</h3>
            </div>
            <div className="p-6">
              <div className="flex gap-3 items-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {pageData.buttons.copy}
                </button>
              </div>
              {copyMessage && (
                <div className="mt-2 text-sm text-green-600">
                  {copyMessage}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.url);

  return {
    props: {
      pageData,
    },
  };
}
