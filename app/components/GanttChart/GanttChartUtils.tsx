'use client';

import { RefObject } from 'react';
// date
import { CalendarDate } from '@internationalized/date';
// schemas
import { Project, Sprint } from '@schemas';
// styles
import './frappe-gantt.css';
import './frappe-gantt-custom.css';

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

/********************************************************************************************************************
 * format sprints into Frappe Gantt-compatible structure
 ********************************************************************************************************************/
export function formatSprintToGanttTask(sprint: Sprint): GanttTask {
  return {
    id: sprint.id,
    name: sprint.title,
    start: sprint.startDate.toString(),
    end: sprint.dueDate.toString(),
    progress: 70, // placeholder
    custom_class: 'gantt-task-bar',
  }
}

export function formatSprintsToGanttTasks(sprints: Project['sprints']): GanttTask[] {
  return sprints.map((sprint) => formatSprintToGanttTask(sprint));
}

/********************************************************************************************************************
 * format a GanttTask back into Sprint
 ********************************************************************************************************************/
export function formatGanttTaskToSprint(task: GanttTask, originalSprint: Sprint): Sprint {
  const startParts = task.start.split('-').map(Number);
  const endParts = task.end.split('-').map(Number);

  return {
    ...originalSprint,
    title: task.name,
    startDate: new CalendarDate(startParts[0], startParts[1], startParts[2]),
    dueDate: new CalendarDate(endParts[0], endParts[1], endParts[2]),
  };
}

/********************************************************************************************************************
 * injects a vertical deadline marker to Gantt chart
 ********************************************************************************************************************/
export function markDeadline(gantt: any, containerEl: HTMLElement | null, deadline: CalendarDate, column_width: number) {
  requestAnimationFrame(() => {
    if (!gantt || !gantt.dates || !containerEl || !deadline) return;

    // find idx offset of the date to add line to
    const index = gantt.dates.findIndex((d: Date) =>
      d.toISOString().split('T')[0] === deadline.toString()
    );
    if (index === -1) return;

    const svgEl = containerEl.querySelector('svg.gantt') as SVGSVGElement | null;
    const svgHeight = svgEl?.getAttribute('height') ?? '372';

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', `${index * column_width}`);
    line.setAttribute('y1', '0');
    line.setAttribute('x2', `${index * column_width}`);
    line.setAttribute('y2', svgHeight);
    line.setAttribute('class', 'gantt-deadline-line');

    gantt.layers.grid.appendChild(line);
  });
}

/********************************************************************************************************************
 * add a highlight to newly added task bar
 ********************************************************************************************************************/
export function highlightLastTaskBar(containerEl: HTMLElement | null) {
  requestAnimationFrame(() => {
    if (!containerEl) return;

    const bars = containerEl.querySelectorAll<SVGRectElement>('.bar .gantt-task-bar');
    if (bars.length === 0) return;

    const lastBar = bars[bars.length - 1];
    if (!lastBar) return;

    lastBar.classList.add('gantt-task-bar-new');

    lastBar.addEventListener(
      'animationend',
      () => {
        lastBar.classList.remove('gantt-task-bar-new');
      },
      { once: true }
    );
  });
}

/********************************************************************************************************************
 * do scroll
 ********************************************************************************************************************/
export function chartDomManipulation(
  initialInit: boolean, 
  ganttRef: RefObject<HTMLDivElement | null>,
  prevScrollX: number,
  prevScrollY: number
) {
  if (!ganttRef.current) return;

  const container = ganttRef.current.querySelector('.gantt-container') as HTMLElement | null;
  
  // custom scroll behaviour
  if (!initialInit) {
    if (container) {
      container.scrollTo({
        left: prevScrollX,
        top: prevScrollY,
        behavior: 'instant',
      });
    }
  }
}