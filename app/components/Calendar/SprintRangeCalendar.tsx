'use client';

import styles from './RangeCalendar.module.css';
import {
  CalendarCell,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  RangeCalendar,
  Heading,
  Button as AriaButton,
} from 'react-aria-components';
import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

/**
 * component to select multiple date range
 */
export default function SprintRangeCalendar() {
  return (
    <Box sx={{ flex: 1, overflowY: 'auto' }}>
      <RangeCalendar
        aria-label='Select project range'
        visibleDuration={{ months: 3 }}
        pageBehavior='single'
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AriaButton slot='previous'>
            <ChevronLeft />
          </AriaButton>
          <Heading style={{ flex: 1, textAlign: 'center' }} />
          <AriaButton slot='next'>
            <ChevronRight />
          </AriaButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map((offset) => (
            <CalendarGrid key={offset} offset={{ months: offset }}>
              <CalendarGridHeader>
                {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => <CalendarCell date={date} className={styles.calendarCell} />}
              </CalendarGridBody>
            </CalendarGrid>
          ))}
        </Box>
      </RangeCalendar>
    </Box>
  );
};