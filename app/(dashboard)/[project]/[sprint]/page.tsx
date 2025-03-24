'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
// components
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Box } from '@mui/material';
import TaskForm from '@components/TaskForm/TaskForm';
import TaskColumn from '@components/TaskColumn/TaskColumn';
import SprintPageAppBar from './SprintPageAppBar';
// contexts
import { useProjectsManager } from '@contexts/ProjectsContext';
// types
import { Task } from '@defines/schemas';
import { SIDEBAR_WIDTH, TASK_PAGE_APPBAR_HEIGHT } from '@defines/consts';

/**
 * sprint dashboard
 */
export default function SprintPage() {
  // get IDs from URL
  const { project: projectId, sprint: sprintId } = useParams() as { project: string; sprint: string };

  // context
  const { projects, addTask, moveTask } = useProjectsManager();
  const project = projects[projectId];
  const sprint = project?.sprints[sprintId];
  const columns = sprint?.columns || [];

  // local state
  const [mode, setMode] = useState(0); // 0 = List, 1 = Calendar
  const [openColumn, setOpenColumn] = useState('');  // columnId to add task to

  // add task handler
  const handleAddTask = (task: Task, columnId: string): void => {
    if (!project || !sprint) return;
    addTask(projectId, sprintId, columnId, task);
  };

  // drag-and-drop task movement
  const onDragEnd = (result: DropResult): void => {
    if (!project || !sprint) return;
    const { source, destination } = result;
    if (!destination) return;

    moveTask(
      projectId,
      sprintId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TaskForm openColumn={openColumn} setOpenColumn={setOpenColumn} addTask={handleAddTask} />

      {/* AppBar */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: SIDEBAR_WIDTH + 1,
        width: `calc(100% - ${SIDEBAR_WIDTH - 1}px)`,
        zIndex: 10,
        bgcolor: 'background.paper'
      }}>
        <SprintPageAppBar project={project?.title || ''} sprint={sprint?.title || ''} mode={mode} setMode={setMode} />
      </Box>

      {/* Board */}
      <Box sx={{ mt: `${TASK_PAGE_APPBAR_HEIGHT}px` }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 4, p: 2 }}>
            {columns.map((column) => (
              <TaskColumn key={column.id} column={column} setOpenColumn={setOpenColumn} />
            ))}
          </Box>
        </DragDropContext>
      </Box>
    </main>
  );
};