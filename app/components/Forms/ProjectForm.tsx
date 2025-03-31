'use client';

import React, { useState } from 'react';
// MUI
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Box, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// our components
import BaseFormDialog, { TextInput } from './BaseFormDialog';
// others
import dayjs, { Dayjs } from 'dayjs';

type Props = {
  projectDialogOpen: boolean;
  setProjectDialogOpen: (v: boolean) => void;
};

/**
 * form
 */
export default function ProjectForm({ projectDialogOpen, setProjectDialogOpen }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    setTitle('');
    setDescription('');
    setDueDate(dayjs());
  };

  return (
    <BaseFormDialog
      open={projectDialogOpen}
      onClose={() => setProjectDialogOpen(false)}
      onSubmit={handleSubmit}
      title='New Project'
      disabled={!title || !description || !dueDate}
    >
      <TextInput
        label='Project title'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        label='Project description'
        rows={4}
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DatePicker
        label='Deadline'
        disablePast
        value={dueDate}
        onChange={(date) => setDueDate(date)}
        slotProps={{ textField: { fullWidth: true, required: true } }}
      />
    </BaseFormDialog>
  );
};