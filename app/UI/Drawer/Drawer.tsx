'use client';

import React from 'react';
// MUI
import { Drawer, Box, Typography, Divider, IconButton, Stack } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};

/********************************************************************************************************************
 * generic drawer UI component
 ********************************************************************************************************************/
export default function BottomDrawer({  open, onClose, children, title = 'Drawer' }: Props) {
  return (
    <Drawer
      anchor='left'
      open={open}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      slotProps={{
        paper: {
          sx: {
            width: '90vw',
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12
          },
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
        <Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
          <Typography variant='h6' fontWeight={600}>{title}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {children}
      </Box>
    </Drawer>
  );
}
