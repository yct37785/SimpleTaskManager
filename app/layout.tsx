'use client';

import { useState } from 'react';
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
import { CssBaseline } from '@mui/material';
import { Category, Project, createCategory, createProject } from './types/schemas';
import styles from './styles/RootLayout.module.css';
import './styles/globals.css';

/**
 * root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Record<string, Category>>({});

  const addCategory = () => {
    const name = prompt('Enter category name:');
    if (name) {
      const newCategory = createCategory(name);
      setCategories((prev) => ({ ...prev, [newCategory.id]: newCategory }));
    }
  };

  const addProject = (categoryId: string) => {
    const name = prompt(`Enter project name for category '${categories[categoryId].name}':`);
    if (name) {
      const newProject = createProject(name);
      setCategories((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          projects: { ...prev[categoryId].projects, [newProject.id]: newProject },
        },
      }));
    }
  };

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], open: !prev[categoryId].open },
    }));
  };

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
              <h2 className={styles.categoryHeader}>Tasks</h2>

              <List subheader={<ListSubheader>Categories</ListSubheader>}>
                {/* add category */}
                <ListItemButton onClick={addCategory}>
                  <ListItemIcon><AddIcon color='primary' /></ListItemIcon>
                  <ListItemText primary='Add Category' />
                </ListItemButton>

                {/* render categories */}
                {Object.values(categories).map((category) => (
                  <div key={category.id}>
                    <ListItemButton onClick={() => toggleCategory(category.id)}>
                      <ListItemIcon>{category.open ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
                      <ListItemText primary={category.name} />
                      <IconButton onClick={() => addProject(category.id)} size='small'>
                        <AddIcon fontSize='small' />
                      </IconButton>
                      {category.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* render projects */}
                    <Collapse in={category.open} timeout='auto' unmountOnExit>
                      <List component='div' disablePadding className={styles.list}>
                        {Object.keys(category.projects).length === 0 ? (
                          <ListItemText className={styles.noProjects}>
                            No projects yet
                          </ListItemText>
                        ) : (
                          Object.values(category.projects).map((project) => (
                            <ListItemButton key={project.id} className={styles.listItem}>
                              <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                              <Link href={`/${category.name}/${project.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <ListItemText primary={project.name} />
                              </Link>
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Collapse>
                  </div>
                ))}
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