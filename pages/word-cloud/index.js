import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Download, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function WordCloudGenerator() {
  const [text, setText] = useState('');
  const [wordFrequency, setWordFrequency] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const [defaultStopWords] = useState(new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    '이', '그', '저', '이것', '저것', '그것', '을', '를', '이다', '있다', '하다', '및', '또는'
  ]));
  const [customStopWords, setCustomStopWords] = useState(new Set());
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const addStopWord = (e) => {
    e.preventDefault();
    if (!newStopWord.trim()) {
      setError('제외할 단어를 입력해주세요');
      return;
    }
    if (defaultStopWords.has(newStopWord.trim()) || customStopWords.has(newStopWord.trim())) {
      setError('이미 존재하는 불용어입니다');
      return;
    }

    const updatedStopWords = new Set(customStopWords);
    updatedStopWords.add(newStopWord.trim().toLowerCase());
    setCustomStopWords(updatedStopWords);
    setNewStopWord('');
    setError('');

    if (text) {
      analyzeText(text, updatedStopWords);
    }
  };

  const removeStopWord = (word) => {
    const updatedStopWords = new Set(customStopWords);
    updatedStopWords.delete(word);
    setCustomStopWords(updatedStopWords);
    if (text) {
      analyzeText(text, updatedStopWords);
    }
  };

  const analyzeText = (inputText, currentCustomStopWords = customStopWords) => {
    if (!inputText.trim()) {
      setWordFrequency({});
      return;
    }

    const words = inputText.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 1 &&
        !defaultStopWords.has(word) &&
        !currentCustomStopWords.has(word));

    const frequency = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });

    setWordFrequency(frequency);
  };

  useEffect(() => {
    if (text) {
      analyzeText(text);
    }
  }, [text]);

  const renderWordCloud = () => {
    const words = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 100);

    const maxFreq = Math.max(...words.map(([_, freq]) => freq));

    return (
      <div className="p-8 bg-gray-50 rounded-lg min-h-[400px] flex flex-wrap gap-4 justify-center items-center">
        {words.map(([word, freq]) => {
          const fontSize = Math.max(12, Math.floor((freq / maxFreq) * 48));
          const opacity = 0.3 + (freq / maxFreq) * 0.7;

          return (
            <span
              key={word}
              style={{
                fontSize: `${fontSize}px`,
                opacity,
                transform: `rotate(${Math.random() * 30 - 15}deg)`,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
              }}
              className="inline-block px-2 cursor-pointer hover:scale-110 transition-transform"
              title={`${word}: ${freq}회 등장`}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  const saveAsImage = () => {
    const cloudElement = document.getElementById('word-cloud-container');
    if (!cloudElement) return;

    html2canvas(cloudElement).then(canvas => {
      const link = document.createElement('a');
      link.download = 'wordcloud.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <>
      <Head>
        <title>워드클라우드 생성기 - Marketing Tools</title>
        <meta name="description" content="텍스트를 분석하여 단어 빈도수를 시각화하는 워드클라우드를 생성합니다." />
        <meta name="keywords" content="워드클라우드, 텍스트 분석, 단어 빈도, 시각화, 마케팅 도구" />
        <meta property="og:title" content="워드클라우드 생성기 - Marketing Tools" />
        <meta property="og:description" content="텍스트를 분석하여 단어 빈도수를 시각화하는 워드클라우드를 생성합니다." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mkt-box.vercel.app/word-cloud" />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/" className="text-blue-500 hover:text-blue-700 mb-6 inline-block">
          ← 메인으로 돌아가기
        </Link>

        <h1 className="text-2xl font-bold mb-6">워드클라우드 생성기</h1>

        <div className="space-y-6">
          {/* 불용어 관리 */}
          <div>
            <label className="block mb-2 font-medium">
              제외할 단어 설정
              <span className="text-sm text-gray-500 ml-2">(분석에서 제외할 단어를 추가해주세요)</span>
            </label>

            {/* 기본 불용어 표시 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">기본 불용어 목록:</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(defaultStopWords).map(word => (
                  <span key={word} className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newStopWord}
                onChange={(e) => setNewStopWord(e.target.value)}
                placeholder="제외할 단어 입력"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addStopWord}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                추가
              </button>
            </div>

            {customStopWords.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(customStopWords).map(word => (
                  <div
                    key={word}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                  >
                    {word}
                    <button
                      onClick={() => removeStopWord(word)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 텍스트 입력 */}
          <div>
            <label className="block mb-2 font-medium">
              <span className="text-red-500">*</span> 분석할 텍스트
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="분석할 텍스트를 입력하세요..."
              className="w-full p-2 border rounded min-h-[200px]"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* 워드클라우드 결과 */}
          {Object.keys(wordFrequency).length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">워드클라우드</h2>
                <button
                  onClick={saveAsImage}
                  className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  <Download className="w-4 h-4" />
                  이미지로 저장
                </button>
              </div>

              <div id="word-cloud-container">
                {renderWordCloud()}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">자주 등장하는 단어</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(wordFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(([word, freq]) => (
                      <div key={word} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>{word}</span>
                        <span className="text-gray-600">{freq}회</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {copyMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
          {copyMessage}
        </div>
      )}
    </>
  );
}
