import { useTranslation } from '@/lib/i18n/useTranslation';
import Head from 'next/head';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function TermsOfService({ pageData }) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{pageData.termsOfServicePage.head.title}</title>
        <meta name="description" content={pageData.termsOfServicePage.head.description} />
      </Head>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </a>
          <LanguageSelector />
        </div>
        <h1 className="text-3xl font-bold mb-4">{pageData.termsOfServicePage.title}</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            {pageData.termsOfServicePage.intro}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section1.title}</h2>
          <p className="mb-4">
            {pageData.termsOfServicePage.section1.content}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section2.title}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.termsOfServicePage.section2.item1}</li>
            <li>{pageData.termsOfServicePage.section2.item2}</li>
            <li>{pageData.termsOfServicePage.section2.item3}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section3.title}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.termsOfServicePage.section3.item1}</li>
            <li>{pageData.termsOfServicePage.section3.item2}</li>
            <li>{pageData.termsOfServicePage.section3.item3}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section4.title}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.termsOfServicePage.section4.item1}</li>
            <li>{pageData.termsOfServicePage.section4.item2}</li>
            <li>{pageData.termsOfServicePage.section4.item3}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section5.title}</h2>
          <p className="mb-4">
            {pageData.termsOfServicePage.section5.content}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section6.title}</h2>
          <p className="mb-4">
            {pageData.termsOfServicePage.section6.content}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.termsOfServicePage.section7.title}</h2>
          <p className="mb-4">
            {pageData.termsOfServicePage.section7.content}
          </p>

          <p className="mt-8 text-gray-600">
            {pageData.termsOfServicePage.effectiveDate}
          </p>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }) {
  const common = await import(`@/public/locales/${locale}/common.json`).then(
    (module) => module.default
  );

  return {
    props: {
      pageData: common,
    },
  };
}
