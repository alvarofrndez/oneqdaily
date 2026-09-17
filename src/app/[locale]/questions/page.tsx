import Link from 'next/link';
import { getAllQuestions } from '@/features/questions/queries';
import type { Question } from '@/features/questions/types';

export default async function QuestionsPage() {
  const questions = await getAllQuestions();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">All Questions</h1>
        {questions.length === 0 ? (
          <p className="text-center text-gray-500">No questions available.</p>
        ) : (
          <ul className="space-y-4">
            {questions.map((q) => (
              <li key={q.id} className="border p-4 rounded-lg bg-white">
                <Link
                  href={`/questions/${q.id}`}
                  className="block hover:underline"
                >
                  <h2 className="text-xl font-semibold">{q.text}</h2>
                  <p className="text-sm text-gray-500">
                    Posted on {new Date(q.created_at).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}