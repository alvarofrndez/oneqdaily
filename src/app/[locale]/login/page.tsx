import LoginForm from '@/src/features/auth/components/LoginForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-3xl font-bold mb-6">{t('title')}</h1>
        <OAuthButtons />
        <div className="my-6 text-center text-sm text-gray-400">{t('orEmail')}</div>
        <LoginForm />
        <p className="mt-4 text-sm text-gray-500">
          {t('noAccount')} <Link href="/signup" className="text-indigo-600 hover:underline">{t('signupLink')}</Link>
        </p>
      </div>
    </main>
  );
}