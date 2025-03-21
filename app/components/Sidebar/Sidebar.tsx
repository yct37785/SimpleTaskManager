'use client';

import { useState, useCallback } from 'react';
// components
import Link from 'next/link';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Collapse, Typography, TextField } from '@mui/material';
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
import { SIDEBAR_WIDTH, SIDEBAR_HEADER_HEIGHT, SCROLLBAR_ALLOWANCE, SIDEBAR_BG } from '@defines/consts';
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
    <TextField autoFocus fullWidth size='small' placeholder={placeholder} variant='outlined' value={value} sx={{ my: 1, mx: 2 }}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSubmit();
        }
      }}
    />
  );
};

/**
 * list all projects
 */
function ProjectListItem({ proj, onAddSprint }: {
  proj: Project;
  onAddSprint: (e: React.MouseEvent) => void;
}) {
  const { toggleProject } = useProjects();

  return (
    <ListItemButton onClick={() => toggleProject(proj.id)}>
      <ListItemIcon>
        {proj.open ? <FolderOpenIcon /> : <FolderIcon />}
      </ListItemIcon>
      <ListItemText primary={proj.name} />
      <IconButton onClick={onAddSprint} size='small'>
        <AddIcon fontSize='small' />
      </IconButton>
      {proj.open ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  );
};

/**
 * list all sprints under a project
 */
function SprintList({ proj, sprintInputForProject, sprintName, setSprintName, handleCreateSprint }: {
  proj: Project;
  sprintInputForProject: string | null;
  sprintName: string;
  setSprintName: (val: string) => void;
  handleCreateSprint: (projId: string) => void;
}) {
  return (
    <Collapse in={proj.open} timeout='auto' unmountOnExit>
      <List sx={{ pl: 2, bgcolor: 'background.paper' }}>
        {sprintInputForProject === proj.id && (
          <InlineTextInput
            placeholder='Sprint name'
            value={sprintName}
            setValue={setSprintName}
            onSubmit={() => handleCreateSprint(proj.id)}
          />
        )}

        {Object.keys(proj.sprints).length === 0 ? (
          <Typography variant='body2' sx={{ pl: 2, fontStyle: 'italic', color: 'text.secondary' }}>
            No sprints yet
          </Typography>
        ) : (
          Object.values(proj.sprints).map((sprint) => (
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
          ))
        )}
      </List>
    </Collapse>
  );
};

/**
 * sidebar component
 */
export default function Sidebar() {
  // context
  const { projects, addProject, addSprint, toggleProject } = useProjects();
  // state
  const [projectInputVisible, setProjectInputVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [sprintInputForProject, setSprintInputForProject] = useState<string | null>(null);
  const [sprintName, setSprintName] = useState('');

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
  const handleAddSprintClick = (e: React.MouseEvent, projId: string, isOpen: boolean) => {
    e.stopPropagation();
    if (!isOpen) toggleProject(projId);
    setSprintInputForProject(projId);
  };

  return (
    <Box sx={{ width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG, display: 'flex', flexDirection: 'column' }}>

      {/* sidebar header */}
      <Box sx={{ height: SIDEBAR_HEADER_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', px: 2, pt: 2 }}>
        <Typography variant='h6' color='primary' sx={{ fontWeight: 600, textAlign: 'left' }} gutterBottom>
          TASK MANAGER
        </Typography>
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
            <InlineTextInput
              placeholder='Project name'
              value={projectName}
              setValue={setProjectName}
              onSubmit={handleCreateProject}
            />
          )}

          {/* render projects and sprints */}
          {Object.values(projects).map((proj) => (
            <div key={proj.id}>
              <ProjectListItem
                proj={proj}
                onAddSprint={(e) => handleAddSprintClick(e, proj.id, proj.open)}
              />
              <SprintList
                proj={proj}
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