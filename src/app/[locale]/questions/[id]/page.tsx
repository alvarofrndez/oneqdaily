import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';

import { ArrowLeft } from 'lucide-react';

import {
    getQuestionById,
    getAnswersPage,
} from '@/src/features/questions/queries';

import AnswerAccordion from '@/src/features/questions/components/AnswerAccordion';
import AnswerForm from '@/src/features/questions/components/AnswerForm';

import styles from './page.module.scss';
import { formatDateKey } from '@/lib/time';
import { buildMetadata } from '@/lib/seo/metadata';
import { qaPageJsonLd } from '@/lib/seo/json-ld';
import { buildBreadcrumbJsonLd } from '@/lib/seo/breadcrumb-data';
import { JsonLd } from '@/src/components/JsonLd';
import { SITE_URL } from '@/lib/seo/config';

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const { id } = await params;
    const locale = await getLocale();
    const t = await getTranslations('Questions.Detail');

    const question = await getQuestionById(id);

    if (!question) {
        return buildMetadata({
            locale,
            path: `/questions/${id}`,
            title: t('notFound'),
            description: t('notFound'),
            noIndex: true,
        });
    }

    return buildMetadata({
        locale,
        path: `/questions/${id}`,
        title: question.text,
        description: t('meta.description', { question: question.text }),
    });
}

export default async function QuestionDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { id } = await params;

    const locale = await getLocale();

    const question = await getQuestionById(id);

    const t = await getTranslations(
        'Questions.Detail'
    );

    if (!question) {
        return (
            <main className={styles.page}>
                <div className={styles.container}>
                    <div
                        className={
                            styles.notFound
                        }
                    >
                        <p
                            className={
                                styles.notFoundMessage
                            }
                        >
                            {t('notFound')}
                        </p>

                        <Link
                            href="/questions"
                            className={
                                styles.backLink
                            }
                        >
                            <ArrowLeft
                                size={15}
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                            <span>
                                {t('back')}
                            </span>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const {
        answers,
        hasMore,
    } = await getAnswersPage(question.id);

    const questionUrl = `${SITE_URL}/${locale}/questions/${question.id}`;

    const qaPage = qaPageJsonLd({
        url: questionUrl,
        questionText: question.text,
        datePublished: question.created_at,
        answers: answers
            .filter((answer) => answer.visibility === 'public')
            .map((answer) => ({
                text: answer.answer_text,
                datePublished: answer.created_at,
                authorName: answer.profiles?.username ?? undefined,
            })),
    });

    const breadcrumbs = await buildBreadcrumbJsonLd(locale, `/questions/${question.id}`);

    return (
        <main className={styles.page}>
            <JsonLd data={qaPage} />
            <JsonLd data={breadcrumbs} />

            <div className={styles.container}>
                <section
                    className={
                        styles.questionCard
                    }
                    aria-labelledby="question-title"
                >
                    <div className={styles.info}>
                        <p
                            className={
                                styles.questionDate
                            }
                        >
                            {t('postedOn', {
                                date: formatDateKey(question.display_date, locale),
                            })}
                        </p>
                    </div>

                    <div
                        className={
                            styles.questionHeader
                        }
                    >
                        <h1
                            id="question-title"
                            className={
                                styles.question
                            }
                        >
                            {question.text}
                        </h1>
                    </div>

                    <div
                        className={
                            styles.answerForm
                        }
                    >
                        <AnswerForm
                            questionId={
                                question.id
                            }
                        />
                    </div>
                </section>

                <AnswerAccordion
                    questionId={question.id}
                    initialAnswers={answers}
                    initialHasMore={hasMore}
                />
            </div>
        </main>
    );
}