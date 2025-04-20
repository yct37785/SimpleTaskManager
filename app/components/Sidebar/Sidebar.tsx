'use client';

import { useState } from 'react';
// next
import { useParams } from 'next/navigation';
import Link from 'next/link';
const NextLink = Link;
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
import { useWorkspacesManager } from '@globals/WorkspacesContext';
import ProjectForm from '@components/Forms/ProjectForm';
// schemas
import { Workspace, Project } from '@schemas';
// utils
import { dateToCalendarDate } from '@utils/datetime';
// styles
import { sidebar_width, appbar_height, scrollbar_allowance } from '@/app/styles/dimens';
import styles from './sidebar.module.css';

/********************************************************************************************************************
 * text input reusable component
 ********************************************************************************************************************/
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

/********************************************************************************************************************
 * render a single workspace row
 ********************************************************************************************************************/
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

/********************************************************************************************************************
 * render all projects inside a workspace
 ********************************************************************************************************************/
function ProjectsList({ workspace, isOpen }: {
  workspace: Workspace;
  isOpen: boolean;
}) {
  const { projectId } = useParams() as { projectId?: string };
  return (
    <Collapse in={isOpen} timeout='auto' unmountOnExit>
      {/* project list */}
      {Object.keys(workspace.projects).length > 0 ? (
        <List sx={{ pl: 2 }} disablePadding>
          {Object.values(workspace.projects).map((proj) => (
            <ListItemButton
              key={proj.id}
              component={NextLink}
              href={`/${workspace.id}/${proj.id}`}
              selected={projectId === proj.id}
            >
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={proj.title} />
            </ListItemButton>
          ))}
        </List>
      ) : null}
    </Collapse>
  );
}

/********************************************************************************************************************
 * sidebar component
 ********************************************************************************************************************/
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

  /******************************************************************************************************************
   * handle workspaces
   ******************************************************************************************************************/
  const handleCreateWorkspace = () => {
    const title = workspaceTitle.trim();
    if (title) {
      createWorkspace(title);
    }
    setWorkspaceTitle('');
    setWorkspaceInputVisible(false);
  };
  
  /******************************************************************************************************************
   * handle projects
   ******************************************************************************************************************/
  const onClickCreateProject = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    setOpenWorkspaces((prev) => ({ ...prev, [workspaceId]: true }));
    setProjectDialogOpen(true);
    setActiveWorkspace(workspaceId);
  };

  const handleCreateProject = (title: string, desc: string, endDate: Date) => {
    if (activeWorkspace && title) {
      createProject(activeWorkspace, title, desc, dateToCalendarDate(new Date()), dateToCalendarDate(endDate));
    }
  };

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  const toggleOpen = (id: string) => {
    setOpenWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box sx={{ width: sidebar_width }} className={styles.sidebar}>
      {/* header */}
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>

        {/* projects management */}
        <List>
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