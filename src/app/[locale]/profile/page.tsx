import { redirect } from 'next/navigation';
import { UserRound } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getProfile } from '@/src/features/auth/queries';
import ProfileForm from '@/src/features/auth/components/ProfileForm';
import PasswordForm from '@/src/features/auth/components/PasswordForm';
import styles from '@/src/features/auth/components/auth-page.module.scss';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await getProfile(user.id);
  if (!profile) redirect('/login');

  const t = await getTranslations('Auth.Profile');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{t('title')}</h1>
            <p className={styles.subtitle}>{user.email}</p>
          </div>
        </header>

        <ProfileForm profile={profile} />

        <section
          className={styles.section}
          aria-labelledby="profile-password-title"
        >
          <h2 id="profile-password-title" className={styles.sectionTitle}>
            {t('password.title')}
          </h2>
          <p className={styles.sectionSubtitle}>{t('password.subtitle')}</p>

          <PasswordForm />
        </section>
      </div>
    </main>
  );
}