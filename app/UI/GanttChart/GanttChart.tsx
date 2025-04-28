'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, IconButton, Stack, Divider, Tooltip, useTheme, Button
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
// date
import { CalendarDate } from '@internationalized/date';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
// utils
import { formatDateToISO, addDays, getDaysBetween, formatISOToDate } from '@utils/datetime';
import { disableHorizontalWheelScroll } from '@utils/UI';
import { markDeadline, highlightLastTaskBar } from './GanttChartUtils';
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
export type GanttTask = {
  id: string;
  name: string;
  start: string;  // yyy-mm-dd
  end: string;    // yyy-mm-dd
  progress: number;
  custom_class?: string;
};

type Props = {
  title?: string;
  tasks: GanttTask[];
  newTask: GanttTask | null;
  retrigger: number;            // retrigger GanttChart if tasks change
  deadline?: CalendarDate;
  heightOffset?: number;
  onCreateClick: () => void;
  onTasksUpdated: (latestTasks: GanttTask[]) => void;
};

/********************************************************************************************************************
 * reusable Frappe Gantt chart component
 ********************************************************************************************************************/
export default function GanttChart({
  title,
  tasks,
  newTask,
  retrigger,
  deadline,
  heightOffset = 0,
  onCreateClick,
  onTasksUpdated }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  const [initialInit, setInitialInit] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [localTasks, setLocalTasks] = useState<GanttTask[]>(tasks);

  const windowHeight = useWindowHeight();
  const theme = useTheme();

  /******************************************************************************************************************
   * inject styles
   ******************************************************************************************************************/
  function injectStyles() {
    if (deadline) {
      markDeadline(ganttInstance.current, ganttRef.current, deadline, column_width);
    }
  }

  useEffect(() => {
    injectStyles();
  }, [editMode, deadline]);

  /******************************************************************************************************************
   * Gantt instance
   * - scroll to current day
   * - scroll to new task
   * - persist prevScrollX
   ******************************************************************************************************************/
  function initGanttInstance() {
    requestAnimationFrame(() => {
      if (!ganttRef.current) return;
      // prev scroll X
      let container = ganttRef.current.querySelector('.gantt-container') as HTMLElement | null;
      let scrollToX = container?.scrollLeft ?? 0;
      let scrollToY = container?.scrollTop ?? 0;
      let scrollBehaviour: 'instant' | 'smooth' = 'instant';

      // clear existing chart
      ganttRef.current.innerHTML = '';
      console.log('Gantt init');

      // create Gantt chart
      ganttInstance.current = new Gantt(ganttRef.current, localTasks, {
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

      // inject custom styles
      injectStyles();

      // custom scroll behaviour
      container = ganttRef.current.querySelector('.gantt-container') as HTMLElement | null;
      if (container) {
        if (ganttInstance.current.dates && ganttInstance.current.dates.length > 0) {
          // if initial init, scroll to current day
          if (initialInit) {
            scrollToX = column_width * getDaysBetween(ganttInstance.current.dates[0], new Date());
            scrollBehaviour = 'smooth';
          }
          // new task added/removed
          else if (localTasks.length > tasks.length) {
            const lastTask = tasks.at(-1);
            const scrollToDate = lastTask ? formatISOToDate(lastTask.start) : new Date();
            scrollToX = column_width * getDaysBetween(ganttInstance.current.dates[0], scrollToDate);
            scrollToY = container.scrollHeight;
            scrollBehaviour = 'smooth';
            highlightLastTaskBar(container);
          }
        }

        container.scrollTo({
          left: scrollToX,
          top: scrollToY,
          behavior: scrollBehaviour,
        });
      }

      // update states
      setInitialInit(false);

      // disable horizontal scroll wheel
      const cleanupWheel = disableHorizontalWheelScroll(container);
      return () => cleanupWheel();
    });
  }

  /******************************************************************************************************************
   * refresh state
   ******************************************************************************************************************/
  useEffect(() => {
    if (windowHeight && retrigger != undefined) {
      initGanttInstance();
    }
  }, [windowHeight, retrigger]);

  useEffect(() => {
    if (newTask) {
      console.log("new task added");
    }
  }, [newTask]);

  /******************************************************************************************************************
   * handle task manipulations
   ******************************************************************************************************************/
  function handleDateChange(task: GanttTask, start: Date, end: Date) {
    // build new updated task
    const updatedTask: GanttTask = {
      ...task,
      start: formatDateToISO(start),
      end: formatDateToISO(addDays(end, 1)), // +1 day as end is exclusive
    };

    // add to tasks
    setLocalTasks(prevTasks =>
      prevTasks.map(t => t.id === task.id ? updatedTask : t)
    );
  }

  function handleAddTask() {
    // delegate to parent to add task/sprint
    onCreateClick();
  }

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  useEffect(() => {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({ readonly: !editMode });
    }
  }, [editMode]);

  function handleConfirmEdits() {
    if (!ganttInstance.current) return;
    // apply updates to the Gantt chart
    localTasks.forEach((updatedTask) => {
      ganttInstance.current.update_task(updatedTask.id, updatedTask);
    });
  
    // call parent to persist updates
    // const latestTasks = tasks.map(task =>
    //   updatedTasks.has(task.id) ? updatedTasks.get(task.id)! : task
    // );
    // onTasksUpdated(latestTasks);

    setEditMode(false);
  }

  function handleCancelEdits() {
    // reset back to prev state
    setLocalTasks(tasks);
    setEditMode(false);
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>

        {/* top bar */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: chart_top_bar_height, px: 2 }}>
          <Stack direction='row' alignItems='center'>
            <Typography variant='subtitle1' fontWeight={600}>
              {title}
            </Typography>
            <Tooltip title='Create'>
              <IconButton size='small' color='primary' sx={{ ml: 1 }} onClick={handleAddTask}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          {!editMode ? (
            <Button
              onClick={() => setEditMode(true)}
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
  );
}
