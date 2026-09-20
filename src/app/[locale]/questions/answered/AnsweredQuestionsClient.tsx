'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Heart } from 'lucide-react';

import {
	AnswerWithQuestion,
	Question,
} from '@/src/features/questions/types';

import styles from './AnsweredQuestionsClient.module.scss';

type QuestionGroup = {
	questionId: string;
	question: Question | null;
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
		likes: string;
	};
};

export default function AnsweredQuestionsClient({
	questions,
	translations,
}: Props) {
	const [currentPage, setCurrentPage] = useState(1);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

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

	const toggleQuestion = (questionId: string) => {
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
		setExpandedIds(new Set(currentQuestions.map((q) => q.questionId)));
	};

	const collapseAll = () => {
		setExpandedIds(new Set());
	};

	return (
		<section className={styles.page}>
			<div className={styles.container}>
				<header className={styles.header}>
					<div className={styles.actions}>
						<button
							type="button"
							className={styles.actionButton}
							onClick={expandAll}
						>
							{translations.expandAll}
						</button>

						<button
							type="button"
							className={styles.actionButton}
							onClick={collapseAll}
						>
							{translations.collapseAll}
						</button>
					</div>

					<Link href="/questions" className={styles.backLink}>
						{translations.backToAllQuestions}
					</Link>
				</header>

				{totalQuestions === 0 ? (
					<p className={styles.empty}>{translations.empty}</p>
				) : (
					<div className={styles.list}>
						{currentQuestions.map(
							({ questionId, question, answers }) => {
								const isExpanded = expandedIds.has(questionId);

								return (
									<div key={questionId} className={styles.group}>
										<button
											type="button"
											className={styles.groupHeader}
											onClick={() => toggleQuestion(questionId)}
											aria-expanded={isExpanded}
										>
											<span className={styles.questionText}>
												{question?.text}
											</span>

											<span className={styles.questionDate}>
												{question?.display_date &&
													new Date(question.display_date).toLocaleDateString()}
											</span>

											<ChevronDown
												size={16}
												className={`${styles.toggle} ${
													isExpanded ? styles.expandedToggle : ''
												}`}
											/>
										</button>

										<div
											className={`${styles.answersWrapper} ${
												isExpanded ? styles.expandedWrapper : ''
											}`}
										>
											<div className={styles.answersInner}>
												<div className={styles.answers}>
													{answers.map((answer) => (
														<Link
															key={answer.id}
															href={`/answers/${answer.id}`}
															className={styles.answer}
														>
															<div 
																className={styles.answerText}
																dangerouslySetInnerHTML={{ __html: answer.answer_text }}
															/>

															<div className={styles.answerMeta}>
																<span className={styles.answerDate}>
																	{translations.answeredOn.replace(
																		'__DATE__',
																		new Date(
																			answer.created_at
																		).toLocaleDateString()
																	)}
																</span>

                                								{answer.visibility === 'private' && (
																	<span className={styles.badge}>
																		{translations.private}
																	</span>
																)}

																<span
																	className={styles.likes}
																	aria-label={translations.likes}
																>
																	<Heart size={14} />
																	{/*answer.likes_count ??*/ 0}
																</span>
															</div>
														</Link>
													))}
												</div>

												<div className={styles.groupFooter}>
													<Link
														href={`/questions/answered/${questionId}`}
														className={styles.viewFullLink}
													>
														{translations.viewFullQuestion}
													</Link>
												</div>
											</div>
										</div>
									</div>
								);
							}
						)}

						{totalPages > 1 && (
							<div className={styles.pagination}>
								<button
									type="button"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.max(1, prev - 1)
										)
									}
									disabled={currentPage === 1}
									className={styles.paginationButton}
								>
									‹
								</button>

								<span className={styles.paginationInfo}>
									Page {currentPage} of {totalPages}
								</span>

								<button
									type="button"
									onClick={() =>
										setCurrentPage((prev) =>
											Math.min(totalPages, prev + 1)
										)
									}
									disabled={currentPage === totalPages}
									className={styles.paginationButton}
								>
									›
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}