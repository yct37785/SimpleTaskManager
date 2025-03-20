'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { Sprint, Project } from '@schemas/schemas';

/**
 * root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Record<string, Project>>({});

  
  const createSprint = (name: string): Sprint => {
    return { id: uuidv4(), name };
  };

  const createProject = (name: string): Project => {
    const id = uuidv4();
    return { id, name, sprints: {}, open: false };
  };

  const addProject = useCallback(() => {
    const name = prompt('Enter project name:');
    if (!name) return;

    const newProject = createProject(name);
    setProjects((prev) => ({ ...prev, [newProject.id]: newProject }));
  }, []);

  const addSprint = useCallback((projectId: string) => {
    const name = prompt(`Enter sprint name for project '${projects[projectId].name}':`);
    if (!name) return;

    for (let i = 0; i < 20; ++i) {
      const newSprint = createSprint(name);
      setProjects((prev) => ({
        ...prev,
        [projectId]: {
          ...prev[projectId],
          sprints: { ...prev[projectId].sprints, [newSprint.id]: newSprint },
          open: true, // always keep category open when adding a project
        },
      }));
    }
  }, [projects]);

  const toggleProject = useCallback((projectId: string) => {
    setProjects((prev) => ({
      ...prev,
      [projectId]: { ...prev[projectId], open: !prev[projectId].open },
    }));
  }, []);

  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </head>
      <body>
        <CssBaseline />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <Stack direction='row' sx={{ height: '100vh' }}>

            {/* sidebar */}
            <Box sx={{ width: 300, bgcolor: '#f6f6f6', display: 'flex', flexDirection: 'column' }}>

              {/* sidebar header */}
              <Box sx={{ height: 100, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', px: 2, pt: 2 }}>
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
                <Box sx={{ width: 284 }}>
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

                      {/* render sprints */}
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
            <Divider orientation='vertical' flexItem />

            {/* main content */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              {children}
            </Box>

          </Stack>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};