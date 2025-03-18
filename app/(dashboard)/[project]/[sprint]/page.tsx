'use client';

import { useState } from 'react';
// components
import { DragDropContext } from '@hello-pangea/dnd';
import { Task } from '../../../types/Task';
import TaskForm from '../../../components/TaskForm/TaskForm';
import TaskColumn from '../../../components/TaskColumn/TaskColumn';
import TaskPageAppBar from './TaskPageAppBar';
// styles
import styles from './page.module.css';
import '../../../styles/globals.css';

export default function SprintPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // add new task
  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

  // handle drag end
  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedTasks = [...tasks];
    const movedTask = updatedTasks.find((task) => task.id === result.draggableId);

    if (movedTask) {
      movedTask.status = result.destination.droppableId as 'TODO' | 'IN_PROGRESS';
      setTasks(updatedTasks);
    }
  };

  return (
    <main>
      <TaskPageAppBar />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.taskContainer}>
          <TaskColumn title='TODO' status='TODO' tasks={tasks.filter(task => task.status === 'TODO')} />
          <TaskColumn title='IN PROGRESS' status='IN_PROGRESS' tasks={tasks.filter(task => task.status === 'IN_PROGRESS')} />
        </div>
      </DragDropContext>
    </main>
  );
};