import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // 도구 카테고리 분류
  const toolCategories = [
    {
      id: 'youtube',
      label: t('header.categories.youtube') || '유튜브',
      items: [
        { id: 'youtube', label: t('tools.youtube.title') || '썸네일 추출', link: '/youtube' },
        { id: 'youtube-time', label: t('tools.youtubeTime.title') || '타임스탬프', link: '/youtube-time' },
        { id: 'youtube-comments', label: t('tools.youtubeComments.title') || '댓글 수집', link: '/youtube-comments' },
      ]
    },
    {
      id: 'marketing',
      label: t('header.categories.marketing') || '마케팅',
      items: [
        { id: 'utm', label: t('tools.utm.title') || 'UTM 생성기', link: '/utm' },
        { id: 'analytics', label: t('tools.analytics.title') || '광고 성과 계산기', link: '/analytics' },
        { id: 'nsearch', label: '네이버 검색 분석', link: '/nsearch' },
      ]
    },
    {
      id: 'text',
      label: t('header.categories.text') || '텍스트',
      items: [
        { id: 'text', label: t('tools.text.title') || '글자수 세기', link: '/text' },
        { id: 'word-cloud', label: t('tools.wordCloud.title') || '워드클라우드', link: '/word-cloud' },
      ]
    },
    {
      id: 'tools',
      label: t('header.categories.tools') || '기타 도구',
      items: [
        { id: 'url', label: t('tools.url.title') || 'URL 단축', link: '/url' },
        { id: 'colors', label: t('tools.colors.title') || '컬러 팔레트', link: '/colors' },
        { id: 'images', label: t('tools.imageConverter.title') || '이미지 변환', link: '/images' },
      ]
    },
  ];

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 라우트 변경시 모바일 메뉴 닫기
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events]);

  const toggleDropdown = (categoryId) => {
    setActiveDropdown(activeDropdown === categoryId ? null : categoryId);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <a href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-blue-600">MKTBOX</span>
          </a>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-1" ref={dropdownRef}>
            {toolCategories.map((category) => (
              <div key={category.id} className="relative">
                <button
                  onClick={() => toggleDropdown(category.id)}
                  className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <span>{category.label}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* 드롭다운 메뉴 */}
                {activeDropdown === category.id && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    {category.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.link}
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* 우측 영역 */}
          <div className="flex items-center space-x-4">
            {/* 언어 선택기 */}
            <div className="hidden md:block">
              <LanguageSelector />
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {toolCategories.map((category) => (
              <div key={category.id} className="mb-4">
                <div className="px-4 py-2 text-sm font-semibold text-gray-900 bg-gray-50">
                  {category.label}
                </div>
                {category.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    className="block px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ))}

            {/* 모바일 언어 선택기 */}
            <div className="px-4 py-2 border-t border-gray-200 mt-4 pt-4">
              <LanguageSelector />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
