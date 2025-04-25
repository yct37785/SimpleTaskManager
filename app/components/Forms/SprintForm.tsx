'use client';

import React, { useState } from 'react';
// MUI
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Box, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// our components
import BaseFormDialog, { TextInput } from './BaseFormDialog';
// date
import dayjs, { Dayjs } from 'dayjs';
// schemas
import { Project } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  project: Project;
  sprintDialogOpen: boolean;
  handleCreateSprint: (title: string, desc: string) => void;
  closeSprintDialog: () => void;
};

/********************************************************************************************************************
 * sprint creation form
 ********************************************************************************************************************/
export default function SprintForm({ project, sprintDialogOpen, handleCreateSprint, closeSprintDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());

  /******************************************************************************************************************
   * submit
   ******************************************************************************************************************/
  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    handleCreateSprint(title, description);
    setTitle('');
    setDescription('');
    setDueDate(dayjs());
    closeSprintDialog();
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <BaseFormDialog
      open={sprintDialogOpen}
      onClose={() => closeSprintDialog()}
      onSubmit={handleSubmit}
      title={`${project.title} - new sprint`}
      disabled={!title || !description || !dueDate}
    >
      <TextInput
        label='Sprint title'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        label='Sprint description'
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
}