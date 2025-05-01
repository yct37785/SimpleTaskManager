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
import { useWorkspacesManager } from '@globals/WorkspacesContext';
// pages
import SprintForm from '@components/Forms/SprintForm';
// Gantt chart utils
import { getGanttContainerEL, markDeadline, doCustomScroll, disableHorizontalWheelScroll } from './GanttChartBehavior';
import { GanttTask, formatSprintsToGanttTasks, formatGanttTaskToSprint, handleDateChange, addNewSprint, applyUpdatedSprints } from './GanttChartLogic';
// schemas
import { Project, Sprint } from '@schemas';
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

  const [initialInit, setInitialInit] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [sprintDialogOpen, setSprintDialogOpen] = useState(false);
  const [ganttTasks, setGanttTasks] = useState<GanttTask[]>(formatSprintsToGanttTasks(project.sprints));
  const [newSprints, setNewSprints] = useState<Sprint[]>([]);
  
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const ganttTaskLen = useRef<number>(project.sprints.length);

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
        on_date_change: (task: GanttTask, start: Date, end: Date) => handleDateChange(task, start, end, setGanttTasks),
      });

      if (initialInit) {
        setInitialInit(false);
      }

      // DOM manipulation
      if (!initialInit) {
        doCustomScroll(ganttInstance, ganttRef, scrollToX, scrollToY, highlightLastTask, ganttTasks, column_width);
      }
      injectStyles();

      // disable horizontal scroll wheel
      const cleanupWheel = disableHorizontalWheelScroll(getGanttContainerEL(ganttRef));
      return () => cleanupWheel();
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

  // if got changes in GanttTasks
  useEffect(() => {
    if (ganttTaskLen.current != ganttTasks.length) {
      initGanttInstance(true);
      ganttTaskLen.current = ganttTasks.length;
    }
  }, [ganttTasks]);

  /******************************************************************************************************************
   * handle task manipulations
   ******************************************************************************************************************/
  function handleCreateSprint(title: string, desc: string) {
    addNewSprint(title, desc, setNewSprints, setGanttTasks);
    // toggle edit mode immediately when new sprint added
    toggleEditMode(true);
  }

  /******************************************************************************************************************
   * handle state manipulations
   ******************************************************************************************************************/
  function handleConfirmEdits() {
    applyUpdatedSprints(ganttInstance, workspaceId, project, ganttTasks, newSprints, createSprint, updateSprint);
    // cleanup
    setNewSprints([]);
    toggleEditMode(false);
  }

  function handleCancelEdits() {
    // reset back to prev state
    setGanttTasks(formatSprintsToGanttTasks(project.sprints));
    toggleEditMode(false);
  }

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  function toggleEditMode(editMode: boolean) {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({ readonly: !editMode });
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
