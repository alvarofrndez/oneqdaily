'use client';

import { useState, useContext } from 'react';
import { useTranslations } from 'next-intl';
import { submitAnswer } from '@/src/features/questions/actions';
import { UserContext } from '@/src/components/providers';
import { Button } from '@/src/components/ui/button';
import { Textarea } from '@/src/components/ui/textarea';
import { Label } from '@/src/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/src/components/ui/radio-group';

export default function AnswerForm({ questionId }: { questionId: string }) {
  const t = useTranslations('Questions.AnswerForm');
  const [answer, setAnswer] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [submitting, setSubmitting] = useState(false);
  const user = useContext(UserContext);

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="answer" className="mb-2 block">{t('label')}</Label>
        <Textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={t('placeholder')}
          rows={4}
          disabled={submitting}
        />
      </div>

      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
        {user ? <span>{t('postingAs')} <span className="font-medium text-foreground">{user.email}</span></span>
              : <span>{t('postingAnonymous')}</span>}
      </div>

      {user && (
        <div>
          <Label className="mb-2 block">{t('visibility')}</Label>
          <RadioGroup
            value={visibility}
            onValueChange={(v) => setVisibility(v as 'public' | 'private')}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="visibility-public" />
              <Label htmlFor="visibility-public" className="font-normal">{t('public')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="visibility-private" />
              <Label htmlFor="visibility-private" className="font-normal">{t('private')}</Label>
            </div>
          </RadioGroup>
        </div>
      )}

      <Button type="submit" disabled={submitting || !answer.trim()} className="w-full">
        {submitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}