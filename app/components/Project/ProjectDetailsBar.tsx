'use client';

import { useState } from 'react';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack, Skeleton, } from '@mui/material';
import { CalendarMonth as CalendarMonthIcon, Edit as EditIcon } from '@mui/icons-material';
// utils
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { getRelativeTime } from '@utils/datetime';
// comps
import ProjectForm from './ProjectForm';
// contexts
import { useWorkspacesManager } from '@hooks/WorkspacesContext';
// schemas
import { Project } from '@schemas';
// const
import { project_details_bar_height, mock_elapse } from '@const';
// styles
import styles from './ProjectDetailsBar.module.css';

const fallbackDesc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  workspaceId: string;
  workspaceTitle: string;
  project: Project;
  loading: boolean;
}

/********************************************************************************************************************
 * project details bar
 ********************************************************************************************************************/
export default function ProjectDetailsBar({
  workspaceId,
  workspaceTitle,
  project,
  loading,
}: Props) {
  // contexts
  const { updateProjectFields } = useWorkspacesManager();
  // UI
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  // others
  const now = today(getLocalTimeZone());
  const formattedDue = `${project.dueDate.day}/${project.dueDate.month}/${project.dueDate.year}`;
  const relativeDue = getRelativeTime(now, project.dueDate);
  const description = project.desc || fallbackDesc;

  /******************************************************************************************************************
   * edit project
   ******************************************************************************************************************/
  const handleEditProject = async (title: string, desc: string, dueDate: CalendarDate) => {
    if (workspaceId) {
      await new Promise(res => setTimeout(res, mock_elapse));
      updateProjectFields(workspaceId, project.id, { title, desc, dueDate });
    }
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      {/* edit project form */}
      <ProjectForm
        workspaceTitle={workspaceTitle}
        project={project}
        projectDialogOpen={editDialogOpen}
        onSubmitProject={handleEditProject}
        closeProjectDialog={() => setEditDialogOpen(false)} />

      {/* main component */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', p: 2, minHeight: project_details_bar_height }}>
        <Box sx={{ flex: 1 }}>
          {!loading ? (
            <Box sx={{ height: 32 }}>
              <Typography variant='h5' fontWeight={600}>
                {`${workspaceTitle} - ${project.title}`}
              </Typography>
            </Box>
          ) : (
            <Skeleton width='50%' height={32} />
          )}

          <Stack sx={{ height: 22 }} direction='row' alignItems='center' spacing={0.5} mt={1}>
            <CalendarMonthIcon fontSize='small' color='action' />
            {!loading ? (
              <Typography variant='subtitle2' color='text.secondary'>
                {`Complete by: ${formattedDue} (${relativeDue})`}
              </Typography>
            ) : (
              <Skeleton width='30%' height={22} />
            )}
          </Stack>

          {!loading ? (
            <Box sx={{ mt: 2, mr: 6 }}>
              <Typography
                variant='body2'
                color='text.secondary'
                className={`${styles.projectDesc} ${!showFullDesc ? styles.projectDescCollapsed : ''}`}
              >
                {description}
              </Typography>

              {description.length > 200 && (
                <Typography
                  variant='caption'
                  color='primary'
                  sx={{ cursor: 'pointer', mt: 0.5, display: 'inline-block' }}
                  onClick={() => setShowFullDesc(prev => !prev)}
                >
                  {showFullDesc ? 'Show less' : 'Show more'}
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ mt: 1 }}>
              <Skeleton width='100%' height={32} />
            </Box>
          )}
        </Box>

        <Tooltip title='Edit Project'>
          <IconButton onClick={() => setEditDialogOpen(true)} sx={{ mt: 0.5 }}>
            <EditIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
}
