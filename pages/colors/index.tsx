import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Palette, Paintbrush, Copy, RefreshCw, Check } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

const HowToUseSection = ({ t }) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t('tools.colors.howToUse.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Paintbrush className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">{t('tools.colors.howToUse.sections.colorSelect.title')}</h3>
              <p className="text-sm text-gray-600">{t('tools.colors.howToUse.sections.colorSelect.description')}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">{t('tools.colors.howToUse.sections.codeCopy.title')}</h3>
              <p className="text-sm text-gray-600">{t('tools.colors.howToUse.sections.codeCopy.description')}</p>
            </div>
          </div>

          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <RefreshCw className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-1">{t('tools.colors.howToUse.sections.palette.title')}</h3>
              <p className="text-sm text-gray-600">{t('tools.colors.howToUse.sections.palette.description')}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ColorConverter = ({ color = '#000000' }) => {
  const [copiedField, setCopiedField] = useState(null);
  const [rgb, setRgb] = useState([0, 0, 0]);
  const { t } = useTranslation();

  const hexToRgb = (hex) => {
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

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative group flex-1">
        <div className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">HEX</span>
            <button
              onClick={() => copyToClipboard(color, 'HEX')}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedField === 'HEX' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm">
            {color.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="relative group flex-1">
        <div className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">RGB</span>
            <button
              onClick={() => copyToClipboard(`rgb(${rgb.join(', ')})`, 'RGB')}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedField === 'RGB' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          <div className="font-mono text-sm">
            rgb({rgb.join(', ')})
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ColorTool({ pageData }) {
  const { t } = useTranslation();
  const [mainColor, setMainColor] = useState('#3B82F6');
  const [copyMessage, setCopyMessage] = useState('');

  const hexToHSL = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
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

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const generatePalette = (hex) => {
    const [h, s, l] = hexToHSL(hex);

    // 밝기 조정 비율 (예: 10%, 20%)
    const lightAdjustmentPercentages = [0.9, 0.8, 1, 1.1, 1.2];

    // 채도 조정 비율 (예: 10%, 20%)
    const saturationAdjustmentPercentages = s > 110 ? [1, 0.9, 1, 1.1, 1.2] : [1, 1, 1, 1.1, 1.2];

    // 최소/최대 밝기/채도 제한
    const minLightness = 10;
    const maxLightness = 90;
    const minSaturation = 10;
    const maxSaturation = 100;

    const newPalette = lightAdjustmentPercentages.map((lightRatio, index) => {
      const saturationRatio = saturationAdjustmentPercentages[index];

      // 새로운 밝기와 채도 계산
      let newLightness = l * lightRatio;
      let newSaturation = s * saturationRatio;

      // 최소/최대 범위 제한
      newLightness = Math.min(Math.max(newLightness, minLightness), maxLightness);
      newSaturation = Math.min(Math.max(newSaturation, minSaturation), maxSaturation);

      return hslToHex(h, newSaturation, newLightness);
    });

    return newPalette;
  };

  const generateComplementary = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    const complementaryH = (h + 180) % 360;
    return [
      hex,
      hslToHex(complementaryH, s, l)
    ];
  };

  const generateSplitComplementary = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hex,
      hslToHex((h + 150) % 360, s, l),
      hslToHex((h + 210) % 360, s, l)
    ];
  };

  const generateAnalogous = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hslToHex((h - 30 + 360) % 360, s, l),
      hex,
      hslToHex((h + 30) % 360, s, l)
    ];
  };

  const generateTriadic = (hex) => {
    const [h, s, l] = hexToHSL(hex);
    return [
      hex,
      hslToHex((h + 120) % 360, s, l),
      hslToHex((h + 240) % 360, s, l)
    ];
  };

  const generateTetradic = (hex) => {
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

  // useMemo를 사용하여 팔레트 생성 함수들을 메모이제이션
  const palette = useMemo(() => generatePalette(mainColor), [mainColor]);
  const complementary = useMemo(() => generateComplementary(mainColor), [mainColor]);
  const splitComplementary = useMemo(() => generateSplitComplementary(mainColor), [mainColor]);
  const analogous = useMemo(() => generateAnalogous(mainColor), [mainColor]);
  const triadic = useMemo(() => generateTriadic(mainColor), [mainColor]);
  const tetradic = useMemo(() => generateTetradic(mainColor), [mainColor]);

  const ColorPaletteItem = ({ color }) => {
    const { t } = useTranslation();
    const [rgb, setRgb] = useState([0, 0, 0]);

    // hex to rgb 변환 함수
    const hexToRgb = (hex) => {
      hex = hex.replace('#', '');
      if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
        return [0, 0, 0];
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return [r, g, b];
    };

    // 컬러가 변경될 때마다 RGB 값 업데이트
    useEffect(() => {
      setRgb(hexToRgb(color));
    }, [color]);

    const copyToClipboard = (color) => {
      navigator.clipboard.writeText(color);
      setCopyMessage(t('tools.colors.copyMessage', { color }));
      setTimeout(() => setCopyMessage(''), 2000);
    };

    return (
      <div className="space-y-2">
        <div
          className="h-24 rounded-lg shadow-sm cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color }}
          onClick={() => copyToClipboard(color)}
        />
        <div className="px-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{color.toUpperCase()}</span>
            <button
              onClick={() => copyToClipboard(color)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="font-mono text-xs text-gray-500">
            rgb({rgb.join(', ')})
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{pageData.head.title}</title>
        <meta name="description" content={pageData.head.description} />
      </Head>

      <div className="p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </Link>
          <LanguageSelector />
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-blue-50">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">{pageData.title}</h1>
          </div>
          <Link
            href="/colors/guide"
            className="text-blue-500 hover:text-blue-700 flex items-center"
          >
            <span>{pageData.guideLink}</span>
            <span className="ml-1">→</span>
          </Link>
        </div>
        
        <HowToUseSection t={t} />

        <Card className="mb-6">
          <CardContent className="p-6 space-y-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="relative">
                <input
                  type="color"
                  value={mainColor}
                  onChange={(e) => setMainColor(e.target.value)}
                  className="w-32 h-32 rounded cursor-pointer"
                />
                <span className="absolute -bottom-6 left-0 text-sm text-gray-500">{t('tools.colors.mainColor')}</span>
              </div>

              <div className="space-y-6 flex-1">
                <div className="space-y-4">
                  <h3 className="font-semibold">{t('tools.colors.colorCode')}</h3>
                  <ColorConverter color={mainColor} />
                </div>

                <button
                  onClick={generateRandomColor}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('tools.colors.randomColor')}</span>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.basic.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.basic.description}</p>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-5 gap-4">
                  {palette.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.complementary.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.complementary.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {complementary.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.splitComplementary.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.splitComplementary.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {splitComplementary.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.analogous.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.analogous.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {analogous.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.triadic.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.triadic.description}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {triadic.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{pageData.palettes.tetradic.title}</h3>
                  <p className="text-sm text-gray-500">{pageData.palettes.tetradic.description}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tetradic.map((color, index) => (
                    <ColorPaletteItem key={index} color={color} />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {copyMessage && (
          <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg">
            {copyMessage}
          </div>
        )}
      </div>
    </>
  );
};

export async function getStaticProps({ locale }) {
  // common.json 파일 로드
  const pageData = await import(`../../public/locales/${locale}/common.json`)
    .then((module) => module.default.tools.colors);

  return {
    props: {
      pageData,
    },
  };
}
