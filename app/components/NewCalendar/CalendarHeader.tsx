'use client';

import { ReactNode } from 'react';
// react-aria
import { AriaButtonProps } from 'react-aria';
// MUI
import { IconButton, IconButtonProps } from '@mui/material';
// others
import { PressEvent } from '@react-types/shared';

type Props = AriaButtonProps<'button'> & {
  children: ReactNode;
  className?: string;
} & Omit<IconButtonProps, 'onClick' | 'disabled'>;

/**
 * wraps a MUI IconButton for use with React Aria's onPress and isDisabled props
 */
export function CalendarNavButton({ onPress, isDisabled, children, className }: Props) {
  const handleClick = () => {
    if (onPress) onPress({} as PressEvent);
  };

  return (
    <IconButton onClick={handleClick} disabled={isDisabled} className={className}>
      {children}
    </IconButton>
  );
};