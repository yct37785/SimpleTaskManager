'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Divider, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetimeUtils';
// our components
import RangeCalendar from '@components/Calendar/RangeCalendar';
import CalendarPicker from '@components/Calendar/CalendarPicker';
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

  /**
   * sprints list
   */
  const sprintsList = () => {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant='h6' fontWeight={500} sx={{ mb: 2 }}>Sprints</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {project.sprints.map((sprint, idx) => (
            <Box
              key={idx}
              sx={{
                minWidth: 200,
                maxWidth: 280,
                p: 2,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.paper',
                boxShadow: 1,
                flex: '1 1 auto'
              }}
            >
              <Typography variant='subtitle1' fontWeight={600}>
                {sprint.title}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ mt: 0.5, lineHeight: 1.4 }}
              >
                {sprint.desc}
              </Typography>
            </Box>
          ))}

          {/* add sprint */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 200,
              maxWidth: 280,
              p: 2,
              borderRadius: 2,
              border: '1px dashed',
              borderColor: 'primary.main',
              color: 'primary.main',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: 'white'
              }
            }}
            onClick={() => {
              // TODO: open your add sprint dialog here
              console.log('Add Sprint clicked');
            }}
          >
            <Typography variant='body1' fontWeight={500}>
              + Add Sprint
            </Typography>
          </Box>
        </Box>
      </Box>
    )
  };

  return (
    <main style={{ height: '100vh', overflow: 'auto', padding: '2rem' }}>
      <Box>
        {projectDetailsBar()}
        <Divider sx={{ mb: 3 }} />
        {sprintsList()}
      </Box>
    </main>
  );
};