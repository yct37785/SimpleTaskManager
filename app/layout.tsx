'use client';

import { useState, useCallback } from 'react';
// components
import Link from 'next/link';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { List, ListItemButton, ListItemIcon, ListItemText, IconButton, Collapse, Typography, CssBaseline } from '@mui/material';
import { 
  Add as AddIcon, 
  Folder as FolderIcon, 
  FolderOpen as FolderOpenIcon, 
  InsertDriveFile as InsertDriveFileIcon, 
  ExpandLess, 
  ExpandMore 
} from '@mui/icons-material';
import { Project, createSprint, createProject } from '@schemas/schemas';
// styles
import styles from './layout.module.css';
import '@styles/globals.css';

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

    const newSprint = createSprint(name);
    setProjects((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        sprints: { ...prev[projectId].sprints, [newSprint.id]: newSprint },
        open: true, // always keep category open when adding a project
      },
    }));
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
                  <Typography variant='h6' color='var(--theme-color)' gutterBottom>TASK MANAGER</Typography>
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
                              <Link href={`/${proj.name}/${sprint.name}`} passHref legacyBehavior key={sprint.id}>
                                <ListItemButton className={styles.listItem}>
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