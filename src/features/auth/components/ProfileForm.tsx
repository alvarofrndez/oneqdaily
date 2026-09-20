'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { updateProfile } from '../actions';
import type { Profile } from '../types';
import styles from './auth-form.module.scss';

const initialState: { error?: string; success?: boolean } = {};

export default function ProfileForm({ profile }: { profile: Profile }) {
  const t = useTranslations('Auth.Profile');
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await updateProfile(formData);
      return { error: result?.error, success: !!result?.success };
    },
    initialState
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>{t('username')}</label>
        <input
          id="username"
          name="username"
          defaultValue={profile.username ?? ''}
          autoComplete="username"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="fullName" className={styles.label}>{t('fullName')}</label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={profile.full_name ?? ''}
          autoComplete="name"
          className={styles.input}
        />
      </div>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
      {state.success && <p role="status" className={styles.success}>{t('success')}</p>}
      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? t('saving') : t('save')}
      </button>
    </form>
  );
}