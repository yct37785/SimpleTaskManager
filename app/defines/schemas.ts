export type Task = {
  id: string;
  title: string;
  timestampAdded: number;
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