import React, { useState } from 'react';
import Head from 'next/head';
import { Link2, Youtube, Type, BarChart2, FileCode, Image, Search, Palette, ArrowRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useRouter } from 'next/router';

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;
  
  const [activeCategory, setActiveCategory] = useState('all');

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
      color: 'red',
      category: 'youtube'
    },
    {
      id: 'youtube-time',
      title: t('tools.youtubeTime.title'),
      description: t('tools.youtubeTime.description'),
      detailedDescription: t('tools.youtubeTime.detailedDescription'),
      keywords: ['유튜브 타임스탬프', '동영상 구간 공유', '유튜브 시간 링크', '동영상 타임라인', '유튜브 챕터'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-time',
      color: 'red',
      category: 'youtube'
    },
    {
      id: 'youtube-comments',
      title: t('tools.youtubeComments.title'),
      description: t('tools.youtubeComments.description'),
      detailedDescription: t('tools.youtubeComments.detailedDescription'),
      keywords: ['유튜브 댓글 수집', '댓글 분석', '엑셀 변환', '데이터 추출', '커뮤니티 관리'],
      icon: <Youtube className="w-6 h-6" />,
      link: '/youtube-comments',
      color: 'red',
      category: 'youtube'
    },
    // 🟢 마케팅/분석 툴
    {
      id: 'utm',
      title: t('tools.utm.title'),
      description: t('tools.utm.description'),
      detailedDescription: t('tools.utm.detailedDescription'),
      keywords: ['UTM 파라미터', '마케팅 분석', 'GA4', '트래픽 분석', '캠페인 추적', '구글 애널리틱스'],
      icon: <FileCode className="w-6 h-6" />,
      link: '/utm',
      color: 'blue',
      category: 'marketing'
    },
    {
      id: 'url',
      title: t('tools.url.title'),
      description: t('tools.url.description'),
      detailedDescription: t('tools.url.detailedDescription'),
      keywords: ['URL 단축', '링크 관리', 'QR코드 생성', '단축URL', '링크 공유'],
      icon: <Link2 className="w-6 h-6" />,
      link: '/url',
      color: 'blue',
      category: 'marketing'
    },
    {
      id: 'nsearch',
      title: '네이버 검색 분석',
      description: '네이버 검색 데이터를 기반으로 키워드 트렌드와 인사이트를 발견하세요',
      detailedDescription: '네이버 블로그, 카페, 뉴스의 검색 결과를 분석하여 워드 클라우드로 시각화하고, 주요 키워드를 파악할 수 있습니다. 정렬 옵션을 통해 관련도순 또는 최신순으로 결과를 확인하세요.',
      keywords: ['네이버 검색', '키워드 분석', '트렌드 분석', '워드 클라우드', '마케팅 인사이트', '콘텐츠 전략'],
      icon: <Search className="w-6 h-6" />,
      link: '/nsearch',
      color: 'green',
      category: 'marketing'
    },
    {
      id: 'analytics',
      title: t('tools.analytics.title'),
      description: t('tools.analytics.description'),
      detailedDescription: t('tools.analytics.detailedDescription'),
      keywords: ['ROAS 계산', '광고 성과', 'CPC 분석', '광고 효율', '마케팅 지표', '성과 측정'],
      icon: <BarChart2 className="w-6 h-6" />,
      link: '/analytics',
      color: 'green',
      category: 'marketing'
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
      color: 'orange',
      category: 'design'
    },
    {
      id: 'imageConverter',
      title: t('tools.imageConverter.title'),
      description: t('tools.imageConverter.description'),
      detailedDescription: t('tools.imageConverter.detailedDescription'),
      keywords: t('tools.imageConverter.keywords'),
      icon: <Image className="w-6 h-6" />,
      link: '/images',
      color: 'orange',
      category: 'design'
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
      color: 'purple',
      category: 'text'
    },
    {
      id: 'word-cloud',
      title: t('tools.wordCloud.title'),
      description: t('tools.wordCloud.description'),
      detailedDescription: t('tools.wordCloud.detailedDescription'),
      keywords: ['워드클라우드', '텍스트 시각화', '단어 빈도 분석', '키워드 추출', '텍스트 마이닝'],
      icon: <Type className="w-6 h-6" />,
      link: '/word-cloud',
      color: 'purple',
      category: 'text'
    },
  ];

  // 카테고리 퀵 필터 탭 구성
  const categories = [
    { id: 'all', label: locale === 'en' ? 'All Tools' : '모든 도구', dot: 'bg-slate-400' },
    { id: 'youtube', label: locale === 'en' ? 'YouTube' : '유튜브', dot: 'bg-red-500' },
    { id: 'marketing', label: locale === 'en' ? 'Marketing' : '마케팅 & 분석', dot: 'bg-emerald-500' },
    { id: 'design', label: locale === 'en' ? 'Design' : '디자인', dot: 'bg-amber-500' },
    { id: 'text', label: locale === 'en' ? 'Text' : '텍스트', dot: 'bg-violet-500' },
  ];

  // 필터링된 도구 목록
  const filteredTools = activeCategory === 'all'
    ? tools
    : tools.filter((tool) => tool.category === activeCategory);

  // 프리미엄 HSL 그라데이션 컬러 매핑
  const designTokens = {
    red: {
      ring: 'from-red-500/10 to-rose-500/10 text-red-600 border-red-100',
      hoverShadow: 'hover:shadow-[0_30px_60px_rgba(239,68,68,0.06)] hover:border-red-200/60',
      badge: 'bg-red-50 text-red-700 border-red-100'
    },
    blue: {
      ring: 'from-blue-500/10 to-cyan-500/10 text-blue-600 border-blue-100',
      hoverShadow: 'hover:shadow-[0_30px_60px_rgba(59,130,246,0.06)] hover:border-blue-200/60',
      badge: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    green: {
      ring: 'from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-100',
      hoverShadow: 'hover:shadow-[0_30px_60px_rgba(16,185,129,0.06)] hover:border-emerald-200/60',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    orange: {
      ring: 'from-orange-500/10 to-amber-500/10 text-amber-600 border-amber-100',
      hoverShadow: 'hover:shadow-[0_30px_60px_rgba(245,158,11,0.06)] hover:border-amber-200/60',
      badge: 'bg-amber-50 text-amber-700 border-amber-100'
    },
    purple: {
      ring: 'from-violet-500/10 to-purple-500/10 text-purple-600 border-purple-100',
      hoverShadow: 'hover:shadow-[0_30px_60px_rgba(139,92,246,0.06)] hover:border-purple-200/60',
      badge: 'bg-purple-50 text-purple-700 border-purple-100'
    }
  };

  return (
    <>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="keywords" content={t('meta.keywords')} />
        <meta property="og:title" content={t('meta.ogTitle')} />
        <meta property="og:description" content={t('meta.ogDescription')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr" />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        {/* 히어로 섹션 */}
        <section className="relative pt-12 md:pt-20 pb-8 md:pb-12 text-center max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100/80 mb-4 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            {locale === 'en' ? 'Ultimate Toolkit for Marketers' : '마케터를 위한 올인원 도구 상자'}
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight mb-4">
            {locale === 'en' ? 'Work Smart, ' : '더 스마트하게 일하고 '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {locale === 'en' ? 'Grow Faster' : '더 빠르게 성장하세요'}
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8 max-w-xl mx-auto">
            {t('meta.description')}
          </p>
        </section>

        {/* 카테고리 퀵 필터 탭 바 */}
        <section className="relative max-w-4xl mx-auto px-4 mb-10 md:mb-14">
          <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-2xl max-w-max mx-auto border border-slate-200/50 shadow-inner">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-white text-slate-900 shadow-md scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${category.dot}`} />
                {category.label}
              </button>
            ))}
          </div>
        </section>

        {/* 도구 그리드 레이아웃 (반응형 4열, 전체 <a> 태그 래핑으로 애드센스 갱신 보장) */}
        <section className="relative max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredTools.map((tool) => {
              const tokens = designTokens[tool.color] || designTokens.blue;

              return (
                <a
                  key={tool.id}
                  href={tool.link}
                  className={`group relative flex flex-col justify-between bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer ${tokens.hoverShadow}`}
                >
                  <div>
                    {/* 상단 링 & 카테고리 뱃지 */}
                    <div className="flex justify-between items-center mb-6">
                      <div className={`p-3 rounded-2xl bg-gradient-to-br border ${tokens.ring}`}>
                        {tool.icon}
                      </div>
                      <span className={`text-[10px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full border ${tokens.badge}`}>
                        {tool.category}
                      </span>
                    </div>

                    {/* 타이틀 및 설명 */}
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300 mb-2">
                      {tool.title}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium min-h-[40px] line-clamp-2">
                      {tool.description}
                    </p>
                  </div>

                  {/* 하단 화살표 링크 애니메이션 */}
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors duration-300">
                    <span>{t('main.useButton')}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

