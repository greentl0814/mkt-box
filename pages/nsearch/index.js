// pages/index.js
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import WordCloud from '../../components/WordCloud';
import { ChevronDown, ChevronUp } from 'lucide-react';
import he from 'he';

export default function SearchTool() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState('blog');
  const [display, setDisplay] = useState(10);
  const [start, setStart] = useState(1);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [sort, setSort] = useState('sim');

  const searchNaver = async (type, query, options = {}) => {
    const display = options.display || 10;
    const start = options.start || 1;
    try {
      const response = await fetch(
        `/api/search?type=${type}&query=${query}&display=${display}&start=${start}&sort=${sort}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API 요청 실패');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!query) {
      setError('검색어를 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setStart(1);

    try {
      const data = await searchNaver(searchType, query, { display, start });
      setResults(data.items);
      if (data.total > data.start + data.display - 1) {
        setStart(data.start + data.display);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMore = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?type=${searchType}&query=${query}&display=${display}&start=${start}&sort=${sort}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API 요청 실패');
      }
      const newData = await response.json();
      setResults([...results, ...newData.items]);
      if (newData.total > newData.start + newData.display - 1) {
        setStart(newData.start + newData.display);
      } else {
        setStart(-1);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSearch();
  };

  const titlesText = useMemo(() => {
    return results
      .map((item) => he.decode(item.title).replace(/<[^>]+>/g, ''))
      .join(' ');
  }, [results]);

  return (
    <>
      <Head>
        <title>마케팅 키워드 인사이트</title>
        <meta name="description" content="네이버 검색 키워드 분석 툴" />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            ← 메인으로 돌아가기
          </Link>
        </div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">네이버 키워드 인사이트</h1>
        </div>
        <div className="mb-6">
          <p className="text-gray-700">
            네이버 검색 데이터를 기반으로, 주요 키워드 트렌드와 연관어를 분석하여
            마케팅 전략 수립에 필요한 인사이트를 발견하세요!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            <b>게시글 제목</b>은 핵심 내용을 간결하게 담고 있어,
            전체 내용을 분석하지 않고도 <b>빠르게 트렌드를 파악</b>하고,{' '}
            <b>소비자의 관심사</b>를 파악할 수 있습니다.<br />해당 툴은 기계적으로 텍스트를 취합하고 분류합니다. <b>사용자의 통찰력이 중요</b>합니다.
            <br />*실제 네이버 웹 검색결과와 상이할 수 있습니다.
          </p>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <button
            className="flex items-center justify-between w-full font-bold text-lg"
            onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
          >
            <span>How to Use</span>
            {isHowToUseOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {isHowToUseOpen && (
            <div className="mt-4 space-y-4">
              {/* 기본 사용법 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">기본 사용법</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="font-medium text-gray-800 mb-2">1. 검색 설정</div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 검색어를 입력하세요</li>
                      <li>• 검색 유형(블로그/카페/뉴스)을 선택하세요</li>
                      <li>• 원하는 정렬 방식을 선택하세요</li>
                      <li>• 검색 버튼을 클릭하거나 Enter를 누르세요</li>
                      
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="font-medium text-gray-800 mb-2">2. 결과 확인</div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• 검색 결과 목록 확인</li>
                      <li>• 워드 클라우드로 주요 키워드 파악</li>
                      <li>• 더보기로 추가 결과 확인</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 고급 기능 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">고급 기능</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2">워드 클라우드 커스터마이징</h4>
                  <p className="text-gray-600 mb-2">원하지 않는 단어를 제외하여 더 의미 있는 분석이 가능합니다:</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 워드 클라우드 상단의 '제외할 단어' 입력</li>
                    <li>• 여러 단어를 추가하여 필터링 가능</li>
                    <li>• 언제든지 제외 단어 삭제 가능</li>
                  </ul>
                </div>
              </div>

              {/* 분석 팁 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">분석 팁</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <ul className="space-y-2 text-gray-600">
                    <li>• 제목에는 핵심 키워드가 집중되어 있어 트렌드 파악이 용이합니다</li>
                    <li>• 워드 클라우드의 글자 크기로 키워드의 중요도를 파악할 수 있습니다</li>
                    <li>• 여러 검색 유형을 번갈아 검색하여 채널별 특성을 비교해보세요</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 font-medium">검색어</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex gap-2 w-full">
                <div className="flex items-center gap-2">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-24 p-2 border rounded"
                  >
                    <option value="blog">블로그</option>
                    <option value="cafearticle">카페</option>
                    <option value="news">뉴스</option>
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-24 p-2 border rounded"
                  >
                    <option value="sim">관련도순</option>
                    <option value="date">최신순</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                  disabled={loading}
                >
                  검색
                </button>
              </div>
            </div>
          </div>
        </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {loading && <p>검색 중...</p>}

          {results.length > 0 && (
            <div className="bg-gray-50 p-4 rounded">
              <div className="font-medium mb-2">검색 결과</div>
              <ul>
                {results.map((item, index) => {
                  let formattedDate = '';

                  if (searchType === 'news') {
                    if (item.pubDate) {
                      try {
                        formattedDate = format(new Date(item.pubDate), 'yyyy-MM-dd');
                      } catch (error) {
                        formattedDate = '';
                      }
                    }
                  } else if (searchType === 'blog') {
                    if (item.postdate && item.postdate.length === 8) {
                      try {
                        const year = item.postdate.slice(0, 4);
                        const month = item.postdate.slice(4, 6);
                        const day = item.postdate.slice(6, 8);
                        const date = new Date(year, month - 1, day);
                        formattedDate = format(date, 'yyyy-MM-dd');
                      } catch (error) {
                        formattedDate = '';
                      }
                    }
                  }
                  // 카페의 경우 날짜 표시 생략 (formattedDate는 빈 문자열)

                  return (
                    <li key={index} className="mb-4">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {he.decode(item.title).replace(/<[^>]+>/g, '')}
                      </a>
                      {formattedDate && (
                        <span className="ml-2 text-gray-500 text-sm">
                          ({formattedDate})
                        </span>
                      )}
                      <p>{he.decode(item.description).replace(/<[^>]+>/g, '')}</p>
                    </li>
                  );
                })}
              </ul>
              {start !== -1 && (
                <button
                  onClick={handleMore}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  더 보기
                </button>
              )}
            </div>
          )}

          {titlesText && (
            <div>
              <h3 className="text-lg font-semibold mt-6 mb-2">
                검색어 관련 워드 클라우드
              </h3>
              <WordCloud text={titlesText} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
