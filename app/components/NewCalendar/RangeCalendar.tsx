'use client';

import { useRef } from 'react';
import { useRangeCalendar } from '@react-aria/calendar';
import { useRangeCalendarState } from '@react-stately/calendar';
import { createCalendar, today, getLocalTimeZone } from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { Box, IconButton, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import CalendarGrid from './CalendarGrid';
import styles from './Calendar.module.css';

type HighlightRange = {
  start: Date;
  end: Date;
  color: string;
};

type Props = {
  cellSize?: number;
  fontSize?: string;
  highlightRanges?: HighlightRange[];
};

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
    <Box {...calendarProps} ref={ref} className={styles.calendar}>
      {/* Header with nav buttons */}
      <Box className={styles.header}>
        <Typography variant='h6' sx={{ flex: 1, textAlign: 'center' }}>
          {title}
        </Typography>
        {/* <IconButton {...prevButtonProps} className={styles.navButton}><ChevronLeft /></IconButton>
        <IconButton {...nextButtonProps} className={styles.navButton}><ChevronRight /></IconButton> */}
      </Box>

      {/* Render multiple months */}
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