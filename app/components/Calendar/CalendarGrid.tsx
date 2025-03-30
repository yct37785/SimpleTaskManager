'use client';

// react-aria
import { useCalendarGrid, useLocale } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
// others
import { getWeeksInMonth, CalendarDate, endOfMonth, isSameMonth } from '@internationalized/date';
// our components
import CalendarCell, { HighlightRange } from './CalendarCell';
// defines
import { calendar_header } from '@defines/styles';

type Props = {
  state: RangeCalendarState;
  offset: number;
  highlightRanges: HighlightRange[];
  cellSize: number;
  fontSize: string;
};

/**
 * calendar grid component with one month of days
 */
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
    <table {...gridProps} style={{ borderCollapse: 'collapse' }}>
      <thead {...headerProps} style={{ fontSize: '1.2rem', color: calendar_header }}>
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
                  startDate={startDate}
                  endDate={endDate}
                />
              ) : <td key={i} />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};