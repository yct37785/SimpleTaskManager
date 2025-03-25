'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// components
import { Box, Typography } from '@mui/material';
// contexts
import { useProjectsManager } from '@contexts/ProjectsContext';

/**
 * project dashboard
 */
export default function ProjectPage() {
  // get IDs from URL
  const { project: projectId } = useParams() as { project: string };

  // context
  const { projects } = useProjectsManager();
  const project = projects[projectId];

  // document title
  useEffect(() => {
    if (project) {
      document.title = `${project.title} | Task Manager`;
    } else {
      document.title = 'Task Manager';
    }
  }, [project]);


  return (
    <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
        Project page
      </Typography>
    </main>
  );
};