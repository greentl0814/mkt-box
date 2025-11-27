import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { FileText } from 'lucide-react';

export default function TextCounter({ pageData }) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  // 전체 글자수
  const totalCount = text.length;

  // 공백 제외 글자수
  const noSpaceCount = text.replace(/\s/g, '').length;

  // 바이트 계산 (2바이트, 3바이트)
  const getByteLength = (str, bytePerKorean) => {
    let byte = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode <= 0x7F) {
        byte += 1; // 영어, 숫자, 기본 특수문자
      } else {
        byte += bytePerKorean; // 한글, 기타 유니코드
      }
    }
    return byte;
  };

  const byteCount2 = getByteLength(text, 2);
  const byteCount3 = getByteLength(text, 3);

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
              href="/text/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink}</span>
              <span>→</span>
            </Link>
          </div>
          <p className="text-gray-600">
            텍스트의 글자 수와 바이트를 실시간으로 계산하세요.
          </p>
        </div>

        {/* 텍스트 입력 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              텍스트 입력
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={pageData.placeholder}
              className="w-full h-60 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 통계 결과 */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">텍스트 통계</h3>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{pageData.stats.total}</div>
              <div className="text-3xl font-bold text-blue-600">{totalCount.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{pageData.stats.noSpace}</div>
              <div className="text-3xl font-bold text-green-600">{noSpaceCount.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{pageData.stats.byte2}</div>
              <div className="text-3xl font-bold text-purple-600">{byteCount2.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{pageData.stats.byte3}</div>
              <div className="text-3xl font-bold text-orange-600">{byteCount3.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* 바이트 계산 설명 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 text-sm text-gray-700">
          <div>
            <p className="font-medium text-blue-900 mb-1">{pageData.info.byteStandard.title}</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>{pageData.info.byteStandard.basic}</li>
              <li>{pageData.info.byteStandard.korean}</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-blue-900 mb-1">{pageData.info.encoding.title}</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>{pageData.info.encoding.utf8}</li>
              <li>{pageData.info.encoding.euckr}</li>
              <li>{pageData.info.encoding.utf16}</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-blue-900 mb-1">{pageData.info.platform.title}</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li>{pageData.info.platform.naver}</li>
              <li>{pageData.info.platform.google}</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  // common.json 파일 로드
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.text);

  return {
    props: {
      pageData,
    },
  };
}
