import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function YoutubeThumbnail() {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState(null);
  const [error, setError] = useState('');

  // YouTube URL에서 비디오 ID 추출
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
      setError('URL을 입력해주세요');
      return;
    }

    const videoId = getVideoId(url);
    if (!videoId) {
      setError('올바른 유튜브 URL이 아닙니다');
      return;
    }

    setThumbnails({
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
      medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      max: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    });
    setError('');
  };

  const downloadImage = (url) => {
    window.open(url, '_blank');

  };

  return (
    <>
      <Head>
        <title>유튜브 썸네일 추출기 - Marketing Tools</title>
        <meta name="description" content="유튜브 동영상의 썸네일 이미지를 다양한 해상도로 추출하세요." />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl font-bold mb-6">유튜브 썸네일 추출기</h1>

        <div className="space-y-6">
          {/* URL 입력 */}
          <div>
            <label className="block mb-2 font-medium">
              유튜브 URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={getThumbnails}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                썸네일 추출
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* 썸네일 결과 */}
          {thumbnails && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">최대 해상도 (1280x720)</h3>
                <div className="border rounded p-4">
                  <img src={thumbnails.max} alt="최대 해상도 썸네일" className="w-full" />
                  <div className="mt-2">
                    <button
                      onClick={() => downloadImage(thumbnails.max, 'max')}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      다운로드
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-medium mb-2">기본 해상도 (120x90)</h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.default} alt="기본 해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.default, 'default')}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        다운로드
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">중간 해상도 (320x180)</h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.medium} alt="중간 해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.medium, 'medium')}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        다운로드
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">고해상도 (480x360)</h3>
                  <div className="border rounded p-4">
                    <img src={thumbnails.high} alt="고해상도 썸네일" className="w-full" />
                    <div className="mt-2">
                      <button
                        onClick={() => downloadImage(thumbnails.high, 'high')}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        다운로드
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
