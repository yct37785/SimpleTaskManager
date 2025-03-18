'use client';

import { useState } from 'react';
// components
import { AppBar, Box, Toolbar, Divider, Typography, Button, IconButton } from '@mui/material';
// styles
import '@styles/globals.css';

export default function TaskPageAppBar({ project, sprint }: { project: string; sprint: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography variant='h6' color='var(--text-label)'>{project} - {sprint}</Typography>
      </Toolbar>
      <Divider />
    </Box>
  );
};