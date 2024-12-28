import { useRouter } from 'next/router';
import { useMemo } from 'react';
import type { Locale, Translations } from './translations';

export function useTranslation() {
  const router = useRouter();
  const locale = (router.locale || 'ko') as Locale;
  const translations = useMemo(() => {
    try {
      return require(`../../public/locales/${locale}/common.json`);
    } catch (error) {
      console.error(`Failed to load translations for locale: ${locale}`, error);
      return require('../../public/locales/ko/common.json');
    }
  }, [locale]) as Translations;

  const t = (key: string, substitutions?: Record<string, string | number>) => {
    // 점(.)으로 구분된 키를 사용하여 번역 객체에서 값을 찾음
    let text = key.split('.').reduce((obj, k) => obj?.[k] as any, translations) || key;

    // substitutions가 있으면 {{key}} 형태의 문자열을 치환
    if (substitutions) {
      Object.entries(substitutions).forEach(([key, value]) => {
        text = text.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
    }

    return text;
  };

  return {
    t,
    locale,
    changeLocale: (newLocale: Locale) => {
      router.push(router.pathname, router.asPath, { locale: newLocale });
    },
  };
}
