'use client';

import { useState, useEffect, useMemo } from 'react';
// next
import { useParams } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// date
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
// utils
import { getRelativeTime, formatISOToDate, dateToCalendarDate } from '@utils/datetime';
// our components
import GanttChart, { GanttTask } from '@UI/GanttChart/GanttChart';
import { useWorkspacesManager } from '@globals/WorkspacesContext';
import SprintForm from '@components/Forms/SprintForm';
// schemas
import { Project, Sprint } from '@schemas';
// styles
import { project_details_bar_height, appbar_height } from '@styles/dimens';
import styles from './ProjectPage.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * format sprints into Frappe Gantt-compatible structure
 ********************************************************************************************************************/
function formatSprintToTask(sprint: Sprint): GanttTask {
  return {
    id: sprint.id,
    name: sprint.title,
    start: sprint.startDate.toString(),
    end: sprint.dueDate.toString(),
    progress: 70, // placeholder
    custom_class: 'gantt-task-bar',
  }
}

function formatSprintsToTasks(sprints: Project['sprints']): GanttTask[] {
  return sprints.map((sprint) => formatSprintToTask(sprint));
}

/********************************************************************************************************************
 * project dashboard
 ********************************************************************************************************************/
export default function ProjectPage() {
  const { workspaceId, projectId } = useParams() as { workspaceId: string; projectId: string };
  const { workspaces, createSprint, updateSprints } = useWorkspacesManager();

  const workspace = workspaces[workspaceId];
  const project = workspace?.projects[projectId];

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [newSprint, setNewSprint] = useState<Sprint | null>(null);

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
   * update global project data
   ******************************************************************************************************************/
  const handleUpdateSprints = (latestTasks: GanttTask[]) => {
    const updatedSprints = latestTasks.map((task): Sprint => {
      const existing = project.sprints.find((s) => s.id === task.id);
      return {
        ...existing!,
        title: task.name,
        startDate: dateToCalendarDate(formatISOToDate(task.start)),
        dueDate: dateToCalendarDate(formatISOToDate(task.end)),
      };
    });
    updateSprints(workspaceId, projectId, updatedSprints);
  };

  const handleCreateSprint = (title: string, desc: string) => {
    const newSprint = {
      id: 'temp',
      title,
      desc,
      startDate: new CalendarDate(2025, 4, 28),
      dueDate: new CalendarDate(2025, 5, 10),
      tasks: []
    };
    setNewSprint(newSprint);
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
        tasks={formatSprintsToTasks(project.sprints)}
        newTaskTemp={newSprint ? formatSprintToTask(newSprint) : null}
        resetNewTaskTemp={() => setNewSprint(null)}
        deadline={project.dueDate}
        heightOffset={project_details_bar_height + appbar_height}
        onCreateClick={() => setSprintDialogOpen(true)}
      />
      {/* create sprint form */}
      {project ? <SprintForm
        project={project}
        sprintDialogOpen={sprintDialogOpen}
        handleCreateSprint={handleCreateSprint}
        closeSprintDialog={() => setSprintDialogOpen(false)} /> : null}
    </Box>
  );
}
