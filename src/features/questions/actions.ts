'use server'

import { createAnswer } from './queries'
import type { InsertAnswer, AnswerVisibility } from './types'
import { getTranslations } from 'next-intl/server'

export async function submitAnswer(formData: FormData) {
  const questionId = formData.get('questionId') as string
  const answerText = formData.get('answerText') as string
  const requestedVisibility = formData.get('visibility') as string

  const t = await getTranslations('Questions.errors')

  if (!questionId || !answerText || answerText.trim() === '') {
    return { error: t('invalidInput') }
  }

  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  const userId = user?.id ?? null
  const visibility: AnswerVisibility =
    userId && requestedVisibility === 'private' ? 'private' : 'public'

  const newAnswer: InsertAnswer = {
    question_id: questionId,
    user_id: userId,
    answer_text: answerText.trim(),
    visibility,
  }

  const createdAnswer = await createAnswer(newAnswer)

  if (!createdAnswer) {
    return { error: t('submitFailed') }
  }

  return { success: true, answer: createdAnswer }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function setAnswerLike(
  answerId: string,
  liked: boolean
): Promise<{ error?: string; liked?: boolean; count?: number }> {
  if (typeof answerId !== 'string' || !UUID_RE.test(answerId) || typeof liked !== 'boolean') {
    return { error: 'Invalid input' }
  }

  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'unauthorized' }

  const { error } = liked
    ? await supabase
        .from('answer_likes')
        .upsert(
          { answer_id: answerId, user_id: user.id },
          { onConflict: 'answer_id,user_id', ignoreDuplicates: true }
        )
    : await supabase
        .from('answer_likes')
        .delete()
        .eq('answer_id', answerId)
        .eq('user_id', user.id)

  if (error) {
    console.error('Error updating like:', error)
    return { error: 'Failed to update like' }
  }

  const { count, error: countError } = await supabase
    .from('answer_likes')
    .select('*', { count: 'exact', head: true })
    .eq('answer_id', answerId)

  if (countError) {
    console.error('Error counting likes:', countError)
    return { liked }
  }

  return { liked, count: count ?? 0 }
}