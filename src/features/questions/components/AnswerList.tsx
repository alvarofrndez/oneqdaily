'use client';

import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase/client';
import { UserContext } from '@/src/components/providers';
import type { Answer } from '../types';
import { Card, CardContent } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/button';
import { Badge } from '@/src/components/ui/badge';
import { Skeleton } from '@/src/components/ui/skeleton';

const PAGE_SIZE = 10;

type Props = {
  questionId: string;
  initialAnswers?: Answer[];
  initialHasMore?: boolean;
};

export default function AnswerList({ questionId, initialAnswers, initialHasMore }: Props) {
  const t = useTranslations('Questions.AnswerList');
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
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {answers.length === 0 ? (
        <p className="text-center text-muted-foreground">{t('empty')}</p>
      ) : (
        answers.map((answer) => (
          <Card key={answer.id}>
            <CardContent className="pt-6">
              <p className="text-card-foreground">{answer.answer_text}</p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-3">
                <span>{answer.profiles?.username || t('anonymous')}</span>
                <span>{new Date(answer.created_at).toLocaleString()}</span>
                {answer.visibility === 'private' && answer.user_id === currentUser?.id && (
                  <Badge variant="secondary">{t('privateBadge')}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      {hasMore && (
        <div className="text-center pt-2">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? t('loadingMore') : t('loadMore')}
          </Button>
        </div>
      )}
    </div>
  );
}