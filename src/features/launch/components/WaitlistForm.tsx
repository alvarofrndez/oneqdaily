'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check } from 'lucide-react';

import { joinWaitlist } from '../actions';
import styles from './WaitlistForm.module.scss';

const initialState: { error?: string; success?: boolean } = {};

export default function WaitlistForm() {
  const t = useTranslations('Launch.waitlist');

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await joinWaitlist(formData);
      return { error: result?.error, success: !!result?.success };
    },
    initialState
  );

  if (state.success) {
    return (
      <p className={styles.success} role="status">
        <Check size={16} strokeWidth={2} aria-hidden="true" />
        <span>{t('success')}</span>
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <label htmlFor="waitlist-email" className="sr-only">
        {t('label')}
      </label>

      <div className={styles.field}>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={t('placeholder')}
          required
          disabled={pending}
          className={styles.input}
        />

        <button type="submit" disabled={pending} className={styles.submit}>
          <span>{pending ? t('submitting') : t('cta')}</span>
          <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {state.error && (
        <p role="alert" className={styles.error}>
          {state.error}
        </p>
      )}
    </form>
  );
}