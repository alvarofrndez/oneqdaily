import { getQuestionById } from '@/features/questions/queries'
import { getAnswersForQuestion } from '@/features/questions/queries'
import type { Question, Answer } from '@/features/questions/types'
import Link from 'next/link'

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const question = await getQuestionById(params.id)
  const answers = await getAnswersForQuestion(params.id)

  if (!question) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">Question not found.</p>
          <Link href="/questions" className="text-indigo-600 hover:underline">
            ← Back to all questions
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Question</h1>
          <Link
            href="/questions"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to all questions
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
          <p className="text-gray-500">
            Posted on {new Date(question.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Answers ({answers.length})</h2>
          {answers.length === 0 ? (
            <p className="text-center text-gray-500">No answers yet.</p>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <div key={answer.id} className="border p-4 rounded-lg bg-white">
                  <p className="text-gray-700">{answer.answer_text}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    {answer.user_id ? (
                      <span>Answered by a user</span>
                    ) : (
                      <span>Anonymous</span>
                    )}
                    <span className="ml-4">
                      {new Date(answer.created_at).toLocaleString()}
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}