import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = router;

  return (
    <footer className="border-t mt-12 py-6 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center space-x-6 mb-2 text-sm text-gray-600">
          <Link href={{ pathname: '/privacy-policy', query: { locale } }} className="hover:text-gray-900">
            {t('footer.privacyPolicy')}
          </Link>
          <Link href={{ pathname: '/terms', query: { locale } }} className="hover:text-gray-900">
            {t('footer.termsOfService')}
          </Link>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          {t('footer.copyright')}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {t('footer.contact')}
        </p>
      </div>
    </footer>
  );
}
