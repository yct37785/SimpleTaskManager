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
  open: boolean;
}

export type Column = {
  id: 'TODO' | 'IN_PROGRESS';
  title: string;
  tasks: Record<string, Task>;
}