'use client';

import { useRef } from 'react';
// react-aria
import { useCalendarCell, useFocusRing, useLocale, mergeProps } from 'react-aria';
import { CalendarState, RangeCalendarState } from 'react-stately';
// utils
import { CalendarDate, isSameDay, isSameMonth, getDayOfWeek, getLocalTimeZone } from '@internationalized/date';
// styles
import styles from './calendar.module.css';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
export type HighlightRange = {
  start: CalendarDate;
  end: CalendarDate;
  color: string;
};

type Props<T extends CalendarState | RangeCalendarState> = {
  state: T;
  date: CalendarDate;
  cellSize: number;
  fontSize: string;
  startDate: CalendarDate;
  highlightRanges?: HighlightRange[];
};

/********************************************************************************************************************
 * calendar cell component of a single day
 ********************************************************************************************************************/
export default function CalendarCell<T extends CalendarState | RangeCalendarState>({
  state,
  date,
  cellSize,
  fontSize,
  startDate,
  highlightRanges = []
}: Props<T>) {
  const ref = useRef(null);
  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);

  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } = useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  // custom ranges
  const matchedHighlight = highlightRanges.find(
    range => date.compare(range.start) >= 0 && date.compare(range.end) <= 0
  );

  /**
   * if outside month
   */
  if (!isSameMonth(startDate, date)) {
    return <td {...cellProps} style={{ width: cellSize, height: cellSize }} />
  }

  // render cell
  const renderCell = (cellClassNames: string, innerClassNames: string) => {
    const highlightColor = matchedHighlight ? matchedHighlight.color : undefined;

    return <td {...cellProps} className={styles.cellTd}>
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        className={cellClassNames}
        style={{
          backgroundColor: highlightColor
        }}
      >
        <div className={innerClassNames}
          style={{
            width: cellSize,
            height: cellSize,
            fontSize,
            lineHeight: `${cellSize}px`
          }}>
          {formattedDate}
        </div>
      </div>
    </td>
  };

  /**
   * calendar date picker
   */
  if (!('highlightedRange' in state)) {
    const cellClassNames = [
      styles.cellWrapper,
      isDisabled && styles.disabled,
      isFocusVisible && styles.focusVisible
    ]
      .filter(Boolean)
      .join(' ');
    const innerClassNames = [
        styles.cellInner,
        isSelected && styles.knob
      ]
        .filter(Boolean)
        .join(' ');
    
    return renderCell(cellClassNames, innerClassNames);
  }

  /**
   * calendar range picker
   */
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

    return renderCell(cellClassNames, innerClassNames);
};