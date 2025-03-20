'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
// components
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import TaskForm from '@components/TaskForm/TaskForm';
import TaskColumn from '@components/TaskColumn/TaskColumn';
import TaskPageAppBar from './TaskPageAppBar';
// defines
import { Task, Column, ColumnType } from '@defines/schemas';
import { SIDEBAR_WIDTH } from '@defines/consts';

const createColumn = (type: ColumnType, title: string): Column => ({
  id: uuidv4(),
  type,
  title,
  tasks: {},
});

export default function SprintPage() {
  // params
  const params = useParams();
  const project = params.project as string;
  const sprint = params.sprint as string;
  // state
  const [openAddTask, setOpenAddTask] = useState(false);
  const [columns, setColumns] = useState<Record<string, Column>>({
    [ColumnType.TODO]: createColumn(ColumnType.TODO, 'TODO'),
    [ColumnType.IN_PROGRESS]: createColumn(ColumnType.IN_PROGRESS, 'IN PROGRESS'),
    [ColumnType.DONE]: createColumn(ColumnType.DONE, 'DONE'),
  });

  // add new task
  const addTask = (task: Task, columnId: string): void => {
    task.timestampAdded = Date.now();
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: { ...prevColumns[columnId].tasks, [task.id]: task },
      },
    }));
  };

  // handle drag end
  const onDragEnd = (result: DropResult): void => {
    if (!result.destination) return;

    const sourceColId = result.source.droppableId;
    const destColId = result.destination.droppableId;

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
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
    <TaskForm openAddTask={openAddTask} setOpenAddTask={setOpenAddTask} addTask={addTask} />

    {/* Fixed TaskPageAppBar */}
    <Box sx={{ position: 'fixed', top: 0, left: SIDEBAR_WIDTH, width: '100%', zIndex: 10, bgcolor: 'background.paper' }}>
      <TaskPageAppBar project={project} sprint={sprint} />
    </Box>

    {/* Scrollable DragDropContext */}
    <Box sx={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', mt: '64px' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, p: 2, minHeight: '100%' }}> 
          {Object.values(columns).map((column) => (
            <TaskColumn key={column.id} column={column} setOpenAddTask={setOpenAddTask} />
          ))}
        </Box>
      </DragDropContext>
    </Box>
  </main>
  );
};