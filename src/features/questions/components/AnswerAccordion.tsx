'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

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
	const t = useTranslations('Questions.Detail');

	const [isExpanded, setIsExpanded] = useState(false);

	const toggle = () => {
		setIsExpanded((prev) => !prev);
	};

	useEffect(() => {
		if(initialAnswers.length === 0) toggle()
	}, [])

	return (
		<div className={styles.answersContainer}>
			<div
				className={styles.answersContainerTitle}
				onClick={toggle}
			>
				<h3 className={styles.title}>{t('answersTitle')}</h3>

				<ChevronRight
					size={18}
					className={`${styles.toggle} ${
						isExpanded ? styles.expandedToggle : ''
					}`}
				/>
			</div>

			<div
				className={`${styles.answersWrapper} ${
					isExpanded ? styles.expandedWrapper : ''
				}`}
			>
				<div className={styles.answersInner}>
					<AnswerList
						questionId={questionId}
						initialAnswers={initialAnswers}
						initialHasMore={initialHasMore}
					/>
				</div>
			</div>
		</div>
	);
}