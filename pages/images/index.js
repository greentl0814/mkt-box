import React, { useState, useCallback, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  Upload,
  Image as ImageIcon,
  Download,
  RefreshCw,
  Trash2,
  Info,
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
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl font-bold">{t('tools.imageConverter.title')}</h1>
            <Link
              href="/images/guide"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium"
            >
              <span>{t('tools.imageConverter.guideLink')}</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-6">

          {/* 파일 업로드 영역 */}
          <div
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors mb-6"
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
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                {t('tools.imageConverter.uploadText')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t('tools.imageConverter.supportedFormats')}
              </p>
            </label>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* 이미지 미리보기 및 변환 옵션 */}
          {preview && (
            <div className="space-y-6">
              {/* 변환 옵션 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* 출력 형식 선택 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tools.imageConverter.outputFormat')}
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>

                  {/* 품질 설정 - JPEG, WebP일 때만 표시 */}
                  {(format === 'jpeg' || format === 'webp') && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {t('tools.imageConverter.quality')}: {quality}%
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">
                        ℹ️ {t('qualityExplanation.description')}
                        <Link href="/images/quality-explanation" legacyBehavior>
                          <a
                            className="text-blue-500 hover:underline ml-1"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t('qualityExplanation.link')}
                          </a>
                        </Link>
                        <br />
                      </p>
                    </div>
                  )}

                  {/* 최대 너비 설정 */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('tools.imageConverter.maxWidth')}
                    </label>
                    <input
                      type="number"
                      min="100"
                      max={imageInfo?.originalWidth || 3840}
                      value={maxWidth}
                      onChange={handleMaxWidthChange}
                      className="w-full p-2 border rounded-lg"
                    />
                    <p className="text-xs text-gray-500">
                      {t('tools.imageConverter.maxWidthNote1')}
                      <br />
                      {t('tools.imageConverter.maxWidthNote2')}{' '}
                      {imageInfo ? imageInfo.originalWidth : '0'}
                      {t('tools.imageConverter.maxWidthNote3')}{' '}
                      {imageInfo ? imageInfo.originalHeight : '0'}
                      {t('tools.imageConverter.maxWidthNote4')}
                    </p>
                  </div>
                </div>

                {/* 이미지 정보, 변환 후 이미지 정보  */}
                <div className="space-y-4">
                  {/* 이미지 정보 */}
                  {imageInfo && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-1">
                      <h4 className="font-medium text-sm">
                        {t('tools.imageConverter.originalImageInfo')}
                      </h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          {t('tools.imageConverter.fileName')}: {imageInfo.name}
                        </p>
                        <p>
                          {t('tools.imageConverter.fileSize')}:{' '}
                          {(imageInfo.size / 1024).toFixed(2)} KB
                        </p>
                        <p>
                          {t('tools.imageConverter.resolution')}:{' '}
                          {imageInfo.width} x {imageInfo.height}
                        </p>
                        <p>
                          {t('tools.imageConverter.newResolution')}:{' '}
                          {imageInfo.newWidth} x {imageInfo.newHeight}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 변환된 이미지 정보 */}
                  {convertedImage && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-1">
                      <h4 className="font-medium text-sm">
                        {t('tools.imageConverter.convertedImageInfo')}
                      </h4>
                      <div className='space-y-1 text-sm'>
                        <p>
                          {t('tools.imageConverter.fileSize')}:{' '}
                          {(convertedImage.size / 1024).toFixed(2)} KB
                        </p>
                        <p>
                          {t('tools.imageConverter.fileType')}: {convertedImage.type}
                        </p>
                        <p>
                          {t('tools.imageConverter.resolution')}:{' '}
                          {convertedImage.width} x {convertedImage.height}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 이미지 미리보기 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    {t('tools.imageConverter.original')}
                  </h3>
                  <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={preview}
                      alt="Original"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {convertedImage && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {t('tools.imageConverter.converted')}
                    </h3>
                    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={convertedImage.url}
                        alt="Converted"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 작업 버튼 */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={convertImage}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-2" />
                  )}
                  {t('tools.imageConverter.convertButton')}
                </button>

                {convertedImage && (
                  <button
                    onClick={downloadImage}
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {t('tools.imageConverter.downloadButton')}
                  </button>
                )}

                <button
                  onClick={resetAll}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('tools.imageConverter.resetButton')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageConverter;
