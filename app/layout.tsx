'use client';

import { useState, useCallback } from 'react';
// components
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Stack, Box, Divider, CssBaseline } from '@mui/material';
import Sidebar from '@components/Sidebar/Sidebar';
// contexts
import { ProjectProvider } from '@contexts/ProjectContext';

/**
 * root layout
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </head>
      <body>
        <CssBaseline />
        <ProjectProvider>
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
        </ProjectProvider>
      </body>
    </html>
  );
};