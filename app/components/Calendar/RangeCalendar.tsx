'use client';

import { useRef } from 'react';
// react-aria
import { useRangeCalendar, useLocale } from 'react-aria';
import { useRangeCalendarState } from 'react-stately';
// MUI
import { Box, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// others
import { createCalendar, today, getLocalTimeZone } from '@internationalized/date';
// our components
import CalendarGrid from './CalendarGrid';
import { HighlightRange } from './CalendarCell';
import { CalendarNavButton } from './CalendarHeader';
// styles
import '@styles/globals.css';
import styles from './Calendar.module.css';

type Props = {
  cellSize?: number;
  fontSize?: string;
  highlightRanges?: HighlightRange[];
};

/**
 * range calendar component
 */
export default function RangeCalendar({
  cellSize = 40,
  fontSize = '1rem',
  highlightRanges = [],
}: Props) {
  let { locale } = useLocale();
  const ref = useRef(null);

  const state = useRangeCalendarState({
    // minValue: today(getLocalTimeZone()),
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
    <Box {...calendarProps} ref={ref} className={styles.rangeCalendar}>
      {/* header */}
      <Box className={styles.rangeCalendarHeader}>
        <CalendarNavButton {...prevButtonProps} className={styles.navButton}>
          <ChevronLeft />
        </CalendarNavButton>
        <Typography variant='h6' sx={{ flex: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        <CalendarNavButton {...nextButtonProps} className={styles.navButton}>
          <ChevronRight />
        </CalendarNavButton>
      </Box>

      {/* grid */}
      <Box sx={{ display: 'flex', gap: 3 }}>
        {[0, 1].map(offset => (
          <CalendarGrid
            key={offset}
            state={state}
            offset={offset}
            highlightRanges={highlightRanges}
            cellSize={cellSize}
            fontSize={fontSize}
          />
        ))}
      </Box>
    </Box>
  );
};