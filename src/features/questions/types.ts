export type Question = {
  id: string
  text: string
  created_at: string
}

export type Answer = {
  id: string
  question_id: string
  user_id: string | null
  answer_text: string
  created_at: string
}

export type InsertAnswer = {
  question_id: string
  user_id: string | null
  answer_text: string
}