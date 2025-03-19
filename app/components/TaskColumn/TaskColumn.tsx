'use client';

// components
import { Droppable } from '@hello-pangea/dnd';
import { Task } from '@schemas/Task';
import TaskCard from '../TaskCard/TaskCard';
import { Button, Box, Typography, Stack } from '@mui/material';
import { 
  Add as AddIcon
} from '@mui/icons-material';
// styles
import styles from './TaskColumn.module.css';

type Props = {
  title: string;
  status: 'TODO' | 'IN_PROGRESS';
  tasks: Task[];
  openAddTask: boolean;
  setOpenAddTask: (open: boolean) => void;
  addTask: (task: Task) => void;
};

export default function TaskColumn({ title, status, tasks, openAddTask, setOpenAddTask, addTask }: Props) {
  return (
    <Stack spacing={2}>
      <Typography variant='body1'>{title}</Typography>
      <Box className={styles.columnContainer}>
        <Droppable droppableId={status}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} className={styles.column}>
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Button variant='outlined' startIcon={<AddIcon />} onClick={() => setOpenAddTask(true)}>new task</Button>
      </Box>
    </Stack>
  );
};