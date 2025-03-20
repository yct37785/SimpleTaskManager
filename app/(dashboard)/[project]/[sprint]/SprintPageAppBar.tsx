'use client';

// components
import { Box, Toolbar, Divider, Typography } from '@mui/material';

/**
 * sprint dashboard app bar
 */
export default function SprintPageAppBar({ project, sprint }: { project: string; sprint: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography variant='h6' color='text.secondary'>{project} - {sprint}</Typography>
      </Toolbar>
      <Divider />
    </Box>
  );
};