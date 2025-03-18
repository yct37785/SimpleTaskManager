'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  ListSubheader,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { CssBaseline } from '@mui/material';
import { Project, createSprint, createProject } from './types/schemas';
import styles from './RootLayout.module.css';
import './styles/globals.css';

/**
 * root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Record<string, Project>>({});

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
          <div className={styles.layout}>

            {/* sidebar */}
            <aside className={styles.sidebar}>
              {/* fixed header */}
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarHeaderTop}>
                  <Typography variant='h5' gutterBottom>Projects</Typography>
                </div>
                <ListItemButton onClick={addProject}>
                  <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
                  <ListItemText primary='Add Project' />
                </ListItemButton>
              </div>

              {/* projects list */}
              <List className={styles.projectList}>
                <div className={styles.projectListInner}>
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
                        <List component='div' disablePadding className={styles.list}>
                          {Object.keys(proj.sprints).length === 0 ? (
                            <ListItemText className={styles.noSprints}>
                              No sprints yet
                            </ListItemText>
                          ) : (
                            Object.values(proj.sprints).map((sprint) => (
                              <ListItemButton key={sprint.id} className={styles.listItem}>
                                <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                                <Link href={`/${proj.name}/${sprint.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                  <ListItemText primary={sprint.name} />
                                </Link>
                              </ListItemButton>
                            ))
                          )}
                        </List>
                      </Collapse>
                    </div>
                  ))}
                </div>
              </List>
            </aside>

            {/* main content */}
            <main className={styles.main}>
              {children}
            </main>

          </div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};