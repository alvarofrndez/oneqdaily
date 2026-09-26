import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswerById } from '@/src/features/questions/queries';
import { setAnswerLike } from '@/src/features/questions/actions';
import LikeButton from '@/src/components/like-button';
import styles from './page.module.scss';
import { getLocale, getTranslations } from 'next-intl/server';
import { formatDateKey, formatInstant } from '@/lib/time';
import ShareAnswerCard from '@/src/components/ShareAnswerCard';
import { buildMetadata } from '@/lib/seo/metadata';
import { SITE_URL } from '@/lib/seo/config';
import { getAnswerCardImageUrl, truncateForCard } from '@/lib/share-card';
import { discussionForumPostingJsonLd } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/breadcrumb-data';
import { JsonLd } from '@/src/components/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations('Questions.AnswerDetail');

  const result = await getAnswerById(id);

  if (!result) {
    return buildMetadata({
      locale,
      path: `/answers/${id}`,
      title: t('answerNotFound'),
      description: t('answerNotFound'),
      noIndex: true,
    });
  }

  const { answer, question } = result;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isOwner = answer.user_id === user?.id;
  const isPublic = answer.visibility === 'public';

  if (!isPublic && !isOwner) {
    return buildMetadata({
      locale,
      path: `/answers/${id}`,
      title: t('answerNotFound'),
      description: t('answerNotFound'),
      noIndex: true,
    });
  }

  return buildMetadata({
    locale,
    path: `/answers/${id}`,
    title: t('forQuestion', { questionText: question.text }),
    description: truncateForCard(answer.answer_text, 200),
    ogImage: isPublic
      ? `${SITE_URL}${getAnswerCardImageUrl(id, 'landscape', locale)}`
      : undefined,
    noIndex: !isPublic,
  });
}

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
  const answerUrl = `${SITE_URL}/${locale}/answers/${answer.id}`;

  const discussionPosting =
    answer.visibility === 'public'
      ? discussionForumPostingJsonLd({
          url: answerUrl,
          headline: question.text,
          text: answer.answer_text,
          datePublished: answer.created_at,
          authorName: answer.profiles?.username ?? undefined,
        })
      : null;

  const breadcrumbs =
    answer.visibility === 'public'
      ? await buildBreadcrumbJsonLd(locale, `/answers/${answer.id}`)
      : null;

  return (
    <section className={styles.page}>
      <JsonLd data={discussionPosting} />
      <JsonLd data={breadcrumbs} />

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
          <p className={styles.text}>{answer.answer_text}</p>

          <div className={styles.answerMeta}>
            <span className={styles.answerDate}>
              {t('answeredOn', {
                date: formatInstant(answer.created_at, locale)
              })}
            </span>

            {answer.visibility === 'private' && (
              <span className={styles.badge}>{t('private')}</span>
            )}

            <div className={styles.actions}>
              {answer.visibility === 'public' && (
                <ShareAnswerCard
                  answerId={answer.id}
                  questionId={question.id}
                  answerText={answer.answer_text}
                />
              )}
              <div className={styles.likes}>
                <LikeButton
                  initialLiked={answer.liked_by_me ?? false}
                  initialCount={answer.likes_count ?? 0}
                  onToggle={setAnswerLike.bind(null, answer.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}