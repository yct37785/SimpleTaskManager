'use client';

import { useState } from 'react';
import axios from 'axios';
// MUI
import { Tabs, Tab, Box, Stack, TextField, Alert, Button, Typography } from '@mui/material';
// comps
import BaseDialog, { DialogTextInput } from '@UI/Dialog/Dialog';
// contexts
import { useAuth } from '@contexts/AuthContext';

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
interface Props {
  open: boolean;
  onClose: () => void;
}

/********************************************************************************************************************
 * auth dialog
 ********************************************************************************************************************/
export default function AuthDialog({ open, onClose }: Props) {
  const { login, isLoading } = useAuth();
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  /******************************************************************************************************************
   * form submission
   ******************************************************************************************************************/
  const handleSubmit = async () => {
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      if (tab === 'signup') {
        await axios.post(`${process.env.NEXT_PUBLIC_API_BASE}/auth/register`, {
          email,
          password,
        });
      }

      await login(email, password);
      onClose();
      resetForm();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;
        const message = data?.error || data?.message || 'An unknown error occurred.';
        setErrorMsg(message);
      } else {
        setErrorMsg(err.message || 'Authentication failed');
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setTab('login');
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <BaseDialog
      open={open}
      onClose={() => { onClose(); resetForm(); }}
      onSubmit={handleSubmit}
      title='Welcome to Task Manager'
      submitLabel={tab === 'login' ? 'Sign In' : 'Sign Up'}
      disabled={isLoading}
      loading={isLoading}
    >
      <Tabs value={tab} onChange={(_, val) => setTab(val)} variant='fullWidth'>
        <Tab label='Sign In' value='login' />
        <Tab label='Sign Up' value='signup' />
      </Tabs>

      {errorMsg ? <Alert severity='error'>{errorMsg}</Alert> : <Box sx={{ mt: 2 }} />}

      <DialogTextInput
        label='Email'
        type='email'
        required
        disabled={isLoading}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />

      <DialogTextInput
        label='Password'
        type='password'
        required
        disabled={isLoading}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Box textAlign='right'>
        <Button
          size='small'
          sx={{ textTransform: 'none' }}
          onClick={() => alert('Forgot password functionality coming soon')}
        >
          Forgot password?
        </Button>
      </Box>
    </BaseDialog>
  );
}
