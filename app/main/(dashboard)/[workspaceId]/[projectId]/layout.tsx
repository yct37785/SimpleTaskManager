'use client';

import { useState, useEffect } from 'react';
// next
import { useParams, useRouter } from 'next/navigation';
// MUI
import { Box, Skeleton } from '@mui/material';
// comps
import GanttChart from '@components/GanttChart/GanttChart';
import SprintDashboard from '@components/Sprint/Dashboard';
import Drawer from '@UI/Drawer/Drawer';
import ProjectDetailsBar from '@/app/components/Project/ProjectDetailsBar';
// contexts
import { useWorkspacesManager } from '@contexts/WorkspacesContext';
// const
import { project_details_bar_height, appbar_height, mock_elapse } from '@const';

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
  const { workspaces, getProject } = useWorkspacesManager();
  const workspace = workspaces[workspaceId];
  const project = getProject(workspaceId, projectId);
  const router = useRouter();

  // UI
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

      {/* project details bar */}
      <ProjectDetailsBar
        workspaceId={workspaceId}
        workspaceTitle={workspaces[workspaceId].title}
        project={project}
        loading={loading}
      />

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
