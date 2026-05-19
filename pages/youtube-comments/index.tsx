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

export default function YouTubeComments({ pageData }) {
  const { t } = useTranslation();
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
            throw new Error(pageData.errors.quotaExceeded);
          }
          throw new Error(pageData.errors.fetchFailed);
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
    const excelData = comments.map(comment => ({
      [pageData.excel.content]: comment.comment,
      [pageData.excel.date]: comment.date,
      [pageData.excel.likes]: comment.numLikes,
      [pageData.excel.author]: comment.author,
      [pageData.excel.type]: comment.isReply ? pageData.excel.replyType : pageData.excel.commentType,
      ...(comment.isReply && { [pageData.excel.parentAuthor]: comment.parentAuthor }),
    }));

    const columnOrder = [
      pageData.excel.content,
      pageData.excel.date,
      pageData.excel.likes,
      pageData.excel.author,
      pageData.excel.type,
      pageData.excel.parentAuthor,
    ];

    const worksheet = XLSX.utils.json_to_sheet(excelData, {
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
      setError(pageData.errors.dailyLimit.replace('{limit}', DAILY_LIMIT));
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
        throw new Error(pageData.errors.invalidUrl);
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
      setError(err instanceof Error ? err.message : pageData.errors.unknown);
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

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content={pageData.head.keywords} />
        <meta name="robots" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageData.head.ogTitle} />
        <meta property="og:description" content={pageData.head.ogDescription} />
        <meta property="og:url" content="https://mktbox.co.kr/youtube-comments" />
        <meta property="og:image" content={pageData.head.ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="MKT Box" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageData.head.ogTitle} />
        <meta name="twitter:description" content={pageData.head.ogDescription} />
        <meta name="twitter:image" content={pageData.head.ogImage} />

        {/* 언어별 Canonical & Alternate */}
        <link rel="canonical" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="ko" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="en" href="https://mktbox.co.kr/en/youtube-comments" />
        <link rel="alternate" hrefLang="x-default" href="https://mktbox.co.kr/youtube-comments" />

        {/* JSON-LD: WebApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": pageData.head.ogTitle,
              "description": pageData.head.description,
              "url": "https://mktbox.co.kr/youtube-comments",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "KRW"
              },
              "featureList": [
                "YouTube 댓글 최대 2,000개 추출",
                "엑셀(XLSX) 파일 다운로드",
                "인기순 / 최신순 정렬",
                "대댓글 포함 추출",
                "워드 클라우드 키워드 분석"
              ],
              "inLanguage": ["ko", "en"]
            })
          }}
        />

        {/* JSON-LD: HowTo */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HowTo",
              "name": "YouTube 댓글 추출하는 방법",
              "description": "유튜브 영상 URL을 입력해 댓글을 엑셀로 추출하는 3단계 방법",
              "totalTime": "PT1M",
              "step": [
                {
                  "@type": "HowToStep",
                  "position": 1,
                  "name": "URL 입력",
                  "text": "댓글을 추출할 유튜브 영상의 URL을 입력창에 붙여넣습니다."
                },
                {
                  "@type": "HowToStep",
                  "position": 2,
                  "name": "옵션 설정",
                  "text": "정렬 방식(인기순/최신순)과 대댓글 포함 여부를 선택합니다."
                },
                {
                  "@type": "HowToStep",
                  "position": 3,
                  "name": "추출 및 다운로드",
                  "text": "'댓글 추출하기' 버튼을 클릭하면 자동으로 엑셀 파일이 다운로드됩니다."
                }
              ]
            })
          }}
        />
      </Head>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">{pageData.title}</h1>
            <a href="/youtube-comments/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink || '댓글 추출 가이드'}</span>
              <span>→</span>
            </a>
          </div>
          <p className="text-gray-600">
            {pageData.description}
          </p>
        </div>

        {/* 사용량 안내 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
          <div className="text-sm text-blue-900">
            {pageData.notice.limits.comments.replace('{limit}', DAILY_LIMIT).replace('{used}', dailyRequestCount)}
          </div>
          <div className="mt-2 text-sm text-blue-800">
            {pageData.notice.limits.quota}
          </div>
          <div className="mt-2 text-sm text-blue-800">
            {pageData.notice.limits.policy}
          </div>
        </div>

        {/* How to Use 섹션 */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg mb-6 overflow-hidden">
          <button
            className="flex items-center justify-between w-full p-4 text-left hover:bg-blue-100 transition-colors"
            onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
          >
            <span className="font-semibold text-blue-900">{pageData.howToUse?.title || 'How to Use (이 페이지는 pc에 최적화 되었습니다)'}</span>
            {isHowToUseOpen ? (
              <ChevronUp className="w-5 h-5 text-blue-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-blue-600" />
            )}
          </button>
          {isHowToUseOpen && (
            <div className="p-4 pt-0 space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-1">1. {pageData.howToUse?.step1?.title || 'URL 입력 및 설정'}</p>
                <p className="text-gray-600">{pageData.howToUse?.step1?.content || '유튜브 URL을 입력하고 정렬 방식(관련도/최신순)과 답글 포함 여부를 선택하세요.'}</p>
              </div>
              <div>
                <p className="font-medium mb-1">2. {pageData.howToUse?.step2?.title || '댓글 추출'}</p>
                <p className="text-gray-600">{pageData.howToUse?.step2?.content || '추출 버튼을 클릭하면 엑셀 파일로 자동 다운로드되며, 워드 클라우드 분석이 표시됩니다.'}</p>
              </div>
              <div>
                <p className="font-medium mb-1">💡 {pageData.howToUse?.tip?.title || 'Tip'}</p>
                <p className="text-gray-600">{pageData.howToUse?.tip?.content || '워드 클라우드를 통해 댓글에서 자주 언급되는 키워드를 파악하여 콘텐츠 개선에 활용하세요.'}</p>
              </div>
            </div>
          )}
        </div>

        {/* 입력 폼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{pageData.inputs.url.label}</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={pageData.inputs.url.placeholder}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{pageData.inputs.sort.label}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'relevance' | 'time')}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">{pageData.inputs.sort.relevance}</option>
                  <option value="time">{pageData.inputs.sort.time}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{pageData.inputs.replies.label}</label>
                <select
                  value={includeReplies.toString()}
                  onChange={(e) => setIncludeReplies(e.target.value === 'true')}
                  className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="true">{pageData.inputs.replies.include}</option>
                  <option value="false">{pageData.inputs.replies.exclude}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 안내 메시지 */}
        {showTip && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            {pageData.info.total
              .replace('{count}', totalComments.toLocaleString())
              .replace('{sortType}', sortBy === 'relevance' ? pageData.info.sortTypes.relevance : pageData.info.sortTypes.time)
              .replace('{repliesNote}', !includeReplies ? pageData.info.repliesNote : '')}
          </div>
        )}

        {/* 진행 상태 */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-lg h-2">
                <div
                  className="bg-blue-600 h-2 rounded-lg transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600 text-center">
                {pageData.progress.collecting
                  .replace('{current}', commentCount.toLocaleString())
                  .replace('{total}', Math.min(totalComments, COMMENTS_LIMIT).toLocaleString())
                  .replace('{progress}', progress.toFixed(1))}
              </div>
            </div>
          </div>
        )}

        {/* 추출 버튼 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {pageData.buttons.extracting}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {pageData.buttons.extract}
              </>
            )}
          </button>
        </div>

        {/* 워드 클라우드 및 분석 결과 */}
        {showAnalysis && commentsText && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-600 rounded"></span>
              {pageData.analysis?.title || '댓글 키워드 분석'}
            </h2>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {pageData.analysis?.description || '다음은 댓글에서 자주 등장하는 키워드를 시각화한 워드 클라우드입니다. 단어의 크기는 등장 빈도에 비례합니다.'}
              </p>
            </div>

            {/* 워드 클라우드 */}
            <div className="border border-gray-200 p-4 rounded-lg bg-white mb-6">
              <WordCloud text={commentsText} />
            </div>

            {/* 통계 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-blue-700">
                  {commentCount.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {pageData.analysis?.stats?.total || '수집된 댓글 수'}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-green-700">
                  {comments.filter(c => !c.isReply).length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {pageData.analysis?.stats?.comments || '댓글 수'}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-semibold text-purple-700">
                  {comments.filter(c => c.isReply).length.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  {pageData.analysis?.stats?.replies || '답글 수'}
                </div>
              </div>
            </div>

            {/* 분석 인사이트 */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">
                {pageData.analysis?.insights?.title || '분석 인사이트'}
              </h4>
              <p className="text-sm text-gray-700">
                {pageData.analysis?.insights?.description || '워드 클라우드에 나타난 주요 키워드를 통해 시청자들의 관심사와 의견을 파악할 수 있습니다. 이를 바탕으로 다음 콘텐츠를 계획하거나 기존 영상에 대한 개선점을 찾아볼 수 있습니다.'}
              </p>
            </div>
          </div>
        )}
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
