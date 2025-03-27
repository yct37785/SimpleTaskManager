'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// components
import { Box, Container, Typography, Divider } from '@mui/material';
import SprintRangeCalendar from '@components/Calendar/SprintRangeCalendar';
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
        <SprintRangeCalendar />
      </Box>
    </main>
  );
};