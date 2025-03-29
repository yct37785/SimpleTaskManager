'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
// others
import { v4 as uuidv4 } from 'uuid';
// defines
import { Workspace, Project, Sprint, Column, Task } from '@defines/schemas';

type WorkspacesContextType = {
  workspaces: Record<string, Workspace>;
  setWorkspaces: React.Dispatch<React.SetStateAction<Record<string, Workspace>>>;
  createWorkspace: (name: string) => void;
  createProject: (workspaceId: string, name: string, startDate: number, endDate: number) => void;
  createSprint: (workspaceId: string, projectId: string, name: string, startDate: number, endDate: number) => boolean;
  addTask: (workspaceId: string, projectId: string, sprintIdx: number, columnId: string, task: Task) => void;
  moveTask: (workspaceId: string, projectId: string, sprintIdx: number, sourceColId: string,
    destColId: string, sourceIndex: number, destIndex: number) => void;
};

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

/**
 * hook to use the WorkspacesContext
 */
export const useWorkspacesManager = () => {
  const context = useContext(WorkspacesContext);
  if (!context) {
    throw new Error('useWorkspacesManager must be used within a WorkspacesProvider');
  }
  return context;
};

/**
 * provides global state for all workspaces, projects, sprints, columns, and tasks
 */
export const WorkspacesProvider = ({ children }: { children: ReactNode }) => {
  const [workspaces, setWorkspaces] = useState<Record<string, Workspace>>({});

  /**
   * create a new workspace
   */
  const createWorkspace = (title: string) => {
    const id = uuidv4();
    const newWorkspace: Workspace = {
      id,
      title,
      projects: {},
    };
    setWorkspaces((prev) => ({ ...prev, [id]: newWorkspace }));
  };

  /**
   * create a project under a workspace with defined bounds
   */
  const createProject = (workspaceId: string, title: string, startDate: number, endDate: number) => {
    const projectId = uuidv4();
    const newProject: Project = {
      id: projectId,
      title,
      startDate,
      endDate,
      sprints: [],
    };

    setWorkspaces(prev => ({
      ...prev,
      [workspaceId]: {
        ...prev[workspaceId],
        projects: {
          ...prev[workspaceId].projects,
          [projectId]: newProject,
        },
      },
    }));
  };

  /**
   * create a sprint under a project with default columns
   * - returns false if invalid date range or overlapping
   */
  const createSprint = (
    workspaceId: string,
    projectId: string,
    title: string,
    startDate: number,
    endDate: number
  ): boolean => {
    const project = workspaces[workspaceId]?.projects[projectId];
    if (!project) return false;
  
    // validate sprint dates
    if (startDate > endDate || startDate < project.startDate || endDate > project.endDate) {
      return false;
    }
  
    // check for overlap with existing sprints
    const overlaps = project.sprints.some((sprint) =>
      !(endDate < sprint.startDate || startDate > sprint.endDate)
    );
    if (overlaps) {
      return false;
    }
  
    const newSprint: Sprint = {
      title,
      startDate,
      endDate,
      columns: [
        { id: uuidv4(), isTodo: true, title: 'TODO', tasks: [] },
        { id: uuidv4(), isTodo: false, title: 'IN PROGRESS', tasks: [] },
        { id: uuidv4(), isTodo: false, title: 'DONE', tasks: [] },
      ],
    };
  
    // update state immutably
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const existingProject = workspace.projects[projectId];
  
      const updatedProject: Project = {
        ...existingProject,
        sprints: [...existingProject.sprints, newSprint],
      };
  
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
  
    return true;
  };

  /**
   * add a task to a column inside a sprint
   */
  const addTask = (
    workspaceId: string,
    projectId: string,
    sprintIdx: number,
    columnId: string,
    task: Task
  ) => {
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const project = workspace.projects[projectId];
      const sprint = project.sprints[sprintIdx];
      
      // update the columns in the sprint
      const updatedColumns = sprint.columns.map(col =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      );

      // updated sprint
      const updatedSprint = { ...sprint, columns: updatedColumns };

      // updated sprint array
      const updatedSprints = [...project.sprints];
      updatedSprints[sprintIdx] = updatedSprint;

      // return updated workspace
      return {
        ...prev,
        [workspaceId]: {
          ...workspace,
          projects: {
            ...workspace.projects,
            [projectId]: {
              ...project,
              sprints: updatedSprints,
            },
          },
        },
      };
    });
  };

  /**
   * move a task from one column to another (or reorder within same column)
   */
  const moveTask = (
    workspaceId: string,
    projectId: string,
    sprintIdx: number,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const project = workspace.projects[projectId];
      const sprint = project.sprints[sprintIdx];

      // columns
      const sourceCol = sprint.columns.find(col => col.id === sourceColId)!;
      const destCol = sprint.columns.find(col => col.id === destColId)!;

      // task
      const task = sourceCol.tasks[sourceIndex];
      sourceCol.tasks.splice(sourceIndex, 1);
      destCol.tasks.splice(destIndex, 0, task);

      return {
        ...prev,
        [workspaceId]: {
          ...workspace,
          projects: {
            ...workspace.projects,
            [projectId]: {
              ...project
            },
          },
        },
      };
    });
  };

  return (
    <WorkspacesContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        createWorkspace,
        createProject,
        createSprint,
        addTask,
        moveTask,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};