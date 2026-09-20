'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { UserContext } from '@/src/components/providers';
import type { Answer } from '../types';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Skeleton } from '@/src/components/ui/skeleton';
import { Heart } from 'lucide-react';
import styles from './AnswerList.module.scss';

const PAGE_SIZE = 10;

type Props = {
  questionId: string;
  initialAnswers?: Answer[];
  initialHasMore?: boolean;
};

const formatRelativeTime = (dateString: string, t: any) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes || 1}m ${t('ago')}`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ${t('ago')}`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ${t('ago')}`;
};

export default function AnswerList({ questionId, initialAnswers, initialHasMore }: Props) {
  const t = useTranslations('Questions.AnswerList');
  const router = useRouter();
  const currentUser = useContext(UserContext);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers ?? []);
  const [hasMore, setHasMore] = useState(initialHasMore ?? true);
  const [loading, setLoading] = useState(initialAnswers === undefined);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPage = useCallback(async (from: number) => {
    const to = from + PAGE_SIZE - 1;
    const { data, error, count } = await supabase
      .from('answers')
      .select('*, profiles(username, avatar_url)', { count: 'exact' })
      .eq('question_id', questionId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching answers:', error);
      return { answers: [] as Answer[], hasMore: false };
    }

    const page = (data as Answer[]) ?? [];
    const more = count != null ? from + page.length < count : page.length === PAGE_SIZE;
    return { answers: page, hasMore: more };
  }, [questionId]);

  useEffect(() => {
    if (initialAnswers !== undefined) return;
    let active = true;
    fetchPage(0).then(({ answers: page, hasMore: more }) => {
      if (!active) return;
      setAnswers(page);
      setHasMore(more);
      setLoading(false);
    });
    return () => { active = false; };
  }, [fetchPage, initialAnswers]);

  useEffect(() => {
    const channel = supabase
      .channel(`answers-${questionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'answers', filter: `question_id=eq.${questionId}` },
        async (payload) => {
          const newId = (payload.new as { id: string }).id;
          const { data } = await supabase
            .from('answers')
            .select('*, profiles(username, avatar_url)')
            .eq('id', newId)
            .single();

          if (data) {
            setAnswers((prev) => (prev.some((a) => a.id === data.id) ? prev : [data as Answer, ...prev]));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [questionId]);

  async function loadMore() {
    setLoadingMore(true);
    const { answers: page, hasMore: more } = await fetchPage(answers.length);
    setAnswers((prev) => [...prev, ...page]);
    setHasMore(more);
    setLoadingMore(false);
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
      </div>
    );
  }

  return (
    <div className={styles.listContainer}>
      {answers.length === 0 ? (
        <p className={styles.empty}>{t('empty')}</p>
      ) : (
        answers.map((answer) => (
          <div 
            key={answer.id} 
            className={styles.answerItem}
            onClick={() => router.push(`/answers/${answer.id}`)}
          >
            
            <div className={styles.header}>
              <div className={styles.meta}>
                <span className={styles.author}>
                  {answer.profiles?.username || t('anonymous')}
                </span>
                <span className={styles.dot}>·</span>
                <span className={styles.time}>
                  {formatRelativeTime(answer.created_at, t)}
                </span>
                
                {answer.visibility === 'private' && answer.user_id === currentUser?.id && (
                  <div className={styles.badge}>{t('privateBadge')}</div>
                )}
              </div>

              <button 
                className={styles.likeAction}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Heart className={styles.heartIcon} />
                <span>{/* answer.likes_count ?? */ 0}</span>
              </button>
            </div>

            <div
              className={styles.answerText}
              dangerouslySetInnerHTML={{ __html: answer.answer_text }}
            />
          </div>
        ))
      )}

      {hasMore && (
        <div className={styles.loadMore}>
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? t('loadingMore') : t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}