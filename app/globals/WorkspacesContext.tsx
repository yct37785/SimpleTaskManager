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
    endDate: CalendarDate
  ) => void;
  createSprint: (
    workspaceId: string,
    projectId: string,
    title: string,
    desc: string,
    startDate: CalendarDate,
    endDate: CalendarDate
  ) => boolean;
  updateSprints: (workspaceId: string, projectId: string, sprints: Sprint[]) => void;
  addTask: (
    workspaceId: string,
    projectId: string,
    sprintId: string,
    task: Task
  ) => void;
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

  /******************************************************************************************************************
   * create a new workspace
   ******************************************************************************************************************/
  const createWorkspace = (title: string) => {
    const id = uuidv4();
    const newWorkspace: Workspace = {
      id,
      title,
      projects: {},
    };
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
    endDate: CalendarDate
  ) => {
    const projectId = uuidv4();
    const newProject: Project = {
      id: projectId,
      title,
      desc,
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
    endDate: CalendarDate
  ): boolean => {
    const project = workspaces[workspaceId]?.projects[projectId];
    if (!project) return false;

    // validate sprint bounds
    if (
      startDate.compare(endDate) > 0 ||
      project.startDate.compare(startDate) > 0 ||
      endDate.compare(project.endDate) > 0
    ) {
      return false;
    }

    // check for overlap
    const overlaps = project.sprints.some((sprint) => {
      const noOverlap = endDate.compare(sprint.startDate) < 0 || startDate.compare(sprint.endDate) > 0;
      return !noOverlap;
    });
    if (overlaps) return false;

    // add sprint
    const newSprint: Sprint = {
      id: uuidv4(),
      title,
      desc,
      startDate,
      endDate,
      tasks: []
    };

    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const updatedProject: Project = {
        ...workspace.projects[projectId],
        sprints: [...workspace.projects[projectId].sprints, newSprint],
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

  /******************************************************************************************************************
   * replace project sprints list with a new list
   ******************************************************************************************************************/
  const updateSprints = (workspaceId: string, projectId: string, sprints: Sprint[]) => {
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const updatedProject: Project = {
        ...workspace.projects[projectId],
        sprints,
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
    setWorkspaces(prev => {
      const workspace = prev[workspaceId];
      const project = workspace.projects[projectId];

      const updatedSprints = project.sprints.map((sprint) =>
        sprint.id === sprintId
          ? { ...sprint, tasks: [...sprint.tasks, task] }
          : sprint
      );

      const updatedProject: Project = {
        ...project,
        sprints: updatedSprints,
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
        updateSprints,
        addTask,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};