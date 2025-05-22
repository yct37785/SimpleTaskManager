'use client';

import { useEffect } from 'react';
// auth
import { useAuth } from 'react-oidc-context';

/********************************************************************************************************************
 * Session monitoring: check for refresh token expiry or silent login failure
 ********************************************************************************************************************/
export default function SessionMonitor() {
  const auth = useAuth();

  useEffect(() => {
    // try silent login only if user is not already restored from storage,
    // and no previous attempt (success or error) has been made yet
    if (!auth.isAuthenticated && !auth.isLoading && !auth.user && !auth.error) {
      console.log('⚙️ Attempting silent sign-in (no user loaded)');
      auth.signinSilent().catch(err => {
        console.warn('🧯 Silent sign-in failed, likely refresh token expired:', err);
        auth.removeUser();
      });
    }

    // if we detect an authentication error (e.g. invalid/expired token),
    // force logout to reset session
    if (auth.error?.message?.includes('expired') || auth.error?.message?.includes('token')) {
      console.warn('🧯 Token expired or invalid — logging out...');
      auth.removeUser();
    }
  }, [auth.isAuthenticated, auth.error]);

  return null;
}
