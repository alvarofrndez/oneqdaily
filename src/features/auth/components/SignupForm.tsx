'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signUpWithEmail } from '../actions';
import styles from './auth-form.module.scss';

const initialState: { error?: string; success?: boolean } = {};

export default function SignupForm() {
  const t = useTranslations('Auth.Signup');
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signUpWithEmail(formData);
      return { error: result?.error, success: !!result?.success };
    },
    initialState
  );

  if (state.success) {
    return <p role="status" className={styles.message}>{t('success')}</p>;
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="username" className={styles.label}>{t('username')}</label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>{t('email')}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>{t('password')}</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={styles.input}
        />
      </div>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}