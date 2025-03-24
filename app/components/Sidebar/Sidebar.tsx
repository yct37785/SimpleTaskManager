'use client';

import { useState } from 'react';
// components
import Link from 'next/link';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Collapse, Typography, TextField, Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as InsertDriveFileIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
// contexts
import { useProjectsManager } from '@contexts/ProjectsContext';
// types
import { SIDEBAR_WIDTH, TASK_PAGE_APPBAR_HEIGHT, SCROLLBAR_ALLOWANCE, SIDEBAR_BG } from '@defines/consts';
import { Project } from '@defines/schemas';

/**
 * text input reusable component
 */
function InlineTextInput({ placeholder, value, setValue, onSubmit }: {
  placeholder: string;
  value: string;
  setValue: (val: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Box>
      <TextField
        autoFocus
        size='small'
        fullWidth
        placeholder={placeholder}
        variant='outlined'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onSubmit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
    </Box>
  );
}

/**
 * render a single project row
 */
function ProjectListItem({ proj, isOpen, onAddSprint, toggleOpen }: {
  proj: Project;
  isOpen: boolean;
  toggleOpen: () => void;
  onAddSprint: (e: React.MouseEvent) => void;
}) {
  return (
    <ListItemButton onClick={toggleOpen}>
      <ListItemIcon>
        {isOpen ? <FolderOpenIcon /> : <FolderIcon />}
      </ListItemIcon>
      <ListItemText primary={proj.title} />
      <IconButton onClick={onAddSprint} size='small'>
        <AddIcon fontSize='small' />
      </IconButton>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  );
}

/**
 * render all sprints inside a project
 */
function SprintList({ proj, isOpen, sprintInputForProject, sprintName, setSprintName, handleCreateSprint }: {
  proj: Project;
  isOpen: boolean;
  sprintInputForProject: string | null;
  sprintName: string;
  setSprintName: (val: string) => void;
  handleCreateSprint: (projId: string) => void;
}) {
  return (
    <Collapse in={isOpen} timeout='auto' unmountOnExit>
      {/* sprint name input */}
      {sprintInputForProject === proj.id && (
        <Box sx={{ pl: 4, mt: 1 }}>
          <InlineTextInput
            placeholder='Sprint name'
            value={sprintName}
            setValue={setSprintName}
            onSubmit={() => handleCreateSprint(proj.id)}
          />
        </Box>
      )}

      {/* sprint list */}
      {Object.keys(proj.sprints).length > 0 ? (
        <List sx={{ pl: 2 }} disablePadding>
          {Object.values(proj.sprints).map((sprint) => (
            <Link
              key={sprint.id}
              href={`/${proj.id}/${sprint.id}`}
              passHref
              legacyBehavior
            >
              <ListItemButton>
                <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                <ListItemText primary={sprint.title} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      ) : null}
    </Collapse>
  );
}

/**
 * sidebar component
 */
export default function Sidebar() {
  // context
  const { projects, createProject, createSprint } = useProjectsManager();

  // state
  const [projectInputVisible, setProjectInputVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sprintInputForProject, setSprintInputForProject] = useState<string | null>(null);
  const [sprintName, setSprintName] = useState('');
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  /**
   * create a project from name input
   */
  const handleCreateProject = () => {
    const name = projectName.trim();
    if (name) createProject(name);
    setProjectName('');
    setProjectInputVisible(false);
  };

  /**
   * create a sprint for a project from name input
   */
  const handleCreateSprint = (projectId: string) => {
    const name = sprintName.trim();
    if (name) createSprint(projectId, name);
    setSprintName('');
    setSprintInputForProject(null);
  };

  const toggleOpen = (id: string) => {
    setOpenProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddSprintClick = (e: React.MouseEvent, projId: string) => {
    e.stopPropagation();
    setOpenProjects((prev) => ({ ...prev, [projId]: true }));
    setSprintInputForProject(projId);
  };

  return (
    <Box sx={{ width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Box sx={{ height: TASK_PAGE_APPBAR_HEIGHT }}>
          <Typography variant='h6' color='primary' sx={{ fontWeight: 600, textAlign: 'left', mt: 1, ml: 2 }} gutterBottom>
            TASK MANAGER
          </Typography>
        </Box>
        <Divider />
        <ListItemButton onClick={() => setProjectInputVisible(true)}>
          <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
          <ListItemText primary='Add Project' />
        </ListItemButton>
      </Box>

      {/* project list */}
      <List sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        <Box sx={{ width: SIDEBAR_WIDTH - SCROLLBAR_ALLOWANCE }}>

          {/* project input */}
          {projectInputVisible && (
            <Box sx={{ ml: 2 }}>
              <InlineTextInput
                placeholder='Project name'
                value={projectName}
                setValue={setProjectName}
                onSubmit={handleCreateProject}
              />
            </Box>
          )}

          {/* each project */}
          {Object.values(projects).map((proj) => (
            <div key={proj.id}>
              <ProjectListItem
                proj={proj}
                isOpen={openProjects[proj.id] || false}
                toggleOpen={() => toggleOpen(proj.id)}
                onAddSprint={(e) => handleAddSprintClick(e, proj.id)}
              />
              <SprintList
                proj={proj}
                isOpen={openProjects[proj.id] || false}
                sprintInputForProject={sprintInputForProject}
                sprintName={sprintName}
                setSprintName={setSprintName}
                handleCreateSprint={handleCreateSprint}
              />
            </div>
          ))}
        </Box>
      </List>
    </Box>
  );
};