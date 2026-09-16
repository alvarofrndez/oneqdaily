import { createSupabaseServerClient } from '@/lib/supabase/server'
import type { Question, Answer, InsertAnswer } from './types'

export async function getTodayQuestion(): Promise<Question | null> {
  const supabase = await createSupabaseServerClient()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .gte('created_at', today.toISOString())
    .lt('created_at', tomorrow.toISOString())
    .order('created_at', { ascending: true })
    .limit(1)

  if (error) {
    console.error('Error fetching today\'s question:', error)
    return null
  }

  if (data.length === 0) {
    // Fallback: return the first question if no question for today
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(1)

    if (fallbackError) {
      console.error('Error fetching fallback question:', fallbackError)
      return null
    }

    return fallbackData[0] ?? null
  }

  return data[0]
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return null
  }

  return data as Question
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

export async function getAllQuestions(): Promise<Question[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching questions:', error)
    return []
  }

  return data as Question[]
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