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
export type EditType = 'new' | 'deleted' | 'modified' | 'none';
export type GanttTask = {
  id: string;
  name: string;     // title
  descTmp: string;  // for holding desc values of new sprint
  start: string;    // yyy-mm-dd
  end: string;      // yyy-mm-dd
  progress: number;
  edit_type: EditType;
  custom_class?: string;
};

/********************************************************************************************************************
 * format sprints into Frappe Gantt-compatible structure
 ********************************************************************************************************************/
export function formatSprintToGanttTask(sprint: Sprint, edit_type: EditType): GanttTask {
  return {
    id: sprint.id,
    name: sprint.title,
    descTmp: sprint.desc,
    start: sprint.startDate.toString(),
    end: sprint.dueDate.toString(),
    progress: 70, // placeholder
    custom_class: 'gantt-task-bar',
    edit_type: edit_type
  }
}

export function formatToGanttTasks(
  sprints: Project['sprints'],
  draftTasks: Record<string, GanttTask>
): GanttTask[] {
  const taskList: GanttTask[] = [];

  const sprintIds = new Set(sprints.map(s => s.id));

  // include all existing sprints, overridden by draftTasks if applicable
  for (const sprint of sprints) {
    const draft = draftTasks[sprint.id];
    taskList.push(draft ?? formatSprintToGanttTask(sprint, 'none'));
  }

  // append new draft tasks (not in sprints)
  for (const task of Object.values(draftTasks)) {
    if (!sprintIds.has(task.id)) {
      taskList.push(task);
    }
  }

  return taskList;
}

/******************************************************************************************************************
 * sprint date modified
 ******************************************************************************************************************/
export function handleDateChange(
  ganttTask: GanttTask,
  start: Date,
  end: Date,
  draftTasks: Record<string, GanttTask>,
  setDraftTasks: (value: SetStateAction<Record<string, GanttTask>>) => void
) {
  const isExistingDraft = ganttTask.id in draftTasks;
  const editType = isExistingDraft ? draftTasks[ganttTask.id].edit_type : 'modified';

  // build new updated task
  const updatedTask: GanttTask = {
    ...ganttTask,
    start: formatDateToISO(start),
    end: formatDateToISO(addDays(end, 1)), // +1 day as end is exclusive
    edit_type: editType,
  };

  // add to draftTasks
  setDraftTasks(prev => ({
    ...prev,
    [updatedTask.id]: updatedTask
  }));
}

/******************************************************************************************************************
 * new sprint added
 ******************************************************************************************************************/
function findLatestEndDate(existingSprints: Sprint[], draftTasks: Record<string, GanttTask>): CalendarDate {
  let latestEnd: CalendarDate = today(getLocalTimeZone());

  // collect all potential end dates
  const existingDates = existingSprints.map(s => s.dueDate);
  const draftDates = Object.values(draftTasks)
    .filter(task => task.edit_type !== 'deleted') // deleted sprints not taken into account
    .map(task => formatISOToCalendarDate(task.end));

  const allDates = [...existingDates, ...draftDates];

  // find the latest end date
  if (allDates.length > 0) {
    latestEnd = allDates.reduce((a, b) => (a.compare(b) > 0 ? a : b));
  }
  return latestEnd;
}

export function addNewSprint(
  title: string,
  desc: string,
  existingSprints: Sprint [],
  draftTasks: Record<string, GanttTask>,
  setDraftTasks: (value: SetStateAction<Record<string, GanttTask>>) => void
) {
  // move start date to right after latest end date
  const latestEnd = findLatestEndDate(existingSprints, draftTasks);

  // create new sprint
  const newSprint: Sprint = {
    id: `TEMP-${uuidv4()}`, // TEMP prepend for safeguard
    title,
    desc,
    startDate: latestEnd.add({ days: 1 }),
    dueDate: latestEnd.add({ days: 8 }),
    tasks: []
  };

  // add to draftTasks
  setDraftTasks(prev => ({
    ...prev,
    [newSprint.id]: formatSprintToGanttTask(newSprint, 'new')
  }));
}

/******************************************************************************************************************
 * apply sprint edits to global state and update Gantt UI
 ******************************************************************************************************************/
export function applyUpdatedSprints(
  ganttInstance: RefObject<any>,
  workspaceId: string,
  project: Project,
  draftTasks: Record<string, GanttTask>,
  setDraftTasks: (value: SetStateAction<Record<string, GanttTask>>) => void,
  createSprint: (workspaceId: string, projectId: string, title: string, desc: string, startDate: CalendarDate, dueDate: CalendarDate) => boolean,
  updateSprint: (workspaceId: string, projectId: string, updatedSprint: Sprint) => void
) {
  if (!ganttInstance.current) return;

  // update task visuals
  Object.values(draftTasks).forEach(task => {
    ganttInstance.current.update_task(task.id, task);
  });

  // apply draft changes
  Object.values(draftTasks).forEach(task => {
    const startDate = formatISOToCalendarDate(task.start);
    const dueDate = formatISOToCalendarDate(task.end);

    if (task.edit_type === 'new') {
      createSprint(workspaceId, project.id, task.name, task.descTmp, startDate, dueDate);
    } else if (task.edit_type === 'modified') {
      const original = project.sprints.find(s => s.id === task.id);
      if (original) {
        updateSprint(workspaceId, project.id, {
          ...original,
          title: task.name,
          startDate,
          dueDate
        });
      }
    }
  });

  // reset local draft state
  setDraftTasks({});
}
