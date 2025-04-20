'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate, parseDate } from '@internationalized/date';
// utils
import { getRelativeTime } from '@utils/datetime';
// our components
import GanttChart, { GanttTask } from '@components/GanttChart/GanttChart';
import { useWorkspacesManager } from '@globals/WorkspacesContext';
// schemas
import { Project } from '@schemas';
// styles
import { project_details_bar_height } from '@styles/dimens';
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * format sprints into Frappe Gantt-compatible structure
 ********************************************************************************************************************/
function formatSprints(project: Project) {
  return project.sprints.map((sprint, index) => ({
    id: `${index}`,
    name: sprint.title,
    start: sprint.startDate.toString(),
    end: sprint.endDate.toString(),
    progress: 20, // placeholder
    custom_class: 'gantt-task-bar',
  }));
}

/********************************************************************************************************************
 * project dashboard
 ********************************************************************************************************************/
export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string, projectId: string };
  const { workspaces } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const originalProject = workspace?.projects[projectId];

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [projectData, setProjectData] = useState<Project | null>(null);

  /******************************************************************************************************************
   * inject demo sprints into local state
   ******************************************************************************************************************/
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
    const dueDate: CalendarDate = originalProject.endDate;
    const now: CalendarDate = today(getLocalTimeZone());

    const formattedDue = `${dueDate.day}/${dueDate.month}/${dueDate.year}`;
    const relativeDue = getRelativeTime(now, dueDate);
    const description = originalProject.desc || fallbackDesc;
    // const description = fallbackDesc;

    return (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 3, minHeight: project_details_bar_height }}>
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
      {projectData && <GanttChart
        title='Sprints'
        tasks={formatSprints(projectData)}
        deadline={projectData.endDate}
        onCreateClick={() => console.log('Create new sprint')}
      />}
    </Box>
  );
}
