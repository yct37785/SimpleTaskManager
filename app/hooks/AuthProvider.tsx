'use client';

// auth
import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

/********************************************************************************************************************
 * Cognito config obj
 ********************************************************************************************************************/
const oidcConfig: AuthProviderProps = {
  authority: `https://${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}.auth.${process.env.NEXT_PUBLIC_COGNITO_REGION}.amazoncognito.com/`,
  client_id: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!,
  redirect_uri: typeof window !== 'undefined'
    ? `${window.location.origin}/callback`
    : 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'openid email profile',
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

/********************************************************************************************************************
 * Cognito auth provider
 ********************************************************************************************************************/
export function CognitoAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
