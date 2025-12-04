import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';

const QualityExplanation = () => {
  const { t } = useTranslation();

  return (
    <div className="py-8 px-4 mx-auto max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6">
        {t('qualityExplanation.heading')}
      </h1>
      <p className="text-gray-700 mb-8">
        {t('qualityExplanation.description')}
      </p>
      <table className="w-full border-collapse shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-3 border text-left font-semibold">
              {t('qualityExplanation.table.originalFormat')}
            </th>
            <th className="px-4 py-3 border text-left font-semibold">
              {t('qualityExplanation.table.outputFormat')}
            </th>
            <th className="px-4 py-3 border text-left font-semibold">
              {t('qualityExplanation.table.qualitySetting')}
            </th>
            <th className="px-4 py-3 border text-left font-semibold">
              {t('qualityExplanation.table.explanation')}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">X</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.pngToPng.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.pngToJpeg.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.pngToWebp.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">X</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.jpegToPng.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.jpegToJpeg.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.jpegToWebp.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">PNG</td>
            <td className="border px-4 py-3">X</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.webpToPng.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">JPEG</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.webpToJpeg.description')}
            </td>
          </tr>
          <tr>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">WebP</td>
            <td className="border px-4 py-3">O</td>
            <td className="border px-4 py-3">
              {t('qualityExplanation.cases.webpToWebp.description')}
            </td>
          </tr>
        </tbody>
      </table>
      {/* 뒤로가기 버튼 */}
      <a href="/images" className="mt-8 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
        {t('common.backButton')}
      </a>
    </div>
  );
};

export default QualityExplanation;
