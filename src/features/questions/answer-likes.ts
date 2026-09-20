import type { SupabaseClient } from '@supabase/supabase-js'
import type { Answer } from './types'

/** Select para añadir al de answers: trae el número de likes */
export const ANSWER_SELECT = '*, profiles(username, avatar_url), answer_likes(count)'

type WithLikeCount<T> = T & { answer_likes?: { count: number }[] }

export async function attachLikeState<T extends Answer = Answer>(
  client: SupabaseClient,
  rows: WithLikeCount<T>[],
  userId?: string
): Promise<T[]> {
  let likedIds = new Set<string>()

  if (userId && rows.length > 0) {
    const { data, error } = await client
      .from('answer_likes')
      .select('answer_id')
      .eq('user_id', userId)
      .in('answer_id', rows.map((row) => row.id))

    if (error) {
      console.error('Error fetching liked answers:', error)
    } else {
      likedIds = new Set((data ?? []).map((row) => row.answer_id as string))
    }
  }

  return rows.map((row) => {
    const { answer_likes, ...answer } = row
    return {
      ...answer,
      likes_count: answer_likes?.[0]?.count ?? 0,
      liked_by_me: likedIds.has(row.id),
    } as unknown as T
  })
}