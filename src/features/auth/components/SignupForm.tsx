'use client';

import { useActionState, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Check,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';

import { signUpWithEmail } from '@/src/features/auth/actions';

import styles from './auth-form.module.scss';

const initialState: {
  error?: string;
  success?: boolean;
} = {};

import { passwordRules } from '@/src/features/auth/password-rules';

export default function SignupForm() {
  const t = useTranslations('Auth.Signup');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signUpWithEmail(formData);

      return {
        error: result?.error,
        success: !!result?.success,
      };
    },
    initialState
  );

  const rules = {
    minLength: passwordRules.minLength(password),
    lowercase: passwordRules.lowercase(password),
    uppercase: passwordRules.uppercase(password),
    number: passwordRules.number(password),
    symbol: passwordRules.symbol(password),
  };

  const passwordIsValid = Object.values(rules).every(Boolean);

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const passwordsDoNotMatch =
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  const formIsValid =
    passwordIsValid && passwordsMatch;

  if (state.success) {
    return (
      <p
        role="status"
        className={styles.message}
      >
        {t('success')}
      </p>
    );
  }

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label
          htmlFor="username"
          className={styles.label}
        >
          {t('username')}
        </label>

        <input
          id="username"
          name="username"
          autoComplete="username"
          required
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label
          htmlFor="email"
          className={styles.label}
        >
          {t('email')}
        </label>

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
        <label
          htmlFor="password"
          className={styles.label}
        >
          {t('password')}
        </label>

        <div className={styles.passwordWrapper}>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            className={styles.input}
            aria-invalid={
              password.length > 0 &&
              !passwordIsValid
            }
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword((visible) => !visible)
            }
            className={styles.visibilityButton}
            aria-label={
              showPassword
                ? t('hidePassword')
                : t('showPassword')
            }
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <Eye
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {password.length > 0 && (
          <ul
            className={styles.passwordRequirements}
            aria-live="polite"
          >
            <PasswordRequirement
              valid={rules.minLength}
              text={t('passwordRequirementLength')}
            />

            <PasswordRequirement
              valid={rules.lowercase}
              text={t('passwordRequirementLowercase')}
            />

            <PasswordRequirement
              valid={rules.uppercase}
              text={t('passwordRequirementUppercase')}
            />

            <PasswordRequirement
              valid={rules.number}
              text={t('passwordRequirementNumber')}
            />

            <PasswordRequirement
              valid={rules.symbol}
              text={t('passwordRequirementSymbol')}
            />
          </ul>
        )}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="confirmPassword"
          className={styles.label}
        >
          {t('confirmPassword')}
        </label>

        <div className={styles.passwordWrapper}>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={
              showConfirmPassword
                ? 'text'
                : 'password'
            }
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            className={styles.input}
            aria-invalid={passwordsDoNotMatch}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                (visible) => !visible
              )
            }
            className={styles.visibilityButton}
            aria-label={
              showConfirmPassword
                ? t('hidePassword')
                : t('showPassword')
            }
            aria-pressed={showConfirmPassword}
          >
            {showConfirmPassword ? (
              <EyeOff
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <Eye
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        {confirmPassword.length > 0 && (
          <div
            className={styles.feedback}
            aria-live="polite"
          >
            {passwordsMatch ? (
              <Check
                className={styles.valid}
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <X
                className={styles.invalid}
                size={15}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}

            <span>
              {passwordsMatch
                ? t('passwordsMatch')
                : t('passwordsDoNotMatch')}
            </span>
          </div>
        )}
      </div>

      {state.error && (
        <p
          role="alert"
          className={styles.error}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !formIsValid}
        className={styles.submit}
      >
        {pending
          ? t('submitting')
          : t('submit')}
      </button>
    </form>
  );
}

function PasswordRequirement({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <li
      className={styles.passwordRequirement}
    >
      {valid ? (
        <Check
          className={styles.valid}
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ) : (
        <X
          className={styles.invalid}
          size={15}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      )}

      <span>{text}</span>
    </li>
  );
}