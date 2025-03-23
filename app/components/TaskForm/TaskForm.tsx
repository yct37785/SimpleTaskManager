'use client';

import React, { useState } from 'react';
// components
import {
  Button, TextField, TextFieldProps, Dialog, DialogActions, DialogContent,
  DialogTitle, Chip, Autocomplete, Stack, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import LabelSelector from './LabelSelector';
// types
import { Task, Label } from '@defines/schemas';

/**
 * input
 */
function TextInput(props: TextFieldProps) {
  return (
    <TextField
      fullWidth
      variant='outlined'
      {...props}
    />
  );
};

type Props = {
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
  addTask: (task: Task, columnId: 'TODO' | 'IN_PROGRESS') => void;
};

/**
 * form
 */
export default function TaskForm({ openAddTask, setOpenAddTask, addTask }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [labels, setLabels] = useState<Label[]>([]);

  const handleAddTask = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      dueDate: dueDate.toISOString(),
      labels,
      addDate: new Date().toISOString(),
    };

    addTask(newTask, 'TODO');
    setOpenAddTask(false);
    setTitle('');
    setDescription('');
    setDueDate(dayjs());
    setLabels([]);
  };

  return (
    <Dialog
      open={openAddTask}
      onClose={() => setOpenAddTask(false)}
      maxWidth='sm'
      fullWidth
      scroll='body' // allow scrolling if content overflows
    >
      <DialogTitle>Create New Task</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>

          <TextInput
            label='Title'
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextInput
            label='Description'
            required
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <DatePicker
            label='Due Date'
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

          <LabelSelector labels={labels} setLabels={setLabels} />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenAddTask(false)}>Cancel</Button>
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