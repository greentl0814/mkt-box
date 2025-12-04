import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';

import { Download, Plus, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function WordCloudGenerator({ pageData }) {
  const { t, locale } = useTranslation();
  const [text, setText] = useState('');
  const [wordFrequency, setWordFrequency] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const [error, setError] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const defaultStopWords = useMemo(() => {
    const englishStopWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with'];
    const koreanStopWords = ['이', '그', '저', '이것', '저것', '그것', '을', '를', '이다', '있다', '하다', '및', '또는'];

    if (locale === 'ko') {
      return new Set([...englishStopWords, ...koreanStopWords]);
    } else {
      return new Set(englishStopWords);
    }
  }, [locale]);

  const [customStopWords, setCustomStopWords] = useState(new Set());

  const addStopWord = (e) => {
    e.preventDefault();
    const trimmedWord = newStopWord.trim();
    if (!trimmedWord) {
      setError(pageData.errors.emptyStopWord);
      return;
    }
    if (defaultStopWords.has(trimmedWord) || customStopWords.has(trimmedWord)) {
      setError(pageData.errors.duplicateStopWord);
      return;
    }

    const updatedStopWords = new Set(customStopWords);
    updatedStopWords.add(trimmedWord.toLowerCase());
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
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
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
  }, [text, customStopWords]);

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
              title={`${word}: ${freq}${pageData.frequency}`}
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
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
        <meta name="keywords" content={pageData.head.keywords} />
        <meta property="og:title" content={pageData.head.ogTitle} />
        <meta property="og:description" content={pageData.head.ogDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mktbox.co.kr/word-cloud" />
      </Head>

      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-3">
            <h1 className="text-3xl font-bold">{pageData.title}</h1>
            <a href="/word-cloud/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{pageData.guideLink}</span>
              <span>→</span>
            </a>
          </div>
          <p className="text-gray-600">
            텍스트에서 자주 등장하는 단어를 시각화하세요.
          </p>
        </div>

        {/* 제외 단어 설정 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {pageData.stopword.label}
              <span className="text-sm text-gray-500 ml-2">{pageData.stopword.subLabel}</span>
            </label>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">{pageData.stopword.defaultTitle}</p>
              <div className="flex flex-wrap gap-2">
                {Array.from(defaultStopWords).map(word => (
                  <span key={word} className="bg-gray-200 px-2 py-1 rounded text-xs">
                    {word}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newStopWord}
                onChange={(e) => setNewStopWord(e.target.value)}
                placeholder={pageData.stopword.placeholder}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={addStopWord}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                {pageData.buttons.add}
              </button>
            </div>

            {customStopWords.size > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.from(customStopWords).map(word => (
                  <div
                    key={word}
                    className="flex items-center gap-1 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg"
                  >
                    <span className="text-sm">{word}</span>
                    <button
                      onClick={() => removeStopWord(word)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 텍스트 입력 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="text-red-500">*</span> {pageData.inputs.text.label}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={pageData.inputs.text.placeholder}
              className="w-full p-4 border border-gray-300 rounded-lg min-h-[200px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 워드 클라우드 결과 */}
        {Object.keys(wordFrequency).length > 0 && (
          <div className="space-y-6">
            {/* 워드 클라우드 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">{pageData.result.title}</h3>
                <button
                  onClick={saveAsImage}
                  className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                >
                  <Download className="w-4 h-4" />
                  {pageData.buttons.saveImage}
                </button>
              </div>

              <div id="word-cloud-container" className="p-6">
                {renderWordCloud()}
              </div>
            </div>

            {/* 빈도수 목록 */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">{pageData.result.subTitle}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(wordFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(([word, freq]) => (
                      <div key={word} className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <span className="font-medium text-gray-900">{word}</span>
                        <span className="text-gray-600">{freq}{pageData.result.frequency}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {copyMessage && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {copyMessage}
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default);

  return {
    props: {
      pageData: common.tools.wordCloud,
    },
  };
}
