'use client';

import { useState } from 'react';

import Link from 'next/link';

import {
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    ExternalLink,
} from 'lucide-react';

import {
    AnswerWithQuestion,
    QuestionSummary,
} from '@/src/features/questions/types';

import { setAnswerLike } from '@/src/features/questions/actions';

import LikeButton from '@/src/components/like-button';

import styles from './AnsweredQuestionsClient.module.scss';

type QuestionGroup = {
    questionId: string;
    question: QuestionSummary | null;
    answers: AnswerWithQuestion[];
};

type Props = {
    questions: QuestionGroup[];
    translations: {
        backToAllQuestions: string;
        empty: string;
        private: string;
        answeredOn: string;
        viewFullQuestion: string;
        expandAll: string;
        collapseAll: string;
    };
};

export default function AnsweredQuestionsClient({
    questions,
    translations,
}: Props) {
    const [currentPage, setCurrentPage] =
        useState(1);

    const [expandedIds, setExpandedIds] =
        useState<Set<string>>(new Set());

    const questionsPerPage = 5;

    const totalQuestions =
        questions.length;

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalQuestions /
                questionsPerPage
        )
    );

    const indexOfLastQuestion =
        currentPage * questionsPerPage;

    const indexOfFirstQuestion =
        indexOfLastQuestion -
        questionsPerPage;

    const currentQuestions =
        questions.slice(
            indexOfFirstQuestion,
            indexOfLastQuestion
        );

    const toggleQuestion = (
        questionId: string
    ) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);

            if (next.has(questionId)) {
                next.delete(questionId);
            } else {
                next.add(questionId);
            }

            return next;
        });
    };

    const expandAll = () => {
        setExpandedIds(
            new Set(
                currentQuestions.map(
                    (question) =>
                        question.questionId
                )
            )
        );
    };

    const collapseAll = () => {
        setExpandedIds(new Set());
    };

    const goToPreviousPage = () => {
        setCurrentPage((prev) =>
            Math.max(1, prev - 1)
        );
    };

    const goToNextPage = () => {
        setCurrentPage((prev) =>
            Math.min(
                totalPages,
                prev + 1
            )
        );
    };

    return (
        <section
            className={styles.page}
        >
            <div
                className={styles.container}
            >
                <header
                    className={styles.header}
                >
                    <div
                        className={
                            styles.actions
                        }
                    >
                        <button
                            type="button"
                            className={
                                styles.actionButton
                            }
                            onClick={expandAll}
                        >
                            {translations.expandAll}
                        </button>

                        <button
                            type="button"
                            className={
                                styles.actionButton
                            }
                            onClick={
                                collapseAll
                            }
                        >
                            {
                                translations.collapseAll
                            }
                        </button>
                    </div>

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
                            {
                                translations.backToAllQuestions
                            }
                        </span>
                    </Link>
                </header>

                {totalQuestions === 0 ? (
                    <p
                        className={
                            styles.empty
                        }
                    >
                        {
                            translations.empty
                        }
                    </p>
                ) : (
                    <div
                        className={styles.list}
                    >
                        {currentQuestions.map(
                            ({
                                questionId,
                                question,
                                answers,
                            }) => {
                                const isExpanded =
                                    expandedIds.has(
                                        questionId
                                    );

                                return (
                                    <article
                                        key={
                                            questionId
                                        }
                                        className={
                                            styles.group
                                        }
                                    >
                                        <button
                                            type="button"
                                            className={
                                                styles.groupHeader
                                            }
                                            onClick={() =>
                                                toggleQuestion(
                                                    questionId
                                                )
                                            }
                                            aria-expanded={
                                                isExpanded
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.questionContent
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.questionText
                                                    }
                                                >
                                                    {
                                                        question?.text
                                                    }
                                                </span>

                                                {question?.display_date && (
                                                    <span
                                                        className={
                                                            styles.questionDate
                                                        }
                                                    >
                                                        {new Date(
                                                            question.display_date
                                                        ).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </span>

                                            <span
                                                className={
                                                    styles.toggleWrapper
                                                }
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    strokeWidth={
                                                        1.8
                                                    }
                                                    aria-hidden="true"
                                                    className={`
                                                        ${styles.toggle}
                                                        ${
                                                            isExpanded
                                                                ? styles.expandedToggle
                                                                : ''
                                                        }
                                                    `}
                                                />
                                            </span>
                                        </button>

                                        <div
                                            className={`
                                                ${styles.answersWrapper}
                                                ${
                                                    isExpanded
                                                        ? styles.expandedWrapper
                                                        : ''
                                                }
                                            `}
                                        >
                                            <div
                                                className={
                                                    styles.answersInner
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles.answers
                                                    }
                                                >
                                                    {answers.map(
                                                        (
                                                            answer
                                                        ) => (
                                                            <article
                                                                key={
                                                                    answer.id
                                                                }
                                                                className={
                                                                    styles.answer
                                                                }
                                                            >
                                                                <Link
                                                                    href={`/answers/${answer.id}`}
                                                                    className={
                                                                        styles.answerLink
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.answerText
                                                                        }
                                                                        dangerouslySetInnerHTML={{
                                                                            __html:
                                                                                answer.answer_text,
                                                                        }}
                                                                    />
                                                                </Link>

                                                                <div
                                                                    className={
                                                                        styles.answerMeta
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles.answerMetaInfo
                                                                        }
                                                                    >
                                                                        <span
                                                                            className={
                                                                                styles.answerDate
                                                                            }
                                                                        >
                                                                            {translations.answeredOn.replace(
                                                                                '__DATE__',
                                                                                new Date(
                                                                                    answer.created_at
                                                                                ).toLocaleDateString()
                                                                            )}
                                                                        </span>

                                                                        {answer.visibility ===
                                                                            'private' && (
                                                                            <span
                                                                                className={
                                                                                    styles.badge
                                                                                }
                                                                            >
                                                                                {
                                                                                    translations.private
                                                                                }
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    <span
                                                                        className={
                                                                            styles.likes
                                                                        }
                                                                    >
                                                                        <LikeButton
                                                                            initialLiked={
                                                                                answer.liked_by_me ??
                                                                                false
                                                                            }
                                                                            initialCount={
                                                                                answer.likes_count ??
                                                                                0
                                                                            }
                                                                            onToggle={(
                                                                                nextLiked
                                                                            ) =>
                                                                                setAnswerLike(
                                                                                    answer.id,
                                                                                    nextLiked
                                                                                )
                                                                            }
                                                                        />
                                                                    </span>
                                                                </div>
                                                            </article>
                                                        )
                                                    )}
                                                </div>

                                                <div
                                                    className={
                                                        styles.groupFooter
                                                    }
                                                >
                                                    <Link
                                                        href={`/questions/${questionId}`}
                                                        className={
                                                            styles.viewFullLink
                                                        }
                                                    >
                                                        <span>
                                                            {
                                                                translations.viewFullQuestion
                                                            }
                                                        </span>

                                                        <ExternalLink
                                                            size={
                                                                14
                                                            }
                                                            strokeWidth={
                                                                1.8
                                                            }
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                );
                            }
                        )}

                        {totalPages > 1 && (
                            <nav
                                className={
                                    styles.pagination
                                }
                                aria-label="Pagination"
                            >
                                <button
                                    type="button"
                                    onClick={
                                        goToPreviousPage
                                    }
                                    disabled={
                                        currentPage ===
                                        1
                                    }
                                    className={
                                        styles.paginationButton
                                    }
                                    aria-label="Previous page"
                                >
                                    <ArrowLeft
                                        size={15}
                                        strokeWidth={
                                            1.8
                                        }
                                        aria-hidden="true"
                                    />
                                </button>

                                <span
                                    className={
                                        styles.paginationInfo
                                    }
                                >
                                    Page{' '}
                                    {
                                        currentPage
                                    }{' '}
                                    of{' '}
                                    {
                                        totalPages
                                    }
                                </span>

                                <button
                                    type="button"
                                    onClick={
                                        goToNextPage
                                    }
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    className={
                                        styles.paginationButton
                                    }
                                    aria-label="Next page"
                                >
                                    <ArrowRight
                                        size={15}
                                        strokeWidth={
                                            1.8
                                        }
                                        aria-hidden="true"
                                    />
                                </button>
                            </nav>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}