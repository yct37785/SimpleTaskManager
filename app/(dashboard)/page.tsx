"use client";

import { useState } from 'react';
import { Typography } from '@mui/material';
import '../styles/globals.css';

export default function Home() {
  return (
    <main style={{ padding: 'var(--padding2)' }}>
      <Typography variant='h5' gutterBottom>main page</Typography>
    </main>
  );
};