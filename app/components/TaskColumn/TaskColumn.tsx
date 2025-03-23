'use client';

// components
import { Droppable } from '@hello-pangea/dnd';
import { Button, Box, Typography, Stack } from '@mui/material';
import TaskCard from '../TaskCard/TaskCard';
import { 
  Add as AddIcon
} from '@mui/icons-material';
// types
import { Column } from '@defines/schemas';
import { TASK_COLUMN_WIDTH, TASK_COLUMN_MIN_HEIGHT } from '@defines/consts';

type Props = {
  column: Column;
  setOpenColumn: (id: string) => void;
};

/**
 * task column component
 */
export default function TaskColumn({ column, setOpenColumn }: Props) {
  return (
    <Box>
      <Typography variant='body2'>{column.title}</Typography>
      <Box sx={{ border: '2px dashed #ccc', width: TASK_COLUMN_WIDTH, borderRadius: 2, p: 2, flex: 1, mt: 1, textAlign: 'center' }}>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {column.tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        <Button variant='outlined' startIcon={<AddIcon />}
          onClick={() => setOpenColumn(column.id)}>new task</Button>
      </Box>
    </Box>
  );
};