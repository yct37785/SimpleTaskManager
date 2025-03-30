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
import { calendar_accent, calendar_accent_light, transition_speed, disabled_opacity, text_disabled } from '@defines/styles';

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
export default function CalendarCell({ state, date, cellSize, fontSize, startDate, endDate, highlightRanges = [] }: Props) {
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
  const isKnob = isSelectionStart || isSelectionEnd;

  return (
    <td {...cellProps} style={{ padding: 0 }}>
      <Box
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        sx={{
          // behaviours
          visibility: isOutsideMonth ? 'hidden' : 'visible',
          pointerEvents: isOutsideMonth ? 'none' : 'auto',
          cursor: isDisabled ? 'auto' : 'pointer',
          userSelect: 'none',
          // colors
          opacity: isDisabled ? disabled_opacity : 1,
          color: isDisabled ? text_disabled : 'inherit',
          backgroundColor: isSelected ? `${calendar_accent_light}` : `rgba(0,0,0,0)`,
          // borders
          borderTopLeftRadius: isRoundedLeft ? 100 : 0,
          borderBottomLeftRadius: isRoundedLeft ? 100 : 0,
          borderTopRightRadius: isRoundedRight ? 100 : 0,
          borderBottomRightRadius: isRoundedRight ? 100 : 0,
          // transition
          transition: `background-color ${transition_speed} ease`,
          // keyboard control
          outline: isFocusVisible ? `2px solid ${calendar_accent}` : 'none',
          outlineOffset: isFocusVisible ? '2px' : '0px'
        }}>
        <Box sx={{
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
          // borders
          borderRadius: 100,
          // color
          backgroundColor: isKnob ? calendar_accent : 'rgba(0,0,0,0)',
          // hover
          '&:hover': {
            backgroundColor: isKnob ?
              darken(calendar_accent, 0.1) :
              isSelected ?
                darken(calendar_accent_light, 0.1) :
                !isDisabled ?
                  `${calendar_accent_light}14` :
                  'rgba(0,0,0,0)'
          }
        }}>
          {formattedDate}
        </Box>
      </Box>
    </td>
  );
};