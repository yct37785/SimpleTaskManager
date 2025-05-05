'use client';

import { useRef, useEffect } from 'react';
// react-aria
import { useCalendar, useLocale } from 'react-aria';
import { useCalendarState } from 'react-stately';
// MUI
import { Box } from '@mui/material';
// utils
import { createCalendar, today, getLocalTimeZone, CalendarDate } from '@internationalized/date';
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
  defaultValue?: CalendarDate;
  highlightRanges?: HighlightRange[];
  onSelect?: (date: CalendarDate) => void;
};

/********************************************************************************************************************
 * calendar date picker component
 ********************************************************************************************************************/
export default function CalendarPicker({
  cellSize = 40,
  dayOfWeekFontSize = '1.2rem',
  fontSize = '1rem',
  defaultValue,
  highlightRanges = [],
  onSelect = () => {}
}: Props) {
  let { locale } = useLocale();

  const state = useCalendarState({
    minValue: today(getLocalTimeZone()),
    visibleDuration: { months: 2 },
    pageBehavior: 'single',
    defaultValue,
    locale,
    createCalendar,
    onChange: valueSelected
  });

  const {
    calendarProps,
    prevButtonProps,
    nextButtonProps,
    title
  } = useCalendar({}, state);

  /******************************************************************************************************************
   * listener
   ******************************************************************************************************************/
  function valueSelected(value: CalendarDate) {
    onSelect(value);
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box {...calendarProps} sx={{ width: 'fit-content', maxWidth: '100%' }}>
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