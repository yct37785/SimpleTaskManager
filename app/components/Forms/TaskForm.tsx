'use client';

import React, { useState } from 'react';
// MUI
import { Button, Dialog, DialogActions, DialogContent, Box, Stack, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// our components
import BaseFormDialog, { TextInput } from './BaseFormDialog';
import LabelSelector from './LabelSelector';
// others
import { v4 as uuidv4 } from 'uuid';
import dayjs, { Dayjs } from 'dayjs';
// defines
import { Task, Label } from '@defines/schemas';

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

  const handleSubmit = () => {
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
    <BaseFormDialog
      open={openColumn !== ''}
      onClose={() => setOpenColumn('')}
      onSubmit={handleSubmit}
      title="New Task"
      disabled={!title || !description || !dueDate}
    >
      <TextInput
        label='Task title'
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextInput
        label='Task description'
        rows={4}
        required
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DatePicker
        label='Due Date'
        disablePast
        value={dueDate}
        onChange={(date) => setDueDate(date)}
        slotProps={{ textField: { fullWidth: true, required: true } }}
      />
      <LabelSelector labels={labels} setLabels={setLabels} />
    </BaseFormDialog>
  );
};