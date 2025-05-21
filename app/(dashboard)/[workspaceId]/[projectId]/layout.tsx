'use client';

import { useState, useEffect } from 'react';
// next
import { useParams, useRouter } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack, Skeleton } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// utils
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { getRelativeTime } from '@utils/datetime';
// our components
import GanttChart from '@components/GanttChart/GanttChart';
import { useWorkspacesManager } from '@hooks/WorkspacesContext';
import ProjectForm from '@components/Forms/ProjectForm';
import SprintDashboard from '@components/Sprint/Dashboard';
import Drawer from '@UI/Drawer/Drawer';
// const
import { project_details_bar_height, appbar_height, mock_elapse } from '@const';
// styles
import styles from './ProjectDashboard.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * project dashboard
 ********************************************************************************************************************/
export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { workspaceId, projectId, sprintId } = useParams() as {
    workspaceId: string;
    projectId: string;
    sprintId?: string;
  };
  // contexts
  const { workspaces, getProject, updateProjectFields } = useWorkspacesManager();
  const workspace = workspaces[workspaceId];
  const project = getProject(workspaceId, projectId);
  const router = useRouter();

  // UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!project || !workspace) return <div>workspace or project not found</div>;

  /******************************************************************************************************************
   * load data
   ******************************************************************************************************************/
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), mock_elapse);
    return () => clearTimeout(timer);
  }, []);

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
   * edit project
   ******************************************************************************************************************/
  const handleEditProject = async (title: string, desc: string, dueDate: CalendarDate) => {
    if (workspaceId && projectId) {
      await new Promise(res => setTimeout(res, mock_elapse));
      updateProjectFields(workspaceId, projectId, { title, desc, dueDate });
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
          {!loading ?
            <Box sx={{ height: 32 }}>
              <Typography variant='h5' fontWeight={600}>
                {`${workspace.title} - ${project.title}`}
              </Typography>
            </Box> :
            <Skeleton width='50%' height={32} />}

          <Stack sx={{ height: 22 }} direction='row' alignItems='center' spacing={0.5} mt={1}>
            <CalendarMonthIcon fontSize='small' color='action' />
            {!loading ?
              <Typography variant='subtitle2' color='text.secondary'>
                {`Complete by: ${formattedDue} (${relativeDue})`}
              </Typography> :
              <Skeleton width='30%' height={22} />}
          </Stack>

          {!loading ?
            <Box sx={{ mt: 2, mr: 6 }}>
              {projectDesc(description)}
            </Box> :
            <Box sx={{ mt: 1 }}>
              <Skeleton width='100%' height={32} />
            </Box>}
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
   * sprint
   ******************************************************************************************************************/
  useEffect(() => {
    setDrawerOpen(!!sprintId);
  }, [sprintId]);

  function onSprintSelected(id: string) {
    router.push(`/${workspaceId}/${projectId}/${id}`);
  }

  function onDrawerClose() {
    if (window.history.length <= 1 || !sprintId) {
      router.push(`/${workspaceId}/${projectId}`);
    } else {
      router.back();
    }
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box>
      {/* sprint dashboard */}
      <Drawer open={drawerOpen} onClose={onDrawerClose} title={`${project.title}`}>
        <SprintDashboard
          workspaceId={workspaceId}
          project={project}
          sprintId={sprintId}
        />
      </Drawer>

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
      {!loading ?
        <GanttChart
          title='Sprints'
          workspaceId={workspaceId}
          project={project}
          heightOffset={project_details_bar_height + appbar_height}
          onSprintSelected={onSprintSelected}
        /> :
        <Box sx={{ px: 2, py: 2 }}>
          <Skeleton variant='rectangular' width='100%' sx={{
            height: `calc(85vh - ${project_details_bar_height + appbar_height}px)`
          }} />
        </Box>}
    </Box>
  );
}
