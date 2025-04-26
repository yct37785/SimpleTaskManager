// others
import { v4 as uuidv4 } from 'uuid';
// date
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
// schemas
import { Workspace, Project, Sprint } from '@schemas';

/********************************************************************************************************************
 * utils
 ********************************************************************************************************************/
function addDays(date: CalendarDate, days: number): CalendarDate {
  return date.add({ days });
}

/********************************************************************************************************************
 * generate a sprint
 ********************************************************************************************************************/
export function genSprint(title: string, startDate: CalendarDate, dueDate: CalendarDate): Sprint {
  return {
    id: uuidv4(),
    title,
    desc: `sprint ${title} description here`,
    startDate,
    dueDate,
    tasks: [],
  };
}

/********************************************************************************************************************
 * generate a project
 ********************************************************************************************************************/
export function genProject(title: string, dueDate: CalendarDate): Project {
  const startDate = today(getLocalTimeZone());
  const projectDuration = dueDate.compare(startDate);

  const sprintCount = Math.floor(Math.random() * 7) + 2; // 2 to 8 sprints
  const sprintMinDuration = 5;
  const sprintMaxDuration = 14;

  const sprints: Sprint[] = [];
  let currentStart = startDate;

  for (let i = 0; i < sprintCount; i++) {
    const sprintLength = Math.floor(Math.random() * (sprintMaxDuration - sprintMinDuration + 1)) + sprintMinDuration;
    const overlap = Math.floor(Math.random() * 3); // 0 to 2 days overlap
    const sprintEnd = addDays(currentStart, sprintLength);

    // clamp sprintEnd to project end
    const clampedEnd = sprintEnd.compare(dueDate) > 0 ? dueDate : sprintEnd;

    sprints.push(genSprint(`Sprint ${i + 1}`, currentStart, clampedEnd));

    // move next start forward
    const nextStart = addDays(clampedEnd, -overlap);
    if (nextStart.compare(dueDate) >= 0) break;
    currentStart = nextStart;
  }

  return {
    id: uuidv4(),
    title,
    desc: `project ${title} description here`,
    startDate,
    dueDate,
    sprints,
  };
}

/********************************************************************************************************************
 * generate a workspace with randomized projects
 ********************************************************************************************************************/
export function genWorkspace(title: string, id: string): Workspace {
  const workspace: Workspace = {
    id: id,
    title,
    projects: {}
  };

  const now = today(getLocalTimeZone());
  const projectCount = Math.floor(Math.random() * 4) + 3; // 3–6

  for (let i = 0; i < projectCount; i++) {
    const endDays = Math.floor(Math.random() * 56) + 5; // 5–60
    const projectEnd = addDays(now, endDays);
    const project = genProject(`Project ${i + 1}`, projectEnd);
    workspace.projects[project.id] = project;
  }

  return workspace;
}