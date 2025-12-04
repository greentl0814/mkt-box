import { useTranslation } from '@/lib/i18n/useTranslation';
import Head from 'next/head';
import { LanguageSelector } from '@/components/LanguageSelector';

export default function PrivacyPolicy({ pageData }) {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{pageData.privacyPolicyPage.head.title}</title>
        <meta name="description" content={pageData.privacyPolicyPage.head.description} />
      </Head>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <a href="/" className="text-blue-500 hover:text-blue-700">
            {t('common.backButton')}
          </a>
          <LanguageSelector />
        </div>
        <h1 className="text-3xl font-bold mb-8">{pageData.privacyPolicyPage.title}</h1>

        <div className="prose max-w-none">
          <p className="mb-4">
            {pageData.privacyPolicyPage.intro}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section1.title}</h2>
          <p className="mb-4">
            {pageData.privacyPolicyPage.section1.content1}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.privacyPolicyPage.section1.item1}</li>
            <li>{pageData.privacyPolicyPage.section1.item2}</li>
            <li>{pageData.privacyPolicyPage.section1.item3}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section2.title}</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.privacyPolicyPage.section2.item1}</li>
            <li>{pageData.privacyPolicyPage.section2.item2}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section3.title}</h2>
          <p className="mb-4">
            {pageData.privacyPolicyPage.section3.content}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section4.title}</h2>
          <p className="mb-4">
            {pageData.privacyPolicyPage.section4.content}
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>{pageData.privacyPolicyPage.section4.item1}</li>
            <li>{pageData.privacyPolicyPage.section4.item2}</li>
            <li>{pageData.privacyPolicyPage.section4.item3}</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section5.title}</h2>
          <p className="mb-4">
            {pageData.privacyPolicyPage.section5.content}<br />
            {pageData.privacyPolicyPage.section5.email}
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">{pageData.privacyPolicyPage.section6.title}</h2>
          <p className="mb-4">
            {pageData.privacyPolicyPage.section6.content}
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
