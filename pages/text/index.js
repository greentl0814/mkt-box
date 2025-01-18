import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{pageData.title}</h1>
          <Link
            href="/text/guide"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <span>{pageData.guideLink}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={pageData.placeholder}
              className="w-full h-60 p-4 border rounded resize-none"
            />
          </div>

          <div className="bg-gray-50 p-4 rounded flex gap-8">
            <div>
              <div className="text-sm text-gray-600">{pageData.stats.total}</div>
              <div className="text-2xl font-bold">{totalCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{pageData.stats.noSpace}</div>
              <div className="text-2xl font-bold">{noSpaceCount}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{pageData.stats.byte2}</div>
              <div className="text-2xl font-bold">{byteCount2}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">{pageData.stats.byte3}</div>
              <div className="text-2xl font-bold">{byteCount3}</div>
            </div>
          </div>

          {/* 바이트 계산 설명 */}
          <div className="bg-blue-50 p-4 rounded space-y-2 text-sm text-gray-700">
            <p className="font-medium">{pageData.info.byteStandard.title}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{pageData.info.byteStandard.basic}</li>
              <li>{pageData.info.byteStandard.korean}</li>
            </ul>

            <p className="font-medium mt-4">{pageData.info.encoding.title}</p>
            <ul className="list-disc list-inside space-y-1">
              <li>{pageData.info.encoding.utf8}</li>
              <li>{pageData.info.encoding.euckr}</li>
              <li>{pageData.info.encoding.utf16}</li>
            </ul>

            <p className="font-medium mt-4">{pageData.info.platform.title}</p>
            <ul className="list-disc list-inside space-y-1">
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
