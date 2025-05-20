'use client';

import { useState, useEffect } from 'react';
// next
import { useParams } from 'next/navigation';
import Link from 'next/link';
const NextLink = Link;
// MUI
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText, CircularProgress,
  IconButton, Collapse, Skeleton, TextField, Divider
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
import { CalendarDate } from '@internationalized/date';
import { dateToCalendarDate } from '@utils/datetime';
// styles
import { sidebar_width, scrollbar_allowance } from '@/app/styles/dimens';
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
  // contexts
  const { workspaces, createWorkspace, createProject } = useWorkspacesManager();

  // creat workspace
  const [workspaceInputVisible, setWorkspaceInputVisible] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState('');
  // create project
  const [activeWorkspaceID, setActiveWorkspaceID] = useState<string | null>(null);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  // UI
  const [openWorkspaces, setOpenWorkspaces] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  /******************************************************************************************************************
   * load data
   ******************************************************************************************************************/
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  /******************************************************************************************************************
   * handle workspaces
   ******************************************************************************************************************/
  const handleCreateWorkspace = async () => {
    const title = workspaceTitle.trim();
    if (!title) {
      setWorkspaceInputVisible(false);
      setIsCreatingWorkspace(false);
      return;
    }

    setIsCreatingWorkspace(true);

    // simulate backend processing delay
    setTimeout(() => {
      createWorkspace(title);
      setWorkspaceTitle('');
      setWorkspaceInputVisible(false);
      setIsCreatingWorkspace(false);
    }, 1000);
  };
  
  /******************************************************************************************************************
   * handle projects
   ******************************************************************************************************************/
  const onClickCreateProject = (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    setProjectDialogOpen(true);
    setActiveWorkspaceID(workspaceId);
  };

  const handleCreateProject = async (title: string, desc: string, dueDate: CalendarDate) => {
    if (activeWorkspaceID && title) {
      await new Promise(res => setTimeout(res, 1500));
      setOpenWorkspaces((prev) => ({ ...prev, [activeWorkspaceID]: true }));
      createProject(activeWorkspaceID, title, desc, dateToCalendarDate(new Date()), dueDate);
    }
  };

  /******************************************************************************************************************
   * UI
   ******************************************************************************************************************/
  const toggleOpen = (id: string) => {
    setOpenWorkspaces((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderSkeleton = () => {
    return (
      [...Array(3)].map((_, i) => (
        <Box key={i} sx={{ px: 2, py: 1 }}>
          <Skeleton variant='rectangular' width={240} height={32} sx={{ mb: 1 }} />
          {[...Array(2)].map((_, j) => (
            <Skeleton key={j} variant='text' width={200} sx={{ ml: 4, mb: 0.5 }} />
          ))}
        </Box>
      ))
    );
  }

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box sx={{ width: sidebar_width, height: '100%' }} className={styles.sidebar}>
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
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InlineTextInput
                placeholder='Workspace title'
                value={workspaceTitle}
                setValue={setWorkspaceTitle}
                onSubmit={handleCreateWorkspace}
              />
              {isCreatingWorkspace && <CircularProgress size={20} />}
            </Box>
          )}

          {/* each workspace */}
          {loading ? renderSkeleton() :
            Object.values(workspaces).map((ws) => (
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
      {activeWorkspaceID ? <ProjectForm
        workspace={workspaces[activeWorkspaceID]}
        projectDialogOpen={projectDialogOpen}
        onSubmitProject={handleCreateProject}
        closeProjectDialog={() => setProjectDialogOpen(false)} /> : null}
      
    </Box>
  );
};