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
import { formatDateToISO, addDays, getDaysBetween } from '@utils/datetime';
import { markDeadline, highlightLastTaskBar, injectCustomBehaviour } from './GanttChartUtils';
// styles
import { project_details_bar_height } from '@styles/dimens';
import './frappe-gantt.css';
import './frappe-gantt-custom.css';
const chart_top_bar_height = 45;
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
  deadline?: CalendarDate;
  onCreateClick: () => void;
};

/********************************************************************************************************************
 * reusable Frappe Gantt chart component
 ********************************************************************************************************************/
export default function GanttChart({ title = 'Timeline', tasks, deadline, onCreateClick }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  const [editMode, setEditMode] = useState(false);
  const [committedTasks, setCommittedTasks] = useState<GanttTask[]>(tasks);
  const [updatedTasks, setUpdatedTasks] = useState<Map<string, GanttTask>>(new Map());

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
   ******************************************************************************************************************/
  function initGanttInstance(taskList: GanttTask[], scrollTo: Date, scrollToBottom: boolean = false) {
    if (!ganttRef.current) return;
    // clear existing chart
    ganttRef.current.innerHTML = '';
    console.log("Gantt init");
    
    // create Gantt chart
    ganttInstance.current = new Gantt(ganttRef.current, taskList, {
      readonly: !editMode,
      column_width,
      infinite_padding: true,
      move_dependencies: false,
      view_mode_select: false,
      upper_header_height: 45,
      lower_header_height: 30,
      bar_height: 40,
      padding: 16,
      container_height: windowHeight - project_details_bar_height - chart_top_bar_height - 100,
      lines: 'both',
      popup_on: 'click',
      view_mode: 'Day',
      date_format: 'DD-MM-YYYY',
      snap_at: '1d',
      on_date_change: (task: GanttTask, start: Date, end: Date) => handleDateChange(task, start, end),
    });
    
    injectStyles();
    
    // DOM manipulation
    injectCustomBehaviour(
      ganttRef.current,
      ganttInstance.current.dates,
      column_width,
      scrollTo,
      scrollToBottom
    );
  }

  useEffect(() => {
    if (windowHeight && ganttRef.current) {
      // trigger init Gantt chart once at start
      // trigger on windowHeight change
      initGanttInstance(tasks, new Date());
    }
  }, [windowHeight]);

  /******************************************************************************************************************
   * handle task manipulations
   ******************************************************************************************************************/
  function handleDateChange(task: GanttTask, start: Date, end: Date) {
    const updatedTask: GanttTask = {
      ...task,
      start: formatDateToISO(start),
      end: formatDateToISO(addDays(end, 1)), // +1 day as end is exclusive
    };

    setUpdatedTasks(prev => {
      const updated = new Map(prev);
      updated.set(task.id, updatedTask);
      return updated;
    });
  }

  function handleAddTask() {
    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(now.getDate() + 5);
    endDate.setDate(now.getDate() + 12);

    const newTask: GanttTask = {
      id: `task-${Date.now()}`,
      name: `New Task`,
      start: formatDateToISO(startDate),
      end: formatDateToISO(endDate),
      progress: 0,
      custom_class: 'gantt-task-bar',
    };

    const newTasks = [...committedTasks, newTask];
    setCommittedTasks(newTasks);

    // re-init Gantt
    initGanttInstance(newTasks, startDate, true);

    highlightLastTaskBar(ganttRef.current);
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

    updatedTasks.forEach((updatedTask) => {
      ganttInstance.current.update_task(updatedTask.id, updatedTask);
    });

    // clear edit mode and updates
    setUpdatedTasks(new Map());
    setEditMode(false);
  }

  function handleCancelEdits() {
    setUpdatedTasks(new Map());
    setEditMode(false);
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, padding: 2 }}>

        {/* top bar */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: chart_top_bar_height }}>
          <Stack direction='row' alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
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

        <Divider sx={{ mt: 1, mb: 2 }} />

        {/* Gantt chart */}
        <div ref={ganttRef} />
      </Box>
    </Box>
  );
}
