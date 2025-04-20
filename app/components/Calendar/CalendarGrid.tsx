'use client';

// react-aria
import { useCalendarGrid, useLocale } from 'react-aria';
import { CalendarState, RangeCalendarState } from 'react-stately';
// date
import { getWeeksInMonth, CalendarDate, endOfMonth, isSameMonth } from '@internationalized/date';
// our components
import CalendarCell, { HighlightRange } from './CalendarCell';
// styles
import styles from './calendar.module.css';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props<T extends CalendarState | RangeCalendarState> = {
  state: T;
  offset: number;
  highlightRanges: HighlightRange[];
  cellSize: number;
  dayOfWeekFontSize: string;
  fontSize: string;
};

/********************************************************************************************************************
 * calendar grid component with one month of days
 ********************************************************************************************************************/
export default function CalendarGrid<T extends CalendarState | RangeCalendarState>({
  state,
  offset,
  highlightRanges,
  cellSize,
  dayOfWeekFontSize,
  fontSize
}: Props<T>) {
  const { locale } = useLocale();

  // calculate how many weeks are in this month view
  const startDate = state.visibleRange.start.add({ months: offset });
  let endDate = endOfMonth(startDate);
  const weeksInMonth = getWeeksInMonth(startDate, locale);

  const { gridProps, headerProps, weekDays } = useCalendarGrid({ startDate, endDate }, state);

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <table {...gridProps} style={{ borderCollapse: 'collapse' }}>
      <thead {...headerProps} className={styles.dayOfWeek} style={{ fontSize: dayOfWeekFontSize }}>
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
                  cellSize={cellSize}
                  fontSize={fontSize}
                  startDate={startDate}
                  highlightRanges={highlightRanges}
                />
              ) : <td key={i} />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};