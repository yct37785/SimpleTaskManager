'use client';

// import { useEffect } from 'react';
// // Next
// import { usePathname } from 'next/navigation';
// // auth
// import { useAuth } from 'react-oidc-context';

// /********************************************************************************************************************
//  * AuthDebug: logs ID token expiry information
//  ********************************************************************************************************************/
// export default function AuthDebug() {
//   const auth = useAuth();
//   const pathname = usePathname();

//   useEffect(() => {
//     if (auth.user?.id_token) {
//       const payload = JSON.parse(atob(auth.user.id_token.split('.')[1]));
//       const now = Math.floor(Date.now() / 1000);
//       const timeLeft = payload.exp - now;

//       console.log(
//         `[AuthDebug] ID token for ${auth.user?.profile?.email || 'user'} expires in ${timeLeft}s at ${new Date(
//           payload.exp * 1000
//         ).toLocaleTimeString()}`
//       );
//     }
//   }, [auth.user, pathname]);

//   return null;
// }
