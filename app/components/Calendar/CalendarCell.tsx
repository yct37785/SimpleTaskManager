'use client';

import { useRef } from 'react';
// react-aria
import { useCalendarCell, useFocusRing, useLocale, mergeProps } from 'react-aria';
import { RangeCalendarState } from 'react-stately';
// MUI
import { Box } from '@mui/material';
// others
import { CalendarDate, isSameDay, isSameMonth, getDayOfWeek, getLocalTimeZone } from '@internationalized/date';
// defines
import { calendar_accent, transition_speed } from '@defines/styles';

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
  isOutsideMonth: boolean;
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
  isOutsideMonth,
  highlightRanges = []
}: Props) {
  const ref = useRef(null);
  const jsDate = date.toDate(getLocalTimeZone());

  const {
    cellProps,
    buttonProps,
    isSelected,
    isDisabled,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  // for keyboard control
  const { focusProps, isFocusVisible } = useFocusRing();

  const matchedHighlight = highlightRanges.find(
    range => jsDate >= range.start && jsDate <= range.end
  );

  return (
    <td {...cellProps}>
      <Box
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth}
        sx={{
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          position: 'relative',
          fontWeight: 500,
          borderRadius: 0,
          width: cellSize, 
          height: cellSize, 
          fontSize, 
          lineHeight: `${cellSize}px`,
          transition: `background-color ${transition_speed} ease`,
          backgroundColor: isSelected ? calendar_accent : undefined
        }}>
        {formattedDate}
      </Box>
    </td>
  );
};