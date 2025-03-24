'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, Sprint, Column, Task } from '@defines/schemas';

type ProjectsContextType = {
  projects: Record<string, Project>;
  setProjects: React.Dispatch<React.SetStateAction<Record<string, Project>>>;
  addProject: (title: string) => void;
  addSprint: (projectId: string, title: string) => void;
  addTask: (projectId: string, sprintId: string, columnId: string, task: Task) => void;
  moveTask: (
    projectId: string,
    sprintId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => void;
};

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

/**
 * hook to use the ProjectsContext
 */
export const useProjectsManager = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjectsManager must be used within a ProjectsProvider');
  }
  return context;
};

/**
 * ProjectsProvider provides global state for all projects, sprints, columns, and tasks
 */
export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Record<string, Project>>({});

  /**
   * adds a new project to the board
   */
  const addProject = (title: string) => {
    const id = uuidv4();
    setProjects((prev) => ({
      ...prev,
      [id]: {
        id,
        title,
        sprints: {},
      },
    }));
  };

  /**
   * adds a new sprint with default columns to a specific project
   */
  const addSprint = (projectId: string, title: string) => {
    const sprintId = uuidv4();

    const newSprint: Sprint = {
      id: sprintId,
      title,
      columns: [
        {
          id: uuidv4(),
          isTodo: true,
          title: 'TODO',
          tasks: [],
        },
        {
          id: uuidv4(),
          isTodo: false,
          title: 'IN PROGRESS',
          tasks: [],
        },
        {
          id: uuidv4(),
          isTodo: false,
          title: 'DONE',
          tasks: [],
        },
      ],
    };

    setProjects((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        sprints: {
          ...prev[projectId].sprints,
          [sprintId]: newSprint,
        },
      },
    }));
  };

  /**
   * adds a task to a specific column inside a sprint
   */
  const addTask = (projectId: string, sprintId: string, columnId: string, task: Task) => {
    setProjects((prev) => {
      const project = prev[projectId];
      const sprint = project.sprints[sprintId];
      const updatedColumns = sprint.columns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, task] } : col
      );

      return {
        ...prev,
        [projectId]: {
          ...project,
          sprints: {
            ...project.sprints,
            [sprintId]: {
              ...sprint,
              columns: updatedColumns,
            },
          },
        },
      };
    });
  };

  /**
   * moves a task from one column to another, or within the same column
   */
  const moveTask = (
    projectId: string,
    sprintId: string,
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    setProjects((prev) => {
      const project = prev[projectId];
      const sprint = project.sprints[sprintId];

      const sourceColumn = sprint.columns.find((col) => col.id === sourceColId)!;
      const destColumn = sprint.columns.find((col) => col.id === destColId)!;

      const task = sourceColumn.tasks[sourceIndex];

      const updatedSourceTasks = [...sourceColumn.tasks];
      updatedSourceTasks.splice(sourceIndex, 1);

      const updatedDestTasks = [...destColumn.tasks];
      updatedDestTasks.splice(destIndex, 0, task);

      const updatedColumns = sprint.columns.map((col) => {
        if (col.id === sourceColId) return { ...col, tasks: updatedSourceTasks };
        if (col.id === destColId) return { ...col, tasks: updatedDestTasks };
        return col;
      });

      return {
        ...prev,
        [projectId]: {
          ...project,
          sprints: {
            ...project.sprints,
            [sprintId]: {
              ...sprint,
              columns: updatedColumns,
            },
          },
        },
      };
    });
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        setProjects,
        addProject,
        addSprint,
        addTask,
        moveTask,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};