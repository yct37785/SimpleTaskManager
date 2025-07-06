'use client';

import { useEffect } from 'react';
// MUI
import { Stack, Box, Divider } from '@mui/material';
// comps
import Sidebar from '@components/Sidebar/Sidebar';
import AppBar from '@components/AppBar/AppBar';
// const
import { appbar_height } from '@const';
// styles
import '../globals.css';

/********************************************************************************************************************
 * root layout
 ********************************************************************************************************************/
export default function RootLayout({ children }: { children: React.ReactNode }) {

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
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
  );
};