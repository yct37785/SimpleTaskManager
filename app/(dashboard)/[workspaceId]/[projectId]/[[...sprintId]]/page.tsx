'use client';

import { useState, useEffect, memo } from 'react';
// next
import { useRouter, useParams } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// utils
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { getRelativeTime } from '@utils/datetime';
// our components
import GanttChart from '@components/GanttChart/GanttChart';
import { useWorkspacesManager } from '@globals/WorkspacesContext';
import ProjectForm from '@components/Forms/ProjectForm';
import Drawer from '@UI/Drawer/Drawer';
// styles
import { project_details_bar_height, appbar_height } from '@styles/dimens';
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * project dashboard
 ********************************************************************************************************************/
export default function ProjectPage() {
  const router = useRouter();
  const { workspaceId, projectId, sprintId } = useParams() as {
    workspaceId: string;
    projectId: string;
    sprintId?: string[];
  };
  const selectedSprintId = sprintId?.[0];
  const { workspaces, getProject, updateProjectFields } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const project = getProject(workspaceId, projectId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (!workspace || !project) {
    return <div>Invalid workspace or project</div>;
  }

  /******************************************************************************************************************
   * URL state management
   ******************************************************************************************************************/
  useEffect(() => {
    setDrawerOpen(!!selectedSprintId);
  }, [selectedSprintId]);

  /******************************************************************************************************************
   * inject demo sprints into local state
   ******************************************************************************************************************/
  useEffect(() => {
    document.title = project ? `${workspace.title} - ${project.title} | Task Manager` : 'Task Manager';
  }, [workspace, project]);

  /******************************************************************************************************************
   * edit project
   ******************************************************************************************************************/
  const handleEditProject = (title: string, desc: string, dueDate: CalendarDate) => {
    if (workspaceId && projectId) {
      updateProjectFields(workspaceId, projectId, { title, desc, dueDate } );
    }
  };

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
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ mt: 0.5 }}>
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
      {/* sprint dashboard */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* edit project form */}
      {project ? <ProjectForm
        workspace={workspaces[workspaceId]}
        project={project}
        projectDialogOpen={editDialogOpen}
        onSubmitProject={handleEditProject}
        closeProjectDialog={() => setEditDialogOpen(false)} /> : null}

      {/* project details top bar */}
      {projectDetailsBar()}

      {/* project Gantt chart */}
      <GanttChart
        title='Sprints'
        workspaceId={workspaceId}
        project={project}
        heightOffset={project_details_bar_height + appbar_height}
        onSprintSelected={(sprintId) => {
          router.push(`/${workspaceId}/${projectId}/${sprintId}`);
        }}
      />
    </Box>
  );
}
