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
  DateValue,
} from 'react-aria-components';
import { Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getTimezone, toEpochDay } from '@utils/DateUtils';
import { today, isWeekend } from '@internationalized/date';

type Props = {
  cellSize?: number;
  fontSize?: string;
};

/**
 * component to select multiple date range
 */
export default function SprintRangeCalendar({
  cellSize = 40,
  fontSize = 'medium'
}: Props) {

  return (
    <Box sx={{ overflowY: 'auto', width: 'fit-content', maxWidth: '100%' }}>
      <RangeCalendar
        aria-label='Select project range'
        visibleDuration={{ months: 2 }}
        pageBehavior='single'
        onChange={(range) => {
          // epoch days
          let now = today(getTimezone());
          const timeZone = getTimezone();
          const startDate = range.start.toDate(timeZone);
          const endDate = range.end.toDate(timeZone);
          const epochDayStart = toEpochDay(startDate);
          const epochDayEnd = toEpochDay(endDate);
          console.log('now: ' + now);
          console.log('Timezone: ' + timeZone);
          console.log('epochDayStart:', epochDayStart);
          console.log('epochDayEnd:', epochDayEnd);
        }}
        minValue={today(getTimezone())}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AriaButton slot='previous' className={styles.navButton}>
            <ChevronLeft />
          </AriaButton>
          <Heading style={{ flex: 1, textAlign: 'center' }} />
          <AriaButton slot='next' className={styles.navButton}>
            <ChevronRight />
          </AriaButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 3 }}>
          {[0, 1].map((offset) => (
            <CalendarGrid key={offset} offset={{ months: offset }} className={styles.calendarGrid}>
              <CalendarGridHeader className={styles.calendarGridHeader}>
                {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody className={styles.calendarGridBody}>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={styles.calendarCell}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      lineHeight: `${cellSize}px`,
                      fontSize,
                    }}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          ))}
        </Box>
      </RangeCalendar>
    </Box>
  );
};