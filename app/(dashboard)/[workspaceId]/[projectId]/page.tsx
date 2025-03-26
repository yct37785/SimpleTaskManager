'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
// components
import { Box, Container, Typography, Divider } from '@mui/material';
import CalendarSlider from '@components/CalenderSlider/CalenderSlider';
import dayjs from 'dayjs';
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

  const today = dayjs().startOf('day').unix();
  const thirtyDaysLater = dayjs().add(30, 'day').startOf('day').unix();

  const [projectRange, setProjectRange] = useState<[number, number]>([
    today,
    today + 7 * 86400,
  ]);

  const [sprintRange, setSprintRange] = useState<[number, number]>([
    today + 2 * 86400,
    today + 5 * 86400,
  ]);

  useEffect(() => {
    if (workspace && project) {
      document.title = `${workspace.title} - ${project.title} | Task Manager`;
    } else {
      document.title = 'Task Manager';
    }
  }, [workspace, project]);

  if (!workspace || !project) {
    return <div>Invalid workspace or project</div>;
  }

  return (
    <main style={{ height: '100vh', overflow: 'auto', padding: '2rem' }}>
      <Container maxWidth='md'>
        <Typography variant='h4' gutterBottom>
          {project.title}
        </Typography>
        <Typography variant='subtitle1' color='text.secondary' gutterBottom>
          Workspace: {workspace.title}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <CalendarSlider
          label='Project Duration'
          range={projectRange}
          setRange={setProjectRange}
          minEpoch={today}
          maxEpoch={thirtyDaysLater}
        />

        <Divider sx={{ my: 4 }} />

        <CalendarSlider
          label='Sprint Duration (must fit within project)'
          range={sprintRange}
          setRange={setSprintRange}
          minEpoch={projectRange[0]}
          maxEpoch={projectRange[1]}
        />
      </Container>
    </main>
  );
};