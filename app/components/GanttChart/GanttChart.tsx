'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, IconButton, Stack, Divider, Tooltip, useTheme, Button
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
// pages
import SprintForm from '@components/Forms/SprintForm';
// our components
import { useWorkspacesManager } from '@globals/WorkspacesContext';
// utils
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { v4 as uuidv4 } from 'uuid';
import { formatDateToISO, addDays, getDaysBetween, formatISOToDate } from '@utils/datetime';
import { disableHorizontalWheelScroll } from '@utils/UI';
import { GanttTask, formatSprintsToGanttTasks, formatGanttTaskToSprint } from './GanttChartUtils';
// schemas
import { Workspace, Project, Sprint } from '@schemas';
// styles
import './frappe-gantt.css';
import './frappe-gantt-custom.css';
const chart_top_bar_height = 45;
const upper_header_height = 40;
const lower_header_height = 30;
const column_width = 45;

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  title?: string;
  workspaceId: string;
  project: Project;
  heightOffset?: number;
};

/********************************************************************************************************************
 * reusable Frappe Gantt chart component
 ********************************************************************************************************************/
export default function GanttChart({
  title,
  workspaceId,
  project,
  heightOffset = 0}: Props) {
  const { updateSprint } = useWorkspacesManager();

  const [editMode, setEditMode] = useState(false);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(formatSprintsToGanttTasks(project.sprints));
  
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  const windowHeight = useWindowHeight();
  const theme = useTheme();

  /******************************************************************************************************************
   * Gantt instance
   * - scroll to current day
   * - scroll to new task
   * - persist prevScrollX
   ******************************************************************************************************************/
  function initGanttInstance() {
    requestAnimationFrame(() => {
      if (!ganttRef.current) return;

      // clear existing chart
      ganttRef.current.innerHTML = '';
      console.log('Gantt init');

      // create Gantt chart
      ganttInstance.current = new Gantt(ganttRef.current, ganttTasks, {
        readonly: !editMode,
        column_width,
        infinite_padding: true,
        move_dependencies: false,
        view_mode_select: false,
        upper_header_height,
        lower_header_height,
        bar_height: 40,
        padding: 16,
        container_height: windowHeight - chart_top_bar_height - upper_header_height - lower_header_height - heightOffset + 40,
        lines: 'both',
        popup_on: 'click',
        view_mode: 'Day',
        date_format: 'DD-MM-YYYY',
        snap_at: '1d',
        on_date_change: (task: GanttTask, start: Date, end: Date) => handleDateChange(task, start, end),
      });
    });
  }

  /******************************************************************************************************************
   * refresh state
   ******************************************************************************************************************/
  // on window height change
  useEffect(() => {
    if (windowHeight !== 0) {
      initGanttInstance();
    }
  }, [windowHeight]);

  /******************************************************************************************************************
   * handle task manipulations
   ******************************************************************************************************************/
  function handleDateChange(ganttTask: GanttTask, start: Date, end: Date) {
    // build new updated task
    const updatedTask: GanttTask = {
      ...ganttTask,
      start: formatDateToISO(start),
      end: formatDateToISO(addDays(end, 1)), // +1 day as end is exclusive
    };

    // add to tasks
    setGanttTasks(prevTasks =>
      prevTasks.map(t => t.id === ganttTask.id ? updatedTask : t)
    );
  }

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  function toggleEditMode(editMode: boolean) {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({ readonly: !editMode });
      setEditMode(editMode);
    }
  }

  function handleConfirmEdits() {
    if (!ganttInstance.current) return;

    // apply updates to the Gantt chart
    ganttTasks.forEach((ganttTask) => {
      ganttInstance.current.update_task(ganttTask.id, ganttTask);
    });

    // apply updates to the global state
    ganttTasks.forEach((ganttTask) => {
      const originalSprint = project.sprints.find(s => s.id === ganttTask.id);
      if (originalSprint) {
        const updatedSprint = formatGanttTaskToSprint(ganttTask, originalSprint);
        updateSprint(workspaceId, project.id, updatedSprint);
      }
    });

    toggleEditMode(false);
  }

  function handleCancelEdits() {
    // reset back to prev state
    setGanttTasks(formatSprintsToGanttTasks(project.sprints));
    toggleEditMode(false);
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
    {/* create sprint form */}
    {project ? <SprintForm
        project={project}
        sprintDialogOpen={sprintDialogOpen}
        handleCreateSprint={() => {}}
        closeSprintDialog={() => setSprintDialogOpen(false)} /> : null}
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>

        {/* top bar */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: chart_top_bar_height, px: 2 }}>
          <Stack direction='row' alignItems='center'>
            <Typography variant='subtitle1' fontWeight={600}>
              {title}
            </Typography>
            <Tooltip title='Create'>
              <IconButton size='small' color='primary' sx={{ ml: 1 }} onClick={() => {}}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {!editMode ? (
            <Button
              onClick={() => toggleEditMode(true)}
              variant='text'
              size='small'
              startIcon={<EditIcon />}
            >
              Edit
            </Button>
          ) : (
            <Stack direction='row' spacing={1}>
              <Button onClick={handleConfirmEdits} color='primary' variant='outlined' size='small' startIcon={<CheckIcon />}>
                Confirm
              </Button>
              <Button onClick={handleCancelEdits} color='inherit' variant='outlined' size='small' startIcon={<CloseIcon />}>
                Cancel
              </Button>
            </Stack>
          )}
        </Stack>

        <Divider />

        {/* Gantt chart */}
        <Box sx={{ px: 2, pb: 1 }}>
          <div ref={ganttRef} />
        </Box>
      </Box>
    </Box>
    </>
  );
}
