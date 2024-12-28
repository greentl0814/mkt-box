import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const data = await response.text();
      setShortUrl(data);
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

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <h1 className="text-2xl font-bold mb-6">{pageData.title}</h1>

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
                placeholder={pageData.inputs.placeholder}
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={shortenUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {pageData.buttons.shorten}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium mb-2">{pageData.results.title}</div>
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={shortUrl}
                  readOnly
                  className="flex-1 p-2 border rounded bg-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {pageData.buttons.copy}
                </button>
              </div>
              {copyMessage && (
                <div className="mt-2 text-sm text-green-600">
                  {copyMessage}
                </div>
              )}
            </div>
          )}
        </div>
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
