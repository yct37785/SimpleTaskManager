import { CalendarDate } from '@internationalized/date';

export type Label = {
  title: string;
  color: string;
}

/**
 * task
 * - eg. review chatper 1
 */
export type Task = {
  id: string;
  title: string;
  desc: string;
  addDate: CalendarDate;
  dueDate: CalendarDate;
  completedDate?: CalendarDate;
  labels?: Label[];
}

/**
 * hosts tasks
 * - eg. TODO/WIP/DONE
 * - draggable ordered
 */
export type Column = {
  id: string;
  title: string;
  isTodo: boolean;
  tasks: Task[];
}

/**
 * sprint board with columns to sort tasks by TODO, WIP and DONE
 * - eg. review algebra 1
 * - ordered
 */
export type Sprint = {
  title: string;
  desc: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
  columns: Column[];
}

/**
 * a project is split into multiple sprints spanning the set duration
 * - eg. review math
 * - sprints ordered chronogically
 */
export type Project = {
  id: string;
  title: string;
  desc: string;
  startDate: CalendarDate;
  endDate: CalendarDate;
  sprints: Sprint[];
}

/**
 * a group of projects of the same category
 * - eg. study for midterms
 * - projects are unordered
 */
export type Workspace = {
  id: string;
  title: string;
  projects: Record<string, Project>;
}