'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Question, Answer, InsertAnswer, AnswerWithQuestion } from './types'
import { ANSWER_SELECT, attachLikeState } from './answer-likes'
import { getAppDateKey } from '@/lib/time'

export async function getTodayQuestion(): Promise<Question | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('display_date', getAppDateKey())
    .maybeSingle()

  if (error) {
    console.error('Error fetching today\'s question:', error)
    return null
  }

  return data
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .lte('display_date', getAppDateKey())
    .maybeSingle()

  if (error) {
    console.error('Error fetching question:', error)
    return null
  }

  return data
}

export async function getAllQuestions(): Promise<Question[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .lte('display_date', getAppDateKey())
    .order('display_date', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return data as Question[]
}

const PAGE_SIZE = 10

export async function getAnswersPage(questionId: string): Promise<{ answers: Answer[]; hasMore: boolean }> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error, count } = await supabase
    .from('answers')
    .select(ANSWER_SELECT, { count: 'exact' })
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })
    .range(0, PAGE_SIZE - 1)

  if (error) {
    console.error('Error fetching answers:', error)
    return { answers: [], hasMore: false }
  }

  const answers = await attachLikeState(supabase, (data as Answer[]) ?? [], user?.id)
  const hasMore = count != null ? answers.length < count : answers.length === PAGE_SIZE

  return { answers, hasMore }
}

export async function getAnswersForQuestion(questionId: string): Promise<Answer[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('answers')
    .select('*')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching answers:', error)
    return []
  }

  return data as Answer[]
}

export async function createAnswer(answer: InsertAnswer): Promise<Answer | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('answers')
    .insert(answer)
    .select()
    .single()

  if (error) {
    console.error('Error creating answer:', error)
    return null
  }

  return data as Answer
}

export async function getAnswersByUser(userId: string): Promise<AnswerWithQuestion[]> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('answers')
    .select(`${ANSWER_SELECT}, questions(id, text, display_date)`)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user answers:', error)
    return []
  }

  return attachLikeState<AnswerWithQuestion>(
    supabase,
    (data ?? []) as unknown as AnswerWithQuestion[],
    user?.id
  )
}

export async function getAnswersByUserAndQuestion(
  userId: string,
  questionId: string
): Promise<Answer[]> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('answers')
    .select(ANSWER_SELECT)
    .eq('user_id', userId)
    .eq('question_id', questionId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching user answers for question:', error)
    return []
  }

  return attachLikeState(supabase, (data ?? []) as unknown as Answer[], user?.id)
}

export async function getAnswerById(
  id: string
): Promise<{ answer: Answer; question: Question } | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('answers')
    .select(`${ANSWER_SELECT}, questions(*)`)
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('Error fetching answer by ID:', error)
    return null
  }

  if (!data) return null

  const { questions, ...row } = data as unknown as Answer & { questions: Question | null }
  if (!questions) return null

  const [answer] = await attachLikeState(supabase, [row as Answer], user?.id)

  return { answer, question: questions }
}

export async function getPublicAnswerIds(): Promise<{ id: string; created_at: string }[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('answers')
    .select('id, created_at')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching public answer ids for sitemap:', error)
    return []
  }

  return data as { id: string; created_at: string }[]
}