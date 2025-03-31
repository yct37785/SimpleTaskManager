'use client';

import { useState } from 'react';
// next
import Link from 'next/link';
// MUI
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Collapse, Typography, TextField, Divider
} from '@mui/material';
import {
  Add as AddIcon, Folder as FolderIcon, FolderOpen as FolderOpenIcon, InsertDriveFile as InsertDriveFileIcon, Send as SendIcon,
  CalendarMonth as CalendarIcon, Home as HomeIcon, PieChart as PieCharIcon, ExpandLess, ExpandMore
} from '@mui/icons-material';
// our components
import { useWorkspacesManager } from '@contexts/WorkspacesContext';
import ProjectForm from '@components/Forms/ProjectForm';
// others
import dayjs, { Dayjs } from 'dayjs';
// defines
import { sidebar_width, appbar_height, scrollbar_allowance } from '@/app/defines/dimens';
import { Workspace, Project } from '@defines/schemas';
// styles
import styles from './sidebar.module.css';

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
function WorkspaceListItem({ workspace, isOpen, onClickCreateProject, toggleOpen }: {
  workspace: Workspace;
  isOpen: boolean;
  onClickCreateProject: (e: React.MouseEvent, workspaceId: string) => void;
  toggleOpen: () => void;
}) {
  return (
    <ListItemButton onClick={toggleOpen}>
      <ListItemIcon>
        {isOpen ? <FolderOpenIcon /> : <FolderIcon />}
      </ListItemIcon>
      <ListItemText primary={workspace.title} />
      <IconButton onClick={(e) => onClickCreateProject(e, workspace.id)} size='small'>
        <AddIcon fontSize='small' />
      </IconButton>
      {isOpen ? <ExpandLess /> : <ExpandMore />}
    </ListItemButton>
  );
};

/**
 * render all projects inside a workspace
 */
function ProjectsList({ workspace, isOpen }: {
  workspace: Workspace;
  isOpen: boolean;
}) {
  return (
    <Collapse in={isOpen} timeout='auto' unmountOnExit>
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

  // creat workspace
  const [workspaceInputVisible, setWorkspaceInputVisible] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  // create project
  const [activeWorkspace, setActiveWorkspace] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  // workspace open/close tracking
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
   * launch project creation dialog
   */
  const onClickCreateProject = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    setOpenWorkspaces((prev) => ({ ...prev, [workspaceId]: true }));
    setProjectDialogOpen(true);
    setActiveWorkspace(workspaceId);
  };

  /**
   * create project
   */
  const handleCreateProject = (title: string, desc: string, dueDate: Dayjs) => {
    if (activeWorkspace && title) {
      createProject(activeWorkspace, title, 0, 100000);
    }
  };

  /**
   * expand workspace
   */
  const toggleOpen = (id: string) => {
    setOpenWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Box sx={{ width: sidebar_width }} className={styles.sidebar}>
      {/* header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Box sx={{ height: appbar_height }}>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Typography variant='h6' color='primary' gutterBottom
              sx={{ fontWeight: 600, textAlign: 'left', mt: 1, ml: 2, cursor: 'pointer' }}>
              TASK MANAGER
            </Typography>
          </Link>
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
        <Box sx={{ width: sidebar_width - scrollbar_allowance }}>

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
                onClickCreateProject={onClickCreateProject}
                toggleOpen={() => toggleOpen(ws.id)}
              />
              <ProjectsList
                workspace={ws}
                isOpen={openWorkspaces[ws.id] || false}
              />
            </div>
          ))}
        </Box>
      </List>

      {/* create project form */}
      {activeWorkspace ? <ProjectForm
        workspace={workspaces[activeWorkspace]}
        projectDialogOpen={projectDialogOpen}
        handleCreateProject={handleCreateProject}
        closeProjectDialog={() => setProjectDialogOpen(false)} /> : null}
      
    </Box>
  );
};