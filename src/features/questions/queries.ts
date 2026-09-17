'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Question, Answer, InsertAnswer, AnswerWithQuestion } from './types'



export async function getTodayQuestion(): Promise<Question | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('display_date', new Date().toISOString().slice(0, 10))
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
    .order('display_date', { ascending: false })

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return data as Question[]
}

const PAGE_SIZE = 10

export async function getAnswersPage(
  questionId: string,
  page: number
): Promise<{ answers: Answer[]; hasMore: boolean }> {
  const supabase = await createSupabaseServerClient()
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data, error, count } = await supabase
    .from('answers')
    .select('*, profiles(username, avatar_url)', { count: 'exact' })
    .eq('question_id', questionId)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching answers:', error)
    return { answers: [], hasMore: false }
  }

  const answers = (data as Answer[]) ?? []
  const hasMore = count != null ? from + answers.length < count : answers.length === PAGE_SIZE

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
  const { data, error } = await supabase
    .from('answers')
    .select('*, questions(id, text)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user answers:', error)
    return []
  }

  return data as AnswerWithQuestion[]
}