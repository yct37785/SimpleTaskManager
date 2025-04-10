'use client';

import { useState, useCallback } from 'react';
// MUI
import { Stack, Box, Divider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
// MUI providers
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// our components
import Sidebar from '@components/Sidebar/Sidebar';
import { WorkspacesProvider } from '@contexts/WorkspacesContext';
// global styles
import '@styles/globals.css';

/**
 * root layout
 */
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
              <Stack direction='row' sx={{ height: '100vh' }}>

                {/* sidebar */}
                <Sidebar />

                <Divider orientation='vertical' flexItem />

                {/* main content */}
                <Box sx={{ overflow: 'auto', flex: 1 }}>
                  {children}
                </Box>

              </Stack>
            </AppRouterCacheProvider>
          </WorkspacesProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
};