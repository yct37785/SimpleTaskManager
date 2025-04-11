'use client';

import { useEffect, useRef, useState } from 'react';
// Frappe Gantt
import Gantt from 'frappe-gantt';
// MUI
import {
  Box, Typography, Switch, FormControlLabel, IconButton, Stack, Divider, Tooltip, useTheme
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
// types
import { Project } from '@defines/schemas';

/**
 * local styles and layout consts
 */
const upperHeaderHeight = 45;
const lowerHeaderHeight = 30;
const barHeight = 40;
const padding = 16;
const bottomBuffer = 60;
const minHeight = 400;

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
  const theme = useTheme();

  /**
   * init and render Gantt chart when project changes
   */
  useEffect(() => {
    if (!ganttRef.current) return;
    // always clear existing chart
    ganttRef.current.innerHTML = '';

    const tasks = formatSprints(project);

    // calculate Gantt container height dynamically
    const height = Math.max(
      tasks.length * (barHeight + padding) + upperHeaderHeight + lowerHeaderHeight + padding + bottomBuffer,
      minHeight
    );

    ganttInstance.current = new Gantt(ganttRef.current, tasks, {
      readonly: !editMode,
      infinite_padding: false,
      move_dependencies: false,
      view_mode_select: false,
      upper_header_height: upperHeaderHeight,
      lower_header_height: lowerHeaderHeight,
      bar_height: barHeight,
      padding,
      container_height: height,
      lines: 'both',
      popup_on: 'hover',
      view_mode: 'Day',
      popup: (task: any) => generatePopupHtml(project, task),
      date_format: 'DD-MM-YYYY',
    });

    ganttInstance.current.scroll_current();
  }, [project]);

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
    <Box
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        overflow: 'hidden',
      }}
    >
      {/* top bar */}
      <Stack
        direction='row'
        spacing={2}
        alignItems='center'
        justifyContent='space-between'
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center'>
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

      <Divider sx={{ my: 2 }} />

      {/* Gantt chart */}
      <Box sx={{ flexGrow: 1, overflowX: 'auto' }}>
        <div ref={ganttRef} />
      </Box>
    </Box>
  );
}
