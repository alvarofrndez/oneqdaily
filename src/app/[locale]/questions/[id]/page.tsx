import { getQuestionById, getAnswersPage } from '@/src/features/questions/queries'
import AnswerList from '@/src/features/questions/components/AnswerList'
import AnswerForm from '@/src/features/questions/components/AnswerForm'
import Link from 'next/link'

export default async function QuestionDetailPage({ params }: { params: { id: string } }) {
  const question = await getQuestionById(params.id)

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

  const { answers, hasMore } = await getAnswersPage(question.id, 0)

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold">Question</h1>
          <Link href="/questions" className="text-sm text-indigo-600 hover:underline">
            ← Back to all questions
          </Link>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">{question.text}</h2>
          <p className="text-gray-500">
            Posted on {new Date(question.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="mb-6">
          <AnswerForm questionId={question.id} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Answers</h2>
          <AnswerList questionId={question.id} initialAnswers={answers} initialHasMore={hasMore} />
        </div>
      </div>
    </main>
  )
}