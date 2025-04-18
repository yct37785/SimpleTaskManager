'use client';

// DND
import { Droppable } from '@hello-pangea/dnd';
// MUI
import { Button, Box, Typography } from '@mui/material';
import {  Add as AddIcon } from '@mui/icons-material';
// our components
import TaskCard from '@components/Cards/TaskCard';
// schemas
import { Column } from '@schemas';
// styles
import { task_column_width } from '@/app/styles/dimens';

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
      <Box sx={{
        border: '2px dashed #ccc', width: task_column_width, borderRadius: 2, p: 2,
        mt: 1, textAlign: 'center', flexDirection: 'column'
      }}>
        <Droppable droppableId={column.id}>
          {(provided) => (
            <Box ref={provided.innerRef} {...provided.droppableProps}
              sx={{ flexDirection: 'column', pb: 10 }}
            >
              {column.tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} />
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
        {column.isTodo ? <Button variant='outlined' startIcon={<AddIcon />}
          onClick={() => setOpenColumn(column.id)}>new task</Button> : null}
      </Box>
    </Box>
  );
};