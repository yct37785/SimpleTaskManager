'use client';

import { useRef } from 'react';
import { useCalendarCell } from 'react-aria';
import { CalendarDate } from '@internationalized/date';
import { RangeCalendarState } from 'react-stately';
import styles from './Calendar.module.css';
import { isSameDay, isWithinInterval } from 'date-fns';
import { Box } from '@mui/material';
import { getTimezone } from '@utils/DateUtils';

type HighlightRange = {
  start: Date;
  end: Date;
  color: string;
};

type Props = {
  state: RangeCalendarState;
  date: CalendarDate;
  cellSize: number;
  fontSize: string;
  highlightRanges?: HighlightRange[];
};

/**
 * A custom CalendarCell that supports:
 * - Range selection state (start/end)
 * - MUI styling
 * - Background highlights for multiple date ranges
 */
export default function CalendarCell({
  state,
  date,
  cellSize,
  fontSize,
  highlightRanges = []
}: Props) {
  const ref = useRef(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    isUnavailable,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  const timeZone = getTimezone();
  const jsDate = date.toDate(timeZone);

  // Determine if this cell falls in any highlight range
  const matchedHighlight = highlightRanges.find(range =>
    isWithinInterval(jsDate, { start: range.start, end: range.end })
  );

  return (
    <td {...cellProps}>
      <Box
        component="div"
        {...buttonProps}
        ref={ref}
        hidden={isOutsideVisibleRange}
        className={`
          ${styles.cell}
          ${isSelected ? styles.selected : ''}
          ${isDisabled ? styles.disabled : ''}
          ${isUnavailable ? styles.unavailable : ''}
        `}
        data-selected={isSelected || undefined}
        data-disabled={isDisabled || undefined}
        data-unavailable={isUnavailable || undefined}
        data-selection-start={
          state.highlightedRange?.start &&
          isSameDay(state.highlightedRange.start.toDate(timeZone), jsDate)
        }
        data-selection-end={
          state.highlightedRange?.end &&
          isSameDay(state.highlightedRange.end.toDate(timeZone), jsDate)
        }
        sx={{
          width: cellSize,
          height: cellSize,
          lineHeight: `${cellSize}px`,
          fontSize,
          backgroundColor: matchedHighlight?.color || undefined
        }}
      >
        {formattedDate}
      </Box>
    </td>
  );
};