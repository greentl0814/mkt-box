import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { Image as NextImage } from 'next/image'; // Image를 NextImage로 import
import { Link2, Youtube, Type, BarChart2, FileCode, Image, Search } from 'lucide-react';
import { Palette } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Home() {
  const { t } = useTranslation();

  const tools = [
    // 🔴 유튜브 툴
    {
      id: 'youtube',
      title: t('tools.youtube.title'),
      description: t('tools.youtube.description'),
      detailedDescription: t('tools.youtube.detailedDescription'),
      keywords: ['유튜브 썸네일', '유튜브 미리보기', '동영상 썸네일', '유튜브 이미지 추출', '고화질 썸네일'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube',
      color: 'red'
    },
    {
      id: 'youtube-time',
      title: t('tools.youtubeTime.title'),
      description: t('tools.youtubeTime.description'),
      detailedDescription: t('tools.youtubeTime.detailedDescription'),
      keywords: ['유튜브 타임스탬프', '동영상 구간 공유', '유튜브 시간 링크', '동영상 타임라인', '유튜브 챕터'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-time',
      color: 'red'
    },
    {
      id: 'youtube-comments',
      title: t('tools.youtubeComments.title'),
      description: t('tools.youtubeComments.description'),
      detailedDescription: t('tools.youtubeComments.detailedDescription'),
      keywords: ['유튜브 댓글 수집', '댓글 분석', '엑셀 변환', '데이터 추출', '커뮤니티 관리'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-comments',
      color: 'red'
    },
    // 🔵 기타
    {
      id: 'utm',
      title: t('tools.utm.title'),
      description: t('tools.utm.description'),
      detailedDescription: t('tools.utm.detailedDescription'),
      keywords: ['UTM 파라미터', '마케팅 분석', 'GA4', '트래픽 분석', '캠페인 추적', '구글 애널리틱스'],
      icon: <FileCode className="w-6 h-6" />,
      link: '/utm',
      color: 'blue'
    },
    {
      id: 'url',
      title: t('tools.url.title'),
      description: t('tools.url.description'),
      detailedDescription: t('tools.url.detailedDescription'),
      keywords: ['URL 단축', '링크 관리', 'QR코드 생성', '단축URL', '링크 공유'],
      icon: <Link2 className="w-6 h-6" />,
      link: '/url',
      color: 'blue'
    },
    // 🟢 분석 툴
    {
      id: 'nsearch',
      title: '네이버 검색 분석',
      description: '네이버 검색 데이터를 기반으로 키워드 트렌드와 인사이트를 발견하세요',
      detailedDescription: '네이버 블로그, 카페, 뉴스의 검색 결과를 분석하여 워드 클라우드로 시각화하고, 주요 키워드를 파악할 수 있습니다. 정렬 옵션을 통해 관련도순 또는 최신순으로 결과를 확인하세요.',
      keywords: ['네이버 검색', '키워드 분석', '트렌드 분석', '워드 클라우드', '마케팅 인사이트', '콘텐츠 전략'],
      icon: <Search className="w-6 h-6" />,
      link: '/nsearch',
      color: 'green'
    },
    {
      id: 'analytics',
      title: t('tools.analytics.title'),
      description: t('tools.analytics.description'),
      detailedDescription: t('tools.analytics.detailedDescription'),
      keywords: ['ROAS 계산', '광고 성과', 'CPC 분석', '광고 효율', '마케팅 지표', '성과 측정'],
      icon: <BarChart2 className="w-6 h-6" />,
      link: '/analytics',
      color: 'green'
    },
    // 🟠 디자인 툴
    {
      id: 'colors',
      title: t('tools.colors.title'),
      description: t('tools.colors.description'),
      detailedDescription: t('tools.colors.detailedDescription'),
      keywords: ['컬러 팔레트', '색상 조합', '브랜드 컬러', '보색', '색상 코드', 'HEX 코드', 'RGB 코드'],
      icon: <Palette className="w-6 h-6" />,
      link: '/colors',
      color: 'orange'
    },
    {
      id: 'imageConverter',
      title: t('tools.imageConverter.title'),
      description: t('tools.imageConverter.description'),
      detailedDescription: t('tools.imageConverter.detailedDescription'),
      keywords: t('tools.imageConverter.keywords'),
      icon: <Image className="w-6 h-6" />,
      link: '/images',
      color: 'orange'
    },
    // 🟣 텍스트 툴
    {
      id: 'text',
      title: t('tools.text.title'),
      description: t('tools.text.description'),
      detailedDescription: t('tools.text.detailedDescription'),
      keywords: ['글자수 세기', '문자 수 계산', '텍스트 분석', '글자수 제한', '문자 통계'],
      icon: <Type className="w-6 h-6" />,
      link: '/text',
      color: 'purple'
    },
    {
      id: 'word-cloud',
      title: t('tools.wordCloud.title'),
      description: t('tools.wordCloud.description'),
      detailedDescription: t('tools.wordCloud.detailedDescription'),
      keywords: ['워드클라우드', '텍스트 시각화', '단어 빈도 분석', '키워드 추출', '텍스트 마이닝'],
      icon: <Type className="w-6 h-6" />,
      link: '/word-cloud',
      color: 'purple'
    },
  ];

  // 색상 매핑
  const colorClasses = {
    red: 'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="keywords" content={t('meta.keywords')} />
        <meta property="og:title" content={t('meta.ogTitle')} />
        <meta property="og:description" content={t('meta.ogDescription')} />
      </Head>

      <main className="py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex items-center mb-4">
                <div className={`p-2 rounded-full ${colorClasses[tool.color]}`}>
                  {tool.icon}
                </div>
                <h2 className="text-xl font-semibold ml-3">{tool.title}</h2>
              </div>
              <p className="text-gray-600 mb-4 min-h-[48px]">{tool.description}</p>
              <Link
                href={tool.link}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full text-center"
              >
                {t('main.useButton')}
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
