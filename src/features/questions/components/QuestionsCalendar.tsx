'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { useLocale, useTranslations } from 'next-intl';

import {
    ArrowLeft,
    ArrowRight,
    CalendarDays,
    List,
} from 'lucide-react';

import styles from './QuestionsCalendar.module.scss';
import { useServerNow } from '@/src/components/server-clock';
import { getAppDateKey, getNextDayStart } from '@/lib/time';

type CalendarQuestion = {
    id: string;
    text: string;
    display_date: string;
};

type QuestionsCalendarProps = {
    questions: CalendarQuestion[];
    today: string;
};

type MobileView = 'day' | 'list';

const WEEK_DAYS = Array.from({ length: 7 }, (_, index) => {
    return new Date(2024, 0, index + 1);
});

function getDateKey(value: string | Date) {
    if (typeof value === 'string') return value.slice(0, 10);

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function fromDateKey(key: string) {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
}

function getCalendarDays(
    year: number,
    month: number,
    maxDate: Date
) {
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = (firstDayOfMonth.getDay() + 6) % 7;

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const totalCells =
        Math.ceil((startDay + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, index) => {
        const dayNumber = index - startDay + 1;

        if (
            dayNumber < 1 ||
            dayNumber > daysInMonth
        ) {
            return null;
        }

        const date = new Date(
            year,
            month,
            dayNumber
        );

        // No mostramos fechas posteriores a mañana.
        if (date > maxDate) {
            return null;
        }

        return date;
    });
}

function isSameMonth(
    dateA: Date,
    dateB: Date
) {
    return (
        dateA.getFullYear() === dateB.getFullYear() &&
        dateA.getMonth() === dateB.getMonth()
    );
}

function isMonthBefore(
    dateA: Date,
    dateB: Date
) {
    return (
        dateA.getFullYear() < dateB.getFullYear() ||
        (
            dateA.getFullYear() === dateB.getFullYear() &&
            dateA.getMonth() < dateB.getMonth()
        )
    );
}

function formatCountdown(milliseconds: number) {
    if (milliseconds === null) return '--:--:--';

    const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));

    const hours = Math.floor(
        totalSeconds / 3600
    );

    const minutes = Math.floor(
        (totalSeconds % 3600) / 60
    );

    const seconds = totalSeconds % 60;

    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0'),
    ].join(':');
}

