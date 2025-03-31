'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Divider, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// others
import { getLocalTimeZone } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetimeUtils';
// our components
import RangeCalendar from '@components/Calendar/RangeCalendar';
import CalendarPicker from '@components/Calendar/CalendarPicker';
import { useWorkspacesManager } from '@contexts/WorkspacesContext';

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
        sx={{
          lineHeight: 1.5,
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: showFullDesc ? 'none' : 3,
        }}
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
    const dueDate = project.endDate.toDate(getLocalTimeZone());
    const now = new Date();
    const formattedDue = dueDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
              {`Due by: ${formattedDue} (${relativeDue})`}
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
        <RangeCalendar
          cellSize={48}
          dayOfWeekFontSize='1.2rem'
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