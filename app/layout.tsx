'use client';

import { useState, useCallback } from 'react';
// next
import Link from 'next/link';
// MUI
import { Stack, Box, Divider, CssBaseline, AppBar, Avatar, InputBase, Toolbar, Typography, alpha } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { LocalizationProvider } from '@mui/x-date-pickers';
// MUI providers
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// our components
import Sidebar from '@components/Sidebar/Sidebar';
import { WorkspacesProvider } from '@globals/WorkspacesContext';
// tyles
import { appbar_height } from '@styles/dimens';
import '@styles/globals.css';

/********************************************************************************************************************
 * app bar component
 ********************************************************************************************************************/
function renderAppBar() {
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

          {/* Search input */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 1,
              backgroundColor: (theme) => alpha(theme.palette.action.selected, 0.1),
              '&:hover': {
                backgroundColor: (theme) => alpha(theme.palette.action.selected, 0.2),
              },
              width: '100%',
              maxWidth: 300,
              mx: 2,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                color: 'text.secondary',
              }}
            >
              <SearchIcon fontSize='small' />
            </Box>
            <InputBase
              placeholder='Search…'
              sx={{ color: 'inherit', pl: 4, pr: 1, py: 0.5, width: '100%', fontSize: '0.875rem' }}
            />
          </Box>

          {/* user */}
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }} alt='User'>
            U
          </Avatar>
        </Toolbar>
        <Divider />
      </AppBar>
    </>
  );
}

/********************************************************************************************************************
 * root layout
 ********************************************************************************************************************/
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link rel='icon' href='/icon.ico' />
      </head>
      <body>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <WorkspacesProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* app bar */}
                {renderAppBar()}

                {/* main layout */}
                <Stack direction='row' sx={{ height: '100vh' }}>

                  {/* sidebar */}
                  <Box sx={{
                    position: 'sticky',
                    top: appbar_height,
                    height: `calc(100vh - ${appbar_height}px)`,
                    zIndex: (theme) => theme.zIndex.drawer,
                  }}>
                    <Sidebar />
                  </Box>

                  <Divider orientation='vertical' flexItem />

                  {/* page content */}
                  <Box sx={{ overflow: 'auto', flex: 1 }}>
                    {children}
                  </Box>

                </Stack>
              </Box>
            </AppRouterCacheProvider>
          </WorkspacesProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
};