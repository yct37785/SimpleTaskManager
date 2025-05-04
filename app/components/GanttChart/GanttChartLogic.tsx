'use client';

import { RefObject, SetStateAction } from 'react';
// utils
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
import { v4 as uuidv4 } from 'uuid';
import { formatDateToISO, addDays, formatISOToCalendarDate } from '@utils/datetime';
// schemas
import { Project, Sprint } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
export type GanttTask = {
  id: string;
  name: string;     // title
  descTmp: string;  // for holding desc values of new sprint
  start: string;    // yyy-mm-dd
  end: string;      // yyy-mm-dd
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
    descTmp: sprint.desc,
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
    // fields modified: title, startDate, endDate
    title: task.name,
    startDate: new CalendarDate(startParts[0], startParts[1], startParts[2]),
    dueDate: new CalendarDate(endParts[0], endParts[1], endParts[2]),
  };
}

/******************************************************************************************************************
 * handle task manipulations
 ******************************************************************************************************************/
export function handleDateChange(
  ganttTask: GanttTask,
  start: Date,
  end: Date,
  setGanttTasks: (value: SetStateAction<GanttTask[]>) => void
) {
  // build new updated task
  const updatedTask: GanttTask = {
    ...ganttTask,
    start: formatDateToISO(start),
    end: formatDateToISO(addDays(end, 1)), // +1 day as end is exclusive
  };

  // add to tasks
  setGanttTasks(prevTasks =>
    prevTasks.map(t => t.id === ganttTask.id ? updatedTask : t)
  );
}

export function addNewSprint(
  title: string,
  desc: string,
  sprints: Sprint[],
  setGanttTasks: (value: SetStateAction<GanttTask[]>) => void
) {
  let startDate = today(getLocalTimeZone());
  // retrieve last date
  if (sprints && sprints.length > 0) {
    startDate = sprints[sprints.length - 1].dueDate.copy()
  }
  // Sprint
  const newSprint: Sprint = {
    id: `TEMP-${uuidv4()}`,
    title,
    desc,
    startDate: startDate,
    dueDate: startDate.add({ days: 7 }),
    tasks: []
  };

  // GanttTask
  setGanttTasks(prev => [...prev, formatSprintToGanttTask(newSprint)]);
}

/******************************************************************************************************************
 * handle state manipulations
 ******************************************************************************************************************/
export function applyUpdatedSprints(
  ganttInstance: RefObject<any>,
  workspaceId: string,
  project: Project,
  ganttTasks: GanttTask[],
  createSprint: (workspaceId: string, projectId: string, title: string, desc: string, startDate: CalendarDate, dueDate: CalendarDate) => boolean,
  updateSprint: (workspaceId: string, projectId: string, updatedSprint: Sprint) => void
) {
  if (!ganttInstance.current) return;

  // update chart visuals
  ganttTasks.forEach(task => {
    ganttInstance.current.update_task(task.id, task);
  });

  // update sprints
  ganttTasks.forEach(ganttTask => {
    // existing
    if (!ganttTask.id.startsWith('TEMP')) {
      // TODO: improve efficiency
      const originalSprint = project.sprints.find(s => s.id === ganttTask.id);
      if (originalSprint) {
        const updatedSprint = formatGanttTaskToSprint(ganttTask, originalSprint);
        updateSprint(workspaceId, project.id, updatedSprint);
      }
    }
    // new
    else {
      createSprint(workspaceId, project.id, ganttTask.name, ganttTask.descTmp, 
        formatISOToCalendarDate(ganttTask.start), formatISOToCalendarDate(ganttTask.end));
    }
  });
}