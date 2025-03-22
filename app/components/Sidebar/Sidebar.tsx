'use client';

import { useState, useCallback } from 'react';
// components
import Link from 'next/link';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Collapse, Typography, TextField, Divider } from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as InsertDriveFileIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
// contexts
import { useProjects } from '@contexts/ProjectContext';
// defines
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
      <TextField autoFocus size='small' fullWidth placeholder={placeholder} variant='outlined' value={value}
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
};

/**
 * list all projects
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
      <ListItemText primary={proj.name} />
      <IconButton onClick={onAddSprint} size='small'>
        <AddIcon fontSize='small' />
      </IconButton>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  );
};

/**
 * list all sprints under a project
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
      {/* display sprints */}
      {Object.keys(proj.sprints).length > 0 ? (
        <List sx={{ pl: 2 }} disablePadding>
          {Object.values(proj.sprints).map((sprint) => (
            <Link
              key={sprint.id}
              href={`/${proj.name}/${sprint.name}`}
              passHref
              legacyBehavior
            >
              <ListItemButton>
                <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                <ListItemText primary={sprint.name} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      ) : null}
    </Collapse>
  );
};

/**
 * sidebar component
 */
export default function Sidebar() {
  // context
  const { projects, addProject, addSprint } = useProjects();
  // state
  const [projectInputVisible, setProjectInputVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sprintInputForProject, setSprintInputForProject] = useState<string | null>(null);
  const [sprintName, setSprintName] = useState('');
  const [openProjects, setOpenProjects] = useState<Record<string, boolean>>({});

  /**
   * project and sprint creation handlers
   */
  const handleCreateProject = () => {
    const name = projectName.trim();
    if (name) addProject(name);
    setProjectName('');
    setProjectInputVisible(false);
  };

  const handleCreateSprint = (projectId: string) => {
    const name = sprintName.trim();
    if (name) addSprint(projectId, name);
    setSprintName('');
    setSprintInputForProject(null);
  };

  /**
   * utilities
   */
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

      {/* sidebar header */}
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

      {/* projects list */}
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

          {/* render projects and sprints */}
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