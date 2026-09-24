'use client';

import {
    useEffect,
    useId,
    useState,
} from 'react';

import { useTranslations } from 'next-intl';

import {
    ChevronRight,
} from 'lucide-react';

import AnswerList from './AnswerList';

import type { Answer } from '../types';

import styles from './AnswerAccordion.module.scss';

type Props = {
    questionId: string;
    initialAnswers: Answer[];
    initialHasMore: boolean;
};

export default function AnswerAccordion({
    questionId,
    initialAnswers,
    initialHasMore,
}: Props) {
    const t = useTranslations(
        'Questions.Detail'
    );

    const [isExpanded, setIsExpanded] =
        useState(false);

    const answersId = useId();

    useEffect(() => {
        if (initialAnswers.length === 0) {
            setIsExpanded(true);
        }
    }, [initialAnswers.length]);

    return (
        <section
            className={
                styles.answersContainer
            }
            aria-labelledby={`${answersId}-title`}
        >
            <button
                type="button"
                className={
                    styles.answersContainerTitle
                }
                onClick={() =>
                    setIsExpanded(
                        (prev) => !prev
                    )
                }
                aria-expanded={isExpanded}
                aria-controls={
                    answersId
                }
            >
                <h2
                    id={`${answersId}-title`}
                    className={
                        styles.title
                    }
                >
                    {t('answersTitle')}
                </h2>

                <ChevronRight
                    size={18}
                    strokeWidth={1.8}
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
            </button>

            <div
                id={answersId}
                className={`
                    ${styles.answersWrapper}
                    ${
                        isExpanded
                            ? styles.expandedWrapper
                            : ''
                    }
                `}
                aria-hidden={!isExpanded}
            >
                <div
                    className={
                        styles.answersInner
                    }
                >
                    <AnswerList
                        questionId={
                            questionId
                        }
                        initialAnswers={
                            initialAnswers
                        }
                        initialHasMore={
                            initialHasMore
                        }
                    />
                </div>
            </div>
        </section>
    );
}