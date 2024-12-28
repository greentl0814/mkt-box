// components/LanguageSelector.tsx
import { useTranslation } from '@/lib/i18n/useTranslation';
import type { Locale } from '@/lib/i18n/translations';

export function LanguageSelector() {
  const { locale, changeLocale } = useTranslation();

  const handleLanguageChange = (newLocale: Locale) => {
    if (locale === newLocale) return;
    changeLocale(newLocale);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLanguageChange('ko')}
        className={`px-2 py-1 rounded-md ${
          locale === 'ko'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        ko
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-2 py-1 rounded-md ${
          locale === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        en
      </button>
    </div>
  );
}
