export type Label = {
  title: string;
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

export enum ColumnType {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export type Column = {
  id: string;
  type: ColumnType;
  title: string;
  tasks: Task[];
}

export type Sprint = {
  id: string;
  title: string;
  columns: Column[];
}

export type Project = {
  id: string;
  title: string;
  sprints: Record<string, Sprint>;
}