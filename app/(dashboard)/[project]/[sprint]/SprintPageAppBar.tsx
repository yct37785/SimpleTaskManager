'use client';

import { useState } from 'react';
// components
import { Box, Toolbar, Divider, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import {
  Checklist as ChecklistIcon,
  Schema as SchemaIcon,
  CalendarMonth as CalendarIcon
} from '@mui/icons-material';

/**
 * sprint dashboard app bar
 */
function ToggleButtons() {
  const [alignment, setAlignment] = useState<string | null>('left');

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null,
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton value="left" aria-label="left aligned">
        <ChecklistIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered">
        <SchemaIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned">
        <CalendarIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

/**
 * sprint dashboard app bar
 */
export default function SprintPageAppBar({ project, sprint }: { project: string; sprint: string }) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant='h6' color='text.secondary'>{project} - {sprint}</Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <ToggleButtons />
        </Box>
      </Toolbar>
      <Divider />
    </Box>
  );
};