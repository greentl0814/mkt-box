import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import WordCloud from '@/components/WordCloud';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

        {/* 언어별 Canonical & Alternate */}
        <link rel="canonical" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="ko" href="https://mktbox.co.kr/youtube-comments" />
        <link rel="alternate" hrefLang="en" href="https://mktbox.co.kr/en/youtube-comments" />
        <link rel="alternate" hrefLang="x-default" href="https://mktbox.co.kr/youtube-comments" />
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
            href="/youtube-comments/guide"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <span>{pageData.guideLink || '댓글 추출 가이드'}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded mb-6">
          <div>
            {pageData.notice.limits.comments.replace('{limit}', DAILY_LIMIT).replace('{used}', dailyRequestCount)}
          </div>
          <div className="mt-2">
            {pageData.notice.limits.quota}
          </div>
          <div className="mt-2">
            {pageData.notice.limits.policy}
          </div>
        </div>

        {/* How to Use 섹션 (두번째 코드 참고) */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <button
            className="flex items-center justify-between w-full font-bold text-lg"
            onClick={() => setIsHowToUseOpen(!isHowToUseOpen)}
          >
            <span>{pageData.howToUse?.title || 'How to Use (이 페이지는 pc에 최적화 되었습니다)'}</span>
            {isHowToUseOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          {isHowToUseOpen && (
            <div className="mt-4 space-y-6">
              {/* 기본 사용법 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{pageData.howToUse?.basicUsage?.title || '기본 사용법'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="font-medium text-gray-800 mb-2">{pageData.howToUse?.basicUsage?.step1?.title || '1. 검색 설정'}</div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• {pageData.howToUse?.basicUsage?.step1?.items?.[0] || '유튜브 URL을 입력하세요'}</li>
                      <li>• {pageData.howToUse?.basicUsage?.step1?.items?.[1] || '정렬 방식을 선택하세요'}</li>
                      <li>• {pageData.howToUse?.basicUsage?.step1?.items?.[2] || '댓글/답글 설정을 선택하세요'}</li>
                      <li>• {pageData.howToUse?.basicUsage?.step1?.items?.[3] || '추출 버튼을 클릭하세요'}</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="font-medium text-gray-800 mb-2">{pageData.howToUse?.basicUsage?.step2?.title || '2. 결과 확인'}</div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• {pageData.howToUse?.basicUsage?.step2?.items?.[0] || '엑셀 파일로 자동 다운로드'}</li>
                      <li>• {pageData.howToUse?.basicUsage?.step2?.items?.[1] || '워드 클라우드로 주요 키워드 파악'}</li>
                      <li>• {pageData.howToUse?.basicUsage?.step2?.items?.[2] || '댓글 분석 인사이트'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 고급 기능 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{pageData.howToUse?.advancedFeatures?.title || '고급 기능'}</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-2">{pageData.howToUse?.advancedFeatures?.wordcloud?.title || '워드 클라우드 분석'}</h4>
                  <p className="text-gray-600 mb-2">{pageData.howToUse?.advancedFeatures?.wordcloud?.description || '댓글에서 자주 언급되는 키워드를 시각적으로 확인하여 주요 이슈나 관심사를 파악할 수 있습니다:'}</p>
                  <ul className="space-y-2 text-gray-600">
                    <li>• {pageData.howToUse?.advancedFeatures?.wordcloud?.items?.[0] || '댓글에서 자주 등장하는 단어를 시각화'}</li>
                    <li>• {pageData.howToUse?.advancedFeatures?.wordcloud?.items?.[1] || '단어의 크기는 언급 빈도에 비례'}</li>
                    <li>• {pageData.howToUse?.advancedFeatures?.wordcloud?.items?.[2] || '제외할 단어를 설정하여 더 의미 있는 분석 가능'}</li>
                  </ul>
                </div>
              </div>

              {/* 분석 팁 섹션 */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">{pageData.howToUse?.analysisTips?.title || '분석 팁'}</h3>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <ul className="space-y-2 text-gray-600">
                    <li>• {pageData.howToUse?.analysisTips?.items?.[0] || '댓글의 키워드로 시청자의 관심사를 파악하세요'}</li>
                    <li>• {pageData.howToUse?.analysisTips?.items?.[1] || '자주 언급되는 키워드로 콘텐츠 개선 아이디어를 얻으세요'}</li>
                    <li>• {pageData.howToUse?.analysisTips?.items?.[2] || '시청자 피드백을 바탕으로 다음 콘텐츠를 기획해보세요'}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">{pageData.inputs.url.label}</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={pageData.inputs.url.placeholder}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">{pageData.inputs.sort.label}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'time')}
                className="w-full p-2 border rounded"
              >
                <option value="relevance">{pageData.inputs.sort.relevance}</option>
                <option value="time">{pageData.inputs.sort.time}</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 font-medium">{pageData.inputs.replies.label}</label>
              <select
                value={includeReplies.toString()}
                onChange={(e) => setIncludeReplies(e.target.value === 'true')}
                className="w-full p-2 border rounded"
              >
                <option value="true">{pageData.inputs.replies.include}</option>
                <option value="false">{pageData.inputs.replies.exclude}</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {showTip && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded">
              {pageData.info.total
                .replace('{count}', totalComments.toLocaleString())
                .replace('{sortType}', sortBy === 'relevance' ? pageData.info.sortTypes.relevance : pageData.info.sortTypes.time)
                .replace('{repliesNote}', !includeReplies ? pageData.info.repliesNote : '')}
            </div>
          )}

          {loading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded h-2">
                <div
                  className="bg-blue-500 h-2 rounded transition-all duration-300"
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
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? pageData.buttons.extracting : pageData.buttons.extract}
          </button>
        </div>

        {/* 워드 클라우드 및 분석 결과 섹션 */}
        {showAnalysis && commentsText && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">
              {pageData.analysis?.title || '댓글 키워드 분석'}
            </h3>
            <div className="bg-gray-50 p-4 rounded">
              <div className="mb-4">
                <p className="text-gray-700">
                  {pageData.analysis?.description || '다음은 댓글에서 자주 등장하는 키워드를 시각화한 워드 클라우드입니다. 단어의 크기는 등장 빈도에 비례합니다.'}
                </p>
              </div>

              {/* 워드 클라우드 컴포넌트 */}
              <div className="border p-4 rounded bg-white mb-4">
                <WordCloud text={commentsText} />
              </div>

              {/* 간단한 통계 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-blue-50 p-4 rounded">
                  <div className="text-lg font-semibold text-blue-700">
                    {commentCount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pageData.analysis?.stats?.total || '수집된 댓글 수'}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded">
                  <div className="text-lg font-semibold text-green-700">
                    {comments.filter(c => !c.isReply).length.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pageData.analysis?.stats?.comments || '댓글 수'}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded">
                  <div className="text-lg font-semibold text-purple-700">
                    {comments.filter(c => c.isReply).length.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {pageData.analysis?.stats?.replies || '답글 수'}
                  </div>
                </div>
              </div>

              {/* 분석 인사이트 */}
              <div className="bg-yellow-50 p-4 rounded">
                <h4 className="font-medium text-gray-800 mb-2">
                  {pageData.analysis?.insights?.title || '분석 인사이트'}
                </h4>
                <p className="text-gray-700">
                  {pageData.analysis?.insights?.description || '워드 클라우드에 나타난 주요 키워드를 통해 시청자들의 관심사와 의견을 파악할 수 있습니다. 이를 바탕으로 다음 콘텐츠를 계획하거나 기존 영상에 대한 개선점을 찾아볼 수 있습니다.'}
                </p>
              </div>
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
