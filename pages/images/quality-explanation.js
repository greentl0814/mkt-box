import React from 'react';
import Head from 'next/head';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { ArrowLeftCircle, HelpCircle } from 'lucide-react';

const QualityExplanation = () => {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t('qualityExplanation.heading')} - Marketing Tools</title>
        <meta name="description" content={t('qualityExplanation.description')} />
        <meta name="keywords" content="이미지 화질, 이미지 변환 품질, PNG JPEG 차이, WebP 압축, 이미지 압축 원리" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={t('qualityExplanation.heading')} />
        <meta property="og:description" content={t('qualityExplanation.description')} />
      </Head>

      <div className="relative min-h-screen overflow-hidden pb-16">
        {/* 몽환적인 파스텔 백그라운드 메시 블러 데코레이션 */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-400/10 blur-[100px] md:blur-[140px] pointer-events-none"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] md:w-[700px] h-[500px] md:h-[700px] rounded-full bg-purple-400/10 blur-[120px] md:blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[15%] w-[450px] md:w-[650px] h-[450px] md:h-[650px] rounded-full bg-pink-400/10 blur-[110px] md:blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 pt-4">
            <a href="/images" className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeftCircle className="w-5 h-5" />
              <span>{t('common.backButton')}</span>
            </a>
          </div>

          {/* Intro Section */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-8 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {t('qualityExplanation.heading')}
              </h1>
            </div>
            <p className="text-base text-slate-600 font-medium leading-relaxed">
              {t('qualityExplanation.description')}
            </p>
          </div>

          {/* Table Container Card */}
          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t('qualityExplanation.table.originalFormat')}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t('qualityExplanation.table.outputFormat')}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                      {t('qualityExplanation.table.qualitySetting')}
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {t('qualityExplanation.table.explanation')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-slate-100 text-slate-400 font-bold px-2 py-1 rounded-md">X</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.pngToPng.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.pngToJpeg.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.pngToWebp.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-slate-100 text-slate-400 font-bold px-2 py-1 rounded-md">X</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.jpegToPng.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.jpegToJpeg.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.jpegToWebp.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 font-bold text-slate-900">PNG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-slate-100 text-slate-400 font-bold px-2 py-1 rounded-md">X</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.webpToPng.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 font-bold text-slate-900">JPEG</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.webpToJpeg.description')}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 font-bold text-slate-900">WebP</td>
                    <td className="px-6 py-4 text-center"><span className="text-xs bg-blue-50 text-blue-600 font-bold px-2 py-1 rounded-md">O</span></td>
                    <td className="px-6 py-4 text-xs text-slate-500 leading-relaxed font-semibold">
                      {t('qualityExplanation.cases.webpToWebp.description')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QualityExplanation;

