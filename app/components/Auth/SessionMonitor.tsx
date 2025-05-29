'use client';

// import { useEffect } from 'react';
// // auth
// import { useAuth } from 'react-oidc-context';

// /********************************************************************************************************************
//  * Session monitoring: check for refresh token expiry or silent login failure
//  ********************************************************************************************************************/
// export default function SessionMonitor() {
//   const auth = useAuth();

//   /********************************************************************************************************************
//    * if we detect an authentication error (e.g. invalid/expired token),
//    * force logout to reset session
//    ********************************************************************************************************************/
//   useEffect(() => {
//     if (auth.error?.message?.includes('invalid_grant') || auth.error?.message?.includes('expired') || auth.error?.message?.includes('token')) {
//       console.log('🧯 Token error or refresh expired — logging out');
//       auth.removeUser();
//     }
//   }, [auth.error]);

//   return null;
// }