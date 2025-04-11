'use client';

import React, { useState } from 'react';
// MUI
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, Box, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// our components
import BaseFormDialog, { TextInput } from './BaseFormDialog';
// date
import dayjs, { Dayjs } from 'dayjs';
// defines
import { Workspace, Project } from '@defines/schemas';

type Props = {
  workspace: Workspace;
  projectDialogOpen: boolean;
  handleCreateProject: (title: string, desc: string, dueDate: Date) => void;
  closeProjectDialog: () => void;
};

/**
 * form
 */
export default function ProjectForm({ workspace, projectDialogOpen, handleCreateProject, closeProjectDialog }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    handleCreateProject(title, description, dueDate.toDate());
    setTitle('');
    setDescription('');
    setDueDate(dayjs());
    closeProjectDialog();
  };

  return (
    <BaseFormDialog
      open={projectDialogOpen}
      onClose={() => closeProjectDialog()}
      onSubmit={handleSubmit}
      title={`${workspace.title} - new project`}
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