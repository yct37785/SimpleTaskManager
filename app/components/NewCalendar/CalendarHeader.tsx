'use client';

import { IconButton, IconButtonProps } from '@mui/material';
import { AriaButtonProps } from 'react-aria';
import { PressEvent } from '@react-types/shared';
import { ReactNode } from 'react';

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