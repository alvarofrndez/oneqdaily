'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';

import { signInWithEmail, resendConfirmationEmail } from '../actions';

import styles from './auth-form.module.scss';

import Link from 'next/link';

const initialState: { error?: string; unconfirmedEmail?: string } = {};

export default function LoginForm() {
  const t = useTranslations('Auth.Login');

  const [email, setEmail] = useState('');

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signInWithEmail(formData);

      return {
        error: result?.error,
        unconfirmedEmail: result?.unconfirmedEmail,
      };
    },
    initialState
  );

  const [resend, setResend] = useState<{
    sending: boolean;
    sent: boolean;
  }>({
    sending: false,
    sent: false,
  });

  const handleResend = async () => {
    if (!state.unconfirmedEmail) return;

    setResend({ sending: true, sent: false });

    await resendConfirmationEmail(state.unconfirmedEmail);

    setResend({ sending: false, sent: true });
  };

  const forgotPasswordHref = {
    pathname: '/forgot-password',
    query: email.trim() ? { email: email.trim() } : {},
  };

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          {t('email')}
        </label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          {t('password')}
        </label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </div>

      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}

          {state.unconfirmedEmail && (
            <button
              type="button"
              onClick={handleResend}
              disabled={resend.sending || resend.sent}
              className={styles.resendButton}
            >
              {resend.sent
                ? t('confirmationResent')
                : resend.sending
                  ? t('resending')
                  : t('resendConfirmation')}
            </button>
          )}
        </p>
      )}

      <Link href={forgotPasswordHref} className={styles.forgotLink}>
        {t('forgotPassword')}
      </Link>

      <button
        type="submit"
        disabled={pending}
        className={styles.submit}
      >
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}