'use client';

import { useRef } from 'react';
import { useCalendarCell } from 'react-aria';
import { useFocusRing } from '@react-aria/focus';
import { useLocale } from '@react-aria/i18n';
import { isSameDay, isSameMonth, getDayOfWeek } from '@internationalized/date';
import { CalendarDate } from '@internationalized/date';
import { RangeCalendarState } from 'react-stately';
import { Box } from '@mui/material';
import { mergeProps } from '@react-aria/utils';
import styles from './Calendar.module.css';
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

export default function CalendarCell({
  state,
  date,
  cellSize,
  fontSize,
  highlightRanges = []
}: Props) {
  const ref = useRef(null);
  const timeZone = getTimezone();
  const jsDate = date.toDate(timeZone);
  const currentMonth = state.visibleRange.start;
  const { locale } = useLocale();

  const {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  const isOutsideMonth = !isSameMonth(date, currentMonth);
  const isSelectionStart = state.highlightedRange?.start && isSameDay(date, state.highlightedRange.start);
  const isSelectionEnd = state.highlightedRange?.end && isSameDay(date, state.highlightedRange.end);
  const dayOfWeek = getDayOfWeek(date, locale);

  const isRoundedLeft = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight = isSelected && (
    isSelectionEnd ||
    dayOfWeek === 6 ||
    date.day === date.calendar.getDaysInMonth(date)
  );

  const matchedHighlight = highlightRanges.find(
    range => jsDate >= range.start && jsDate <= range.end
  );

  return (
    <td {...cellProps}>
      <Box
        component='div'
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        //hidden={isOutsideMonth}
        className={`${styles.cell} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
        data-selection-start={isSelectionStart || undefined}
        data-selection-end={isSelectionEnd || undefined}
        sx={{
          width: cellSize,
          height: cellSize,
          fontSize,
          lineHeight: `${cellSize}px`,
          borderTopLeftRadius: isRoundedLeft ? '9999px' : 0,
          borderBottomLeftRadius: isRoundedLeft ? '9999px' : 0,
          borderTopRightRadius: isRoundedRight ? '9999px' : 0,
          borderBottomRightRadius: isRoundedRight ? '9999px' : 0,
          backgroundColor: isSelectionStart || isSelectionEnd
            ? '#1976d2'
            : matchedHighlight?.color || (isSelected ? '#90caf9' : undefined),
          color: isSelectionStart || isSelectionEnd ? 'white' : undefined,
          textAlign: 'center',
          userSelect: 'none',
          transition: 'background-color 0.2s ease'
        }}
      >
        {formattedDate}
      </Box>
    </td>
  );
};