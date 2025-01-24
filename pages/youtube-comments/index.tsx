import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';

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

    try {
      const videoId = getVideoId(url);
      if (!videoId) {
        throw new Error(pageData.errors.invalidUrl);
      }

      const options: FetchOptions = {
        includeReplies,
        sortBy,
      };

      const comments = await fetchComments(videoId, options);
      exportToExcel(comments);
      incrementDailyCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : pageData.errors.unknown);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />

        <meta name="keywords" content="유튜브 마케팅, 유튜브 마케팅 툴, 유튜브 댓글, 유튜브 댓글 다운, download youtube comments, youtube comment extractor"/>
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mktbox.co.kr/youtube-comments" />
        <meta property="og:title" content="유튜브 댓글 추출 전문 툴 | YouTube Comment Extractor" />
        <meta property="og:description" content="유튜브 마케팅 분석을 위한 댓글 데이터 추출 도구, YouTube 댓글 CSV/XLSX 다운로드 지원" />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:locale:alternate" content="en_US" />




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
