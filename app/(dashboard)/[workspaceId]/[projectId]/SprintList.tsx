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
 * convert CalendarDate to JS Date using local time zone
 */
function calendarDateToDate(cd: CalendarDate): Date {
  return cd.toDate(getLocalTimeZone());
}

/**
 * format sprints from project into Gantt-compatible task objects
 */
function formatSprints(project: Project) {
  return project.sprints.map((sprint, index) => {
    const total = sprint.columns.reduce((sum, col) => sum + col.tasks.length, 0);
    const completed = sprint.columns.find(c => c.title.toLowerCase() === 'done')?.tasks.length ?? 0;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      id: `sprint-${index}`,
      name: sprint.title,
      start: calendarDateToDate(sprint.startDate),
      end: calendarDateToDate(sprint.endDate),
      progress,
      custom_class: 'gantt-sprint-bar'
    };
  });
}

/**
 * compute min and max date range for the Gantt view with clamping (±30 days)
 */
function getClampedDateRange(project: Project): { start: Date; end: Date } {
  const zone = getLocalTimeZone();

  if (!project.sprints.length) {
    const now = today(zone);
    return {
      start: now.subtract({ days: 30 }).toDate(zone),
      end: now.add({ days: 30 }).toDate(zone),
    };
  }

  const startDates = project.sprints.map(s => s.startDate);
  const endDates = project.sprints.map(s => s.endDate);

  const minStart = startDates.reduce((a, b) => (a.compare(b) < 0 ? a : b));
  const maxEnd = endDates.reduce((a, b) => (a.compare(b) > 0 ? a : b));

  return {
    start: minStart.subtract({ days: 30 }).toDate(zone),
    end: maxEnd.add({ days: 30 }).toDate(zone),
  };
}

/**
 * generate custom tooltip HTML for each task bar
 */
function generatePopupHtml(task: any): string {
  return `
    <div style="
      padding: 8px;
      max-width: 250px;
      background: white;
      border-radius: 4px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    ">
      <div style="font-weight: 600; margin-bottom: 4px;">${task.name}</div>
      <div style="margin-bottom: 4px;">${task.progress}% complete</div>
      <div style="font-size: 0.875rem; color: gray;">
        ${task._start.toDateString()} → ${task._end.toDateString()}
      </div>
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

    // clamp horizontal scroll to start of range
    const { start } = getClampedDateRange(project);
    const wrapper = ganttRef.current.querySelector('.gantt .gantt-container') as HTMLElement | null;
    if (wrapper) {
      const scrollLeft = wrapper.scrollLeft;
      const scrollMax = wrapper.scrollWidth;
      wrapper.scrollLeft = scrollLeft > scrollMax ? scrollMax : scrollLeft;
    }

    const svg = ganttRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', '100%');
    }
  }, [project]);

  return (
    <Box sx={{
      overflow: 'auto',
      border: '1px solid #ddd',
      borderRadius: 2,
      padding: 2,
      flexGrow: 1,
      display: 'flex',
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
