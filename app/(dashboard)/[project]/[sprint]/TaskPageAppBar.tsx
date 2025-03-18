'use client';

import { useState } from 'react';
// components
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// styles
import '../../../styles/globals.css';

export default function TaskPageAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <IconButton
          size='large'
          edge='start'
          color='inherit'
          aria-label='menu'
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
          News
        </Typography>
        <Button color='inherit'>Login</Button>
      </Toolbar>
      <Divider />
    </Box>
  );
};