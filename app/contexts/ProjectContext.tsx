'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, Sprint } from '@defines/schemas';

type ProjectContextType = {
  projects: Record<string, Project>;
  addProject: (name: string) => void;
  addSprint: (projectId: string, name: string) => void;
  toggleProject: (projectId: string) => void;
};

/**
 * persists projects
 */
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

/**
 * use projects context
 */
export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) throw new Error('useProjects must be used within ProjectProvider');
  return context;
};

/**
 * project provider
 */
export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Record<string, Project>>({});
  
  /**
   * project
   */
  const createProject = (name: string): Project => {
    const id = uuidv4();
    return { id, name, sprints: {}, open: false };
  };

  const addProject = useCallback((name: string) => {
    const newProject = createProject(name);
    setProjects((prev) => ({ ...prev, [newProject.id]: newProject }));
  }, []);

  /**
   * sprint
   */
  const createSprint = (name: string): Sprint => ({
    id: uuidv4(),
    name,
  });

  const addSprint = useCallback((projectId: string, name: string) => {
    const newSprint = createSprint(name);
    setProjects((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        sprints: {
          ...prev[projectId].sprints,
          [newSprint.id]: newSprint,
        },
        open: true,
      },
    }));
  }, []);

  /**
   * misc
   */
  const toggleProject = useCallback((projectId: string) => {
    setProjects((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], open: !prev[projectId].open },
    }));
  }, []);

  return (
    <ProjectContext.Provider value={{ projects, addProject, addSprint, toggleProject }}>
      {children}
    </ProjectContext.Provider>
  );
};
