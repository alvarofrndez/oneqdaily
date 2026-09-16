'use server'

import { createAnswer } from './queries'
import type { InsertAnswer } from './types'

export async function submitAnswer(formData: FormData) {
  const questionId = formData.get('questionId') as string
  const answerText = formData.get('answerText') as string

  // Basic validation
  if (!questionId || !answerText || answerText.trim() === '') {
    return { error: 'Invalid input' }
  }

  // Determine user_id: we need to get the current user session.
  // For simplicity, we'll rely on the supabase client to get the user.
  // However, in a server action we don't have direct access to cookies.
  // We'll need to create a supabase server client inside this action.
  // We'll import createSupabaseServerClient and get the user.
  // But we can also pass user_id via a hidden field if we have the session on the client.
  // Better approach: on the client, we can get the session and pass user_id as a form field.
  // However, for anonymity, we can allow null user_id.
  // We'll implement getting the user from supabase inside the action.

  const { createSupabaseServerClient } = await import('@/lib/supabase/server')
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const userId = user?.id ?? null

  const newAnswer: InsertAnswer = {
    question_id: questionId,
    user_id: userId,
    answer_text: answerText.trim(),
  }

  const createdAnswer = await createAnswer(newAnswer)

  if (!createdAnswer) {
    return { error: 'Failed to submit answer' }
  }

  return { success: true, answer: createdAnswer }
}