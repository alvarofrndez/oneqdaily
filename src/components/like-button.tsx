'use client';

import { useContext, useOptimistic, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CornerDownLeft, Heart } from 'lucide-react';
import { UserContext } from './providers';
import styles from './like-button.module.scss';

export type LikeResult = { error?: string; liked?: boolean; count?: number };

type Props = {
  initialLiked: boolean;
  initialCount: number;
  /** Recibe el estado deseado. Debe ser idempotente en el servidor. */
  onToggle: (nextLiked: boolean) => Promise<LikeResult>;
  onError?: (message: string) => void;
};

type LikeState = { liked: boolean; count: number };

export default function LikeButton({ initialLiked, initialCount, onToggle, onError }: Props) {
  const t = useTranslations('Like');
  const router = useRouter();
  const user = useContext(UserContext);
  const [state, setState] = useState<LikeState>({ liked: initialLiked, count: initialCount });
  const [optimistic, setOptimistic] = useOptimistic(state, (_current, next: LikeState) => next);
  const [pending, startTransition] = useTransition();

  function handleClick(event: React.MouseEvent) {
    event.stopPropagation();

    if (pending) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const nextLiked = !optimistic.liked;
    const nextCount = Math.max(0, optimistic.count + (nextLiked ? 1 : -1));

    startTransition(async () => {
      setOptimistic({ liked: nextLiked, count: nextCount });

      const result = await onToggle(nextLiked);

      if (result.error) {
        onError?.(result.error);
        return;
      }

      startTransition(() => {
        setState({
          liked: result.liked ?? nextLiked,
          count: result.count ?? nextCount,
        });
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={optimistic.liked}
      aria-busy={pending}
      aria-label={t(optimistic.liked ? 'unlike' : 'like', { count: optimistic.count })}
      className={`${styles.like} ${optimistic.liked ? styles.liked : ''} ${pending ? styles.pending : ''}`}
    >
      <Heart size={14} className={styles.icon} aria-hidden />
      <span className={styles.count}>{optimistic.count}</span>
    </button>
  );
}