'use client';

import { useActionState, useEffect, useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight, Eye, EyeOff } from 'lucide-react';

import { updatePassword } from '../actions';
import { passwordRules } from '../password-rules';

import styles from './auth-form.module.scss';

const initialState: { error?: string; success?: boolean } = {};

const REQUIREMENT_KEYS = [
  'minLength',
  'lowercase',
  'uppercase',
  'number',
  'symbol',
] as const;

export default function PasswordForm() {
    const t = useTranslations('Auth.Profile.password');
    const tErrors = useTranslations('Auth.errors');

    const [open, setOpen] = useState(false);
    const panelId = useId();

    const [state, formAction, pending] = useActionState(
        async (_prev: typeof initialState, formData: FormData) => {
            const result = await updatePassword(formData);
            return { error: result?.error, success: !!result?.success };
        },
        initialState
    );

    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const requirements = useMemo(
        () =>
        REQUIREMENT_KEYS.map((key) => ({
            key,
            met: passwordRules[key](password),
        })),
        [password]
    );

    const allRequirementsMet = requirements.every(
        (requirement) => requirement.met
    );

    const passwordsMatch =
        password.length > 0 && password === confirmPassword;

    const canSubmit =
        currentPassword.length > 0 &&
        allRequirementsMet &&
        passwordsMatch &&
        !pending;

    useEffect(() => {
        if (!state.success) return;

        setCurrentPassword('');
        setPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowPassword(false);
        setShowConfirm(false);
        setOpen(false);
    }, [state.success]);

    return (
        <section className={styles.collapsible}>
            <button
                type="button"
                className={styles.collapsibleTrigger}
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls={panelId}
            >
                <span>{t('title')}</span>

                <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
                />
            </button>

        <div
            id={panelId}
            className={`${styles.collapsiblePanel} ${
            open ? styles.expandedPanel : ''
            }`}
        >
            <div className={styles.collapsiblePanelInner}>
            <p className={styles.collapsibleHint}>{t('subtitle')}</p>

            <form action={formAction} className={styles.form}>
                <input type="hidden" name="profile" value="1" />

                 <div className={styles.field}>
                    <label htmlFor="currentPassword" className={styles.label}>
                        {t('currentPassword')}
                    </label>

                    <div className={styles.passwordWrapper}>
                        <input
                            id="currentPassword"
                            name="currentPassword"
                            type={showCurrent ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(event) =>
                                setCurrentPassword(event.target.value)
                            }
                            autoComplete="current-password"
                            required
                            className={styles.input}
                            disabled={pending}
                        />

                        <button
                            type="button"
                            className={styles.visibilityButton}
                            onClick={() => setShowCurrent((value) => !value)}
                            aria-label={
                                showCurrent ? t('hidePassword') : t('showPassword')
                            }
                            tabIndex={-1}
                        >
                            {showCurrent ? (
                                <EyeOff size={15} strokeWidth={1.8} aria-hidden="true" />
                            ) : (
                                <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>
                        {t('newPassword')}
                    </label>

                    <div className={styles.passwordWrapper}>
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            autoComplete="new-password"
                            required
                            className={styles.input}
                            disabled={pending}
                            aria-describedby="password-requirements"
                        />

                        <button
                            type="button"
                            className={styles.visibilityButton}
                            onClick={() => setShowPassword((value) => !value)}
                            aria-label={
                                showPassword ? t('hidePassword') : t('showPassword')
                            }
                            tabIndex={-1}
                        >
                        {showPassword ? (
                            <EyeOff size={15} strokeWidth={1.8} aria-hidden="true" />
                        ) : (
                            <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
                        )}
                        </button>
                    </div>

                    <ul
                        id="password-requirements"
                        className={styles.passwordRequirements}
                    >
                        {requirements.map((requirement) => (
                        <li
                            key={requirement.key}
                            className={`${styles.passwordRequirement} ${
                            requirement.met
                                ? styles.requirementMet
                                : styles.requirementPending
                            }`}
                        >
                            <span className={styles.requirementDot} aria-hidden="true" />
                            {t(`requirements.${requirement.key}`)}
                        </li>
                        ))}
                    </ul>
                </div>

                {/* Confirmación */}
                <div className={styles.field}>
                <label htmlFor="confirmPassword" className={styles.label}>
                    {t('confirmPassword')}
                </label>

                <div className={styles.passwordWrapper}>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        autoComplete="new-password"
                        required
                        className={styles.input}
                        disabled={pending}
                        />

                        <button
                            type="button"
                            className={styles.visibilityButton}
                            onClick={() => setShowConfirm((value) => !value)}
                            aria-label={
                                showConfirm ? t('hidePassword') : t('showPassword')
                            }
                            tabIndex={-1}
                        >
                        {showConfirm ? (
                            <EyeOff size={15} strokeWidth={1.8} aria-hidden="true" />
                        ) : (
                            <Eye size={15} strokeWidth={1.8} aria-hidden="true" />
                        )}
                    </button>
                </div>

                {confirmPassword.length > 0 && !passwordsMatch && (
                    <p className={`${styles.feedback} ${styles.invalid}`} role="alert">
                        {tErrors('passwordsDoNotMatch')}
                    </p>
                )}
                </div>

                {state.error && (
                    <p role="alert" className={styles.error}>
                        {state.error}
                    </p>
                )}

                <button type="submit" disabled={!canSubmit} className={styles.submit}>
                    {pending ? t('submitting') : t('submit')}
                </button>
            </form>
            </div>
        </div>
        </section>
    );
}