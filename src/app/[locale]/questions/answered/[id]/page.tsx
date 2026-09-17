import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getQuestionById } from '@/src/features/questions/queries';
import { getAnswersByUserAndQuestion } from '@/src/features/questions/queries';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function AnsweredQuestionPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login');
  }

  const { id }= await params;
  const t = await getTranslations('Questions.AnsweredQuestion');

  // Fetch the question details
  const question = await getQuestionById(id);

  // If question doesn't exist, redirect to 404 or answered questions list
  if (!question) {
    redirect(`/questions/answered`);
  }

  // Fetch only the current user's answers for this question
  const userAnswers = await getAnswersByUserAndQuestion(user.id, id);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex space-x-3">
            <Link
              href="/questions/answered"
              className="text-sm hover:underline"
            >
              {t('backToAnsweredList')}
            </Link>
          </div>
        </div>

        {!question ? (
          <p className="text-center text-muted-foreground">
            {t('questionNotFound')}
          </p>
        ) : (
          <div className="space-y-6">
            {/* Question header */}
            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {question.text}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {t('postedOn', {
                  date: new Date(question.display_date).toLocaleDateString(),
                })}
              </p>
            </div>

            {/* User's answers to this question */}
            {userAnswers.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t('noAnswersYet')}
              </p>
            ) : (
              <div className="space-y-4">
                {userAnswers.map((answer) => (
              <Link
                key={answer.id}
                href={`/answers/${answer.id}`}
                className="block"
              >
                <div className="border-l-2 border-indigo-500 pl-4">
                  <div className="prose prose-sm max-w-none">
                    {answer.answer_text}
                  </div>
                  {answer.visibility === 'private' && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
                      {t('private')}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {t('answeredOn', {
                      date: new Date(answer.created_at).toLocaleDateString(),
                    })}
                  </p>
                </div>
              </Link>
            ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
