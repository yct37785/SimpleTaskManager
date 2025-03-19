'use client';

import React from 'react';
// components
import { Task } from '@schemas/Task';
import { 
  Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type Props = {
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
  addTask: (task: Task) => void;
};

export default function TaskForm({ openAddTask, setOpenAddTask, addTask }: Props) {
  return (
    <Dialog
      open={openAddTask}
      onClose={() => setOpenAddTask(false)}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            setOpenAddTask(false);
          },
        },
      }}
    >
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin='dense'
          id='name'
          name='email'
          label='Email Address'
          type='email'
          fullWidth
          variant='standard'
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenAddTask(false)}>Cancel</Button>
        <Button type='submit'>Subscribe</Button>
      </DialogActions>
    </Dialog>
  );
};