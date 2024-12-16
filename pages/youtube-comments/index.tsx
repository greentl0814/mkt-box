// pages/youtube-comments/index.tsx
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

export default function YouTubeComments() {
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
            throw new Error('YouTube API 일일 할당량이 초과되었습니다. 내일 다시 시도해주세요.');
          }
          throw new Error('댓글을 가져오는데 실패했습니다');
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
            isReply: false
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
                parentAuthor: comment.authorDisplayName
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
    // 엑셀용 데이터 포맷 변환
    const excelData = comments.map(comment => ({
      '내용': comment.comment,
      '작성일': comment.date,
      '좋아요 수': comment.numLikes,
      '작성자': comment.author,
      '댓글 유형': comment.isReply ? '↳ 답글' : '원댓글',
      ...(comment.isReply && { '원댓글 작성자': comment.parentAuthor })
    }));

    // 컬럼 순서 지정
    const columnOrder = [
      '내용',
      '작성일',
      '좋아요 수',
      '작성자',
      '댓글 유형',
      '원댓글 작성자'
    ];

    // 워크시트 생성 시 컬럼 순서 적용
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: columnOrder
    });

    // 컬럼별 너비 설정
    const wscols = [
      { wch: 40 },  // 내용
      { wch: 20 },  // 작성일
      { wch: 10 },  // 좋아요 수
      { wch: 15 },  // 작성자
      { wch: 10 },  // 댓글 유형
      { wch: 15 }   // 원댓글 작성자
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
      setError('일일 사용 한도(10회)를 초과했습니다. 내일 다시 시도해주세요.');
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
        throw new Error('올바른 YouTube URL이 아닙니다');
      }

      const options: FetchOptions = {
        includeReplies,
        sortBy
      };

      const comments = await fetchComments(videoId, options);
      exportToExcel(comments);
      incrementDailyCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>YouTube 댓글 추출기 - Marketing Tools</title>
        <meta name="description" content="YouTube 동영상의 댓글을 엑셀 파일로 추출합니다." />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl font-bold mb-6">YouTube 댓글 추출기</h1>

        <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-2 rounded mb-6">
          <div>
            ⚡ 1회당 최대 2,000개의 댓글을 수집할 수 있습니다. (일일 사용 한도: {DAILY_LIMIT}회 중 {dailyRequestCount}회 사용)
          </div>
          <div className="mt-2">
            전체 이용자의 사용량에 따라 나의 한도와 상관없이 수집이 중단될 수 있습니다. 다음날 이용해 주세요
          </div>
          <div className="mt-2">
            2,000개가 넘는 댓글이 있더라도 유튜브의 댓글 정책에 따라 전체 댓글이 수집되지 않을수 있습니다.
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">YouTube URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium">정렬 방식</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'relevance' | 'time')}
                className="w-full p-2 border rounded"
              >
                <option value="relevance">인기 댓글순</option>
                <option value="time">최신순</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2 font-medium">대댓글 설정</label>
              <select
                value={includeReplies.toString()}
                onChange={(e) => setIncludeReplies(e.target.value === 'true')}
                className="w-full p-2 border rounded"
              >
                <option value="true">대댓글 포함</option>
                <option value="false">대댓글 제외</option>
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
              💡 전체 {totalComments.toLocaleString()}개의 댓글 중 {sortBy === 'relevance' ? '인기 댓글순' : '최신순'}으로 상위 2,000개만 수집됩니다.
              {!includeReplies && ' (대댓글 제외)'}
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
                {commentCount}/{Math.min(totalComments, COMMENTS_LIMIT)} 댓글 수집 중... ({progress.toFixed(1)}%)
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? '댓글 수집 중...' : '댓글 추출하기'}
          </button>
        </div>
      </div>
    </>
  );
}
