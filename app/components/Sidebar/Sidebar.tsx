'use client';

import { useState } from 'react';
// components
import Link from 'next/link';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Collapse, Typography, TextField, Divider
} from '@mui/material';
import {
  Add as AddIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon, InsertDriveFile as InsertDriveFileIcon, Send as SendIcon,
  CalendarMonth as CalendarIcon, Home as HomeIcon, PieChart as PieCharIcon, ExpandLess, ExpandMore
} from '@mui/icons-material';
// contexts
import { useWorkspacesManager } from '@contexts/WorkspacesContext';
// types
import { SIDEBAR_WIDTH, TASK_PAGE_APPBAR_HEIGHT, SCROLLBAR_ALLOWANCE, SIDEBAR_BG } from '@defines/consts';
import { Workspace, Project } from '@defines/schemas';

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
        onChange={(e) => setValue(e.target.value)} onBlur={onSubmit}
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
 * render a single workspace row
 */
function WorkspaceListItem({ workspace, isOpen, onAddProject, toggleOpen }: {
  workspace: Workspace;
  isOpen: boolean;
  onAddProject: (e: React.MouseEvent) => void;
  toggleOpen: () => void;
}) {
  return (
    <ListItemButton onClick={toggleOpen}>
      <ListItemIcon>
        {isOpen ? <FolderOpenIcon /> : <FolderIcon />}
      </ListItemIcon>
      <ListItemText primary={workspace.title} />
      <IconButton onClick={onAddProject} size='small'>
        <AddIcon fontSize='small' />
      </IconButton>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  );
};

/**
 * render all projects inside a workspace
 */
function ProjectsList({ workspace, isOpen, targetWorkspace, projectTitle, setProjectTitle, handleCreateProject }: {
  workspace: Workspace;
  isOpen: boolean;
  targetWorkspace: string | null;
  projectTitle: string;
  setProjectTitle: (val: string) => void;
  handleCreateProject: (workspaceId: string) => void;
}) {
  return (
    <Collapse in={isOpen} timeout='auto' unmountOnExit>
      {/* project name input */}
      {targetWorkspace === workspace.id && (
        <Box sx={{ pl: 4, mt: 1 }}>
          <InlineTextInput
            placeholder='Project title'
            value={projectTitle}
            setValue={setProjectTitle}
            onSubmit={() => handleCreateProject(workspace.id)}
          />
        </Box>
      )}

      {/* project list */}
      {Object.keys(workspace.projects).length > 0 ? (
        <List sx={{ pl: 2 }} disablePadding>
          {Object.values(workspace.projects).map((proj) => (
            <Link
              key={proj.id}
              href={`/${workspace.id}/${proj.id}`}
              passHref
              legacyBehavior
            >
              <ListItemButton>
                <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                <ListItemText primary={proj.title} />
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
  const { workspaces, createWorkspace, createProject } = useWorkspacesManager();

  // state
  const [workspaceInputVisible, setWorkspaceInputVisible] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  const [targetWorkspace, setTargetWorkspace] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({});

  /**
   * create a workspace from name input
   */
  const handleCreateWorkspace = () => {
    const title = workspaceTitle.trim();
    if (title) {
      createWorkspace(title);
    }
    setWorkspaceTitle('');
    setWorkspaceInputVisible(false);
  };

  /**
   * create a project for a workspace from name input
   */
  const handleCreateProject = (workspaceId: string) => {
    const title = projectTitle.trim();
    if (title) {
      createProject(workspaceId, title, 0, 100000);
    }
    setProjectTitle('');
    setTargetWorkspace(null);
  };

  const toggleOpen = (id: string) => {
    setOpenWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAddProjectClick = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    setOpenWorkspaces((prev) => ({ ...prev, [workspaceId]: true }));
    setTargetWorkspace(workspaceId);
  };

  return (
    <Box sx={{ width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG, display: 'flex', flexDirection: 'column' }}>
      {/* header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Box sx={{ height: TASK_PAGE_APPBAR_HEIGHT }}>
          <Typography variant='h6' color='#55F' sx={{ fontWeight: 600, textAlign: 'left', mt: 1, ml: 2 }} gutterBottom>
            TASK MANAGER
          </Typography>
        </Box>

        <Divider />

        {/* projects management */}
        <List>
          <ListItemButton>
            <ListItemIcon><CalendarIcon /></ListItemIcon>
            <ListItemText primary='Timeline' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon><PieCharIcon /></ListItemIcon>
            <ListItemText primary='Metrics' />
          </ListItemButton>
        </List>

        <Divider />

        {/* add workspace */}
        <ListItemButton onClick={() => setWorkspaceInputVisible(true)}>
          <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
          <ListItemText primary='Add Workspace' />
        </ListItemButton>
      </Box>

      {/* workspace list */}
      <List sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        <Box sx={{ width: SIDEBAR_WIDTH - SCROLLBAR_ALLOWANCE }}>

          {/* workspace input */}
          {workspaceInputVisible && (
            <Box sx={{ ml: 2 }}>
              <InlineTextInput
                placeholder='Workspace title'
                value={workspaceTitle}
                setValue={setWorkspaceTitle}
                onSubmit={handleCreateWorkspace}
              />
            </Box>
          )}

          {/* each workspace */}
          {Object.values(workspaces).map((ws) => (
            <div key={ws.id}>
              <WorkspaceListItem
                workspace={ws}
                isOpen={openWorkspaces[ws.id] || false}
                onAddProject={(e) => handleAddProjectClick(e, ws.id)}
                toggleOpen={() => toggleOpen(ws.id)}
              />
              <ProjectsList
                workspace={ws}
                isOpen={openWorkspaces[ws.id] || false}
                targetWorkspace={targetWorkspace}
                projectTitle={projectTitle}
                setProjectTitle={setProjectTitle}
                handleCreateProject={handleCreateProject}
              />
            </div>
          ))}
        </Box>
      </List>
    </Box>
  );
};