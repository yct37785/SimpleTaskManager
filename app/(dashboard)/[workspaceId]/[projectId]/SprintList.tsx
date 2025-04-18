'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, Switch, FormControlLabel, IconButton, Stack, Divider, Tooltip, useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// hooks
import { useWindowHeight } from '@hooks/useWindowHeight';
// schemas
import { Project } from '@schemas';
// utils
import { disableHorizontalWheelScroll } from '@utils/UI';
// styles
import { project_details_bar_height } from '@defines/dimens';

/**
 * adds a vertical red line to mark the project's end date on the Gantt chart
 */
export function markProjectDeadline(gantt: any, containerEl: HTMLElement | null, project: Project) {
  if (!gantt || !project?.endDate || !gantt.dates || !gantt.options || !containerEl) return;

  // find index of date
  const index = gantt.dates.findIndex((d: Date) =>
    d.toISOString().split('T')[0] === project.endDate.toString()
  );
  if (index === -1) return;

  // get actual SVG element
  const svgEl = containerEl.querySelector('svg.gantt') as SVGSVGElement | null;
  const svgHeight = svgEl?.getAttribute('height') ?? '372'; // fallback to default 372px

  const columnWidth = 45;

  // red vertical line
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', `${index * columnWidth}`);
  line.setAttribute('y1', '0');
  line.setAttribute('x2', `${index * columnWidth}`);
  line.setAttribute('y2', svgHeight);
  line.setAttribute('class', 'gantt-deadline-line');

  // append to SVG grid layer
  gantt.layers.grid.appendChild(line);
}

/**
 * format sprints into Frappe Gantt-compatible structure
 */
function formatSprints(project: Project) {
  return project.sprints.map((sprint, index) => ({
    id: `${index}`,
    name: sprint.title,
    start: sprint.startDate.toString(),
    end: sprint.endDate.toString(),
    progress: 20, // placeholder
    custom_class: 'gantt-sprint-bar',
  }));
}

/**
 * Gantt chart tooltip HTML
 */
const generatePopupHtml = (project: Project, task: any): string => {
  const index = parseInt(task.task.id);
  const sprint = project.sprints[index];
  return `
    <div class='gantt-tooltip'>
      <div class='gantt-tooltip-title'>${sprint.title}</div>
      <div class='gantt-tooltip-progress'>${task.task.progress}% complete</div>
      <div class='gantt-tooltip-desc'>${sprint?.desc || 'No description available'}</div>
    </div>
  `;
};

type Props = {
  project: Project;
};

/**
 * sprint timeline Gantt chart component
 */
export default function SprintList({ project }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);
  const ganttInstance = useRef<any>(null);
  const [editMode, setEditMode] = useState(false);
  const windowHeight = useWindowHeight();
  const theme = useTheme();

  /**
   * init and render Gantt chart when project changes
   */
  useEffect(() => {
    if (!ganttRef.current) return;
    // always clear existing chart
    ganttRef.current.innerHTML = '';

    const tasks = formatSprints(project);

    ganttInstance.current = new Gantt(ganttRef.current, tasks, {
      readonly: !editMode,
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
      popup: (task: any) => generatePopupHtml(project, task),
      date_format: 'DD-MM-YYYY',
    });
    // scroll to current day
    ganttInstance.current.scroll_current();
    // mark deadline
    markProjectDeadline(ganttInstance.current, ganttRef.current, project);
    // disable horizontal scrollwheel
    const cleanupWheel = disableHorizontalWheelScroll(ganttRef.current.querySelector('.gantt-container'));
    return () => {
      cleanupWheel();
    };
  }, [project, windowHeight]);

  /**
   * update readonly on toggle
   */
  useEffect(() => {
    if (ganttInstance.current) {
      ganttInstance.current.update_options({
        readonly: !editMode,
      });
    }
  }, [editMode]);

  return (
    <Box sx={{ px: 2, pb: 2 }}>
      <Box
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          padding: 2
        }}
      >
        {/* top bar */}
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Stack direction='row'alignItems='center'>
            <Typography variant='h6' fontWeight={600}>
              Sprints
            </Typography>
            <Tooltip title='Create Sprint'>
              <IconButton color='primary' size='small' sx={{ ml: 1 }}>
                <AddIcon />
              </IconButton>
            </Tooltip>
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
