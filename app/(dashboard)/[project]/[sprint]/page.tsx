'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// components
import { DragDropContext } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import { Task } from '@schemas/Schemas';
import TaskForm from '@components/TaskForm/TaskForm';
import TaskColumn from '@components/TaskColumn/TaskColumn';
import TaskPageAppBar from './TaskPageAppBar';

export default function SprintPage() {
  // params
  const params = useParams();
  const project = params.project as string;
  const sprint = params.sprint as string;
  // state
  const [openAddTask, setOpenAddTask] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // add new task
  const addTask = (task: Task): void => {
    setTasks([...tasks, task]);
  };

  // handle drag end
  const onDragEnd = (result: any): void => {
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
      <TaskForm openAddTask={openAddTask} setOpenAddTask={setOpenAddTask} addTask={addTask} />
      <TaskPageAppBar project={project} sprint={sprint} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
          <TaskColumn
            title='TODO'
            status='TODO'
            tasks={tasks.filter(task => task.status === 'TODO')}
            openAddTask={openAddTask}
            setOpenAddTask={setOpenAddTask}
            addTask={addTask} />
          <TaskColumn
            title='IN PROGRESS'
            status='IN_PROGRESS'
            tasks={tasks.filter(task => task.status === 'IN_PROGRESS')}
            openAddTask={openAddTask}
            setOpenAddTask={setOpenAddTask}
            addTask={addTask} />
        </Box>
      </DragDropContext>
    </main>
  );
};