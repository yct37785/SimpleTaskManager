'use client';

import React, { ReactNode } from 'react';
// MUI
import { Popover, PopoverProps } from '@mui/material';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  anchorEl: HTMLElement | null;
  setAnchorEl: (el: HTMLElement | null) => void;
  children: ReactNode;
} & Partial<PopoverProps>;

/********************************************************************************************************************
 * popover component
 ********************************************************************************************************************/
export default function PopoverComponent({
  anchorEl,
  setAnchorEl,
  children,
  ...otherProps
}: Props) {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => setAnchorEl(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      slotProps={{
        paper: {
          sx: { p: 2, mt: 1, overflow: 'visible' },
        },
      }}
      {...otherProps}
    >
      {children}
    </Popover>
  );
}
