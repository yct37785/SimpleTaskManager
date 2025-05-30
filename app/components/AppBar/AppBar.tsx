'use client';

import { useEffect, useState } from 'react';
// next
import Link from 'next/link';
// MUI
import { Box, Divider, AppBar, Avatar, Toolbar, Typography, Button } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
// comps
import AuthDialog from '@components/Auth/AuthDialog';
// contexts
import { useAuth } from '@contexts/AuthContext';
// const
import { appbar_height } from '@const';
// styles
import appBarStyles from './AppBar.module.css';

/********************************************************************************************************************
 * app bar component
 ********************************************************************************************************************/
export default function AppBarComponent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      <AppBar position='sticky' color='default'
        sx={{
          height: appbar_height,
          justifyContent: 'center',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>

          {/* title */}
          <Link href='/' style={{ textDecoration: 'none' }}>
            <Typography
              variant='h6'
              color='primary'
              gutterBottom
              sx={{ fontWeight: 600, textAlign: 'left', mt: 1, ml: 2, cursor: 'pointer' }}
            >
              TASK MANAGER
            </Typography>
          </Link>

          {/* input search bar button */}
          <Box
            onClick={() => { }}
            role='button'
            tabIndex={0}
            className={appBarStyles.searchButton}
          >
            <SearchIcon fontSize='small' sx={{ mr: 1, color: 'action.active' }} />
            Search…
          </Box>

          {/* user actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <>
                <Typography variant='body2' color='text.primary' sx={{ fontWeight: 500 }}>
                  {user?.email}
                </Typography>
                <Button
                  variant='outlined'
                  size='small'
                  color='primary'
                  onClick={logout}
                  sx={{ textTransform: 'none' }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <Button
                disabled={isLoading}
                variant='contained'
                size='small'
                color='primary'
                onClick={() => setDialogOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Sign in
              </Button>
            )}
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>

      {/* Auth modal */}
      <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
