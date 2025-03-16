'use client';

import { useState } from 'react';
import { Task } from '../types/task';
import { useRouter } from 'next/navigation';
import styles from './TaskForm.module.css';

type Props = {
  onAddTask: (task: Task) => void;
};

export default function TaskForm({ onAddTask }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
    };

    onAddTask(newTask);
    router.push(`/task/${newTask.id}`);
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
      <textarea
        placeholder='Task Description'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className={styles.textarea}
      />
      <button type='submit' className={styles.button}>Add Task</button>
    </form>
  );
}
