import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslation } from '@/lib/i18n/useTranslation';
import WordCloud from '@/components/WordCloud';
import { ChevronDown, ChevronUp, Loader2, Download } from 'lucide-react';
import he from 'he';

interface Comment {
  comment: string;
  author: string;
  date: string;
  numLikes: number;
  isReply: boolean;
  parentAuthor?: string;
}

interface FetchOptions {
  includeReplies: boolean;
  sortBy: 'relevance' | 'time';
}

const COMMENTS_LIMIT = 2000;
const DAILY_LIMIT = 10;

export default function YouTubeComments({ pageData = {} }: { pageData?: any }) {
  const { t } = useTranslation();
  
  const headData = pageData?.head || {};
  const noticeData = pageData?.notice || {};
  const limitsData = noticeData?.limits || {};
  const howToUseData = pageData?.howToUse || {};
  const inputsData = pageData?.inputs || {};
  const buttonsData = pageData?.buttons || {};
  const progressData = pageData?.progress || {};
  const errorsData = pageData?.errors || {};
  const infoData = pageData?.info || {};
  const excelData = pageData?.excel || {};
  const analysisData = pageData?.analysis || {};

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [commentCount, setCommentCount] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [dailyRequestCount, setDailyRequestCount] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [includeReplies, setIncludeReplies] = useState(true);
  const [sortBy, setSortBy] = useState<'relevance' | 'time'>('relevance');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    const count = localStorage.getItem('dailyRequestCount');
    const date = localStorage.getItem('requestDate');
    const today = new Date().toDateString();

    if (date !== today) {
      localStorage.setItem('dailyRequestCount', '0');
      localStorage.setItem('requestDate', today);
      setDailyRequestCount(0);
    } else if (count) {
      setDailyRequestCount(parseInt(count));
    }
  }, []);

  const incrementDailyCount = () => {
    const newCount = dailyRequestCount + 1;
    setDailyRequestCount(newCount);
    localStorage.setItem('dailyRequestCount', newCount.toString());
    localStorage.setItem('requestDate', new Date().toDateString());
  };

  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
      return urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
  };

  const fetchComments = async (videoId: string, options: FetchOptions): Promise<Comment[]> => {
    const comments: Comment[] = [];
    let pageToken = '';
    const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

    try {
      const videoResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`
      );
      const videoData = await videoResponse.json();
      const total = parseInt(videoData.items[0].statistics.commentCount);
      setTotalComments(total);

      if (total > COMMENTS_LIMIT) {
        setShowTip(true);
      }

      while (comments.length < COMMENTS_LIMIT) {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=100&order=${options.sortBy}&pageToken=${pageToken}&key=${API_KEY}`
        );

        if (!response.ok) {
          const error = await response.json();
          if (error.error.code === 403 && error.error.message.includes('quotaExceeded')) {
            throw new Error(errorsData.quotaExceeded || 'API 할당량이 초과되었습니다.');
          }
          throw new Error(errorsData.fetchFailed || '댓글 수집에 실패했습니다.');
        }

        const data = await response.json();

        for (const item of data.items) {
          if (comments.length >= COMMENTS_LIMIT) break;

          const comment = item.snippet.topLevelComment.snippet;
          comments.push({
            comment: comment.textDisplay,
            author: comment.authorDisplayName,
            date: formatDate(comment.publishedAt),
            numLikes: comment.likeCount,
            isReply: false,
          });

          if (options.includeReplies && item.snippet.totalReplyCount > 0 && item.replies && comments.length < COMMENTS_LIMIT) {
            for (const reply of item.replies.comments) {
              if (comments.length >= COMMENTS_LIMIT) break;
              comments.push({
                comment: reply.snippet.textDisplay,
                author: reply.snippet.authorDisplayName,
                date: formatDate(reply.snippet.publishedAt),
                numLikes: reply.snippet.likeCount,
                isReply: true,
                parentAuthor: comment.authorDisplayName,
              });
            }
          }
        }

        setCommentCount(comments.length);
        setProgress((comments.length / Math.min(total, COMMENTS_LIMIT)) * 100);

        if (!data.nextPageToken || comments.length >= COMMENTS_LIMIT) break;
        pageToken = data.nextPageToken;
      }

      return comments;
    } catch (error) {
      throw error;
    }
  };

  const exportToExcel = (comments: Comment[]) => {
    const excelRows = comments.map(comment => ({
      [excelData.content || '내용']: comment.comment,
      [excelData.date || '작성일']: comment.date,
      [excelData.likes || '좋아요 수']: comment.numLikes,
      [excelData.author || '작성자']: comment.author,
      [excelData.type || '댓글 유형']: comment.isReply ? (excelData.replyType || '↳ 답글') : (excelData.commentType || '원댓글'),
      ...(comment.isReply && { [excelData.parentAuthor || '원댓글 작성자']: comment.parentAuthor }),
    }));

    const columnOrder = [
      excelData.content || '내용',
      excelData.date || '작성일',
      excelData.likes || '좋아요 수',
      excelData.author || '작성자',
      excelData.type || '댓글 유형',
      excelData.parentAuthor || '원댓글 작성자',
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelRows, {
      header: columnOrder,
    });

    const wscols = [
      { wch: 40 },
      { wch: 20 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
    ];
    worksheet['!cols'] = wscols;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comments');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').substring(0, 14);
    saveAs(data, `youtube_comments_${timestamp}.xlsx`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (dailyRequestCount >= DAILY_LIMIT) {
      setError((errorsData.dailyLimit || '일일 사용 한도({limit}회)를 초과했습니다.').replace('{limit}', DAILY_LIMIT.toString()));
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);
    setCommentCount(0);
    setTotalComments(0);
    setShowTip(false);
    setComments([]);
    setShowAnalysis(false);

    try {
      const videoId = getVideoId(url);
      if (!videoId) {
        throw new Error(errorsData.invalidUrl || '올바른 YouTube URL이 아닙니다');
      }

      const options: FetchOptions = {
        includeReplies,
        sortBy,
      };

      const fetchedComments = await fetchComments(videoId, options);
      setComments(fetchedComments);
      exportToExcel(fetchedComments);
      incrementDailyCount();
      setShowAnalysis(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : (errorsData.unknown || '알 수 없는 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  // 댓글 텍스트 데이터만 추출하여 워드 클라우드에 사용
  const commentsText = useMemo(() => {
    return comments
      .map((item) => he.decode(item.comment).replace(/<[^>]+>/g, ""))
      .join(" ");
  }, [comments]);

  const commentsNoticeText = limitsData.comments
    ? limitsData.comments.replace('{limit}', DAILY_LIMIT.toString()).replace('{used}', dailyRequestCount.toString())
    : `⚡ 1회당 최대 2,000개의 댓글을 수집할 수 있습니다. (일일 사용 한도: ${DAILY_LIMIT}회 중 ${dailyRequestCount}회 사용)`;

  const infoTotalText = infoData.total
    ? infoData.total
        .replace('{count}', totalComments.toLocaleString())
        .replace('{sortType}', sortBy === 'relevance' ? infoData.sortTypes?.relevance || '인기 댓글순' : infoData.sortTypes?.time || '최신순')
        .replace('{repliesNote}', !includeReplies ? infoData.repliesNote || ' (대댓글 제외)' : '')
    : `전체 ${totalComments.toLocaleString()}개의 댓글 중 ${sortBy === 'relevance' ? '인기 댓글순' : '최신순'}으로 상위 2,000개만 수집됩니다.`;

  const progressCollectingText = progressData.collecting
    ? progressData.collecting
        .replace('{current}', commentCount.toLocaleString())
        .replace('{total}', Math.min(totalComments, COMMENTS_LIMIT).toLocaleString())
        .replace('{progress}', progress.toFixed(1))
    : `${commentCount.toLocaleString()}/${Math.min(totalComments, COMMENTS_LIMIT).toLocaleString()} 댓글 수집 중... (${progress.toFixed(1)}%)`;

  return (
    <>
      <Head>
        <title>{headData.title || '유튜브 댓글 추출기 - 무료 엑셀 다운로드 | Marketing Tools'}</title>
        <meta name="description" content={headData.description || '유튜브 영상의 댓글을 최대 2,000개까지 무료로 엑셀 파일로 추출하세요.'} />
        <meta name="keywords" content={headData.keywords || '유튜브 댓글 추출, 유튜브 댓글 다운로드'} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={headData.ogTitle || '유튜브 댓글 추출기'} />
        <meta property="og:description" content={headData.ogDescription || '유튜브 영상 URL만 입력하면 댓글을 엑셀로 자동 추출!'} />
        <meta property="og:url" content="https://mktbox.co.kr/youtube-comments" />
        <meta property="og:image" content={headData.ogImage || 'https://mktbox.co.kr/og-youtube-comments.png'} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="MKT Box" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={headData.ogTitle || '유튜브 댓글 추출기'} />
        <meta name="twitter:description" content={headData.ogDescription || '유튜브 영상 URL만 입력하면 댓글을 엑셀로 자동 추출!'} />
        <meta name="twitter:image" content={headData.ogImage || 'https://mktbox.co.kr/og-youtube-comments.png'} />

        {/* 언어별 Canonical & Alternate */}
        <link rel="canonical" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="ko" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="en" href="https://mktbox.co.kr/en/youtube-comments" />
        <link rel="alternate" hrefLang="x-default" href="https://mktbox.co.kr/youtube-comments" />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
          {/* 히어로 배너 */}
          <div className="mb-8 md:mb-12 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                {pageData?.title || 'YouTube 댓글 추출기'}
              </h1>
              <a href="/youtube-comments/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>{pageData?.guideLink || '댓글 추출 가이드'}</span>
                <span>→</span>
              </a>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">
              {pageData?.description || '유튜브 영상의 댓글을 엑셀 파일로 추출합니다.'}
            </p>
          </div>

          {/* 사용량 안내 */}
          <div className="bg-blue-50/50 backdrop-blur border border-blue-100/80 rounded-2xl px-5 py-4 mb-6 shadow-sm">
            <div className="text-sm font-bold text-blue-900 mb-1">
              {commentsNoticeText}
            </div>
            <div className="text-xs text-blue-700/95 leading-relaxed space-y-1">
              <p>{limitsData.quota || '전체 이용자의 사용량에 따라 수집이 중단될 수 있습니다.'}</p>
              <p>{limitsData.policy || '유튜브 댓글 정책에 따라 일부 댓글이 누락될 수 있습니다.'}</p>
            </div>
          </div>

          {/* How to Use 섹션 */}
          <div className="bg-white/80 backdrop-blur border border-slate-100/60 rounded-3xl mb-6 overflow-hidden shadow-sm">
            <button
              className="flex items-center justify-between w-full p-5 text-left hover:bg-slate-50/60 transition-colors"
              onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
            >
              <span className="font-bold text-slate-800 text-sm md:text-base">
                {howToUseData.title || 'How to Use (이 페이지는 PC에 최적화되었습니다)'}
              </span>
              {isHowToUseOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </button>
            {isHowToUseOpen && (
              <div className="p-5 pt-0 space-y-4 text-xs md:text-sm text-slate-600 border-t border-slate-50">
                <div>
                  <p className="font-bold text-slate-800 mb-1">1. {howToUseData.step1?.title || 'URL 입력 및 설정'}</p>
                  <p className="text-slate-500">{howToUseData.step1?.content || '유튜브 URL을 입력하고 정렬 방식과 답글 포함 여부를 선택하세요.'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">2. {howToUseData.step2?.title || '댓글 추출'}</p>
                  <p className="text-slate-500">{howToUseData.step2?.content || '추출 버튼을 클릭하면 엑셀 파일로 자동 다운로드됩니다.'}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-800 mb-1">💡 {howToUseData.tip?.title || 'Tip'}</p>
                  <p className="text-slate-500">{howToUseData.tip?.content || '주요 키워드를 파악하여 영상 개선 및 분석에 활용해 보세요.'}</p>
                </div>
              </div>
            )}
          </div>

          {/* 입력 폼 (3XL 글라스모피즘 카드) */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300 mb-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2.5">
                  {inputsData.url?.label || 'YouTube URL'}
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={inputsData.url?.placeholder || 'https://www.youtube.com/watch?v=...'}
                  className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-medium text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2.5">
                    {inputsData.sort?.label || '정렬 방식'}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'relevance' | 'time')}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="relevance">{inputsData.sort?.relevance || '인기 댓글순'}</option>
                    <option value="time">{inputsData.sort?.time || '최신순'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2.5">
                    {inputsData.replies?.label || '대댓글 설정'}
                  </label>
                  <select
                    value={includeReplies.toString()}
                    onChange={(e) => setIncludeReplies(e.target.value === 'true')}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50 backdrop-blur font-semibold text-slate-700 cursor-pointer"
                  >
                    <option value="true">{inputsData.replies?.include || '대댓글 포함'}</option>
                    <option value="false">{inputsData.replies?.exclude || '대댓글 제외'}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-700 px-5 py-4 rounded-2xl font-semibold mb-6 shadow-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* 안내 메시지 */}
          {showTip && (
            <div className="bg-amber-50/80 backdrop-blur border border-amber-100 text-amber-900 px-5 py-4 rounded-2xl font-medium mb-6 shadow-sm text-sm leading-relaxed">
              {infoTotalText}
            </div>
          )}

          {/* 진행 상태 및 프로그레스 UI 고급화 */}
          {loading && (
            <div className="bg-white/90 backdrop-blur border border-slate-100 rounded-[32px] p-6 shadow-sm mb-6">
              <div className="space-y-3">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-xs md:text-sm font-bold text-slate-700 text-center">
                  {progressCollectingText}
                </div>
              </div>
            </div>
          )}

          {/* 추출 실행 버튼 (그라데이션 & 섀도우) */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 shadow-sm mb-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-5 rounded-2xl hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] transition-all duration-300 font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {buttonsData.extracting || '댓글 수집 중...'}
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  {buttonsData.extract || '댓글 추출하기'}
                </>
              )}
            </button>
          </div>

          {/* 워드 클라우드 및 분석 결과 (대시보드 리스크화) */}
          {showAnalysis && commentsText && (
            <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-shadow duration-300">
              <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2.5">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                {analysisData.title || '댓글 키워드 분석'}
              </h2>

              <div className="mb-6">
                <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                  {analysisData.description || '다음은 댓글에서 자주 등장하는 키워드를 시각화한 워드 클라우드입니다.'}
                </p>
              </div>

              {/* 워드 클라우드 */}
              <div className="border border-slate-100 p-5 rounded-2xl bg-slate-50/50 backdrop-blur mb-8">
                <WordCloud text={commentsText} />
              </div>

              {/* 통계 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <div className="bg-blue-50/60 backdrop-blur p-5 rounded-2xl border border-blue-100/30">
                  <div className="text-3xl font-black text-blue-700 tracking-tight">
                    {commentCount.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    {analysisData.stats?.total || '수집된 댓글 수'}
                  </div>
                </div>
                <div className="bg-emerald-50/60 backdrop-blur p-5 rounded-2xl border border-emerald-100/30">
                  <div className="text-3xl font-black text-emerald-700 tracking-tight">
                    {comments.filter(c => !c.isReply).length.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    {analysisData.stats?.comments || '댓글 수'}
                  </div>
                </div>
                <div className="bg-violet-50/60 backdrop-blur p-5 rounded-2xl border border-violet-100/30">
                  <div className="text-3xl font-black text-violet-700 tracking-tight">
                    {comments.filter(c => c.isReply).length.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-slate-500 mt-1">
                    {analysisData.stats?.replies || '답글 수'}
                  </div>
                </div>
              </div>

              {/* 분석 인사이트 */}
              <div className="bg-amber-50/60 backdrop-blur border border-amber-100/60 p-5 rounded-2xl">
                <h4 className="font-bold text-slate-900 text-sm md:text-base mb-2">
                  {analysisData.insights?.title || '분석 인사이트'}
                </h4>
                <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">
                  {analysisData.insights?.description || '댓글 속 단어 분석을 바탕으로 시청자 반응을 확인하세요.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`).then(
    (module) => module.default
  );

  return {
    props: {
      pageData: common.tools.youtubeComments,
    },
  };
}

