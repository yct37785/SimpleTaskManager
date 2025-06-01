'use client';

import { useState } from 'react';
// next
import Link from 'next/link';
// MUI
import {
  Box, Divider, AppBar, Avatar, Toolbar, Typography,
  IconButton, Menu, MenuItem, ListItemIcon
} from '@mui/material';
import { Search as SearchIcon, Person as PersonIcon, Logout as LogoutIcon,
  Login as LoginIcon, Settings as SettingsIcon
} from '@mui/icons-material';
// comps
import AuthDialog from '@components/Auth/AuthDialog';
// contexts
import { useAuth } from '@contexts/AuthContext';
// const
import { appbar_height } from '@const';
// styles
import appBarStyles from './AppBar.module.css';

/********************************************************************************************************************
 * AppBar with avatar menu for auth actions
 ********************************************************************************************************************/
export default function AppBarComponent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // open avatar dropdown
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // close dropdown
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // sign out action
  const handleLogout = async () => {
    handleMenuClose();
    await logout();
  };

  // sign in action
  const handleOpenDialog = () => {
    handleMenuClose();
    setDialogOpen(true);
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <>
      <AppBar
        position='sticky'
        color='default'
        sx={{
          height: appbar_height,
          justifyContent: 'center',
          bgcolor: 'background.paper',
          boxShadow: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar variant='dense' sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>

          {/* left: logo/title */}
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

          {/* center: search button */}
          <Box
            onClick={() => { }}
            role='button'
            tabIndex={0}
            className={appBarStyles.searchButton}
          >
            <SearchIcon fontSize='small' sx={{ mr: 1, color: 'action.active' }} />
            Search…
          </Box>

          {/* right: avatar + dropdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleMenuOpen} disabled={isLoading}>
              <Avatar sx={{ width: 32, height: 32 }}>
                {isAuthenticated && user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : <PersonIcon fontSize='small' />
                }
              </Avatar>
            </IconButton>

            {/* menu when avatar is clicked */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              {/* show email as disabled label if signed in */}
              {isAuthenticated && (
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </MenuItem>
              )}

              {isAuthenticated && <Divider />}

              {/* dummy settings option */}
              <MenuItem onClick={() => { handleMenuClose(); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>

              {/* auth action */}
              {isAuthenticated ? (
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Sign out
                </MenuItem>
              ) : (
                <MenuItem onClick={handleOpenDialog}>
                  <ListItemIcon>
                    <LoginIcon fontSize="small" />
                  </ListItemIcon>
                  Sign in
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
        <Divider />
      </AppBar>

      {/* auth dialog modal */}
      <AuthDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
