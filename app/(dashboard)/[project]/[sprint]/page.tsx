'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
// components
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import TaskForm from '@components/TaskForm/TaskForm';
import TaskColumn from '@components/TaskColumn/TaskColumn';
import SprintPageAppBar from './SprintPageAppBar';
// types
import { Task, Column, ColumnType } from '@defines/schemas';
import { SIDEBAR_WIDTH, TASK_PAGE_APPBAR_HEIGHT } from '@defines/consts';

const createColumn = (id: string, type: ColumnType, title: string): Column => ({
  id,
  type,
  title,
  tasks: []
});

/**
 * sprint dashboard
 */
export default function SprintPage() {
  // params
  const params = useParams();
  const project = params.project as string;
  const sprint = params.sprint as string;
  // state
  const [mode, setMode] = useState(0); // 0 = List, 1 = Graph, 2 = Calendar
  const [openColumn, setOpenColumn] = useState('');  // column to add task to
  // TODO: give proper ids to columns
  const [columns, setColumns] = useState<Record<string, Column>>({
    ['asdasdasd']: createColumn('asdasdasd', ColumnType.TODO, 'TODO'),
    ['sdfsdfds']: createColumn('sdfsdfds', ColumnType.IN_PROGRESS, 'IN PROGRESS'),
    ['rf34tsvdf']: createColumn('rf34tsvdf', ColumnType.DONE, 'DONE'),
  });

  // add new task
  const addTask = (task: Task, columnId: string): void => {
    const column = { ...columns[columnId] };
    column.tasks.push(task);
    setColumns(prev => ({
      ...prev,
      [columnId]: column
    }));
  };

  // handle drag end
  const onDragEnd = (result: DropResult): void => {
    const { source, destination, draggableId } = result;
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const task = sourceCol.tasks[source.index];
    sourceCol.tasks.splice(source.index, 1);
    destCol.tasks.splice(destination.index, 0, task);
    
    setColumns(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    }));
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TaskForm openColumn={openColumn} setOpenColumn={setOpenColumn} addTask={addTask} />

      {/* appbar */}
      <Box sx={{
        position: 'fixed', top: 0, left: SIDEBAR_WIDTH + 1, width: `calc(100% - ${SIDEBAR_WIDTH - 1}px)`,
        zIndex: 10, bgcolor: 'background.paper'
      }}>
        <SprintPageAppBar project={project} sprint={sprint} mode={mode} setMode={setMode} />
      </Box>

      {/* dashboard */}
      <Box sx={{ overflowX: 'auto', overflowY: 'auto', mt: `${TASK_PAGE_APPBAR_HEIGHT}px` }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 4, p: 2 }}>
            {Object.values(columns).map((column) => (
              <TaskColumn key={column.id} column={column} setOpenColumn={setOpenColumn} />
            ))}
          </Box>
        </DragDropContext>
      </Box>
    </main>
  );
};