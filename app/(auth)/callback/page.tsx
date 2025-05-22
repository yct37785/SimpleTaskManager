'use client';

import { useEffect, useState } from 'react';
// Next
import { useRouter } from 'next/navigation';
// auth
import { useAuth } from 'react-oidc-context';
// MUI
import {
  Box,
  Typography,
  Stack,
  CircularProgress,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
// custom components
import BaseDialog from '@UI/Dialog/Dialog';
// values
import { redirect_elapse } from '@const';

/********************************************************************************************************************
 * /callback: after Cognito Hosted UI login redirect
 * Shows a dialog with login progress/status
 ********************************************************************************************************************/
export default function CallbackPage() {
  const auth = useAuth();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(true);
  const [loginComplete, setLoginComplete] = useState(false);

  /******************************************************************************************************************
   * auth hook
   ******************************************************************************************************************/
  useEffect(() => {
    if (auth.isAuthenticated) {
      setLoginComplete(true);
      setTimeout(() => {
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
        router.replace(redirectTo);
      }, redirect_elapse);
    }
  }, [auth.isAuthenticated, router]);

  /******************************************************************************************************************
   * dialog content
   ******************************************************************************************************************/
  const renderDialogContent = () => {
    if (auth.error) {
      return (
        <Typography color='error' textAlign='center'>
          ❌ Login error: {auth.error.message}
        </Typography>
      );
    }

    return (
      <Stack spacing={3} alignItems='center' justifyContent='center' sx={{ minHeight: '30vh' }}>
        <Box
          display='flex'
          justifyContent='center'
          alignItems='center'
          minHeight={80}
          sx={{
            animation: loginComplete
              ? `pulse-scale ${redirect_elapse}ms ease-in-out forwards`
              : 'none',
          }}
        >
          {loginComplete ? (
            <CheckCircleOutlineIcon color='success' sx={{ fontSize: 48 }} />
          ) : (
            <CircularProgress size={40} />
          )}
        </Box>
        <Typography variant='body1' fontWeight={500} textAlign='center'>
          {loginComplete ? '✅ Login success, redirecting…' : '🔐 Logging you in…'}
        </Typography>
      </Stack>
    );
  };

  /******************************************************************************************************************
   * render
   ******************************************************************************************************************/
  return (
    <BaseDialog
      open={dialogOpen}
      onClose={() => {}}
      hideActions
    >
      {renderDialogContent()}
    </BaseDialog>
  );
}
