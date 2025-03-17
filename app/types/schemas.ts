import { v4 as uuidv4 } from "uuid";

// Project Schema
export interface Project {
  id: string; // UUID for backend mapping
  name: string;
}

// Category Schema
export interface Category {
  id: string; // UUID for backend mapping
  name: string;
  projects: Record<string, Project>; // Store projects in a Map-like object
  open: boolean;
}

// Function to create a new category
export const createCategory = (name: string): Category => {
  const id = uuidv4();
  return { id, name, projects: {}, open: false };
};

// Function to create a new project
export const createProject = (name: string): Project => {
  return { id: uuidv4(), name };
};
