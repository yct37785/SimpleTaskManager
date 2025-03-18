import { v4 as uuidv4 } from 'uuid';

export interface Sprint {
  id: string;
  name: string;
}

export interface Project {
  id: string;
  name: string;
  sprints: Record<string, Sprint>;
  open: boolean;
}

export const createSprint = (name: string): Sprint => {
  return { id: uuidv4(), name };
};

export const createProject = (name: string): Project => {
  const id = uuidv4();
  return { id, name, sprints: {}, open: false };
};
