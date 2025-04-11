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
// date
import dayjs, { Dayjs } from 'dayjs';
import { today, getLocalTimeZone } from '@internationalized/date';
// types
import { Task, Label } from '@defines/schemas';
// utils
import { dateToCalendarDate } from '@utils/datetimeUtils';

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
  const [desc, setDesc] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [labels, setLabels] = useState<Label[]>([]);

  const handleSubmit = () => {
    if (!title.trim() || !desc.trim() || !dueDate) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      desc,
      addDate: today(getLocalTimeZone()),
      dueDate: dateToCalendarDate(dueDate.toDate()),
      completedDate: undefined,
      labels,
    };

    addTask(newTask, openColumn);
    setOpenColumn('');
    setTitle('');
    setDesc('');
    setDueDate(dayjs());
    setLabels([]);
  };

  return (
    <BaseFormDialog
      open={openColumn !== ''}
      onClose={() => setOpenColumn('')}
      onSubmit={handleSubmit}
      title='New Task'
      disabled={!title || !desc || !dueDate}
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
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
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