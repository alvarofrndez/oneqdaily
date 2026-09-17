import SignupForm from '@/src/features/auth/components/SignupForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SignupPage() {
  const t = useTranslations('Auth.Signup');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
        <OAuthButtons />
        <div className="my-6 text-center text-sm text-gray-400">{t('orEmail')}</div>
        <SignupForm />
        <p className="mt-4 text-sm text-gray-500">
          {t('hasAccount')} <Link href="/login" className="text-indigo-600 hover:underline">{t('loginLink')}</Link>
        </p>
      </div>
    </main>
  );
}