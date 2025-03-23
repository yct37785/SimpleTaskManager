'use client';

import React, { useState } from 'react';
// mui
import {
  Button, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, Chip, Autocomplete, Stack, Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// utils
import dayjs, { Dayjs } from 'dayjs';
// types
import { Task } from '@defines/schemas';

type Label = {
  name: string;
  color: string;
};

type Props = {
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
  addTask: (task: Task, columnId: 'TODO' | 'IN_PROGRESS') => void;
};

export default function TaskForm({ openAddTask, setOpenAddTask, addTask }: Props) {
  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Dayjs | null>(dayjs());
  const [labels, setLabels] = useState<Label[]>([]);

  // label input management
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
      maxWidth="sm"
      fullWidth
    >
      {/* Task Title */}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />

      <DialogContent dividers>
        <Stack spacing={2}>

          {/* Description */}
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            multiline
            minRows={3}
            fullWidth
          />

          {/* Due Date */}
          <DatePicker
            label="Due Date"
            disablePast
            value={dueDate}
            onChange={(date) => setDueDate(date)}
            slotProps={{
              textField: { fullWidth: true, required: true }
            }}
          />

          {/* Labels */}
          <Autocomplete
            multiple
            freeSolo
            options={[]}
            value={labels.map((l) => l.name)}
            onChange={(event, newValues) => {
              const newLabels: Label[] = newValues.map((val) => {
                const existing = labels.find((l) => l.name === val);
                return existing || {
                  name: val,
                  color: '#' + Math.floor(Math.random() * 16777215).toString(16), // random color
                };
              });
              setLabels(newLabels);
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option, index) => {
                const label = labels.find((l) => l.name === option);
                return (
                  <Chip
                    {...getTagProps({ index })}
                    label={option}
                    key={option}
                    sx={{ bgcolor: label?.color || 'grey.300', color: 'white' }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Labels (optional)" placeholder="Type and press enter" />
            )}
          />

        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => setOpenAddTask(false)}>Cancel</Button>
        <Button onClick={handleAddTask} variant="contained" disabled={!title || !description || !dueDate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};