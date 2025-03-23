export type Label = {
  name: string;
  color: string;
}

export type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  labels?: Label[];
  addDate: string; // ISO string for when the task was added
}

export type Sprint = {
  id: string;
  name: string;
}

export type Project = {
  id: string;
  name: string;
  sprints: Record<string, Sprint>;
}

export enum ColumnType {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export type Column = {
  id: string;
  type: ColumnType;
  title: string;
  tasks: Record<string, Task>;
}