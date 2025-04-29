'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { CalendarDate } from '@internationalized/date';
import { Workspace, Project, Sprint, Task } from '@schemas';
import sampleWorkspaces from './sampleData';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type WorkspacesContextType = {
  workspaces: Record<string, Workspace>;
  setWorkspaces: React.Dispatch<React.SetStateAction<Record<string, Workspace>>>;
  createWorkspace: (title: string) => void;
  createProject: (
    workspaceId: string,
    title: string,
    desc: string,
    startDate: CalendarDate,
    dueDate: CalendarDate
  ) => void;
  createSprint: (
    workspaceId: string,
    projectId: string,
    title: string,
    desc: string,
    startDate: CalendarDate,
    dueDate: CalendarDate
  ) => boolean;
  updateSprint: (workspaceId: string, projectId: string, updatedSprint: Sprint) => void;
  addTask: (workspaceId: string, projectId: string, sprintId: string, task: Task) => void;
};

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

/********************************************************************************************************************
 * context hook
 ********************************************************************************************************************/
export const useWorkspacesManager = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspacesManager must be used within a WorkspacesProvider');
  }
  return context;
};

/********************************************************************************************************************
 * provider
 ********************************************************************************************************************/
export const WorkspacesProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>(sampleWorkspaces);

  const updateProject = (
    workspaceId: string,
    projectId: string,
    updater: (project: Project) => Project
  ) => {
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      if (!workspace) return prev;

      const project = workspace.projects[projectId];
      if (!project) return prev;

      const updatedProject = updater(project);

      return {
        ...prev,
        [workspaceId]: {
          ...workspace,
          projects: {
            ...workspace.projects,
            [projectId]: updatedProject,
          },
        },
      };
    });
  };

  /******************************************************************************************************************
   * create a new workspace
   ******************************************************************************************************************/
  const createWorkspace = (title: string) => {
    const id = uuidv4();
    const newWorkspace: Workspace = { id, title, projects: {} };
    setWorkspaces(prev => ({ ...prev, [id]: newWorkspace }));
  };

  /******************************************************************************************************************
   * create a project under a workspace with defined bounds
   ******************************************************************************************************************/
  const createProject = (
    workspaceId: string,
    title: string,
    desc: string,
    startDate: CalendarDate,
    dueDate: CalendarDate
  ) => {
    const projectId = uuidv4();
    const newProject: Project = {
      id: projectId,
      title,
      desc,
      startDate,
      dueDate,
      sprints: [],
    };
    updateProject(workspaceId, projectId, () => newProject);
  };

  /******************************************************************************************************************
   * create a sprint under a project with default columns
   * - returns false if invalid date range or overlapping
   ******************************************************************************************************************/
  const createSprint = (
    workspaceId: string,
    projectId: string,
    title: string,
    desc: string,
    startDate: CalendarDate,
    dueDate: CalendarDate
  ): boolean => {
    const project = workspaces[workspaceId]?.projects[projectId];
    if (!project) return false;

    const newSprint: Sprint = {
      id: uuidv4(),
      title,
      desc,
      startDate,
      dueDate,
      tasks: [],
    };

    updateProject(workspaceId, projectId, (project) => ({
      ...project,
      sprints: [...project.sprints, newSprint],
    }));

    return true;
  };

  /******************************************************************************************************************
   * update a single sprint in a project by ID
   ******************************************************************************************************************/
  const updateSprint = (
    workspaceId: string,
    projectId: string,
    updatedSprint: Sprint
  ) => {
    updateProject(workspaceId, projectId, (project) => ({
      ...project,
      sprints: project.sprints.map(sprint =>
        sprint.id === updatedSprint.id ? updatedSprint : sprint
      ),
    }));
  };

  /******************************************************************************************************************
   * add a task to a sprint
   ******************************************************************************************************************/
  const addTask = (
    workspaceId: string,
    projectId: string,
    sprintId: string,
    task: Task
  ) => {
    updateProject(workspaceId, projectId, (project) => ({
      ...project,
      sprints: project.sprints.map(sprint =>
        sprint.id === sprintId
          ? { ...sprint, tasks: [...sprint.tasks, task] }
          : sprint
      ),
    }));
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <WorkspacesContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        createWorkspace,
        createProject,
        createSprint,
        updateSprint,
        addTask,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};
