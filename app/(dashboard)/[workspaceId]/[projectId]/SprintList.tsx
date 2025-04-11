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
 * format sprints from project into Gantt-compatible task objects
 */
function formatSprints(project: Project) {
  return project.sprints.map((sprint, index) => {
    const progress = 20;  // hardcode for now
    return {
      id: `sprint-${index}`,
      name: sprint.title,
      start: sprint.startDate.toString(),
      end: sprint.endDate.toString(),
      progress,
      custom_class: 'gantt-sprint-bar'
    };
  });
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
    ganttRef.current.innerHTML = ''; // clear previous chart

    const tasks = formatSprints(project);
    const gantt = new Gantt(ganttRef.current, tasks, {
      view_mode: 'Day',
      custom_popup_html: generatePopupHtml,
      date_format: 'YYYY-MM-DD',
    });

    gantt.scroll_current();
  }, [project]);

  return (
    <Box sx={{
      border: '1px solid #ddd',
      borderRadius: 2,
      padding: 2,
      flexDirection: 'column',
      minHeight: 0,
    }}>
      <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
        Sprint Timeline
      </Typography>
      <Box sx={{ flexGrow: 1 }}>
        <div ref={ganttRef} />
      </Box>
    </Box>
  );
}
