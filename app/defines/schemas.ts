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

export type Column = {
  id: string;
  isTodo: boolean;
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