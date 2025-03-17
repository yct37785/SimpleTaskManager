import { v4 as uuidv4 } from 'uuid';

export interface Project {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  projects: Record<string, Project>;
  open: boolean;
}

export const createCategory = (name: string): Category => {
  const id = uuidv4();
  return { id, name, projects: {}, open: false };
};

export const createProject = (name: string): Project => {
  return { id: uuidv4(), name };
};
