'use client';

import React, { ReactNode } from 'react';
// MUI
import { Dialog, DialogTitle, DialogActions, DialogContent, Button, Stack, TextField, TextFieldProps, CircularProgress } from '@mui/material';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  submitLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
};

/********************************************************************************************************************
 * UI components
 ********************************************************************************************************************/
export function DialogTextInput(props: TextFieldProps) {
  return (
    <TextField fullWidth multiline variant='outlined'
      {...props}
    />
  );
};

/********************************************************************************************************************
 * form dialog base component
 ********************************************************************************************************************/
export default function BaseDialog({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel = 'Create',
  disabled = false,
  loading = false,
  children,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth scroll='body' disableRestoreFocus>
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent dividers>
        <Stack spacing={2}>{children}</Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} loading={loading} variant='contained' disabled={disabled}>
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};