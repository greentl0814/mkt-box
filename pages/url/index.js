import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function URLShortener() {
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
      setError('URL을 입력해주세요');
      return;
    }

    if (!validateUrl(url)) {
      setError('올바른 URL 형식이 아닙니다');
      return;
    }

    try {
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      const data = await response.text();
      setShortUrl(data);
      setError('');
    } catch (error) {
      setError('URL 단축 중 오류가 발생했습니다');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopyMessage('URL이 복사되었습니다!');
    setTimeout(() => {
      setCopyMessage('');
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>URL 단축기 - Marketing Tools</title>
        <meta name="description" content="긴 URL을 짧고 간단하게 줄여보세요." />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl font-bold mb-6">URL 단축기</h1>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              URL 입력
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={shortenUrl}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                단축하기
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
              <div className="font-medium mb-2">단축된 URL:</div>
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
                  복사
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