export default function QuestionsCalendar({
    questions,
    today: initialToday,
}: QuestionsCalendarProps) {
    const locale = useLocale();
    const t = useTranslations('Questions.Calendar');

    // Reloj del servidor. Hasta que el cliente monta (null) se usa el día que
    // mandó el servidor, así el primer render coincide con el SSR.
    const serverNow = useServerNow();
    const todayKey =
        serverNow === null ? initialToday : getAppDateKey(serverNow);

    const today = fromDateKey(todayKey);

    const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
    );

    const [currentMonth, setCurrentMonth] = useState(() => {
        const initial = fromDateKey(initialToday);
        return new Date(initial.getFullYear(), initial.getMonth(), 1);
    });

    const [mobileView, setMobileView] =
        useState<MobileView>('day');

    const [selectedDate, setSelectedDate] =
        useState(() => fromDateKey(initialToday));

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const calendarDays = useMemo(
        () =>
            getCalendarDays(
                year,
                month,
                tomorrow
            ),
        [
            year,
            month,
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate(),
        ]
    );

    const visibleMonthDays = useMemo(() => {
        return calendarDays.filter(
            (date): date is Date => date !== null
        );
    }, [calendarDays]);

    const questionsByDate = useMemo(() => {
        const groupedQuestions = new Map<
            string,
            CalendarQuestion[]
        >();

        questions.forEach((question) => {
            const dateKey = getDateKey(
                question.display_date
            );

            const currentQuestions =
                groupedQuestions.get(dateKey) ?? [];

            groupedQuestions.set(dateKey, [
                ...currentQuestions,
                question,
            ]);
        });

        return groupedQuestions;
    }, [questions]);

    const monthLabel = new Intl.DateTimeFormat(
        locale,
        {
            month: 'long',
            year: 'numeric',
        }
    ).format(currentMonth);

    const selectedDayLabel =
        new Intl.DateTimeFormat(locale, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(selectedDate);

    const weekDayLabels = WEEK_DAYS.map((date) =>
        new Intl.DateTimeFormat(locale, {
            weekday: 'short',
        }).format(date)
    );

    const isToday = (date: Date) =>
        getDateKey(date) === getDateKey(today);

    const isTomorrow = (date: Date) =>
        getDateKey(date) === getDateKey(tomorrow);

    const isSelectedDate = (date: Date) =>
        getDateKey(date) === getDateKey(selectedDate);

    const tomorrowCountdown =
        serverNow === null ? null : getNextDayStart(serverNow) - serverNow;

    const canGoNextMonth = isMonthBefore(
        currentMonth,
        tomorrow
    );

    const goToPreviousMonth = () => {
        setCurrentMonth(
            new Date(year, month - 1, 1)
        );
    };

    const goToNextMonth = () => {
        if (!canGoNextMonth) {
            return;
        }

        setCurrentMonth(
            new Date(year, month + 1, 1)
        );
    };

    const goToPreviousDay = () => {
        setSelectedDate(
            new Date(
                selectedDate.getFullYear(),
                selectedDate.getMonth(),
                selectedDate.getDate() - 1
            )
        );
    };

    const goToNextDay = () => {
        const nextDate = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate() + 1
        );

        if (nextDate > tomorrow) {
            return;
        }

        setSelectedDate(nextDate);
    };

    const canGoNextDay =
        selectedDate < tomorrow;

    const changeMobileView = (
        view: MobileView
    ) => {
        setMobileView(view);

        if (view === 'day') {
            if (
                isSameMonth(
                    currentMonth,
                    today
                )
            ) {
                setSelectedDate(
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        today.getDate()
                    )
                );

                return;
            }

            const firstVisibleDay =
                visibleMonthDays[0];

            if (firstVisibleDay) {
                setSelectedDate(
                    firstVisibleDay
                );
            }
        }
    };

    const handleMobileMonthPrevious =
        () => {
            const previousMonth = new Date(
                year,
                month - 1,
                1
            );

            setCurrentMonth(previousMonth);

            if (
                mobileView === 'day'
            ) {
                setSelectedDate(
                    previousMonth
                );
            }
        };

    const handleMobileMonthNext = () => {
        if (!canGoNextMonth) {
            return;
        }

        const nextMonth = new Date(
            year,
            month + 1,
            1
        );

        setCurrentMonth(nextMonth);

        if (
            mobileView === 'day'
        ) {
            const firstVisibleDay =
                getCalendarDays(
                    nextMonth.getFullYear(),
                    nextMonth.getMonth(),
                    tomorrow
                ).find(
                    (date): date is Date =>
                        date !== null
                );

            if (firstVisibleDay) {
                setSelectedDate(
                    firstVisibleDay
                );
            }
        }
    };

    const selectedDateKey =
        getDateKey(selectedDate);

    const selectedDayQuestions =
        questionsByDate.get(
            selectedDateKey
        ) ?? [];

    return (
        <section
            className={styles.calendar}
            aria-label={t('title')}
        >
            {/* -------------------------------------------------
                DESKTOP / TABLET
            ------------------------------------------------- */}

            <div className={styles.desktopCalendar}>
                <header className={styles.header}>
                    <div className={styles.navigation}>
                        <button
                            type="button"
                            className={styles.navigationButton}
                            onClick={
                                goToPreviousMonth
                            }
                            aria-label={t(
                                'previousMonth'
                            )}
                        >
                            <ArrowLeft size={14} />
                        </button>

                        <h2
                            className={
                                styles.month
                            }
                        >
                            {monthLabel}
                        </h2>

                        <button
                            type="button"
                            className={styles.navigationButton}
                            onClick={
                                goToNextMonth
                            }
                            disabled={
                                !canGoNextMonth
                            }
                            aria-label={t(
                                'nextMonth'
                            )}
                        >
                            <ArrowRight size={14} />
                        </button>
                    </div>

                    <div
                        className={styles.actions}
                    >
                        <Link
                            href="/"
                            className={
                                styles.link
                            }
                        >
                            {t('goBack')}
                        </Link>
                    </div>
                </header>

                <div
                    className={
                        styles.weekDays
                    }
                >
                    {weekDayLabels.map(
                        (day) => (
                            <div
                                key={day}
                                className={
                                    styles.weekDay
                                }
                            >
                                {day}
                            </div>
                        )
                    )}
                </div>

                <div
                    className={styles.grid}
                >
                    {calendarDays.map(
                        (date, index) => {
                            if (!date) {
                                return (
                                    <div
                                        key={`empty-${index}`}
                                        className={
                                            styles.dayCellEmpty
                                        }
                                        aria-hidden="true"
                                    />
                                );
                            }

                            const dateKey =
                                getDateKey(
                                    date
                                );

                            const dayQuestions =
                                questionsByDate.get(
                                    dateKey
                                ) ?? [];

                            const dateIsToday =
                                isToday(date);

                            const dateIsTomorrow =
                                isTomorrow(date);

                            return (
                                <div
                                    key={dateKey}
                                    className={`
                                        ${styles.dayCell}
                                        ${
                                            dateIsToday
                                                ? styles.today
                                                : ''
                                        }
                                        ${
                                            dateIsTomorrow
                                                ? styles.lockedDay
                                                : ''
                                        }
                                    `.trim()}
                                >
                                    <div
                                        className={
                                            styles.dayNumber
                                        }
                                    >
                                        <span
                                            className={
                                                styles.number
                                            }
                                        >
                                            {date.getDate()}
                                        </span>

                                        {dateIsToday ? (
                                            <span
                                                className={
                                                    styles.badge
                                                }
                                            />
                                        ) : null}
                                    </div>

                                    {dateIsTomorrow ? (
                                        <div
                                            className={
                                                styles.countdown
                                            }
                                        >
                                            <span
                                                className={
                                                    styles.countdownLabel
                                                }
                                            >
                                                {t(
                                                    'unlocksIn'
                                                )}
                                            </span>

                                            <span
                                                className={
                                                    styles.countdownTime
                                                }
                                            >
                                                {formatCountdown(
                                                    tomorrowCountdown
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <div
                                            className={
                                                styles.questions
                                            }
                                        >
                                            {dayQuestions.map(
                                                (
                                                    question
                                                ) => (
                                                    <Link
                                                        key={
                                                            question.id
                                                        }
                                                        href={`/questions/${question.id}`}
                                                        className={
                                                            styles.question
                                                        }
                                                    >
                                                        {
                                                            question.text
                                                        }
                                                    </Link>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            </div>

            {/* -------------------------------------------------
                MOBILE
            ------------------------------------------------- */}

            <div className={styles.mobileCalendar}>
                <div
                    className={
                        styles.mobileToolbar
                    }
                >
                    <div
                        className={
                            styles.mobileViewSwitch
                        }
                        role="group"
                        aria-label={t(
                            'viewMode'
                        )}
                    >
                        <button
                            type="button"
                            className={
                                mobileView ===
                                'day'
                                    ? styles.active
                                    : ''
                            }
                            aria-pressed={
                                mobileView ===
                                'day'
                            }
                            onClick={() =>
                                changeMobileView(
                                    'day'
                                )
                            }
                        >
                            <CalendarDays
                                size={15}
                                aria-hidden="true"
                            />
                            <span>
                                {t(
                                    'dayView'
                                )}
                            </span>
                        </button>

                        <button
                            type="button"
                            className={
                                mobileView ===
                                'list'
                                    ? styles.active
                                    : ''
                            }
                            aria-pressed={
                                mobileView ===
                                'list'
                            }
                            onClick={() =>
                                changeMobileView(
                                    'list'
                                )
                            }
                        >
                            <List
                                size={15}
                                aria-hidden="true"
                            />
                            <span>
                                {t(
                                    'listView'
                                )}
                            </span>
                        </button>
                    </div>

                    <Link
                        href="/"
                        className={
                            styles.mobileBack
                        }
                    >
                        {t('goBack')}
                    </Link>
                </div>

                {mobileView === 'day' ? (
                    <div
                        className={
                            styles.mobileDayView
                        }
                    >
                        <header
                            className={
                                styles.mobileHeader
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.navigationButton
                                }
                                onClick={
                                    goToPreviousDay
                                }
                                aria-label={
                                    t(
                                        'previousDay'
                                    )
                                }
                            >
                                <ArrowLeft
                                    size={16}
                                />
                            </button>

                            <div
                                className={
                                    styles.mobileDate
                                }
                            >
                                <span>
                                    {selectedDayLabel}
                                </span>

                                {isToday(
                                    selectedDate
                                ) && (
                                    <span
                                        className={
                                            styles.mobileToday
                                        }
                                    >
                                        {t(
                                            'today'
                                        )}
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.navigationButton
                                }
                                onClick={
                                    goToNextDay
                                }
                                disabled={
                                    !canGoNextDay
                                }
                                aria-label={
                                    t(
                                        'nextDay'
                                    )
                                }
                            >
                                <ArrowRight
                                    size={16}
                                />
                            </button>
                        </header>

                        {isTomorrow(
                            selectedDate
                        ) ? (
                            <div
                                className={
                                    styles.mobileCountdown
                                }
                            >
                                <span>
                                    {t(
                                        'unlocksIn'
                                    )}
                                </span>

                                <strong>
                                    {formatCountdown(
                                        tomorrowCountdown
                                    )}
                                </strong>
                            </div>
                        ) : selectedDayQuestions.length >
                          0 ? (
                            <div
                                className={
                                    styles.mobileQuestions
                                }
                            >
                                {selectedDayQuestions.map(
                                    (
                                        question
                                    ) => (
                                        <Link
                                            key={
                                                question.id
                                            }
                                            href={`/questions/${question.id}`}
                                            className={
                                                styles.mobileQuestion
                                            }
                                        >
                                            {
                                                question.text
                                            }
                                        </Link>
                                    )
                                )}
                            </div>
                        ) : (
                            <div
                                className={
                                    styles.emptyDay
                                }
                            >
                                {t(
                                    'noQuestions'
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div
                        className={
                            styles.mobileListView
                        }
                    >
                        <header
                            className={
                                styles.mobileHeader
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.navigationButton
                                }
                                onClick={
                                    handleMobileMonthPrevious
                                }
                                aria-label={
                                    t(
                                        'previousMonth'
                                    )
                                }
                            >
                                <ArrowLeft
                                    size={16}
                                />
                            </button>

                            <h2
                                className={
                                    styles.month
                                }
                            >
                                {monthLabel}
                            </h2>

                            <button
                                type="button"
                                className={
                                    styles.navigationButton
                                }
                                onClick={
                                    handleMobileMonthNext
                                }
                                disabled={
                                    !canGoNextMonth
                                }
                                aria-label={
                                    t(
                                        'nextMonth'
                                    )
                                }
                            >
                                <ArrowRight
                                    size={16}
                                />
                            </button>
                        </header>

                        <div
                            className={
                                styles.inlineDays
                            }
                        >
                            {visibleMonthDays.map(
                                (date) => {
                                    const dateKey =
                                        getDateKey(
                                            date
                                        );

                                    const dayQuestions =
                                        questionsByDate.get(
                                            dateKey
                                        ) ?? [];

                                    const dateIsToday =
                                        isToday(date);

                                    const dateIsTomorrow =
                                        isTomorrow(
                                            date
                                        );

                                    return (
                                        <article
                                            key={
                                                dateKey
                                            }
                                            className={`
                                                ${
                                                    styles.inlineDay
                                                }
                                                ${
                                                    dateIsToday
                                                        ? styles.today
                                                        : ''
                                                }
                                            `.trim()}
                                        >
                                            <div
                                                className={
                                                    styles.inlineDate
                                                }
                                            >
                                                <span
                                                    className={
                                                        styles.inlineWeekDay
                                                    }
                                                >
                                                    {new Intl.DateTimeFormat(
                                                        locale,
                                                        {
                                                            weekday:
                                                                'short',
                                                        }
                                                    ).format(
                                                        date
                                                    )}
                                                </span>

                                                <span
                                                    className={
                                                        styles.inlineNumber
                                                    }
                                                >
                                                    {
                                                        date.getDate()
                                                    }
                                                </span>

                                                {dateIsToday && (
                                                    <span
                                                        className={
                                                            styles.badge
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div
                                                className={
                                                    styles.inlineQuestions
                                                }
                                            >
                                                {dateIsTomorrow ? (
                                                    <div
                                                        className={
                                                            styles.mobileCountdown
                                                        }
                                                    >
                                                        <span>
                                                            {t(
                                                                'unlocksIn'
                                                            )}
                                                        </span>

                                                        <strong>
                                                            {formatCountdown(
                                                                tomorrowCountdown
                                                            )}
                                                        </strong>
                                                    </div>
                                                ) : dayQuestions.length >
                                                  0 ? (
                                                    dayQuestions.map(
                                                        (
                                                            question
                                                        ) => (
                                                            <Link
                                                                key={
                                                                    question.id
                                                                }
                                                                href={`/questions/${question.id}`}
                                                                className={
                                                                    styles.mobileQuestion
                                                                }
                                                            >
                                                                {
                                                                    question.text
                                                                }
                                                            </Link>
                                                        )
                                                    )
                                                ) : (
                                                    <span
                                                        className={
                                                            styles.noQuestionsInline
                                                        }
                                                    >
                                                        {t(
                                                            'noQuestions'
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}