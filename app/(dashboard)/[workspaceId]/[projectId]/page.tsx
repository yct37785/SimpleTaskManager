'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// components
import { Box, Typography } from '@mui/material';
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

  // document title
  useEffect(() => {
    if (workspace && project) {
      document.title = `${workspace.title} - ${project.title} | Task Manager`;
    } else {
      document.title = 'Task Manager';
    }
  }, [workspace, project]);

  return (
    <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
        Project dashboard
      </Typography>
    </main>
  );
};