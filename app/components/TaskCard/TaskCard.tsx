'use client';

// components
import { Draggable } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
// types
import { Task } from '@defines/schemas';

type Props = {
  task: Task;
  index: number;
};

/**
 * task card form
 */
export default function TaskCard({ task, index }: Props) {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <Box
          sx={{
            p: 1,
            mb: 1,
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: 1,
            textAlign: 'center',
            cursor: 'grab'
          }}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.title}
        </Box>
      )}
    </Draggable>
  );
};