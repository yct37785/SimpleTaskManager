'use client';

import { useEffect, useRef } from 'react';
// Frappe
import Gantt from 'frappe-gantt';
// MUI
import { Box, Typography } from '@mui/material';
// date
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
// defines
import { Project } from '@defines/schemas';

/**
 * local styles
 */
const upper_header_height = 45;
const lower_header_height = 30;
const bar_height = 40;
const padding = 16;
const bottom_buffer = 40;

/**
 * format sprints from project into Gantt-compatible task objects
 */
function formatSprints(project: Project) {
  return project.sprints.map((sprint, index) => ({
    id: `sprint-${index}`,
    name: sprint.title,
    start: sprint.startDate.toString(),
    end: sprint.endDate.toString(),
    progress: 20, // placeholder
    custom_class: 'gantt-sprint-bar',
  }));
}

/**
 * generate custom tooltip HTML for each task bar
 */
function generatePopupHtml(task: any): string {
  return `
    <div class='gantt-tooltip'>
      <strong>${task.name}</strong>
      <div>${task.progress}% complete</div>
      <div>${task._start.toDateString()} → ${task._end.toDateString()}</div>
    </div>
  `;
}

type Props = {
  project: Project;
};

/**
 * displays all sprints using Frappe Gantt timeline
 */
export default function SprintList({ project }: Props) {
  const ganttRef = useRef<HTMLDivElement>(null);

  /**
   * init and render Gantt chart when project changes
   */
  useEffect(() => {
    if (!ganttRef.current) return;

    // clear existing chart
    ganttRef.current.innerHTML = '';

    // retrieve sprints
    const sprints = formatSprints(project);

    // calculate gantt container height
    const container_height = sprints.length * (bar_height + padding) + upper_header_height +
      lower_header_height + padding + bottom_buffer;

    // create gantt
    const gantt = new Gantt(ganttRef.current, sprints, {
      infinite_padding: false,
      move_dependencies: false,
      view_mode_select: false,
      upper_header_height: upper_header_height,
      lower_header_height: lower_header_height,
      bar_height: bar_height,
      padding: padding,
      container_height: container_height,
      lines: 'both',
      popup_on: 'hover',
      view_mode: 'Day',
      custom_popup_html: generatePopupHtml,
      date_format: 'DD-MM-YYYY',
    });

    gantt.scroll_current();
  }, [project]);

  return (
    <Box sx={{ border: '1px solid #ddd', borderRadius: 2, padding: 2, flexDirection: 'column', minHeight: 0 }}>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
        Sprint Timeline
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <div ref={ganttRef} />
      </Box>
    </Box>
  );
}
