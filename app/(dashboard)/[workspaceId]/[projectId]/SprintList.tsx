'use client';

import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { today, getLocalTimeZone, CalendarDate, fromDate } from '@internationalized/date';
// types
import { Project, Sprint } from '@defines/schemas';

// convert CalendarDate to JS Date
function calendarDateToDate(cd: CalendarDate): Date {
  return cd.toDate(getLocalTimeZone());
}

// dummy sprints for demo
function createDummySprints(): Sprint[] {
  const now = today(getLocalTimeZone());
  const addDays = (base: CalendarDate, days: number) =>
    new CalendarDate(base.calendar, base.era, base.year, base.month, base.day + days);

  return [
    {
      title: 'Sprint Alpha',
      desc: 'Initial implementation phase.',
      startDate: now,
      endDate: addDays(now, 7),
      columns: [
        { id: 'todo', title: 'TODO', isTodo: true, tasks: Array(3).fill({ id: 't1', title: '', desc: '', addDate: now, dueDate: now, completedDate: undefined, labels: [] }) },
        { id: 'done', title: 'DONE', isTodo: false, tasks: Array(1).fill({ id: 't4', title: '', desc: '', addDate: now, dueDate: now, completedDate: now, labels: [] }) }
      ]
    },
    {
      title: 'Sprint Beta',
      desc: 'Testing and documentation.',
      startDate: addDays(now, 10),
      endDate: addDays(now, 17),
      columns: [
        { id: 'todo', title: 'TODO', isTodo: true, tasks: Array(4).fill({ id: 't2', title: '', desc: '', addDate: now, dueDate: now, completedDate: undefined, labels: [] }) },
        { id: 'done', title: 'DONE', isTodo: false, tasks: Array(2).fill({ id: 't5', title: '', desc: '', addDate: now, dueDate: now, completedDate: now, labels: [] }) }
      ]
    }
  ];
}

export default function SprintList() {
  const theme = useTheme();
  const ganttRef = useRef<HTMLDivElement>(null);

  const dummyProject: Project = {
    id: 'demo',
    title: 'Demo Project',
    desc: '',
    startDate: today(getLocalTimeZone()),
    endDate: today(getLocalTimeZone()).add({ days: 30 }),
    sprints: createDummySprints()
  };

  useEffect(() => {
    if (ganttRef.current) {
      const tasks = dummyProject.sprints.map((sprint, index) => {
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

      new Gantt(ganttRef.current, tasks, {
        view_mode: 'Day',
        custom_popup_html: (task: any) => `
          <div style="
            padding: 8px;
            max-width: 250px;
            background: white;
            border-radius: 4px;
            font-family: ${theme.typography.fontFamily};
            color: ${theme.palette.text.primary};
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          ">
            <h5 style="margin: 0 0 4px; font-size: 1rem;">${task.name}</h5>
            <p style="margin: 0 0 2px;"><strong>${task.progress}%</strong> complete</p>
            <p style="margin: 0;">${task._start.toDateString()} → ${task._end.toDateString()}</p>
          </div>
        `
      });
    }
  }, [theme]);

  return (
    <Paper elevation={3} sx={{ overflowX: 'auto', borderRadius: 2, p: 3 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>
        Sprint Timeline (Demo)
      </Typography>
      <Box ref={ganttRef} />
    </Paper>
  );
}
