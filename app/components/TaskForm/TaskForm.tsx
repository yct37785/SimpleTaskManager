'use client';

// components
import { useState } from 'react';
import { Task } from '@schemas/Task';
import { Typography } from '@mui/material';
// styles
import styles from './TaskForm.module.css';

type Props = {
  onAddTask: (task: Task) => void;
};

export default function TaskForm({ onAddTask }: Props) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      status: 'TODO',
    };

    onAddTask(newTask);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type='text'
        placeholder='Task Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className={styles.input}
      />
      <button type='submit' className={styles.button}>Add Task</button>
    </form>
  );
}
