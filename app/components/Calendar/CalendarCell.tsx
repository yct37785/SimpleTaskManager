'use client';

import { useRef } from 'react';
// react-aria
import { useCalendarCell, useFocusRing, useLocale, mergeProps } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
// MUI
import { Box, darken } from '@mui/material';
// others
import { CalendarDate, isSameDay, isSameMonth, getDayOfWeek, getLocalTimeZone } from '@internationalized/date';
// defines
import { calendar_accent, transition_speed, disabled_opacity, text_disabled } from '@defines/styles';

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
  endDate: CalendarDate;
  highlightRanges?: HighlightRange[];
};

/**
 * calendar cell component of a single day
 */
export default function CalendarCell({ state, date, cellSize, fontSize, startDate, endDate, highlightRanges = []}: Props) {
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

  // for keyboard control
  const { focusProps, isFocusVisible } = useFocusRing();

  // status
  const isOutsideMonth = !isSameMonth(startDate, date);

  // range behaviours
  const isSelectionStart = state.highlightedRange ? isSameDay(date, state.highlightedRange.start) : isSelected;
  const isSelectionEnd = state.highlightedRange ? isSameDay(date, state.highlightedRange.end) : isSelected;

  // edge
  const isRoundedLeft = isSelected &&
    (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight = isSelected &&
    (isSelectionEnd || dayOfWeek === 6 || date.day === date.calendar.getDaysInMonth(date));

  // custom ranges
  // const matchedHighlight = highlightRanges.find(
  //   range => jsDate >= range.start && jsDate <= range.end
  // );

  // bg color
  const bgColor = isSelectionStart || isSelectionEnd
    ? calendar_accent
    : isSelected
      ? `${calendar_accent}78`
      : 'rgba(0,0,0,0)';

  return (
    <td {...cellProps}>
      <Box
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        sx={{
          // dimensions
          width: cellSize,
          height: cellSize,
          fontSize,
          lineHeight: `${cellSize}px`,
          // alignments
          textAlign: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // behaviours
          visibility: isOutsideMonth ? 'hidden' : 'visible',
          pointerEvents: isOutsideMonth ? 'none' : 'auto',
          cursor: isDisabled ? 'auto' : 'pointer',
          userSelect: 'none',
          // colors
          opacity: isDisabled ? disabled_opacity : 1,
          color: isDisabled ? text_disabled : 'inherit',
          backgroundColor: bgColor,
          // borders
          borderTopLeftRadius: isRoundedLeft ? 100 : 0,
          borderBottomLeftRadius: isRoundedLeft ? 100 : 0,
          borderTopRightRadius: isRoundedRight ? 100 : 0,
          borderBottomRightRadius: isRoundedRight ? 100 : 0,
          // transition
          transition: `background-color ${transition_speed} ease`,
          // keyboard control
          outline: isFocusVisible ? `2px solid ${calendar_accent}` : 'none',
          outlineOffset: isFocusVisible ? '2px' : '0px',
          // hover
          '&:hover': {
            backgroundColor: bgColor !== 'rgba(0,0,0,0)'
              ? darken(bgColor, 0.1)
              : !isDisabled
                ? `${calendar_accent}14`
                : 'rgba(0,0,0,0)'
          }
        }}>
        {formattedDate}
      </Box>
    </td>
  );
};