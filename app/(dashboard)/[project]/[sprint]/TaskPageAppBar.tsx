'use client';

// components
import { Box, Toolbar, Divider, Typography } from '@mui/material';

export default function TaskPageAppBar({ project, sprint }: { project: string; sprint: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography variant='h6' color='text.secondary'>{project} - {sprint}</Typography>
      </Toolbar>
      <Divider />
    </Box>
  );
};