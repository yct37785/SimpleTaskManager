'use client';

import React, { useState } from 'react';
// MUI
import { Button, TextField, TextFieldProps, Dialog, DialogTitle, DialogActions, DialogContent, Box, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// others
import dayjs, { Dayjs } from 'dayjs';

/**
 * input
 */
function TextInput(props: TextFieldProps) {
  return (
    <TextField fullWidth variant='outlined' multiline required
      {...props}
    />
  );
};

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

  const handleAddTask = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    setTitle('');
    setDescription('');
    setDueDate(dayjs());
  };

  return (
    <Dialog open={projectDialogOpen} maxWidth='sm' fullWidth scroll='body'>
      <DialogTitle>New Project</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>

          <TextInput
            label='Project title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextInput
            label='Project description'
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <DatePicker
            label='Deadline'
            disablePast
            value={dueDate}
            onChange={(date) => setDueDate(date)}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
              }
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
        <Button
          onClick={handleAddTask}
          variant='contained'
          disabled={!title || !description || !dueDate}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};