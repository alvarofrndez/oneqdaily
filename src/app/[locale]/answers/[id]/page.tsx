import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswerById } from '@/src/features/questions/queries';
import { getQuestionById } from '@/src/features/questions/queries';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function AnswerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id } = await params;
  const t = await getTranslations('Questions.AnswerDetail');

  const answerWithQuestion = await getAnswerById(id);

  if (!answerWithQuestion) {
    redirect(`/questions/answered`);
  }

  const { answer, question } = answerWithQuestion;

  if(answer.visibility !== 'public'){
    if (answer.user_id !== user?.id) {
      redirect(`/questions/answered`);
    }
  }
  

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex space-x-3">
            <Link
              href={`/questions/answered/${question.id}`}
              className="text-sm hover:underline"
            >
              {t('backToQuestionAnswers')}
            </Link>
            <Link
              href="/questions/answered"
              className="text-sm hover:underline"
            >
              {t('backToAnsweredList')}
            </Link>
          </div>
        </div>

        {!answerWithQuestion ? (
          <p className="text-center text-muted-foreground">
            {t('answerNotFound')}
          </p>
        ) : (
          <div className="space-y-6">
            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 mb-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('answerDetail')}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('forQuestion', { questionText: question.text })}
                  </p>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {t('postedOn', {
                    date: new Date(question.display_date).toLocaleDateString(),
                  })}
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t('yourAnswer')}
                </h3>
              </div>
              <div className="prose prose-lg max-w-none">
                {answer.answer_text}
              </div>

              {answer.visibility === 'private' && (
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t('private')}
                  </span>
                </div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                {t('answeredOn', {
                  date: new Date(answer.created_at).toLocaleDateString(),
                })}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}