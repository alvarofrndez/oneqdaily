'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { submitAnswer } from '@/src/features/questions/actions';

import { Button } from '@/src/components/ui/button';

import AnswerInput from './AnswerInput';

import styles from './AnswerForm.module.scss';

interface AnswerFormProps {
    questionId: string;
}

export default function AnswerForm({
    questionId,
}: AnswerFormProps) {
    const t = useTranslations(
        'Questions.AnswerForm'
    );

    const [answerHtml, setAnswerHtml] =
        useState('');

    const [answerText, setAnswerText] =
        useState('');

    const [visibility, setVisibility] =
        useState<'public' | 'private'>(
            'public'
        );

    const [submitting, setSubmitting] =
        useState(false);

    const handleAnswerChange = (
        html: string,
        text: string
    ) => {
        setAnswerHtml(html);
        setAnswerText(text);
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!answerText.trim()) {
            return;
        }

        setSubmitting(true);

        const formData = new FormData();

        formData.append(
            'questionId',
            questionId
        );

        formData.append(
            'answerText',
            answerHtml
        );

        formData.append(
            'visibility',
            visibility
        );

        try {
            const result =
                await submitAnswer(
                    formData
                );

            if (result.error) {
                alert(result.error);
                return;
            }

            setAnswerHtml('');
            setAnswerText('');
            setVisibility('public');
        } catch (err) {
            console.error(err);
            alert(
                t('unexpectedError')
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={styles.form}
        >
            <AnswerInput
                value={answerHtml}
                onChange={
                    handleAnswerChange
                }
                visibility={visibility}
                onVisibilityChange={
                    setVisibility
                }
                disabled={submitting}
                footerActions={
                    <Button
                        type="submit"
                        disabled={
                            submitting ||
                            !answerText.trim()
                        }
                        className={
                            styles.submit
                        }
                    >
                        {submitting
                            ? t('submitting')
                            : t('submit')}
                    </Button>
                }
            />
        </form>
    );
}