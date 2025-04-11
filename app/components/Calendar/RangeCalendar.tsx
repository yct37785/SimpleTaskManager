'use client';

import { useRef } from 'react';
// react-aria
import { useRangeCalendar, useLocale } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
// MUI
import { Box } from '@mui/material';
// date
import { createCalendar, today, getLocalTimeZone } from '@internationalized/date';
// our components
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import { HighlightRange } from './CalendarCell';

type Props = {
  cellSize?: number;
  dayOfWeekFontSize?: string;
  fontSize?: string;
  highlightRanges?: HighlightRange[];
};

/**
 * range calendar component
 */
export default function RangeCalendar({
  cellSize = 40,
  dayOfWeekFontSize = '1.2rem',
  fontSize = '1rem',
  highlightRanges = [],
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