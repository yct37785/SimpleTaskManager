'use client';

import { useEffect } from 'react';
// next
import Image from 'next/image';
// MUI
import { Box, Typography } from '@mui/material';

/********************************************************************************************************************
 * home dashboard
 ********************************************************************************************************************/
export default function Home() {
  // document title
  useEffect(() => {
    document.title = 'Task Manager';
  }, []);

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant='h4' fontWeight='bold' color='primary' gutterBottom>
        This is the landing page
      </Typography>
    </main>
  );
};