import { getAllQuestions } from '@/src/features/questions/queries';
import { getTranslations } from 'next-intl/server';
import QuestionsCalendar from '@/src/features/questions/components/QuestionsCalendar';
import styles from './page.module.scss';
import { getAppDateKey } from '@/lib/time';

export default async function QuestionsPage() {
  const questions = await getAllQuestions();
  const t = await getTranslations('Questions.AllQuestions');

  const calendarQuestions = questions.map((question) => ({
    id: question.id,
    text: question.text,
    display_date: question.display_date,
  }));

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        {questions.length === 0 ? (
          <p className={styles.empty}>
            {t('empty')}
          </p>
        ) : (
          <QuestionsCalendar questions={calendarQuestions} today={getAppDateKey()} />
        )}
      </div>
    </section>
  );
}