'use client';

// components
import { Droppable } from '@hello-pangea/dnd';
import { Button, Box, Typography, Stack } from '@mui/material';
import { Task } from '@schemas/Schemas';
import TaskCard from '../TaskCard/TaskCard';
import { 
  Add as AddIcon
} from '@mui/icons-material';

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
      <Box sx={{
        flex: 1,
        p: 2,
        border: '2px dashed #ccc',
        bgcolor: 'background.default',
        borderRadius: 1,
        textAlign: 'center'
      }}>
        <Droppable droppableId={status}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ width: 300, minHeight: 400, textAlign: 'center' }}>
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