'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, Sprint } from '@defines/schemas';

type ProjectContextType = {
  projects: Record<string, Project>;
  addProject: () => void;
  addSprint: (projectId: string) => void;
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

export const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Record<string, Project>>({});

  const createSprint = (name: string): Sprint => ({
    id: uuidv4(),
    name,
  });

  const createProject = (name: string): Project => {
    const id = uuidv4();
    return { id, name, sprints: {}, open: false };
  };

  const addProject = useCallback(() => {
    const name = prompt('Enter project name:');
    if (!name) return;
    const newProject = createProject(name);
    setProjects((prev) => ({ ...prev, [newProject.id]: newProject }));
  }, []);

  const addSprint = useCallback((projectId: string) => {
    const name = prompt(`Enter sprint name for project '${projects[projectId].name}':`);
    if (!name) return;
    
    for (let i = 0; i < 20; ++i) {
      const newSprint = createSprint(name);
      setProjects((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          sprints: { ...prev[projectId].sprints, [newSprint.id]: newSprint },
          open: true, // always keep category open when adding a project
        },
      }));
    }
  }, [projects]);

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
