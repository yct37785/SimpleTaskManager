'use client';

import { AuthProvider, AuthProviderProps } from 'react-oidc-context';

const oidcConfig: AuthProviderProps = {
  authority: `https://cognito-idp.${process.env.COGNITO_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  client_id: process.env.COGNITO_CLIENT_ID!,
  redirect_uri: typeof window !== 'undefined'
    ? `${window.location.origin}/callback`
    : 'http://localhost:3000/callback',
  response_type: 'code',
  scope: 'openid email profile',
};

export function CognitoAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider {...oidcConfig}>{children}</AuthProvider>;
}
