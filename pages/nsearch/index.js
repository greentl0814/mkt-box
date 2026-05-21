// pages/nsearch/index.js
import { useState, useMemo } from "react";
import Head from "next/head";

import { format } from "date-fns";
import WordCloud from "@/components/WordCloud";
import { ChevronDown, ChevronUp, Search, Loader2, BookOpen, Sparkles, Database } from "lucide-react";
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

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 md:py-12">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Database className="w-8 h-8 text-emerald-600 animate-pulse" />
              네이버 검색 키워드 인사이트
            </h1>
            <p className="text-slate-500 font-medium mt-2 leading-relaxed">
              네이버 검색 데이터를 실시간으로 수집하여 주요 연관어를 분석하고 마케팅 트렌드 인사이트를 시각화합니다.
            </p>
          </div>

          {/* 사용 방법 섹션 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8 overflow-hidden">
            <button
              className="flex items-center justify-between w-full p-6 text-left hover:bg-slate-50/50 transition-colors"
              onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
            >
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                사용 방법
              </span>
              {isHowToUseOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400" />
              )}
            </button>
            {isHowToUseOpen && (
              <div className="px-6 pb-6 space-y-4 border-t border-slate-50 text-sm text-slate-600 leading-relaxed font-semibold">
                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <p className="font-black text-slate-800 mb-1">1. 검색 설정</p>
                    <p className="text-xs font-semibold text-slate-500">검색 유형(블로그/카페/뉴스)과 정렬 방식을 선택하고 검색어를 입력하세요.</p>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                    <p className="font-black text-slate-800 mb-1">2. 결과 분석</p>
                    <p className="text-xs font-semibold text-slate-500">워드 클라우드를 통해 주요 키워드를 시각적으로 파악하고, 검색 결과를 확인하세요.</p>
                  </div>
                  <div className="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/30">
                    <p className="font-black text-emerald-800 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      Tip
                    </p>
                    <p className="text-xs font-semibold text-emerald-600">제목에는 핵심 키워드가 집중되어 있어 빠르게 트렌드를 파악할 수 있습니다.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 검색 폼 */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">검색 유형</label>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="w-full p-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-850 font-semibold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80 cursor-pointer"
                  >
                    <option value="blog">블로그</option>
                    <option value="cafearticle">카페</option>
                    <option value="news">뉴스</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">정렬 방식</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full p-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-850 font-semibold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80 cursor-pointer"
                  >
                    <option value="sim">관련도순</option>
                    <option value="date">최신순</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">검색어</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    className="flex-1 p-4 bg-slate-50/50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-400 font-semibold text-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/80"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl hover:shadow-[0_8px_16px_rgba(16,185,129,0.15)] transition-all duration-300 shadow-sm flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-red-50/80 border border-red-200/80 backdrop-blur text-red-600 px-5 py-4 rounded-2xl mb-8 font-semibold text-sm shadow-sm">
              {error}
            </div>
          )}

          {/* 워드 클라우드 (결과 위에 위치하여 트렌드 요약 먼저 제공) */}
          {titlesText && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
              <h3 className="text-xl font-bold text-slate-850 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
                키워드 워드 클라우드
              </h3>
              <WordCloud text={titlesText} />
            </div>
          )}

          {/* 검색 결과 */}
          {results.length > 0 && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 overflow-hidden">
              <div className="px-6 md:px-8 py-5 border-b border-slate-100/80 bg-slate-50/50">
                <h3 className="font-bold text-slate-850">검색 결과 ({results.length}개)</h3>
              </div>
              <div className="divide-y divide-slate-100/80">
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
                    <div key={index} className="p-6 hover:bg-slate-50/30 transition-colors">
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 font-bold hover:underline block mb-2 text-base"
                      >
                        {he.decode(item.title).replace(/<[^>]+>/g, "")}
                      </a>
                      <p className="text-slate-500 font-semibold text-xs md:text-sm mb-3 line-clamp-2 leading-relaxed">
                        {he.decode(item.description).replace(/<[^>]+>/g, "")}
                      </p>
                      {formattedDate && (
                        <span className="inline-block text-2xs font-bold text-slate-400 bg-slate-100/60 px-2 py-0.5 rounded-md">
                          {formattedDate}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {start !== -1 && (
                <div className="p-5 bg-slate-50/50 border-t border-slate-100/80 flex justify-center">
                  <button
                    onClick={handleMore}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 font-bold text-sm rounded-2xl hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "로딩 중..." : "더보기"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
