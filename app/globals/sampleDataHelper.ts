// others
import { v4 as uuidv4 } from 'uuid';
// date
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date';
// schemas
import { Workspace, Project, Sprint, Column, Task } from '@schemas';

/********************************************************************************************************************
 * utils
 ********************************************************************************************************************/
function addDays(date: CalendarDate, days: number): CalendarDate {
  return date.add({ days });
}

/********************************************************************************************************************
 * generate column for sprint
 ********************************************************************************************************************/
function genColumn(title: string, isTodo = false): Column {
  return {
    id: uuidv4(),
    title,
    isTodo,
    tasks: [],
  };
}

/********************************************************************************************************************
 * generate a sprint
 ********************************************************************************************************************/
export function genSprint(title: string, startDate: CalendarDate, endDate: CalendarDate): Sprint {
  return {
    id: uuidv4(),
    title,
    desc: `sprint ${title} description here`,
    startDate,
    endDate,
    columns: [
      genColumn('TODO', true),
      genColumn('IN PROGRESS'),
      genColumn('DONE'),
    ],
  };
}

/********************************************************************************************************************
 * generate a project
 ********************************************************************************************************************/
export function genProject(title: string, endDate: CalendarDate): Project {
  const projectStart = today(getLocalTimeZone());
  const projectEnd = endDate;
  const projectDuration = projectEnd.compare(projectStart);

  const sprintCount = Math.floor(Math.random() * 7) + 2; // 2 to 8 sprints
  const sprintMinDuration = 5;
  const sprintMaxDuration = 14;

  const sprints: Sprint[] = [];
  let currentStart = projectStart;

  for (let i = 0; i < sprintCount; i++) {
    const sprintLength = Math.floor(Math.random() * (sprintMaxDuration - sprintMinDuration + 1)) + sprintMinDuration;
    const overlap = Math.floor(Math.random() * 3); // 0 to 2 days overlap
    const sprintEnd = addDays(currentStart, sprintLength);

    // clamp sprintEnd to project end
    const clampedEnd = sprintEnd.compare(projectEnd) > 0 ? projectEnd : sprintEnd;

    sprints.push(genSprint(`Sprint ${i + 1}`, currentStart, clampedEnd));

    // move next start forward
    const nextStart = addDays(clampedEnd, -overlap);
    if (nextStart.compare(projectEnd) >= 0) break;
    currentStart = nextStart;
  }

  return {
    id: uuidv4(),
    title,
    desc: `project ${title} description here`,
    startDate: projectStart,
    endDate: projectEnd,
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