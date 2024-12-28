// lib/i18n/translations.ts

export type Locale = 'ko' | 'en';

export interface Translations {
  meta: {
    title: string;
    description: string;
    keywords: string;
    ogTitle: string;
    ogDescription: string;
  };
  main: {
    heading: string;
    useButton: string;
  };
  tools: {
    utm: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    youtube: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    youtubeTime: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    youtubeComments: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    url: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    text: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    analytics: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    wordCloud: {
      title: string;
      description: string;
      detailedDescription: string;
    };
    colors: {
      title: string;
      description: string;
      detailedDescription: string;
    };
  };
}
