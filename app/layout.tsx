"use client";

import { useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  ListSubheader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { CssBaseline } from "@mui/material";
import { Category, Project, createCategory, createProject } from "./types/schemas";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Record<string, Category>>({});

  // Add a new category
  const addCategory = () => {
    const name = prompt("Enter category name:");
    if (name) {
      const newCategory = createCategory(name);
      setCategories((prev) => ({ ...prev, [newCategory.id]: newCategory }));
    }
  };

  // Add a new project under a category
  const addProject = (categoryId: string) => {
    const name = prompt(`Enter project name for category "${categories[categoryId].name}":`);
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

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setCategories((prev) => ({
      ...prev,
      [categoryId]: { ...prev[categoryId], open: !prev[categoryId].open },
    }));
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <CssBaseline />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <aside style={{ width: "300px", backgroundColor: "#f8f9fa", overflowY: "auto", padding: "16px" }}>
              <h2 style={{ marginBottom: "10px" }}>Tasks</h2>

              <List subheader={<ListSubheader>Categories</ListSubheader>}>
                {/* Add Category Button */}
                <ListItemButton onClick={addCategory}>
                  <ListItemIcon><AddIcon color="primary" /></ListItemIcon>
                  <ListItemText primary="Add Category" />
                </ListItemButton>

                {/* Render Categories */}
                {Object.values(categories).map((category) => (
                  <div key={category.id}>
                    <ListItemButton onClick={() => toggleCategory(category.id)}>
                      <ListItemIcon>{category.open ? <FolderOpenIcon /> : <FolderIcon />}</ListItemIcon>
                      <ListItemText primary={category.name} />
                      <IconButton onClick={() => addProject(category.id)} size="small">
                        <AddIcon fontSize="small" />
                      </IconButton>
                      {category.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>

                    {/* Render Projects Inside Category */}
                    <Collapse in={category.open} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding style={{ paddingLeft: "16px", backgroundColor: "#ffffff" }}>
                        {Object.keys(category.projects).length === 0 ? (
                          <ListItemText style={{ paddingLeft: "20px", fontStyle: "italic", color: "#888" }}>
                            No projects yet
                          </ListItemText>
                        ) : (
                          Object.values(category.projects).map((project) => (
                            <ListItemButton key={project.id} style={{ paddingLeft: "32px" }}>
                              <ListItemIcon><InsertDriveFileIcon /></ListItemIcon>
                              <ListItemText primary={project.name} />
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Collapse>
                  </div>
                ))}
              </List>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
              {children}
            </main>
          </div>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
