'use client';

import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { Answer } from '../types';

const PAGE_SIZE = 10;

type Props = {
  questionId: string;
  initialAnswers?: Answer[];
  initialHasMore?: boolean;
};

export default function AnswerList({ questionId, initialAnswers, initialHasMore }: Props) {
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

  // Carga inicial solo si no vino precargada desde el servidor
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

  // Respuestas nuevas en vivo: se añaden arriba del todo
  useEffect(() => {
    const channel = supabase
      .channel(`answers-${questionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'answers', filter: `question_id=eq.${questionId}` },
        async (payload) => {
          const newId = (payload.new as { id: string }).id;
          // El payload de realtime no trae el join a profiles; lo pedimos aparte
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

  if (loading) return <p>Loading answers...</p>;

  return (
    <div className="space-y-4">
      {answers.length === 0 ? (
        <p className="text-center text-gray-500">No answers yet. Be the first to respond!</p>
      ) : (
        answers.map((answer) => (
          <div key={answer.id} className="border p-4 rounded-lg">
            <p className="text-gray-700">{answer.answer_text}</p>
            <div className="flex items-center text-sm text-gray-500 mt-2">
              {answer.profiles?.username ? (
                <span>{answer.profiles.username}</span>
              ) : (
                <span>Anónimo</span>
              )}
              <span className="ml-4">{new Date(answer.created_at).toLocaleString()}</span>
            </div>
          </div>
        ))
      )}

      {hasMore && (
        <div className="text-center pt-2">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {loadingMore ? 'Cargando...' : 'Cargar más'}
          </button>
        </div>
      )}
    </div>
  );
}