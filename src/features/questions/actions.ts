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