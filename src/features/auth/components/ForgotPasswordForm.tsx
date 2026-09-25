'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { requestPasswordReset } from '../actions';
import styles from './auth-form.module.scss';

const initialState: { error?: string; success?: boolean } = {};
const RESEND_COOLDOWN_SECONDS = 30;

type ForgotPasswordFormProps = {
  email?: string;
};

export default function ForgotPasswordForm({ email = '' }: ForgotPasswordFormProps) {
  const t = useTranslations('Auth.ForgotPassword');
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await requestPasswordReset(formData);
      return { error: result?.error, success: !!result?.success };
    },
    initialState
  );

  const [submittedEmail, setSubmittedEmail] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [editingEmail, setEditingEmail] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!state.success) return;

    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  }, [state.success]);

  // Manejo del contador
  useEffect(() => {
    if (secondsLeft <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [secondsLeft]);

  const handleSubmit = (formData: FormData) => {
    const value = (formData.get('email') as string) ?? '';
    setSubmittedEmail(value);
    setEditingEmail(false);
    return formAction(formData);
  };

  if (state.success && !editingEmail) {
    const canResend = secondsLeft === 0 && !pending;

    return (
      <div className={styles.successBlock} role="status" aria-live="polite">
        <p className={styles.successTitle}>{t('emailSentTitle')}</p>
        <p className={styles.successMessage}>
          {t('emailSentTo', { email: submittedEmail })}
        </p>

        <p className={styles.successHint}>{t('checkSpam')}</p>

        <div className={styles.successActions}>
          <button
            type="button"
            className={styles.resendButton}
            disabled={!canResend}
            onClick={() => {
              if (!canResend) return;
              const formData = new FormData();
              formData.append('email', submittedEmail);
              handleSubmit(formData);
            }}
          >
            {pending
              ? t('resending')
              : secondsLeft > 0
                ? t('resendIn', { seconds: secondsLeft })
                : t('resend')}
          </button>

          <button
            type="button"
            className={styles.forgotLink}
            onClick={() => {
              setEditingEmail(true);
              setSecondsLeft(0);
            }}
          >
            {t('useAnotherEmail')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          {t('email')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={submittedEmail || email}
          autoComplete="email"
          required
          className={styles.input}
          disabled={pending}
        />
      </div>

      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}