'use client';

import { useCalendarGrid } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
import { getWeeksInMonth, CalendarDate, endOfMonth } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import CalendarCell from './CalendarCell';
import styles from './Calendar.module.css';

type HighlightRange = {
  start: Date;
  end: Date;
  color: string;
};

type Props = {
  state: RangeCalendarState;
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

  // calculate how many weeks are in this month view
  const startDate = state.visibleRange.start.add({ months: offset });
  let endDate = endOfMonth(startDate);
  const weeksInMonth = getWeeksInMonth(startDate, locale);

  const { gridProps, headerProps, weekDays } = useCalendarGrid({ startDate, endDate }, state);

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
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state.getDatesInWeek(weekIndex, startDate).map((date: CalendarDate | null, i: number) =>
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