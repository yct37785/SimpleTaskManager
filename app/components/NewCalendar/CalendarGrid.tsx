'use client';

import { useCalendarGrid } from 'react-aria';
import { getWeeksInMonth } from '@internationalized/date';
import { useLocale } from 'react-aria';
import CalendarCell from './CalendarCell';
import styles from './Calendar.module.css';

type HighlightRange = {
  start: Date;
  end: Date;
  color: string;
};

type Props = {
  state: any;
  offset: number; // for month shifting
  highlightRanges: HighlightRange[];
  cellSize: number;
  fontSize: string;
};

export default function CalendarGrid({
  state,
  offset,
  highlightRanges,
  cellSize,
  fontSize
}: Props) {
  const { locale } = useLocale();

  // Get props for this calendar grid
  const { gridProps, headerProps, weekDays } = useCalendarGrid({}, state);

  // Calculate how many weeks are in this month view
  const visibleStart = state.visibleRange.start.add({ months: offset });
  const weeksInMonth = getWeeksInMonth(visibleStart, locale);

  return (
    <table {...gridProps} className={styles.calendarTable}>
      <thead {...headerProps} className={styles.calendarGridHeader}>
        <tr>
          {weekDays.map((day, i) => (
            <th key={i}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex).map((date: any, i: number) =>
              date ? (
                <CalendarCell
                  key={i}
                  state={state}
                  date={date}
                  highlightRanges={highlightRanges}
                  cellSize={cellSize}
                  fontSize={fontSize}
                />
              ) : <td key={i} />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};