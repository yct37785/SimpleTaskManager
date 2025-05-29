'use client';

import { useEffect } from 'react';
// MUI
import { Stack, Box, Divider, CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
// our components
import { AuthProvider } from '@hooks/AuthContext';
import Sidebar from '@components/Sidebar/Sidebar';
import AppBar from '@components/AppBar/AppBar';
// import AuthDebug from '@components/Auth/AuthDebug';
// import SessionMonitor from '@components/Auth/SessionMonitor';
import { WorkspacesProvider } from '@hooks/WorkspacesContext';
// styles
import { appbar_height } from '@const';
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
          {/* auth */}
          {/* <AuthDebug />
          <SessionMonitor /> */}

          <WorkspacesProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

                {/* app bar */}
                <AppBar />

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
        </AuthProvider>
      </body>
    </html>
  );
};