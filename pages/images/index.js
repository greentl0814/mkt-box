import React, { useState, useCallback, useRef } from 'react';
import Head from 'next/head';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Upload,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Trash2,
  HelpCircle,
} from 'lucide-react';

// 최대 너비 입력값 유효성 검사 및 숫자 변환
const parseMaxWidth = (value, originalWidth) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 100
    ? 100
    : parsed > originalWidth
    ? originalWidth
    : parsed;
};

const ImageConverter = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 변환 옵션 상태
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState('1920');
  const [format, setFormat] = useState('jpeg');

  // 파일 정보
  const [imageInfo, setImageInfo] = useState(null);

  const fileInputRef = useRef(null);

  // 파일 선택 또는 드롭 처리
  const handleFileDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0] || e.target?.files[0];

      if (file && file.type.startsWith('image/')) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
          setConvertedImage(null);
          setError('');

          // 이미지 정보 수집
          const img = new Image();
          img.onload = () => {
            const initialMaxWidth = parseMaxWidth(maxWidth, img.width);
            const aspectRatio = img.width / img.height;
            const newWidth = Math.min(img.width, initialMaxWidth);
            const newHeight = Math.round(newWidth / aspectRatio);

            setImageInfo({
              name: file.name,
              size: file.size,
              type: file.type,
              width: img.width,
              height: img.height,
              originalWidth: img.width,
              originalHeight: img.height,
              newWidth,
              newHeight,
            });
            setMaxWidth(newWidth.toString());
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      } else {
        setError(t('tools.imageConverter.errors.fileType'));
      }
    },
    [maxWidth, t]
  );

  // 최대 너비 변경 처리
  const handleMaxWidthChange = useCallback(
    (e) => {
      const newMaxWidth = e.target.value;
      setMaxWidth(newMaxWidth);

      if (imageInfo) {
        const parsedMaxWidth = parseMaxWidth(
          newMaxWidth,
          imageInfo.originalWidth
        );
        const aspectRatio = imageInfo.width / imageInfo.height;
        const newWidth = Math.min(imageInfo.width, parsedMaxWidth);
        const newHeight = Math.round(newWidth / aspectRatio);

        setImageInfo((prev) => ({
          ...prev,
          newWidth,
          newHeight,
        }));
      }
    },
    [imageInfo]
  );

  // 이미지 변환 처리
  const convertImage = useCallback(
    async () => {
      if (!selectedFile) return;

      setLoading(true);
      try {
        const img = new Image();
        img.src = preview;
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        const parsedMaxWidth = parseMaxWidth(
          maxWidth,
          imageInfo.originalWidth
        );
        let newWidth = Math.min(img.width, parsedMaxWidth);
        let newHeight = Math.round((newWidth / img.width) * img.height);

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const blob = await new Promise((resolve) => {
          canvas.toBlob(resolve, `image/${format}`, quality / 100);
        });

        setConvertedImage({
          url: URL.createObjectURL(blob),
          size: blob.size,
          type: blob.type,
          width: newWidth,
          height: newHeight,
        });
      } catch (err) {
        setError(t('tools.imageConverter.errors.conversion'));
        console.error(err);
      }
      setLoading(false);
    },
    [selectedFile, preview, format, quality, maxWidth, imageInfo, t]
  );

  // 이미지 다운로드 처리
  const downloadImage = useCallback(
    () => {
      if (!convertedImage) return;

      const link = document.createElement('a');
      link.href = convertedImage.url;
      const extension = convertedImage.type.split('/')[1];
      const originalName = selectedFile.name.split('.')[0];
      link.download = `${originalName}_converted.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [convertedImage, selectedFile]
  );

  // 초기화 처리
  const resetAll = useCallback(() => {
    setSelectedFile(null);
    setPreview('');
    setConvertedImage(null);
    setError('');
    setImageInfo(null);
    setMaxWidth('1920');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t('tools.imageConverter.title')}</title>
        <meta
          name="description"
          content={t('tools.imageConverter.description')}
        />
        <meta name="keywords" content="이미지 변환, JPG를 WebP로, PNG 변환, 이미지 압축, 용량 줄이기, 이미지 화질 조절, 이미지 리사이즈, image converter, WebP converter" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/images" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/images" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/images" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/images" />
        <meta property="og:title" content={t('tools.imageConverter.title')} />
        <meta property="og:description" content={t('tools.imageConverter.description')} />
        <meta property="og:site_name" content="MKT Box" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={t('tools.imageConverter.title')} />
        <meta name="twitter:description" content={t('tools.imageConverter.description')} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "이미지 변환기",
            "url": "https://www.mktbox.co.kr/images",
            "description": "이미지를 JPEG, PNG, WebP 형식으로 변환하고 용량을 줄이세요. 리사이즈 기능 지원.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["JPEG/PNG/WebP 변환", "화질 조절", "최대 너비 설정", "이미지 정보 확인"],
            "inLanguage": ["ko", "en"]
          })}}
        />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8 pt-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
                  {t('tools.imageConverter.title')}
                </h1>
                <p className="text-slate-500 font-medium text-sm">
                  {t('tools.imageConverter.description')}
                </p>
              </div>
              <a
                href="/images/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100/50 transition-all duration-300 self-start md:self-auto shadow-sm"
              >
                <span>{t('tools.imageConverter.guideLink')}</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="w-full bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm">
            {/* 파일 업로드 영역 */}
            <div
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              className="group relative border-2 border-dashed border-slate-200 hover:border-blue-500/60 rounded-[32px] p-8 md:p-12 text-center cursor-pointer transition-all duration-500 bg-slate-50/40 hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-indigo-500/5 mb-6 overflow-hidden"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileDrop}
                className="hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="cursor-pointer block">
                <div className="mx-auto h-16 w-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:scale-110 shadow-sm transition-all duration-300">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="mt-4 text-base font-bold text-slate-800">
                  {t('tools.imageConverter.uploadText')}
                </p>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  {t('tools.imageConverter.supportedFormats')}
                </p>
              </label>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50/80 backdrop-blur border border-red-100 text-red-600 px-5 py-4 rounded-[20px] mb-6 text-sm font-semibold flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            {/* 이미지 미리보기 및 변환 옵션 */}
            {preview && (
              <div className="space-y-8 animate-fadeIn">
                {/* 변환 옵션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* 출력 형식 선택 */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800">
                        {t('tools.imageConverter.outputFormat')}
                      </label>
                      <div className="relative">
                        <select
                          value={format}
                          onChange={(e) => setFormat(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        >
                          <option value="jpeg">JPEG</option>
                          <option value="png">PNG</option>
                          <option value="webp">WebP</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">▼</div>
                      </div>
                    </div>

                    {/* 품질 설정 - JPEG, WebP일 때만 표시 */}
                    {(format === 'jpeg' || format === 'webp') && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-slate-800">
                            {t('tools.imageConverter.quality')}
                          </label>
                          <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                            {quality}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
                        />
                        <div className="flex items-start gap-1.5 bg-slate-50 border border-slate-100/50 rounded-2xl p-4 mt-2">
                          <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-500 leading-normal font-medium">
                            {t('qualityExplanation.description')}
                            <a
                              href="/images/quality-explanation"
                              className="text-blue-600 hover:text-blue-700 font-bold ml-1 inline-flex items-center"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('qualityExplanation.link')}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 최대 너비 설정 */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-800">
                        {t('tools.imageConverter.maxWidth')}
                      </label>
                      <input
                        type="number"
                        min="100"
                        max={imageInfo?.originalWidth || 3840}
                        value={maxWidth}
                        onChange={handleMaxWidthChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                      />
                      <p className="text-xs text-slate-400 font-medium leading-normal">
                        {t('tools.imageConverter.maxWidthNote1')}{' '}
                        {t('tools.imageConverter.maxWidthNote2')}{' '}
                        <span className="font-semibold text-slate-600">{imageInfo ? imageInfo.originalWidth : '0'}</span>
                        {t('tools.imageConverter.maxWidthNote3')}{' '}
                        <span className="font-semibold text-slate-600">{imageInfo ? imageInfo.originalHeight : '0'}</span>
                        {t('tools.imageConverter.maxWidthNote4')}
                      </p>
                    </div>
                  </div>

                  {/* 이미지 정보, 변환 후 이미지 정보 */}
                  <div className="space-y-6">
                    {/* 이미지 정보 */}
                    {imageInfo && (
                      <div className="bg-slate-50/70 border border-slate-100/50 rounded-3xl p-5 space-y-3">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          {t('tools.imageConverter.originalImageInfo')}
                        </h4>
                        <div className="space-y-2 text-xs font-semibold text-slate-500">
                          <p className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span>{t('tools.imageConverter.fileName')}</span>
                            <span className="text-slate-700 truncate max-w-[200px]">{imageInfo.name}</span>
                          </p>
                          <p className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span>{t('tools.imageConverter.fileSize')}</span>
                            <span className="text-slate-700">{(imageInfo.size / 1024).toFixed(2)} KB</span>
                          </p>
                          <p className="flex justify-between border-b border-slate-100 pb-1.5">
                            <span>{t('tools.imageConverter.resolution')}</span>
                            <span className="text-slate-700">{imageInfo.width} × {imageInfo.height}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>{t('tools.imageConverter.newResolution')}</span>
                            <span className="text-blue-600">{imageInfo.newWidth} × {imageInfo.newHeight}</span>
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 변환된 이미지 정보 - 프리미엄 에메랄드 다운로드 카드 라인 */}
                    {convertedImage && (
                      <div className="bg-emerald-50/50 border border-emerald-100/80 rounded-3xl p-5 space-y-3 shadow-[0_12px_24px_rgba(16,185,129,0.02)] transition-all duration-300">
                        <h4 className="font-bold text-emerald-800 text-sm flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {t('tools.imageConverter.convertedImageInfo')}
                        </h4>
                        <div className="space-y-2 text-xs font-semibold text-emerald-700">
                          <p className="flex justify-between border-b border-emerald-100/30 pb-1.5">
                            <span>{t('tools.imageConverter.fileSize')}</span>
                            <span className="text-emerald-950 font-bold">{(convertedImage.size / 1024).toFixed(2)} KB</span>
                          </p>
                          <p className="flex justify-between border-b border-emerald-100/30 pb-1.5">
                            <span>{t('tools.imageConverter.fileType')}</span>
                            <span className="text-emerald-950 uppercase">{convertedImage.type.split('/')[1]}</span>
                          </p>
                          <p className="flex justify-between">
                            <span>{t('tools.imageConverter.resolution')}</span>
                            <span className="text-emerald-950">{convertedImage.width} × {convertedImage.height}</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 이미지 미리보기 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-2">
                      {t('tools.imageConverter.original')}
                    </h3>
                    <div className="relative aspect-video bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                      <img
                        src={preview}
                        alt="Original"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    </div>
                  </div>

                  {convertedImage ? (
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 mb-2">
                        {t('tools.imageConverter.converted')}
                      </h3>
                      <div className="relative aspect-video bg-emerald-50/20 border border-emerald-100/30 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center p-2">
                        <img
                          src={convertedImage.url}
                          alt="Converted"
                          className="max-h-full max-w-full object-contain rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-sm font-bold text-slate-400 mb-2">
                        {t('tools.imageConverter.converted')}
                      </h3>
                      <div className="relative aspect-video bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-slate-300 font-semibold text-sm">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span>변환 대기 중</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 작업 버튼 */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={convertImage}
                    disabled={loading}
                    className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl disabled:opacity-50 hover:shadow-[0_12px_24px_rgba(79,70,229,0.15)] shadow-sm transition-all duration-300"
                  >
                    {loading ? (
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ImageIcon className="h-5 w-5 mr-2" />
                    )}
                    {t('tools.imageConverter.convertButton')}
                  </button>

                  {convertedImage && (
                    <button
                      onClick={downloadImage}
                      className="flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl hover:shadow-[0_12px_24px_rgba(16,185,129,0.15)] shadow-sm transition-all duration-300"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      {t('tools.imageConverter.downloadButton')}
                    </button>
                  )}

                  <button
                    onClick={resetAll}
                    className="flex items-center justify-center px-6 py-3.5 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 hover:text-slate-800 font-bold rounded-2xl transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5 mr-2" />
                    {t('tools.imageConverter.resetButton')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageConverter;
