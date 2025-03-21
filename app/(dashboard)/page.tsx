'use client';

// components
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
// contexts
import { useProjects } from '@contexts/ProjectContext';

/**
 * home dashboard
 */
export default function Home() {
  const { projects } = useProjects();

  const hasProjects = Object.keys(projects).length > 0;
  if (hasProjects) return null;

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

      <Box sx={{ position: 'absolute', top: '7%', left: '23%', display: 'flex', alignItems: 'center' }}>
        <Image src='/arrow.svg' alt='Arrow pointing to sidebar' width={100} height={100} 
        style={{ transform: 'rotate(20deg)' }} />
        <Typography variant='body1' fontWeight='bold' color='text.secondary' sx={{ mt: 5, ml: 2 }}>
          Click <strong>'Add Project'</strong> in the sidebar!
        </Typography>
      </Box>

    </main>
  );
};