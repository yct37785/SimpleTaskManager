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
import { Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { getTimezone, getLocale } from '@utils/DateUtils';
import { today } from '@internationalized/date';

/**
 * temp range data struct
 */
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

/**
 * displays a calendar with range selection and cell highlight support
 */
export default function SprintRangeCalendar({
  cellSize = 40,
  fontSize = 'medium',
  highlightRanges = [],
}: Props) {
  const timeZone = getTimezone();

  const isDateInHighlightRange = (cellDate: Date) => {
    return highlightRanges.some(
      (range) =>
        cellDate >= range.start &&
        cellDate <= range.end
    );
  };

  return (
    <Box sx={{ overflowY: 'auto', width: 'fit-content', maxWidth: '100%' }}>
      <RangeCalendar
        aria-label='Select project range'
        visibleDuration={{ months: 2 }}
        pageBehavior='single'
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
                {(date) => {
                  const jsDate = date.toDate(timeZone);

                  // get highlight color if any
                  const match = highlightRanges.find(
                    (range) => jsDate >= range.start && jsDate <= range.end
                  );

                  return (
                    <CalendarCell
                      date={date}
                      className={styles.calendarCell}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        lineHeight: `${cellSize}px`,
                        fontSize,
                        backgroundColor: match?.color || undefined,
                      }}
                    />
                  );
                }}
              </CalendarGridBody>
            </CalendarGrid>
          ))}
        </Box>
      </RangeCalendar>
    </Box>
  );
};