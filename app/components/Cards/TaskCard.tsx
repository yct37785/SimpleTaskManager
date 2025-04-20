'use client';

// DND
import { Draggable } from '@hello-pangea/dnd';
// MUI
import { Box } from '@mui/material';
// schemas
import { Task } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  task: Task;
  index: number;
};

/********************************************************************************************************************
 * task card form
 ********************************************************************************************************************/
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