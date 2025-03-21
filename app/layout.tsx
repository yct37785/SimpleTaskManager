'use client';

import { useState, useCallback } from 'react';
// components
import Link from 'next/link';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Stack, Box, List, ListItemButton, ListItemIcon, ListItemText, IconButton, Collapse, Typography, Divider, CssBaseline } from '@mui/material';
import {
  Add as AddIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as InsertDriveFileIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
// contexts
import { ProjectProvider, useProjects } from '@contexts/ProjectContext';
// defines
import { SIDEBAR_WIDTH, SIDEBAR_HEADER_HEIGHT, SCROLLBAR_ALLOWANCE, SIDEBAR_BG } from '@defines/consts';

/**
 * sidebar component
 */
function Sidebar() {
  const { projects, addProject, addSprint, toggleProject } = useProjects();

  return (
    <Box sx={{ width: SIDEBAR_WIDTH, bgcolor: SIDEBAR_BG, display: 'flex', flexDirection: 'column' }}>

      {/* sidebar header */}
      <Box sx={{ height: SIDEBAR_HEADER_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', px: 2, pt: 2 }}>
        <Typography variant='h6' color='primary' gutterBottom>
          TASK MANAGER
        </Typography>
        <ListItemButton onClick={addProject}>
          <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
          <ListItemText primary='Add Project' />
        </ListItemButton>
      </Box>

      {/* projects list */}
      <List sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        <Box sx={{ width: SIDEBAR_WIDTH - SCROLLBAR_ALLOWANCE }}>
          {Object.values(projects).map((proj) => (
            <div key={proj.id}>
              <ListItemButton onClick={() => toggleProject(proj.id)}>
                <ListItemIcon>{proj.open ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
                <ListItemText primary={proj.name} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    addSprint(proj.id);
                  }}
                  size='small'>
                  <AddIcon fontSize='small' />
                </IconButton>
                {proj.open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={proj.open} timeout='auto' unmountOnExit>
                <List sx={{ pl: 2, bgcolor: 'background.paper' }}>
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

/**
 * root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </head>
      <body>
        <CssBaseline />
        <ProjectProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <Stack direction='row' sx={{ height: '100vh' }}>

              {/* sidebar */}
              <Sidebar />

              <Divider orientation='vertical' flexItem />

              {/* main content */}
              <Box sx={{ overflowY: 'auto', flex: 1 }}>
                {children}
              </Box>

            </Stack>
          </AppRouterCacheProvider>
        </ProjectProvider>
      </body>
    </html>
  );
};