'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// components
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import { Task, Column } from '@schemas/Schemas';
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
  const [columns, setColumns] = useState<Record<string, Column>>({
    TODO: { id: 'TODO', title: 'TODO', tasks: {} },
    IN_PROGRESS: { id: 'IN_PROGRESS', title: 'IN PROGRESS', tasks: {} },
  });

  // add new task
  const addTask = (task: Task, columnId: 'TODO' | 'IN_PROGRESS'): void => {
    task.timestampAdded = Date.now();
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: { ...prevColumns[columnId].tasks, [task.id]: task }, // add task to the map
      },
    }));
  };

  // handle drag end
  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const sourceColId = result.source.droppableId as 'TODO' | 'IN_PROGRESS';
    const destColId = result.destination.droppableId as 'TODO' | 'IN_PROGRESS';

    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];

    // find the moved task
    const movedTask = sourceCol.tasks[result.draggableId];
    if (!movedTask) return;

    // remove task from source column
    const updatedSourceTasks = { ...sourceCol.tasks };
    delete updatedSourceTasks[result.draggableId];

    // add task to destination column and sort by timestamp
    movedTask.timestampAdded = Date.now();
    const updatedDestTasks = { ...destCol.tasks, [movedTask.id]: movedTask };

    // update state
    setColumns({
      ...columns,
      [sourceColId]: { ...sourceCol, tasks: updatedSourceTasks },
      [destColId]: { ...destCol, tasks: updatedDestTasks },
    });
  };

  return (
    <main>
      <TaskForm openAddTask={openAddTask} setOpenAddTask={setOpenAddTask} addTask={addTask} />
      <TaskPageAppBar project={project} sprint={sprint} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        {Object.values(columns).map((column) => (
            <TaskColumn
              key={column.id}
              title={column.id}
              column={column}
              setOpenAddTask={setOpenAddTask}
            />
          ))}
        </Box>
      </DragDropContext>
    </main>
  );
};