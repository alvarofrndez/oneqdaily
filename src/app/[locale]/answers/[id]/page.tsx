import { notFound, redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswerById } from '@/src/features/questions/queries';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import styles from './page.module.scss';
import { Heart } from 'lucide-react';

export default async function AnswerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id } = await params;
  const t = await getTranslations('Questions.AnswerDetail');

  const answerWithQuestion = await getAnswerById(id);

  if (!answerWithQuestion) {
    redirect('/questions/answered');
  }

  const { answer, question } = answerWithQuestion;

  if(!answer || !question){
    return notFound
  }

  if (answer.visibility !== 'public') {
    if (answer.user_id !== user?.id) {
      redirect('/questions/answered');
    }
  }

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.info}>
            <div className={styles.user}>
              {t('postedBy', {
                username: answer.profiles?.username ?? 'anonymous',
              })}
            </div>
            
            <div className={styles.navigation}>
              {
                answer.user_id === user?.id ?
                  <Link
                    href='/questions/answered'
                    className={styles.link}
                  >
                    {t('backToAnsweredList')}
                  </Link>
                  
                :
                  null
              }
              
              <Link
                href={`/questions/${question.id}`}
                className={styles.link}
              >
                {t('backToQuestion')}
              </Link>
            </div>
          </div>

          <div className={styles.question}>
            <p className={styles.questionText}>
              {question.text}
            </p>
            <div className={styles.questionDate}>
              {t('postedOn', {
                date: new Date(
                  question.display_date,
                ).toLocaleDateString(),
              })}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{
              __html: answer.answer_text,
            }}
          />

          <div className={styles.answerMeta}>
            <span className={styles.answerDate}>
              {t('answeredOn', {
                date: new Date(
                  answer.created_at,
                ).toLocaleDateString(),
              })}
            </span>

            {answer.visibility === 'private' && (
              <span className={styles.badge}>
                {answer.visibility === 'private' && (
                    <span className={styles.privateBadge}>
                      {t('private')}
                    </span>
                )}
              </span>
            )}

            <span
              className={styles.likes}
              aria-label={t('likes')}
            >
              <Heart size={14} />
              {/*answer.likes_count ??*/ 0}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}