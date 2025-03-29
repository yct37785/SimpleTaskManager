'use client';

import { ReactNode } from 'react';
// react-aria
import { AriaButtonProps } from 'react-aria';
// MUI
import { IconButton, IconButtonProps, Box, Typography } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
// others
import { PressEvent } from '@react-types/shared';
// styles
import '@styles/globals.css';
import styles from './Calendar.module.css';

type NavButtonProps = AriaButtonProps & {
  children: ReactNode;
  className?: string;
} & Omit<IconButtonProps, 'onClick' | 'disabled'>;

/**
 * wraps a MUI IconButton for use with React Aria's onPress and isDisabled props
 */
function CalendarNavButton({ onPress, isDisabled, children, className }: NavButtonProps) {
  const handleClick = () => {
    if (onPress) onPress({} as PressEvent);
  };

  return (
    <IconButton onClick={handleClick} disabled={isDisabled} className={className}>
      {children}
    </IconButton>
  );
};

type Props = {
  prevButtonProps: AriaButtonProps;
  nextButtonProps: AriaButtonProps;
  title: string;
};

/**
 * range calendar header component
 */
export default function CalendarHeader({ prevButtonProps, nextButtonProps, title }: Props) {
  return (
    <Box className={styles.calendarHeader}>
      <CalendarNavButton {...prevButtonProps} className={styles.navButton}>
        <ChevronLeft />
      </CalendarNavButton>
      <Typography variant='h6' sx={{ flex: 1, textAlign: 'center' }}>
        {title}
      </Typography>
      <CalendarNavButton {...nextButtonProps} className={styles.navButton}>
        <ChevronRight />
      </CalendarNavButton>
    </Box>
  );
};