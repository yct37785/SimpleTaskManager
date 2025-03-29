'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Container, Typography, Divider } from '@mui/material';
// our components
import RangeCalendar from '@components/Calendar/RangeCalendar';
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
          highlightRanges={[
            { start: new Date(2025, 3, 1), end: new Date(2025, 3, 7), color: 'lightgreen' },
            { start: new Date(2025, 3, 15), end: new Date(2025, 3, 20), color: 'lightblue' },
          ]}
        />
      </Box>
    </main>
  );
};