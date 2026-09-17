import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getAnswersByUser } from '@/src/features/questions/queries';
import {
  AnswerWithQuestion,
  Question,
} from '@/src/features/questions/types';

import AnsweredQuestionsClient from './AnsweredQuestionsClient';

export default async function AnsweredQuestionsPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const answersWithQuestions = await getAnswersByUser(user.id);
  const t = await getTranslations('Questions.AnsweredQuestions');

  // Group answers by question
  const answersByQuestion = answersWithQuestions.reduce(
    (
      acc,
      answer
    ) => {
      const questionId = answer.questions?.id;

      if (!questionId) {
        return acc;
      }

      if (!acc[questionId]) {
        acc[questionId] = {
          question: answer.questions,
          answers: [],
        };
      }

      acc[questionId].answers.push(answer);

      return acc;
    },
    {} as Record<
      string,
      {
        question: Question | null;
        answers: AnswerWithQuestion[];
      }
    >
  );

  // Convert to array for easier pagination
  const questionsArray = Object.entries(answersByQuestion).map(
    ([questionId, { question, answers }]) => ({
      questionId,
      question,
      answers,
    })
  );

  return (
    <AnsweredQuestionsClient
      questions={questionsArray}
      translations={{
        title: t('title'),
        backToAllQuestions: t('backToAllQuestions'),
        empty: t('empty'),
        questionId: t('questionId', { id: '__ID__' }),
        private: t('private'),
        answeredOn: t('answeredOn', { date: '__DATE__' }),
        viewFullQuestion: t('viewFullQuestion'),
      }}
    />
  );
}