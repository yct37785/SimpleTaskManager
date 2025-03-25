'use client';

import { useEffect } from 'react';
// components
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
// contexts
import { useProjectsManager } from '@contexts/ProjectsContext';

/**
 * home dashboard
 */
export default function Home() {
  const { projects } = useProjectsManager();

  const hasProjects = Object.keys(projects).length > 0;
  if (hasProjects) return null;

  // document title
  useEffect(() => {
    document.title = 'Task Manager';
  }, []);

  return (
    <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

      <Box sx={{ maxWidth: 500 }}>
        <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
          Welcome to Task Manager
        </Typography>
        <Typography variant='h6' color='text.secondary' sx={{ fontWeight: 500, textAlign: 'left' }}>
          Get started by creating a <strong>project</strong> to organize your work efficiently.
        </Typography>
        <Typography variant='h6' color='text.secondary' sx={{ fontWeight: 500, textAlign: 'left', mt: 2 }}>
          Within each project, add <strong>sprints</strong> to break down tasks and track progress.
        </Typography>
      </Box>

      <Box sx={{ position: 'absolute', top: '120px', left: '300px' }}>
        <Image src='/arrow.svg' alt='Arrow pointing to sidebar' width={100} height={100} 
        style={{ transform: 'scale(1, -1) rotate(20deg)', position: 'absolute', top: '8px' }} />
        <Typography variant='body1' fontWeight='bold' color='text.secondary' sx={{ ml: '40px' }}>
          Click <strong>'Add Project'</strong> in the sidebar!
        </Typography>
      </Box>

    </main>
  );
};