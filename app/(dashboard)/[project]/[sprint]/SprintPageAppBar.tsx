'use client';

import { useState } from 'react';
// components
import { Box, Toolbar, Divider, Typography, ToggleButton, Tabs, Tab } from '@mui/material';
import {
  Checklist as ChecklistIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

type Props = {
  project: string;
  sprint: string;
  mode: number;
  setMode: (mode: number) => void;
};

/**
 * sprint dashboard app bar
 */
export default function SprintPageAppBar({ project, sprint, mode, setMode }: Props) {

  const handleModeChange = (event: React.SyntheticEvent, newValue: number) => {
    setMode(newValue);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      {/* project title */}
      <Typography sx={{ position: 'absolute', ml: 3 }} variant='h6' color='text.secondary'>{project} - {sprint}</Typography>

      {/* tabs */}
      <Box sx={{ flex: 1 }}>
        <Tabs value={mode} onChange={handleModeChange} aria-label='sprint modes' centered>
          <Tab icon={<ChecklistIcon />} />
          <Tab icon={<CalendarIcon />} />
        </Tabs>
        <Divider />
      </Box>
    </Box>
  );
};