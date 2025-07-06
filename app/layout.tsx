'use client';

import { useEffect } from 'react';
// MUI
import { Box, CssBaseline, Typography } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// contexts
import { AuthProvider } from '@contexts/AuthContext';
import { WorkspacesProvider } from '@contexts/WorkspacesContext';
// styles
import './globals.css';

/********************************************************************************************************************
 * root layout
 ********************************************************************************************************************/
export default function RootLayout({ children }: { children: React.ReactNode }) {

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
        <link rel='icon' href='/icon.ico' />
      </head>
      <body>
        <CssBaseline />
        <AuthProvider>
          <WorkspacesProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {children}
              </Box>
            </AppRouterCacheProvider>
          </WorkspacesProvider>
        </AuthProvider>
      </body>
    </html>
  );
};