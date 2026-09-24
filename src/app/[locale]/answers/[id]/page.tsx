import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswerById } from '@/src/features/questions/queries';
import { setAnswerLike } from '@/src/features/questions/actions';
import LikeButton from '@/src/components/like-button';
import styles from './page.module.scss';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatDateKey, formatInstant } from '@/lib/time';

export default async function AnswerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id } = await params;
  const t = await getTranslations('Questions.AnswerDetail');
  const locale = await getLocale();

  const answerWithQuestion = await getAnswerById(id);

  if (!answerWithQuestion) {
    redirect('/questions/answered');
  }

  const { answer, question } = answerWithQuestion;

  if (!answer || !question) {
    notFound();
  }

  if (answer.visibility !== 'public' && answer.user_id !== user?.id) {
    redirect('/questions/answered');
  }

  const isOwner = answer.user_id === user?.id;

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
              {isOwner && (
                <Link href="/questions/answered" className={styles.link}>
                  {t('backToAnsweredList')}
                </Link>
              )}

              <Link href={`/questions/${question.id}`} className={styles.link}>
                {t('backToQuestion')}
              </Link>
            </div>
          </div>

          <div className={styles.question}>
            <p className={styles.questionText}>{question.text}</p>
            <div className={styles.questionDate}>
              {t('postedOn', {
                date: formatDateKey(question.display_date, locale),
              })}
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: answer.answer_text }}
          />

          <div className={styles.answerMeta}>
            <span className={styles.answerDate}>
              {t('answeredOn', {
                date: formatInstant(answer.created_at, locale)
              })}
            </span>

            {answer.visibility === 'private' && (
              <span className={styles.badge}>{t('private')}</span>
            )}

            <span className={styles.likes}>
              <LikeButton
                initialLiked={answer.liked_by_me ?? false}
                initialCount={answer.likes_count ?? 0}
                onToggle={setAnswerLike.bind(null, answer.id)}
              />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}