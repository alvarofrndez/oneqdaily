export type Question = {
  id: string
  text: string
  created_at: string
}

export type AnswerProfile = {
  username: string | null
  avatar_url: string | null
}

export type Answer = {
  id: string
  question_id: string
  user_id: string | null
  answer_text: string
  created_at: string
  profiles: AnswerProfile | null
}

export type InsertAnswer = {
  question_id: string
  user_id: string | null
  answer_text: string
}