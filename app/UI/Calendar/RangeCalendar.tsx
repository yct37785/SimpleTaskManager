'use client';

import { useRef, useEffect } from 'react';
// react-aria
import { useRangeCalendar, useLocale } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
// MUI
import { Box } from '@mui/material';
// utils
import { createCalendar, today, getLocalTimeZone, CalendarDate, toCalendarDate } from '@internationalized/date';
// our components
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { HighlightRange } from './CalendarCell';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  cellSize?: number;
  dayOfWeekFontSize?: string;
  fontSize?: string;
  highlightRanges?: HighlightRange[];
  onSelect?: (start: CalendarDate, end: CalendarDate) => void;
};

/********************************************************************************************************************
 * range calendar component
 ********************************************************************************************************************/
export default function RangeCalendar({
  cellSize = 40,
  dayOfWeekFontSize = '1.2rem',
  fontSize = '1rem',
  highlightRanges = [],
  onSelect = () => {}
}: Props) {
  let { locale } = useLocale();
  const ref = useRef(null);

  const state = useRangeCalendarState({
    minValue: today(getLocalTimeZone()),
    visibleDuration: { months: 2 },
    pageBehavior: 'single',
    locale,
    createCalendar,
  });

  const {
    calendarProps,
    prevButtonProps,
    nextButtonProps,
    title
  } = useRangeCalendar({ minValue: today(getLocalTimeZone()) }, state, ref);

  /******************************************************************************************************************
   * listener
   ******************************************************************************************************************/
  useEffect(() => {
    const range = state.value;
    if (!range || !range.start || !range.end) return;
  
    onSelect(
      toCalendarDate(range.start),
      toCalendarDate(range.end)
    );
  }, [state.value?.start, state.value?.end]);
  
  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box {...calendarProps} ref={ref} sx={{ width: 'fit-content', maxWidth: '100%' }}>
      {/* header */}
      <CalendarHeader prevButtonProps={prevButtonProps} nextButtonProps={nextButtonProps} title={title} />

      {/* grid */}
      <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
        {[0, 1].map(offset => (
          <CalendarGrid
            key={offset}
            state={state}
            offset={offset}
            highlightRanges={highlightRanges}
            cellSize={cellSize}
            dayOfWeekFontSize={dayOfWeekFontSize}
            fontSize={fontSize}
          />
        ))}
      </Box>
    </Box>
  );
};