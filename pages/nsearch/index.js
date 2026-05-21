// pages/nsearch/index.js
import { useState, useMemo } from "react";
import Head from "next/head";

import { format } from "date-fns";
import WordCloud from "@/components/WordCloud";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import he from "he";

export default function SearchTool() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchType, setSearchType] = useState("blog");
  const [display] = useState(10);
  const [start, setStart] = useState(1);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [sort, setSort] = useState("sim");

  const searchNaver = async (type, query, options = {}) => {
    const display = options.display || 10;
    const start = options.start || 1;
    try {
      const response = await fetch(
        `/api/search?type=${type}&query=${query}&display=${display}&start=${start}&sort=${sort}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "API 요청 실패");
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async () => {
    if (!query) {
      setError("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");
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
        throw new Error(errorData.message || "API 요청 실패");
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
      .map((item) => he.decode(item.title).replace(/<[^>]+>/g, ""))
      .join(" ");
  }, [results]);

  return (
    <>
      <Head>
        <title>네이버 검색 키워드 인사이트 | MKT Box</title>
        <meta name="description" content="네이버 블로그, 카페, 뉴스 검색 결과를 분석하여 주요 키워드를 워드 클라우드로 시각화하세요. 마케팅 인사이트를 발견하세요." />
        <meta name="keywords" content="네이버 키워드 분석, 네이버 검색 분석, 키워드 트렌드, 연관 키워드, 블로그 키워드, 워드 클라우드, 마케팅 인사이트, 콘텐츠 전략" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.mktbox.co.kr/nsearch" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/nsearch" />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/nsearch" />
        <meta property="og:title" content="네이버 검색 키워드 인사이트 | MKT Box" />
        <meta property="og:description" content="네이버 검색 데이터를 기반으로 콘텐츠 트렌드와 주요 키워드를 분석하세요." />
        <meta property="og:site_name" content="MKT Box" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="네이버 검색 키워드 인사이트 | MKT Box" />
        <meta name="twitter:description" content="네이버 검색 데이터를 기반으로 콘텐츠 트렌드와 주요 키워드를 분석하세요." />
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "네이버 검색 키워드 인사이트",
            "url": "https://www.mktbox.co.kr/nsearch",
            "description": "네이버 검색 API를 활용해 블로그, 카페, 뉴스의 주요 키워드를 워드 클라우드로 시각화합니다.",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["네이버 블로그 검색", "네이버 카페 검색", "네이버 뉴스 검색", "워드 클라우드 시각화"],
            "inLanguage": ["ko"]
          })}}
        />
      </Head>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-3">네이버 검색 키워드 인사이트</h1>
          <p className="text-gray-600">
            네이버 검색 데이터를 기반으로 주요 연관어를 분석하여 마케팅 인사이트를 발견하세요.
          </p>
        </div>

        {/* How to Use 섹션 */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg mb-6 overflow-hidden">
          <button
            className="flex items-center justify-between w-full p-4 text-left hover:bg-blue-100 transition-colors"
            onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
          >
            <span className="font-semibold text-blue-900">사용 방법</span>
            {isHowToUseOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </button>
          {isHowToUseOpen && (
            <div className="p-4 pt-0 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-1">1. 검색 설정</p>
                <p className="text-gray-600">검색 유형(블로그/카페/뉴스)과 정렬 방식을 선택하고 검색어를 입력하세요.</p>
              </div>
              <div>
                <p className="font-medium mb-1">2. 결과 분석</p>
                <p className="text-gray-600">워드 클라우드를 통해 주요 키워드를 시각적으로 파악하고, 검색 결과를 확인하세요.</p>
              </div>
              <div>
                <p className="font-medium mb-1">💡 Tip</p>
                <p className="text-gray-600">제목에는 핵심 키워드가 집중되어 있어 빠르게 트렌드를 파악할 수 있습니다.</p>
              </div>
            </div>
          )}
        </div>

        {/* 검색 폼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">검색 유형</label>
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="blog">블로그</option>
                  <option value="cafearticle">카페</option>
                  <option value="news">뉴스</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">정렬 방식</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="sim">관련도순</option>
                  <option value="date">최신순</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">검색어</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색어를 입력하세요"
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      검색 중
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      검색
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 검색 결과 */}
        {results.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">검색 결과 ({results.length}개)</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {results.map((item, index) => {
                let formattedDate = "";

                if (searchType === "news") {
                  if (item.pubDate) {
                    try {
                      formattedDate = format(new Date(item.pubDate), "yyyy-MM-dd");
                    } catch (error) {
                      formattedDate = "";
                    }
                  }
                } else if (searchType === "blog") {
                  if (item.postdate && item.postdate.length === 8) {
                    try {
                      const year = item.postdate.slice(0, 4);
                      const month = item.postdate.slice(4, 6);
                      const day = item.postdate.slice(6, 8);
                      const date = new Date(year, month - 1, day);
                      formattedDate = format(date, "yyyy-MM-dd");
                    } catch (error) {
                      formattedDate = "";
                    }
                  }
                }

                return (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline block mb-2"
                    >
                      {he.decode(item.title).replace(/<[^>]+>/g, "")}
                    </a>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {he.decode(item.description).replace(/<[^>]+>/g, "")}
                    </p>
                    {formattedDate && (
                      <span className="text-xs text-gray-500">
                        {formattedDate}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            {start !== -1 && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={handleMore}
                  disabled={loading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "로딩 중..." : "더보기"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 워드 클라우드 */}
        {titlesText && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded"></span>
              키워드 워드 클라우드
            </h3>
            <WordCloud text={titlesText} />
          </div>
        )}
      </div>
    </>
  );
}
