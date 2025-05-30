'use client';

import { useState, useEffect } from 'react';
// next
import { useParams, useRouter } from 'next/navigation';
// MUI
import { Box, Typography, Tooltip, IconButton, Stack } from '@mui/material';
import { Edit as EditIcon, CalendarMonth as CalendarMonthIcon } from '@mui/icons-material';
// utils
import { getLocalTimeZone, today, CalendarDate } from '@internationalized/date';
import { getRelativeTime } from '@utils/datetime';
// contexts
import { useWorkspacesManager } from '@hooks/WorkspacesContext';
// schemas
import { Project, Sprint, Task } from '@schemas';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
type Props = {
  workspaceId: string;
  project: Project;
  sprintId?: string;
};

/********************************************************************************************************************
 * Sprint dashboard
 ********************************************************************************************************************/
export default function SprintDashboard({
  workspaceId,
  project,
  sprintId }: Props) {
  if (!workspaceId || !project || !sprintId) return <div>invalid sprint</div>;


  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <Box>
      
    </Box>
  );
}
