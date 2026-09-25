import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import ResetPasswordForm from '@/src/features/auth/components/ResetPasswordForm';
import styles from '@/src/features/auth/components/auth-page.module.scss';

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/forgot-password');

  const t = await getTranslations('Auth.ResetPassword');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('description')}</p>

        <ResetPasswordForm />
      </div>
    </main>
  );
}