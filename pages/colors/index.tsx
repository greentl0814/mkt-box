import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';

import { useTranslation } from '@/lib/i18n/useTranslation';
import { Palette, Paintbrush, Copy, RefreshCw, Check } from 'lucide-react';

interface HowToUseSectionProps {
  t: (key: string) => string;
}

const HowToUseSection: React.FC<HowToUseSectionProps> = ({ t }) => {
  return (
    <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.01)] transition-all duration-300 mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 rounded-full bg-blue-600"></span>
        {t('tools.colors.howToUse.title')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 border border-blue-100/20">
              <Paintbrush className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">{t('tools.colors.howToUse.sections.colorSelect.title')}</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">{t('tools.colors.howToUse.sections.colorSelect.description')}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 border border-blue-100/20">
              <Copy className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">{t('tools.colors.howToUse.sections.codeCopy.title')}</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">{t('tools.colors.howToUse.sections.codeCopy.description')}</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-50/50 flex items-center justify-center text-blue-600 border border-blue-100/20">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1.5">{t('tools.colors.howToUse.sections.palette.title')}</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">{t('tools.colors.howToUse.sections.palette.description')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ColorConverterProps {
  color: string;
}

const ColorConverter: React.FC<ColorConverterProps> = ({ color = '#000000' }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [rgb, setRgb] = useState<number[]>([0, 0, 0]);

  const hexToRgb = (hex: string): number[] => {
    hex = hex.replace('#', '');
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return [0, 0, 0];
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  };

  useEffect(() => {
    setRgb(hexToRgb(color));
  }, [color]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative group flex-1">
        <div className="bg-slate-50/60 border border-slate-100/80 rounded-2xl p-4 space-y-1.5 hover:bg-white hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">HEX</span>
            <button
              onClick={() => copyToClipboard(color, 'HEX')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              {copiedField === 'HEX' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-slate-800 uppercase">
            {color}
          </div>
        </div>
      </div>

      <div className="relative group flex-1">
        <div className="bg-slate-50/60 border border-slate-100/80 rounded-2xl p-4 space-y-1.5 hover:bg-white hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">RGB</span>
            <button
              onClick={() => copyToClipboard(`rgb(${rgb.join(', ')})`, 'RGB')}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              {copiedField === 'RGB' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm font-bold text-slate-800">
            rgb({rgb.join(', ')})
          </div>
        </div>
      </div>
    </div>
  );
};

interface ColorToolProps {
  pageData: {
    title: string;
    guideLink: string;
    head: {
      title: string;
      description: string;
    };
    palettes: {
      basic: { title: string; description: string };
      complementary: { title: string; description: string };
      splitComplementary: { title: string; description: string };
      analogous: { title: string; description: string };
      triadic: { title: string; description: string };
      tetradic: { title: string; description: string };
    };
  };
}

export default function ColorTool({ pageData }: ColorToolProps) {
  const { t } = useTranslation();
  const [mainColor, setMainColor] = useState('#3B82F6');
  const [inputValue, setInputValue] = useState('#3B82F6');
  const [copyMessage, setCopyMessage] = useState('');

  useEffect(() => {
    setInputValue(mainColor);
  }, [mainColor]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Remove whitespaces
    val = val.replace(/\s/g, '');
    
    // Add '#' prefix if missing and non-empty
    if (val.length > 0 && !val.startsWith('#')) {
      val = '#' + val;
    }
    
    // Limit length to # + 6 hex chars = 7
    if (val.length > 7) {
      val = val.slice(0, 7);
    }
    
    setInputValue(val);
    
    // Apply when it is a valid 6-character hex code
    const hex6Regex = /^#[0-9A-Fa-f]{6}$/;
    if (hex6Regex.test(val)) {
      setMainColor(val.toUpperCase());
    }
  };

  const hexToHSL = (hex: string): number[] => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    const lightAdjustmentPercentages = [0.9, 0.8, 1, 1.1, 1.2];
    const saturationAdjustmentPercentages = s > 110 ? [1, 0.9, 1, 1.1, 1.2] : [1, 1, 1, 1.1, 1.2];

    const minLightness = 10;
    const maxLightness = 90;
    const minSaturation = 10;
    const maxSaturation = 100;

    const newPalette = lightAdjustmentPercentages.map((lightRatio, index) => {
      const saturationRatio = saturationAdjustmentPercentages[index];
      let newLightness = l * lightRatio;
      let newSaturation = s * saturationRatio;

      newLightness = Math.min(Math.max(newLightness, minLightness), maxLightness);
      newSaturation = Math.min(Math.max(newSaturation, minSaturation), maxSaturation);

      return hslToHex(h, newSaturation, newLightness);
    });

    return newPalette;
  };

  const generateComplementary = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    const complementaryH = (h + 180) % 360;
    return [
      hex,
      hslToHex(complementaryH, s, l)
    ];
  };

  const generateSplitComplementary = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hex,
      hslToHex((h + 150) % 360, s, l),
      hslToHex((h + 210) % 360, s, l)
    ];
  };

  const generateAnalogous = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hslToHex((h - 30 + 360) % 360, s, l),
      hex,
      hslToHex((h + 30) % 360, s, l)
    ];
  };

  const generateTriadic = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hex,
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l)
    ];
  };

  const generateTetradic = (hex: string): string[] => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hex,
      hslToHex((h + 90) % 360, s, l),
      hslToHex((h + 180) % 360, s, l),
      hslToHex((h + 270) % 360, s, l)
    ];
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setMainColor(randomColor);
  };

  const palette = useMemo(() => generatePalette(mainColor), [mainColor]);
  const complementary = useMemo(() => generateComplementary(mainColor), [mainColor]);
  const splitComplementary = useMemo(() => generateSplitComplementary(mainColor), [mainColor]);
  const analogous = useMemo(() => generateAnalogous(mainColor), [mainColor]);
  const triadic = useMemo(() => generateTriadic(mainColor), [mainColor]);
  const tetradic = useMemo(() => generateTetradic(mainColor), [mainColor]);

  interface ColorPaletteItemProps {
    color: string;
  }

  const ColorPaletteItem: React.FC<ColorPaletteItemProps> = ({ color }) => {
    const { t } = useTranslation();
    const [rgb, setRgb] = useState<number[]>([0, 0, 0]);

    const hexToRgb = (hex: string): number[] => {
      hex = hex.replace('#', '');
      if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return [0, 0, 0];
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    };

    useEffect(() => {
      setRgb(hexToRgb(color));
    }, [color]);

    const copyToClipboard = (colorVal: string) => {
      navigator.clipboard.writeText(colorVal);
      setCopyMessage(t('tools.colors.copyMessage', { color: colorVal }));
      setTimeout(() => setCopyMessage(''), 2000);
    };

    return (
      <div className="space-y-2.5 bg-white/60 hover:bg-white border border-slate-100/50 p-2.5 rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.03)] hover:-translate-y-0.5 transition-all duration-300 group">
        <div
          className="h-20 md:h-24 rounded-[18px] cursor-pointer shadow-inner relative overflow-hidden"
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
        >
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Copy className="w-5 h-5 text-white filter drop-shadow-sm" />
          </div>
        </div>
        <div className="px-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs md:text-sm font-bold text-slate-800">{color.toUpperCase()}</span>
            <button
              onClick={() => copyToClipboard(color)}
              className="text-slate-400 hover:text-blue-600 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="font-mono text-[10px] md:text-xs font-semibold text-slate-400 truncate">
            rgb({rgb.join(',')})
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{pageData?.head?.title}</title>
        <meta name="description" content={pageData?.head?.description} />
        <meta name="keywords" content="컬러 팔레트, 색상 조합, 브랜드 컬러, 보색, HEX 코드, RGB 코드, 색상 코드, 컴플리멘터리, 유사색, color palette" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.mktbox.co.kr/colors" />
        <link rel="alternate" hrefLang="ko" href="https://www.mktbox.co.kr/colors" />
        <link rel="alternate" hrefLang="en" href="https://www.mktbox.co.kr/en/colors" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mktbox.co.kr/colors" />
        <meta property="og:title" content={pageData?.head?.title} />
        <meta property="og:description" content={pageData?.head?.description} />
        <meta property="og:site_name" content="MKT Box" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageData?.head?.title} />
        <meta name="twitter:description" content={pageData?.head?.description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "컬러 팔레트 생성기",
            "url": "https://www.mktbox.co.kr/colors",
            "description": "브랜드에 맞는 완벽한 컬러 조합을 생성하세요. HEX, RGB 코드를 제공하며 보색, 유사색, 삼원색 등 다양한 컴비네이션을 지원합니다.",
            "applicationCategory": "DesignApplication",
            "operatingSystem": "Web",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "KRW" },
            "featureList": ["컴플리멘터리 컴비네이션", "유사색 컴비네이션", "삼원색 컴비네이션", "HEX/RGB 코드 복사"],
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
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pageData?.title}</h1>
                </div>
              </div>
              <a href="/colors/guide"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50 px-4 py-2.5 rounded-2xl border border-blue-100/50 transition-all duration-300 self-start md:self-auto shadow-sm"
              >
                <span>{pageData?.guideLink}</span>
                <span>→</span>
              </a>
            </div>
          </div>
          
          <HowToUseSection t={t} />

          <div className="bg-white/90 backdrop-blur border border-slate-100/80 rounded-[32px] p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-start gap-8 pb-8 border-b border-slate-100 mb-8">
              <div className="relative flex flex-col items-center gap-3">
                <div className="w-32 h-32 rounded-[28px] overflow-hidden border border-slate-200 shadow-md relative group hover:scale-105 transition-all duration-300">
                  <input
                    type="color"
                    value={mainColor}
                    onChange={(e) => setMainColor(e.target.value)}
                    className="absolute inset-[-10px] w-[150px] h-[150px] cursor-pointer"
                  />
                </div>
                <div className="flex flex-col items-center gap-1.5 w-full">
                  <span className="text-xs font-bold text-slate-400">{t('tools.colors.mainColor')}</span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleHexChange}
                    placeholder="#3B82F6"
                    className="w-28 px-3 py-1.5 text-center font-mono text-xs md:text-sm font-extrabold text-slate-800 bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:bg-slate-100/50 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-5 flex-1 w-full">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 text-sm">{t('tools.colors.colorCode')}</h3>
                  <ColorConverter color={mainColor} />
                </div>

                <button
                  onClick={generateRandomColor}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 font-bold rounded-2xl border border-blue-100/50 hover:shadow-sm transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 animate-spin-reverse" />
                  <span>{t('tools.colors.randomColor')}</span>
                </button>
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.basic?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.basic?.description}</p>
                </div>
                <div className="grid grid-cols-5 gap-3 md:gap-4">
                  {palette.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.complementary?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.complementary?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {complementary.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.splitComplementary?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.splitComplementary?.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {splitComplementary.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.analogous?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.analogous?.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {analogous.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.triadic?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.triadic?.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {triadic.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                  <h3 className="font-extrabold text-slate-800 text-base md:text-lg">{pageData?.palettes?.tetradic?.title}</h3>
                  <p className="text-xs font-semibold text-slate-400">{pageData?.palettes?.tetradic?.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  {tetradic.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {copyMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-[0_12px_24px_rgba(16,185,129,0.2)] text-sm font-bold animate-fadeIn flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{copyMessage}</span>
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.colors);

  return {
    props: {
      pageData,
    },
  };
}
