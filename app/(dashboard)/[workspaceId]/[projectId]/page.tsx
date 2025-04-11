'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import {
  Box, Typography, Divider, Tooltip, IconButton, Stack
} from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate, parseDate } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetimeUtils';
// our components
import SprintList from './SprintList';
import { useWorkspacesManager } from '@contexts/WorkspacesContext';
// types
import { Project } from '@defines/schemas';
// styles
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...';

export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string, projectId: string };
  const { workspaces } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const originalProject = workspace?.projects[projectId];

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);

  // inject demo sprints into local state
  useEffect(() => {
    if (workspace && originalProject) {
      document.title = `${workspace.title} - ${originalProject.title} | Task Manager`;

      // clone and safely mutate
      const clonedProject: Project = {
        ...originalProject,
        sprints: [...originalProject.sprints]
      };

      setProjectData(clonedProject);
    } else {
      document.title = 'Task Manager';
    }
  }, [workspace, originalProject]);

  if (!workspace || !originalProject) {
    return <div>Invalid workspace or project</div>;
  }

  const projectDesc = (description: string) => (
    <Box>
      <Typography
        variant='body2'
        color='text.secondary'
        className={`${styles.projectDesc} ${!showFullDesc ? styles.projectDescCollapsed : ''}`}
      >
        {description}
      </Typography>

      {description.length > 200 && (
        <Typography
          variant='caption'
          color='primary'
          sx={{ cursor: 'pointer', mt: 0.5, display: 'inline-block' }}
          onClick={() => setShowFullDesc(prev => !prev)}
        >
          {showFullDesc ? 'Show less' : 'Show more'}
        </Typography>
      )}
    </Box>
  );

  const projectDetailsBar = () => {
    const dueDate: CalendarDate = originalProject.endDate;
    const now: CalendarDate = today(getLocalTimeZone());

    const formattedDue = `${dueDate.month}/${dueDate.day}/${dueDate.year}`;
    const relativeDue = getRelativeTime(now, dueDate);
    const description = originalProject.desc || fallbackDesc;

    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant='h5' fontWeight={600}>
            {`${workspace.title} - ${originalProject.title}`}
          </Typography>

          <Stack direction='row' alignItems='center' spacing={0.5} mt={1}>
            <CalendarMonthIcon fontSize='small' color='action' />
            <Typography variant='subtitle2' color='text.secondary'>
              {`Complete by: ${formattedDue} (${relativeDue})`}
            </Typography>
          </Stack>

          <Box sx={{ mt: 2, maxWidth: '80ch' }}>
            {projectDesc(description)}
          </Box>
        </Box>

        <Tooltip title='Edit Project'>
          <IconButton onClick={() => setEditDialogOpen(true)} sx={{ mt: 0.5 }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  return (
    <main style={{ height: '100vh', overflow: 'auto', padding: '2rem' }}>
      <Box sx={{ height: '100%' }}>
        {projectDetailsBar()}
        <Divider sx={{ mb: 3 }} />
        {projectData && <SprintList project={projectData} />}
      </Box>
    </main>
  );
}
