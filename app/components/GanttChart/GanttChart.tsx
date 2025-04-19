'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, Switch, FormControlLabel, IconButton, Stack, Divider, Tooltip, useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// date
import { CalendarDate } from '@internationalized/date';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
// utils
import { disableHorizontalWheelScroll } from '@utils/UI';
// styles
import { project_details_bar_height } from '@styles/dimens';
const column_width = 45;

export type GanttTask = {
  id: string;
  name: string;
  start: string;
  end: string;
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
 * Gantt chart tooltip HTML
 */
const generatePopupHtml = (task: any): string => {
  return `
        <div class='gantt-tooltip'>
          <div class='gantt-tooltip-title'>${task.name}</div>
          <div class='gantt-tooltip-progress'>${task.progress}% complete</div>
        </div>
      `
};

/**
 * reusable Frappe Gantt chart component
 */
export default function GanttChart({ title = 'Timeline', tasks, deadline, onCreateClick }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const [editMode, setEditMode] = useState(false);
  const windowHeight = useWindowHeight();
  const theme = useTheme();

  /**
   * init and render Gantt chart when project changes
   */
  useEffect(() => {
    if (!ganttRef.current || windowHeight === 0) return;
    // always clear existing chart
    ganttRef.current.innerHTML = '';

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
      container_height: windowHeight - project_details_bar_height - 130,
      lines: 'both',
      popup_on: 'hover',
      view_mode: 'Day',
      date_format: 'DD-MM-YYYY',
      popup: generatePopupHtml,
    });
    // scroll to current day
    ganttInstance.current.scroll_current();
    // mark deadline
    if (deadline) {
      markDeadline(ganttInstance.current, ganttRef.current, deadline);
    }
    // disable horizontal scrollwheel
    const cleanupWheel = disableHorizontalWheelScroll(ganttRef.current.querySelector('.gantt-container'));
    return () => cleanupWheel();
  }, [tasks, windowHeight, deadline]);

  /**
   * update readonly on toggle
   */
  useEffect(() => {
    ganttInstance.current?.update_options({ readonly: !editMode });
  }, [editMode]);

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 2, padding: 2 }}>
        {/* top bar */}
        <Stack direction='row' justifyContent='space-between' alignItems='center'>
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
          <FormControlLabel
            control={
              <Switch
                checked={editMode}
                onChange={() => setEditMode(!editMode)}
                color='primary'
              />
            }
            label='Edit Mode'
          />
        </Stack>

        <Divider sx={{ mt: 1, mb: 2 }} />

        {/* Gantt chart */}
        <div ref={ganttRef} />
      </Box>
    </Box>
  );
}
