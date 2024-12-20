import React from 'react';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import Image from 'next/image';
import { Link2, Youtube, Type, BarChart2, FileCode } from 'lucide-react';
import { Palette } from 'lucide-react';

export default function Home() {
  const tools = [
    {
      id: 'utm',
      title: 'UTM 생성기',
      description: '마케팅 채널별 링크를 추적하고 분석하기 위한 UTM 코드를 쉽게 생성하세요.',
      detailedDescription: '페이스북, 인스타그램, 네이버, 구글 등 다양한 마케팅 채널의 성과를 정확하게 측정하세요. GA4와 호환되는 표준 형식으로 제공되며, 캠페인별, 매체별 트래픽을 구분하여 분석할 수 있습니다.',
      keywords: ['UTM 파라미터', '마케팅 분석', 'GA4', '트래픽 분석', '캠페인 추적', '구글 애널리틱스'],
      icon: <FileCode className="w-6 h-6" />,
      link: '/utm'
    },
    {
      id: 'youtube',
      title: '유튜브 썸네일 추출기',
      description: '유튜브 영상의 썸네일 이미지를 다양한 해상도로 추출할 수 있습니다.',
      detailedDescription: '유튜브 영상 URL만으로 고화질(HD), 중화질(SD), 저화질 썸네일을 즉시 추출할 수 있습니다. 블로그 포스팅, SNS 공유용 이미지로 활용하기 적합하며, 실시간 미리보기를 제공합니다.',
      keywords: ['유튜브 썸네일', '유튜브 미리보기', '동영상 썸네일', '유튜브 이미지 추출', '고화질 썸네일'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube'
    },
    {
      id: 'youtube-time',
      title: '유튜브 타임스탬프 생성기',
      description: '유튜브 동영상의 특정 시간대로 바로 이동하는 URL을 생성합니다.',
      detailedDescription: '긴 유튜브 영상에서 원하는 구간을 정확히 공유하세요. 시간, 분, 초를 입력하면 해당 시점부터 재생되는 링크가 자동으로 생성됩니다. 교육 컨텐츠나 하이라이트 공유에 매우 유용합니다.',
      keywords: ['유튜브 타임스탬프', '동영상 구간 공유', '유튜브 시간 링크', '동영상 타임라인', '유튜브 챕터'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-time'
    },
    {
      id: 'youtube-comments',
      title: '유튜브 댓글 추출기',
      description: '유튜브 영상의 댓글을 엑셀 파일로 추출합니다.',
      detailedDescription: '유튜브 영상의 모든 댓글과 답글을 손쉽게 엑셀 파일로 내보내기할 수 있습니다. 댓글 작성자, 시간, 좋아요 수 등 상세 정보를 포함하며, 고객 피드백 분석과 커뮤니티 관리에 활용할 수 있습니다.',
      keywords: ['유튜브 댓글 수집', '댓글 분석', '엑셀 변환', '데이터 추출', '커뮤니티 관리'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-comments'
    },
    {
      id: 'url',
      title: 'URL 단축기',
      description: '긴 URL을 간단하게 줄여서 관리와 공유를 더 쉽게 만들어줍니다.',
      detailedDescription: '길고 복잡한 URL을 짧고 기억하기 쉬운 링크로 변환합니다. 커스텀 URL 설정이 가능하며, QR코드 자동 생성 기능을 제공합니다. SNS 공유와 오프라인 마케팅에 최적화되어 있습니다.',
      keywords: ['URL 단축', '링크 관리', 'QR코드 생성', '단축URL', '링크 공유'],
      icon: <Link2 className="w-6 h-6" />,
      link: '/url'
    },
    {
      id: 'text',
      title: '텍스트 분석기',
      description: '텍스트의 글자수와 바이트를 실시간으로 체크하고 분석합니다.',
      detailedDescription: '글자수, 단어수, 문장수를 실시간으로 분석합니다. 공백 포함/미포함 옵션을 제공하며, SNS 글자수 제한 기준선을 표시해 줍니다. 한글, 영문, 특수문자 등 문자 타입별 통계도 확인할 수 있습니다.',
      keywords: ['글자수 세기', '문자 수 계산', '텍스트 분석', '글자수 제한', '문자 통계'],
      icon: <Type className="w-6 h-6" />,
      link: '/text'
    },
    {
      id: 'analytics',
      title: '광고 성과 분석',
      description: 'ROAS, CPC, CTR 등 주요 광고 지표를 분석하고 성과를 측정합니다.',
      detailedDescription: '광고 비용과 매출 데이터를 기반으로 ROAS, CPC, CTR, CVR 등 핵심 마케팅 지표를 자동 계산합니다. 채널별 성과 비교와 시계열 분석이 가능하며, 최적화 인사이트를 제공합니다.',
      keywords: ['ROAS 계산', '광고 성과', 'CPC 분석', '광고 효율', '마케팅 지표', '성과 측정'],
      icon: <BarChart2 className="w-6 h-6" />,
      link: '/analytics'
    },
    {
      id: 'word-cloud',
      title: '워드클라우드 생성기',
      description: '텍스트를 분석하여 단어 빈도수를 시각화하는 워드클라우드를 생성합니다.',
      detailedDescription: '입력된 텍스트에서 자주 등장하는 단어를 추출하여 시각적으로 표현합니다. 단어의 출현 빈도에 따라 글자 크기가 자동으로 조절되며, 커스텀 색상과 레이아웃 옵션을 제공합니다.',
      keywords: ['워드클라우드', '텍스트 시각화', '단어 빈도 분석', '키워드 추출', '텍스트 마이닝'],
      icon: <Type className="w-6 h-6" />,
      link: '/word-cloud'
    },
    {
      id: 'colors',
      title: '컬러 도구',
      description: '완벽한 색상 조합을 찾고 활용하세요.',
      detailedDescription: '메인 컬러를 기준으로 보색, 유사색, 삼각 배색 등 다양한 색상 조합을 확인할 수 있습니다. HEX, RGB 등 색상 코드를 쉽게 복사하고, 팔레트를 만들어 브랜드 디자인에 활용하세요.',
      keywords: ['컬러 팔레트', '색상 조합', '브랜드 컬러', '보색', '색상 코드', 'HEX 코드', 'RGB 코드'],
      icon: <Palette className="w-6 h-6" />,
      link: '/colors'
    }

  ];

  return (
    <>
      <Head>
        <title>마케팅 도구 모음 - 실용적인 마케팅 툴 모음</title>
        <meta name="description" content="UTM 생성, 유튜브 댓글 및 썸네일 추출, URL 단축 등 마케터에게 필요한 다양한 도구를 제공합니다." />
        <meta name="keywords" content="UTM 생성기, 유튜브 댓글 및 썸네일 추출, 마케팅 도구, URL 단축, 마케팅 분석" />
        <meta property="og:title" content="마케팅 도구 모음" />
        <meta property="og:description" content="마케터를 위한 필수 도구! UTM 생성, 유튜브 댓글 및 썸네일 추출, URL 단축 등 다양한 기능을 무료로 이용하세요." />
      </Head>
      

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          마케터를 위한 Tool Box
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600">
                  {tool.icon}
                </div>
                <h2 className="text-xl font-semibold ml-3">{tool.title}</h2>
              </div>
              <p className="text-gray-600 mb-4 min-h-[48px]">{tool.description}</p>
              <Link
                href={tool.link}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors w-full text-center"
              >
                도구 사용하기
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
