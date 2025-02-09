// components/WordCloud.js
import React, { useState, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';

export default function WordCloud({ text }) {
  const [wordFrequency, setWordFrequency] = useState({});
  const [newStopWord, setNewStopWord] = useState('');
  const [error, setError] = useState('');

  const [customStopWords, setCustomStopWords] = useState(new Set());

  const addStopWord = (e) => {
    e.preventDefault();
    const trimmedWord = newStopWord.trim();
    if (!trimmedWord) {
      setError('제외할 단어를 입력해주세요.');
      return;
    }
    if (customStopWords.has(trimmedWord)) {
      setError('이미 제외된 단어입니다.');
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

    const words = inputText
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !currentCustomStopWords.has(word));

    const frequency = {};
    words.forEach((word) => {
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
      .slice(0, 100); // 최대 100개 단어

    const maxFreq = Math.max(...words.map(([, freq]) => freq));

    return (
      <div className="p-8 bg-gray-50 rounded-lg min-h-[200px] flex flex-wrap gap-4 justify-center items-center">
        {words.map(([word, freq]) => {
          const fontSize = Math.max(12, Math.floor((freq / maxFreq) * 48));
          const opacity = 0.3 + (freq / maxFreq) * 0.7;

          return (
            <span
              key={word}
              style={{
                fontSize: `${fontSize}px`,
                opacity,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
              }}
              className="inline-block px-2 cursor-pointer hover:scale-110 transition-transform"
              title={`${word}: ${freq}회`}
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

    html2canvas(cloudElement).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'wordcloud.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <>
      <div className="p-8 max-w-4xl mx-auto">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              제외할 단어 (선택 사항)
            </label>

            {/* 기본 불용어 관련 UI 제거 */}

            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={newStopWord}
                onChange={(e) => setNewStopWord(e.target.value)}
                placeholder="제외할 단어를 입력하세요"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={addStopWord}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1"
              >
                추가
              </button>
            </div>

            {customStopWords.size > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.from(customStopWords).map((word) => (
                  <div
                    key={word}
                    className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded"
                  >
                    {word}
                    <button
                      onClick={() => removeStopWord(word)}
                      className="text-red-500 hover:text-red-700"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {Object.keys(wordFrequency).length > 0 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">워드 클라우드</h2>
                <button
                  onClick={saveAsImage}
                  className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  이미지로 저장
                </button>
              </div>

              <div id="word-cloud-container">
                {renderWordCloud()}
              </div>

              <div>
                <h2 className="text-xl font-bold mb-4">상위 단어</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(wordFrequency)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 20)
                    .map(([word, freq]) => (
                      <div
                        key={word}
                        className="flex justify-between p-2 bg-gray-50 rounded"
                      >
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
    </>
  );
}
