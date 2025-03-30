'use client';

import { useRef } from 'react';
// react-aria
import { useCalendarCell, useFocusRing, useLocale, mergeProps } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
// MUI
import { Box, darken } from '@mui/material';
// others
import { CalendarDate, isSameDay, isSameMonth, getDayOfWeek, getLocalTimeZone } from '@internationalized/date';
// styles
import styles from './calendar.module.css';

/**
 * define a range to highlight
 */
export type HighlightRange = {
  start: Date;
  end: Date;
  color: string;
};

type Props = {
  state: RangeCalendarState;
  date: CalendarDate;
  cellSize: number;
  fontSize: string;
  startDate: CalendarDate;
  highlightRanges?: HighlightRange[];
};

/**
 * calendar cell component of a single day
 */
export default function CalendarCell({
  state,
  date,
  cellSize,
  fontSize,
  startDate,
  highlightRanges = []
}: Props) {
  const ref = useRef(null);
  const { locale } = useLocale();
  const jsDate = date.toDate(getLocalTimeZone());
  const dayOfWeek = getDayOfWeek(date, locale);

  const {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  const isSelectionStart = state.highlightedRange ? isSameDay(date, state.highlightedRange.start) : isSelected;
  const isSelectionEnd = state.highlightedRange ? isSameDay(date, state.highlightedRange.end) : isSelected;
  const isRoundedLeft = isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight = isSelected && (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date));

  const cellClassNames = [
    styles.cellWrapper,
    isSelected && styles.selected,
    isDisabled && styles.disabled,
    isRoundedLeft && styles.roundedLeft,
    isRoundedRight && styles.roundedRight,
    isFocusVisible && styles.focusVisible
  ]
    .filter(Boolean)
    .join(' ');

  const innerClassNames = [
    styles.cellInner,
    (isSelectionStart || isSelectionEnd) && styles.knob
  ]
    .filter(Boolean)
    .join(' ');
  
  // custom ranges
  // const matchedHighlight = highlightRanges.find(
  //   range => jsDate >= range.start && jsDate <= range.end
  // );

  return (
    <td {...cellProps} style={{ padding: 0 }}>
      {isSameMonth(startDate, date) ? <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={cellClassNames}
      >
        <div
          className={innerClassNames}
          style={{
            width: cellSize,
            height: cellSize,
            fontSize,
            lineHeight: `${cellSize}px`
          }}
        >
          {formattedDate}
        </div>
      </div> : <div style={{ width: cellSize, height: cellSize }} />}
    </td>
  );
};