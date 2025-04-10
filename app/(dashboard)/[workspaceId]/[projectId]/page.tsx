'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Divider, Tooltip, Button, IconButton, Stack, Card, CardContent, CardActionArea } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon, Add as AddIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetimeUtils';
// our components
import RangeCalendar from '@components/Calendar/RangeCalendar';
import CalendarPicker from '@components/Calendar/CalendarPicker';
import SprintList from './SprintList';
import { useWorkspacesManager } from '@contexts/WorkspacesContext';
// styles
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/**
 * project dashboard
 */
export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string, projectId: string };
  const { workspaces } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const project = workspace?.projects[projectId];

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

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

  /**
   * toggle desc
   */
  const projectDesc = (description: string) => {
    return <Box>
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
  };

  /**
   * project details dashboard
   */
  const projectDetailsBar = () => {
    const dueDate: CalendarDate = project.endDate;
    const now: CalendarDate = today(getLocalTimeZone());

    const formattedDue = `${dueDate.month}/${dueDate.day}/${dueDate.year}`;
    const relativeDue = getRelativeTime(now, dueDate);
    const description = project.desc || fallbackDesc;

    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant='h5' fontWeight={600}>
            {`${workspace.title} - ${project.title}`}
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
      <Box>
        {projectDetailsBar()}
        <Divider sx={{ mb: 3 }} />
        <SprintList />
      </Box>
    </main>
  );
};