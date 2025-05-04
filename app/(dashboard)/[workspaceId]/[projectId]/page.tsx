'use client';

import { useState, useEffect, useMemo } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// utils
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { getRelativeTime, formatISOToDate, dateToCalendarDate } from '@utils/datetime';
import { v4 as uuidv4 } from 'uuid';
// our components
import GanttChart from '@components/GanttChart/GanttChart';
import { useWorkspacesManager } from '@globals/WorkspacesContext';
// schemas
import { Project, Sprint } from '@schemas';
// styles
import { project_details_bar_height, appbar_height } from '@styles/dimens';
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * project dashboard
 ********************************************************************************************************************/
export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string; projectId: string };
  const { workspaces, getProject } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const project = getProject(workspaceId, projectId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  /******************************************************************************************************************
   * inject demo sprints into local state
   ******************************************************************************************************************/
  useEffect(() => {
    document.title = project ? `${workspace.title} - ${project.title} | Task Manager` : 'Task Manager';
  }, [workspace, project]);

  if (!workspace || !project) {
    return <div>Invalid workspace or project</div>;
  }

  /******************************************************************************************************************
   * project details
   ******************************************************************************************************************/
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
    const dueDate: CalendarDate = project.dueDate;
    const now: CalendarDate = today(getLocalTimeZone());

    const formattedDue = `${dueDate.day}/${dueDate.month}/${dueDate.year}`;
    const relativeDue = getRelativeTime(now, dueDate);
    const description = project.desc || fallbackDesc;
    // const description = fallbackDesc;

    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2, minHeight: project_details_bar_height }}>
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

          <Box sx={{ mt: 2, mr: 6 }}>
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

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box>
      {projectDetailsBar()}
      <GanttChart
        title='Sprints'
        workspaceId={workspaceId}
        project={project}
        heightOffset={project_details_bar_height + appbar_height}
      />
    </Box>
  );
}
