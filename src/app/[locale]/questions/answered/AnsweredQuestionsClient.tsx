'use client';

import { useState } from 'react';
import Link from 'next/link';

import {
  AnswerWithQuestion,
  Question,
} from '@/src/features/questions/types';

type QuestionGroup = {
  questionId: string;
  question: Question | null;
  answers: AnswerWithQuestion[];
};

type Props = {
  questions: QuestionGroup[];
  translations: {
    title: string;
    backToAllQuestions: string;
    empty: string;
    questionId: string;
    private: string;
    answeredOn: string;
    viewFullQuestion: string;
  };
};

export default function AnsweredQuestionsClient({
  questions,
  translations,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const questionsPerPage = 5;

  const totalQuestions = questions.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalQuestions / questionsPerPage)
  );

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;

  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {translations.title}
          </h1>

          <Link
            href="/questions"
            className="text-sm hover:underline"
          >
            {translations.backToAllQuestions}
          </Link>
        </div>

        {totalQuestions === 0 ? (
          <p className="text-center text-muted-foreground">
            {translations.empty}
          </p>
        ) : (
          <div className="space-y-6">
            {currentQuestions.map(
              ({ questionId, question, answers }) => (
                <div
                  key={questionId}
                  className="border rounded-lg p-6 bg-white dark:bg-gray-800"
                >
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {question?.text}
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {translations.questionId.replace(
                        '__ID__',
                        questionId
                      )}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {answers.map((answer) => (
                      <Link
                        key={answer.id}
                        href={`/answers/${answer.id}`}
                        className="block"
                      >
                        <div
                          className="border-l-2 border-indigo-500 pl-4"
                        >
                          <div className="prose prose-sm max-w-none">
                            {answer.answer_text}
                          </div>

                          {answer.visibility === 'private' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-2">
                              {translations.private}
                            </span>
                          )}

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {translations.answeredOn.replace(
                              '__DATE__',
                              new Date(
                                answer.created_at
                              ).toLocaleDateString()
                            )}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/questions/answered/${questionId}`}
                      className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {translations.viewFullQuestion}
                    </Link>
                  </div>
                </div>
              )
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center space-x-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(1, prev - 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  ‹
                </button>

                <span className="px-3 py-1.5 text-sm rounded bg-gray-100 dark:bg-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}