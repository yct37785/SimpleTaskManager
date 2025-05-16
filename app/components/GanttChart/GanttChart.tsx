'use client';

import { useEffect, useRef, useState, memo } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, IconButton, Stack, Divider, Tooltip, useTheme, Button
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
import { useWorkspacesManager } from '@globals/WorkspacesContext';
// our components
import SprintForm from '@components/Forms/SprintForm';
import GanttChartConfirmDialog from './GanttChartConfirmDialog';
// Gantt chart utils
import { getGanttContainerEL, markDeadline, doCustomScroll, enableGanttDragScroll } from './GanttChartBehavior';
import { GanttTask, formatToGanttTasks, handleDateChange, addNewSprint, applyUpdatedSprints } from './GanttChartLogic';
// schemas
import { Project } from '@schemas';
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
  onSprintSelected: (id: string) => void;
};

/********************************************************************************************************************
 * reusable Frappe Gantt chart component
 ********************************************************************************************************************/
function GanttChart({
  title = 'Gantt Chart',
  workspaceId,
  project,
  heightOffset = 0,
  onSprintSelected }: Props) {
  // safeguards
  if (!project) return;

  // states
  const [initialInit, setInitialInit] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [draftTasks, setDraftTasks] = useState<Record<string, GanttTask>>({});
  const [sprintAdded, setSprintAdded] = useState(false);
  const [changesCancelled, setChangesCancelled] = useState(false);
  
  // refs
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const currProjectDueDate = useRef<String>('');

  // contexts
  const { createSprint, updateSprint } = useWorkspacesManager();
  const windowHeight = useWindowHeight();
  const theme = useTheme();

  /******************************************************************************************************************
   * Gantt instance
   * - scroll to current day
   * - scroll to new task
   * - persist prevScrollX
   ******************************************************************************************************************/
  function initGanttInstance(highlightLastTask: boolean) {
    requestAnimationFrame(() => {
      if (!ganttRef.current) return;

      // prev scroll
      const container = getGanttContainerEL(ganttRef);
      let scrollToX = container?.scrollLeft ?? 0;
      let scrollToY = container?.scrollTop ?? 0;

      // clear existing chart
      ganttRef.current.innerHTML = '';
      console.log('Gantt init');

      // curr tasks
      const currTasks = formatToGanttTasks(project.sprints, draftTasks);

      // create Gantt chart
      ganttInstance.current = new Gantt(ganttRef.current, currTasks, {
        readonly: false,
        readonly_dates: !editMode,
        readonly_progress: !editMode,
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
        on_date_change: (task: GanttTask, start: Date, end: Date) => handleDateChange(task, start, end, draftTasks, setDraftTasks),
        on_click: assignSprintClickHandler(editMode)
      });

      if (initialInit) {
        setInitialInit(false);
      }

      // DOM manipulation
      if (!initialInit) {
        doCustomScroll(ganttInstance, ganttRef, scrollToX, scrollToY, highlightLastTask, currTasks, column_width);
      }
      injectStyles();

      // disable horizontal scroll wheel
      const cleanupScroll = enableGanttDragScroll(getGanttContainerEL(ganttRef));
      return () => cleanupScroll();
    });
  }

  /******************************************************************************************************************
   * DOM manipulation
   ******************************************************************************************************************/
  function injectStyles() {
    markDeadline(ganttInstance, ganttRef, project.dueDate, column_width);
  }

  /******************************************************************************************************************
   * hooks
   ******************************************************************************************************************/
  // on window height change
  useEffect(() => {
    if (windowHeight !== 0) {
      initGanttInstance(false);
    }
  }, [windowHeight]);

  // trigger for new sprint added
  useEffect(() => {
    if (sprintAdded) {
      initGanttInstance(true);
      setSprintAdded(false);
    }
  }, [sprintAdded]);

  // if changes cancelled
  useEffect(() => {
    if (changesCancelled) {
      initGanttInstance(false);
      setChangesCancelled(false);
    }
  }, [changesCancelled]);

  // if deadline changes
  useEffect(() => {
    const currDueDateStr = project.dueDate.toString();
    if (currProjectDueDate.current && currProjectDueDate.current !== currDueDateStr) {
      console.log('Due date changed: ' + project.dueDate.toString());
      injectStyles();
    }
    currProjectDueDate.current = currDueDateStr;
  }, [project.dueDate]);

  /******************************************************************************************************************
   * handle task manipulations
   ******************************************************************************************************************/
  function handleCreateSprint(title: string, desc: string) {
    addNewSprint(title, desc, project.sprints, draftTasks, setDraftTasks);
    // toggle edit mode immediately when new sprint added
    toggleEditMode(true);
    setSprintAdded(true);
  }

  /******************************************************************************************************************
   * handle state manipulations
   ******************************************************************************************************************/
  function assignSprintClickHandler(editMode: boolean) {
    return editMode
      ? () => { }
      : (task: GanttTask) => onSprintSelected(task.id);
  }

  async function handleConfirmEdits() {
    await new Promise(res => setTimeout(res, 1500));
    // apply changes to global state as well as Gantt chart programatically
    applyUpdatedSprints(ganttInstance, workspaceId, project, draftTasks, setDraftTasks, createSprint, updateSprint);
    toggleEditMode(false);
    setConfirmDialogOpen(false);
  }

  function handleCancelEdits() {
    // reset back to prev state
    setDraftTasks({});
    // refresh Gantt chart
    setChangesCancelled(true);
    toggleEditMode(false);
  }

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  function toggleEditMode(editMode: boolean) {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({
        readonly_dates: !editMode,
        readonly_progress: !editMode,
        on_click: assignSprintClickHandler(editMode),
      });
      setEditMode(editMode);
      injectStyles();
    }
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
        handleCreateSprint={handleCreateSprint}
        closeSprintDialog={() => setSprintDialogOpen(false)} /> : null}

      {/* confirm edits popup */}
      <GanttChartConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmEdits}
        project={project}
        draftTasks={draftTasks}
      />

      {/* main content */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>

          {/* top bar */}
          <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: chart_top_bar_height, px: 2 }}>
            <Stack direction='row' alignItems='center'>
              <Typography variant='subtitle1' fontWeight={600}>
                {title}
              </Typography>
              <Tooltip title='Create'>
                <IconButton size='small' color='primary' sx={{ ml: 1 }} onClick={() => setSprintDialogOpen(true)}>
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
                <Button onClick={() => setConfirmDialogOpen(true)} color='primary' variant='outlined' size='small' startIcon={<CheckIcon />}>
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

export default memo(GanttChart);