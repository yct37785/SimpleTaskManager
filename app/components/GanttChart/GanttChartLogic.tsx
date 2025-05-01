'use client';

// date
import { CalendarDate } from '@internationalized/date';
// schemas
import { Project, Sprint } from '@schemas';

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
