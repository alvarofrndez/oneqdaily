'use client';

import { useState, useContext, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Expand } from 'lucide-react';

import { UserContext } from '@/src/components/providers';
import { submitAnswer } from '@/src/features/questions/actions';
import { Button } from '@/src/components/ui/button';
import { Label } from '@/src/components/ui/label';
import { Switch } from '@/src/components/ui/switch';

import styles from './AnswerForm.module.scss';

interface AnswerFormProps {
  questionId: string;
}

export default function AnswerForm({ questionId }: AnswerFormProps) {
  const t = useTranslations('Questions.AnswerForm');
  const user = useContext(UserContext);

  const [answer, setAnswer] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [submitting, setSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [answer]);

  const handleVisibilityChange = (checked: boolean) => {
    setVisibility(checked ? 'private' : 'public');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answer.trim()) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append('questionId', questionId);
    formData.append('answerText', answer);
    formData.append('visibility', visibility);

    try {
      const result = await submitAnswer(formData);

      if (result.error) {
        alert(result.error);
      } else {
        setAnswer('');
        setVisibility('public');
      }
    } catch (err) {
      console.error(err);
      alert(t('unexpectedError'));
    } finally {
      setSubmitting(false);
    }
  };

  const isPrivate = visibility === 'private';

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.user}>
        {!user ? (
          <span className={styles.anonymus}>{t('postingAnonymous')}</span>
        ) : (
          <div className={styles.visibility}>
            <Switch
              id='visibility'
              size='sm'
              className={styles.switch}
              checked={isPrivate}
              onCheckedChange={handleVisibilityChange}
              disabled={submitting}
            />

            <Label
              htmlFor='visibility'
              className={`${styles.label} ${isPrivate ? styles.active : ''}`}
            >
              {t('private')}
            </Label>
          </div>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          id='answer'
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('placeholder')}
          disabled={submitting}
          rows={1}
        />

        <button
          type='button'
          className={styles.expand}
          aria-label='Expand textarea'
        >
          <Expand size={14} />
        </button>
      </div>

      <Button
        type='submit'
        disabled={submitting || !answer.trim()}
        className={styles.submit}
      >
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}