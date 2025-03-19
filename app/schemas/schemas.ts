export type Task = {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS';
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
