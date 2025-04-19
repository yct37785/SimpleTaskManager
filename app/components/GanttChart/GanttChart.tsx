'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, Switch, FormControlLabel, IconButton, Stack, Divider, Tooltip, useTheme, Button
} from '@mui/material';
import { Add as AddIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
// date
import { CalendarDate } from '@internationalized/date';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
// utils
import { disableHorizontalWheelScroll } from '@utils/UI';
import { formatDateToISO } from '@utils/datetime';
// styles
import { project_details_bar_height } from '@styles/dimens';
import './frappe-gantt.css';
import './frappe-gantt-custom.css';
const chart_top_bar_height = 45;
const column_width = 45;

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

/**
 * injects a vertical deadline marker to Gantt chart
 */
function markDeadline(gantt: any, containerEl: HTMLElement | null, deadline: CalendarDate) {
  if (!gantt || !deadline || !gantt.dates || !containerEl) return;

  // find index of date
  const index = gantt.dates.findIndex((d: Date) =>
    d.toISOString().split('T')[0] === deadline.toString()
  );
  if (index === -1) return;

  // get actual SVG element
  const svgEl = containerEl.querySelector('svg.gantt') as SVGSVGElement | null;
  const svgHeight = svgEl?.getAttribute('height') ?? '372';

  // red vertical line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', `${index * column_width}`);
  line.setAttribute('y1', '0');
  line.setAttribute('x2', `${index * column_width}`);
  line.setAttribute('y2', svgHeight);
  line.setAttribute('class', 'gantt-deadline-line');

  // append to grid layer
  gantt.layers.grid.appendChild(line);
}

/**
 * reusable Frappe Gantt chart component
 */
export default function GanttChart({ title = 'Timeline', tasks, deadline, onCreateClick }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);

  const [editMode, setEditMode] = useState(false);
  const [updatedTasks, setUpdatedTasks] = useState<Map<string, GanttTask>>(new Map());

  const windowHeight = useWindowHeight();
  const theme = useTheme();
  
  /**
   * inject styles when state changes
   */
  function injectStyles() {
    if (deadline && ganttInstance.current && ganttRef.current) {
      markDeadline(ganttInstance.current, ganttRef.current, deadline);
    }
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      injectStyles();
    });
  }, [editMode, deadline]);

  /**
   * hold updated tasks when their date values are edited
   */
  function handleDateChange(task: GanttTask, start: Date, end: Date) {
    const updatedTask: GanttTask = {
      ...task,
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0],
    };
  
    setUpdatedTasks(prev => {
      const updated = new Map(prev);
      updated.set(task.id, updatedTask);
      return updated;
    });
  }

  /**
   * init Gantt chart once
   */
  useEffect(() => {
    if (!windowHeight || !ganttRef.current || ganttInstance.current) return;
  
    // clear existing chart
    ganttRef.current.innerHTML = '';
  
    // create Gantt chart
    ganttInstance.current = new Gantt(ganttRef.current, tasks, {
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
  
    ganttInstance.current.scroll_current();
  
    // inject styles (defer to ensure SVG is rendered)
    requestAnimationFrame(() => {
      injectStyles();
    });
  
    // disable horizontal scroll
    const cleanupWheel = disableHorizontalWheelScroll(
      ganttRef.current.querySelector('.gantt-container')
    );
  
    return () => {
      cleanupWheel();
    };
  }, [tasks, windowHeight, deadline]);  

  /**
   * toggle readonly for Gantt chart
   */
  useEffect(() => {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({ readonly: !editMode });
    }
  }, [editMode]);

  /**
   * once edits are confirmed
   */
  function handleConfirmEdits() {
    if (!ganttInstance.current) return;
  
    updatedTasks.forEach((updatedTask) => {
      console.log('asdasdasd');
      ganttInstance.current.update_task(updatedTask.id, updatedTask);
    });

    // clear edit mode and updates
    setUpdatedTasks(new Map());
    setEditMode(false);
  }

  /**
   * edits to be discarded
   */
  function handleCancelEdits() {
    setUpdatedTasks(new Map());
    setEditMode(false);
  }

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, padding: 2 }}>

        {/* top bar */}
        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ height: chart_top_bar_height }}>
          <Stack direction='row' alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
              {title}
            </Typography>
            {onCreateClick && (
              <Tooltip title='Create'>
                <IconButton size='small' color='primary' sx={{ ml: 1 }} onClick={onCreateClick}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
          {!editMode ? (
            <FormControlLabel
              control={
                <Switch
                  checked={editMode}
                  onChange={() => setEditMode(prev => !prev)}
                  color='primary'
                />
              }
              label='Edit Mode'
            />
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
