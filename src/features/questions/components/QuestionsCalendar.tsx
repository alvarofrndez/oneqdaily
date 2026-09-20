'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, Lock } from 'lucide-react';

import styles from './QuestionsCalendar.module.scss';

type CalendarQuestion = {
	id: string;
	text: string;
	display_date: string;
};

type QuestionsCalendarProps = {
	questions: CalendarQuestion[];
};

const WEEK_DAYS = Array.from({ length: 7 }, (_, index) => {
	return new Date(2024, 0, index + 1);
});

function getDateKey(value: string | Date) {
	const date = value instanceof Date ? value : new Date(value);

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function getCalendarDays(year: number, month: number, maxDate: Date) {
	const firstDayOfMonth = new Date(year, month, 1);
	const startDay = (firstDayOfMonth.getDay() + 6) % 7;
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

	return Array.from({ length: totalCells }, (_, index) => {
		const dayNumber = index - startDay + 1;

		if (dayNumber < 1 || dayNumber > daysInMonth) {
			return null;
		}

		const date = new Date(year, month, dayNumber);

		// No mostramos fechas posteriores a mañana.
		if (date > maxDate) {
			return null;
		}

		return date;
	});
}

function isSameMonth(dateA: Date, dateB: Date) {
	return (
		dateA.getFullYear() === dateB.getFullYear() &&
		dateA.getMonth() === dateB.getMonth()
	);
}

function isMonthBefore(dateA: Date, dateB: Date) {
	return (
		dateA.getFullYear() < dateB.getFullYear() ||
		(dateA.getFullYear() === dateB.getFullYear() &&
			dateA.getMonth() < dateB.getMonth())
	);
}

function formatCountdown(milliseconds: number) {
	const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return [
		String(hours).padStart(2, '0'),
		String(minutes).padStart(2, '0'),
		String(seconds).padStart(2, '0'),
	].join(':');
}

export default function QuestionsCalendar({ questions }: QuestionsCalendarProps) {
	const locale = useLocale();
	const t = useTranslations('Questions.Calendar');

	const [now, setNow] = useState(() => new Date());
	const [currentMonth, setCurrentMonth] = useState(
		() => new Date(now.getFullYear(), now.getMonth(), 1)
	);

	useEffect(() => {
		const interval = window.setInterval(() => {
			setNow(new Date());
		}, 1000);

		return () => {
			window.clearInterval(interval);
		};
	}, []);

	const today = now;
	const tomorrow = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate() + 1
	);

	const year = currentMonth.getFullYear();
	const month = currentMonth.getMonth();

	const calendarDays = useMemo(
		() => getCalendarDays(year, month, tomorrow),
		[year, month, tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()]
	);

	const questionsByDate = useMemo(() => {
		const groupedQuestions = new Map<string, CalendarQuestion[]>();

		questions.forEach((question) => {
			const dateKey = getDateKey(question.display_date);
			const currentQuestions = groupedQuestions.get(dateKey) ?? [];

			groupedQuestions.set(dateKey, [...currentQuestions, question]);
		});

		return groupedQuestions;
	}, [questions]);

	const monthLabel = new Intl.DateTimeFormat(locale, {
		month: 'long',
		year: 'numeric',
	}).format(currentMonth);

	const weekDayLabels = WEEK_DAYS.map((date) =>
		new Intl.DateTimeFormat(locale, {
			weekday: 'short',
		}).format(date)
	);

	const goToPreviousMonth = () => {
		setCurrentMonth(new Date(year, month - 1, 1));
	};

	const goToNextMonth = () => {
		if (
			currentMonth.getFullYear() > tomorrow.getFullYear() ||
			(currentMonth.getFullYear() === tomorrow.getFullYear() &&
				currentMonth.getMonth() >= tomorrow.getMonth())
		) {
			return;
		}

		setCurrentMonth(new Date(year, month + 1, 1));
	};

	const canGoNext = isMonthBefore(currentMonth, tomorrow);
	const isTomorrow = (date: Date) => getDateKey(date) === getDateKey(tomorrow);
	const isToday = (date: Date) => getDateKey(date) === getDateKey(today);
	const tomorrowCountdown = tomorrow.getTime() - now.getTime();

	return (
		<section className={styles.calendar} aria-label={t('title')}>
			<header className={styles.header}>
				<div className={styles.navigation}>
					<button
						type="button"
						className={styles.navigationButton}
						onClick={goToPreviousMonth}
						aria-label={t('previousMonth')}
					>
						<ArrowLeft size={14} />
					</button>

					<h2 className={styles.month}>{monthLabel}</h2>

					<button
						type="button"
						className={styles.navigationButton}
						onClick={goToNextMonth}
						disabled={!canGoNext}
						aria-label={t('nextMonth')}
					>
						<ArrowRight size={14} />
					</button>
				</div>

				<div className={styles.actions}>
					<Link href="/" className={styles.link}>
						{t('goBack')}
					</Link>
				</div>
			</header>

			<div className={styles.weekDays}>
				{weekDayLabels.map((day) => (
					<div key={day} className={styles.weekDay}>
						{day}
					</div>
				))}
			</div>

			<div className={styles.grid}>
				{calendarDays.map((date, index) => {
					if (!date) {
						return (
							<div
								key={`empty-${index}`}
								className={styles.dayCellEmpty}
								aria-hidden="true"
							/>
						);
					}

					const dateKey = getDateKey(date);
					const dayQuestions = questionsByDate.get(dateKey) ?? [];
					const dateIsToday = isToday(date);
					const dateIsTomorrow = isTomorrow(date);

					return (
						<div
							key={dateKey}
							className={`${styles.dayCell} ${dateIsToday ? styles.today : ''} ${
								dateIsTomorrow ? styles.lockedDay : ''
							}`.trim()}
						>
							<div className={styles.dayNumber}>
								<span className={styles.number}>{date.getDate()}</span>
								{
									dateIsToday ?
										<span className={styles.badge}></span>
									:
										null
								}
							</div>

							{dateIsTomorrow ? (
								<div className={styles.countdown}>
									<span className={styles.countdownLabel}>{t('unlocksIn')}</span>
									<span className={styles.countdownTime}>
										{formatCountdown(tomorrowCountdown)}
									</span>
								</div>
							) : (
								<div className={styles.questions}>
									{dayQuestions.map((question) => (
										<Link
											key={question.id}
											href={`/questions/${question.id}`}
											className={styles.question}
										>
											{question.text}
										</Link>
									))}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</section>
	);
}