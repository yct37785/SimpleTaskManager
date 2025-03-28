'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// components
import { Box, Container, Typography, Divider } from '@mui/material';
import RangeCalendar from '@/app/components/NewCalendar/RangeCalendar';
// contexts
import { useWorkspacesManager } from '@contexts/WorkspacesContext';

/**
 * project dashboard
 */
export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string, projectId: string };
  const { workspaces } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const project = workspace?.projects[projectId];

  if (!workspace || !project) {
    return <div>Invalid workspace or project</div>;
  }

  useEffect(() => {
    if (workspace && project) {
      document.title = `${workspace.title} - ${project.title} | Task Manager`;
    } else {
      document.title = 'Task Manager';
    }
  }, [workspace, project]);

  return (
    <main style={{ height: '100vh', overflow: 'auto', padding: '2rem' }}>
      <Box>
        <RangeCalendar
          cellSize={48}
          fontSize='1rem'
          highlightRanges={[
            { start: new Date(2025, 3, 1), end: new Date(2025, 3, 7), color: 'lightgreen' },
            { start: new Date(2025, 3, 15), end: new Date(2025, 3, 20), color: 'lightblue' },
          ]}
        />
      </Box>
    </main>
  );
};