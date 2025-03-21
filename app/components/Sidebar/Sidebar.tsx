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

          {/* project input field */}
          {projectInputVisible && (
            <TextField
              autoFocus
              fullWidth
              size='small'
              placeholder='Project name'
              variant='outlined'
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={handleCreateProject}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              sx={{ my: 1, mx: 2, height: 20 }}
            />
          )}

          {/* render projects */}
          {Object.values(projects).map((proj) => (
            <div key={proj.id}>
              <ListItemButton onClick={() => toggleProject(proj.id)}>
                <ListItemIcon>{proj.open ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
                <ListItemText primary={proj.name} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSprintInputForProject(proj.id);
                    // project must be open when adding stream
                    if (!proj.open) {
                      toggleProject(proj.id);
                    }
                  }}
                  size='small'
                >
                  <AddIcon fontSize='small' />
                </IconButton>
                {proj.open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={proj.open} timeout='auto' unmountOnExit>
                <List sx={{ pl: 2, bgcolor: 'background.paper' }}>
                  {sprintInputForProject === proj.id && (
                    <TextField
                      autoFocus
                      fullWidth
                      size='small'
                      placeholder='Sprint name'
                      variant='outlined'
                      value={sprintName}
                      onChange={(e) => setSprintName(e.target.value)}
                      onBlur={() => handleCreateSprint(proj.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateSprint(proj.id)}
                      sx={{ my: 1, mx: 1, height: 10 }}
                    />
                  )}

                  {Object.keys(proj.sprints).length === 0 ? (
                    <Typography variant='body2' sx={{ pl: 2, fontStyle: 'italic', color: 'text.secondary' }}>
                      No sprints yet
                    </Typography>
                  ) : (
                    Object.values(proj.sprints).map((sprint) => (
                      <Link href={`/${proj.name}/${sprint.name}`} passHref legacyBehavior key={sprint.id}>
                        <ListItemButton>
                          <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                          <ListItemText primary={sprint.name} />
                        </ListItemButton>
                      </Link>
                    ))
                  )}
                </List>
              </Collapse>
            </div>
          ))}

        </Box>
      </List>
    </Box>
  );
};