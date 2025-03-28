'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
// components
import {
  Button, TextField, TextFieldProps, Dialog, DialogActions, DialogContent,
  DialogTitle, Box, Stack, Typography
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
    <TextField fullWidth variant='outlined' multiline required
      {...props}
    />
  );
};

type Props = {
  openColumn: string;
  setOpenColumn: (id: string) => void;
  addTask: (task: Task, columnId: string) => void;
};

/**
 * form
 */
export default function TaskForm({ openColumn, setOpenColumn, addTask }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [labels, setLabels] = useState<Label[]>([]);

  const handleAddTask = () => {
    if (!title.trim() || !description.trim() || !dueDate) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      addDate: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      completedDate: '',
      labels,
    };

    addTask(newTask, openColumn);
    setOpenColumn('');
    setTitle('');
    setDescription('');
    setDueDate(dayjs());
    setLabels([]);
  };

  return (
    <Dialog
      open={openColumn !== ''}
      onClose={() => setOpenColumn('')}
      maxWidth='sm'
      fullWidth
      scroll='body' // allow scrolling if content overflows
    >

      <DialogContent dividers>
        <Stack spacing={2}>

          <TextInput
            label='Task title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextInput
            label='Task description'
            rows={4}
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
        <Button onClick={() => setOpenColumn('')}>Cancel</Button>
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