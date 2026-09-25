// src/features/questions/components/AnswerInput.tsx
'use client';

import { useContext } from 'react';
import { useTranslations } from 'next-intl';

import { UserContext } from '@/src/components/providers';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';
import { Textarea } from '@/src/components/ui/textarea';

import styles from './AnswerInput.module.scss';

interface AnswerInputProps {
    value: string;
    onChange: (value: string) => void;
    visibility: 'public' | 'private';
    onVisibilityChange: (visibility: 'public' | 'private') => void;
    disabled?: boolean;
    footerActions?: React.ReactNode;
}

export default function AnswerInput({
    value,
    onChange,
    visibility,
    onVisibilityChange,
    disabled = false,
    footerActions,
}: AnswerInputProps) {
    const t = useTranslations('Questions.AnswerForm');
    const user = useContext(UserContext);
    const isPrivate = visibility === 'private';

    return (
        <div className={styles.wrapper}>
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('placeholder')}
                disabled={disabled}
                rows={5}
                className={styles.textarea}
            />

            <div className={styles.footer}>
                <div className={styles.footerMeta}>
                    {!user ? (
                        <span className={styles.anonymous}>{t('postingAnonymous')}</span>
                    ) : (
                        <div className={styles.visibility}>
                            <Switch
                                id="answer-visibility"
                                size="sm"
                                checked={isPrivate}
                                onCheckedChange={(checked) =>
                                    onVisibilityChange(checked ? 'private' : 'public')
                                }
                                disabled={disabled}
                            />
                            <Label
                                htmlFor="answer-visibility"
                                className={`${styles.visibilityLabel} ${isPrivate ? styles.active : ''}`}
                            >
                                {t('private')}
                            </Label>
                        </div>
                    )}
                </div>

                {footerActions && <div className={styles.footerActions}>{footerActions}</div>}
            </div>
        </div>
    );
}