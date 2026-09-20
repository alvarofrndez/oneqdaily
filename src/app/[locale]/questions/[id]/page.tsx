import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import {
	getQuestionById,
	getAnswersPage,
} from '@/src/features/questions/queries';

import AnswerAccordion from '@/src/features/questions/components/AnswerAccordion';
import AnswerForm from '@/src/features/questions/components/AnswerForm';

import styles from './page.module.scss';

export default async function QuestionDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const { id } = await params;

	const question = await getQuestionById(id);

	const t = await getTranslations('Questions.Detail');

	if (!question) {
		return (
			<main className={styles.page}>
				<div className={styles.container}>
					<div className={styles.notFound}>
						<p className={styles.notFoundMessage}>
							{t('notFound')}
						</p>

						<Link
							href="/questions"
							className={styles.backLink}
						>
							{t('back')}
						</Link>
					</div>
				</div>
			</main>
		);
	}

	const { answers, hasMore } = await getAnswersPage(
		question.id,
		0
	);

	return (
		<main className={styles.page}>
			<div className={styles.container}>
				<section className={styles.questionCard}>
					<div className={styles.questionHeader}>
						<h1 className={styles.question}>
							{question.text}
						</h1>
					</div>

					<div className={styles.info}>
						<p className={styles.questionDate}>
							{t('postedOn', {
								date: new Date(
									question.display_date
								).toLocaleDateString(),
							})}
						</p>

						<Link
							href="/questions"
							className={styles.backLink}
						>
							{t('back')}
						</Link>
					</div>

					<div className={styles.answerForm}>
						<AnswerForm questionId={question.id} />
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