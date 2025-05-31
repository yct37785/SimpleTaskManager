'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/********************************************************************************************************************
 * types
 ********************************************************************************************************************/
interface AuthContextType {
  user: { email: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/********************************************************************************************************************
 * provider
 ********************************************************************************************************************/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [accessTokenExpiresAt, setAccessTokenExpiresAt] = useState<number | null>(null);
  const [refreshTokenExpiresAt, setRefreshTokenExpiresAt] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /******************************************************************************************************************
   * store and restore tokens from localStorage (or just memory)
   ******************************************************************************************************************/
  useEffect(() => {
    console.log('[AuthContext] Loading tokens from storage...');
    const storedAccess = localStorage.getItem('accessToken');
    const storedRefresh = localStorage.getItem('refreshToken');
    const storedEmail = localStorage.getItem('userEmail');
    const storedAtExpiresAt = localStorage.getItem('atExpiresAt');
    const storedRtExpiresAt = localStorage.getItem('rtExpiresAt');

    if (storedAccess && storedRefresh && storedEmail) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUser({ email: storedEmail });

      if (storedAtExpiresAt) {
        setAccessTokenExpiresAt(new Date(storedAtExpiresAt).getTime());
      }
      if (storedRtExpiresAt) {
        setRefreshTokenExpiresAt(new Date(storedRtExpiresAt).getTime());
        // Check for expired refresh token on load
        if (Date.now() > new Date(storedRtExpiresAt).getTime()) {
          console.log('[AuthContext] Refresh token expired on load — logging out');
          logout();
        }
      }

      console.log('[AuthContext] Tokens and metadata loaded');
    } else {
      console.log('[AuthContext] No tokens to load');
    }

    setIsLoading(false);
  }, []);

  /******************************************************************************************************************
   * login: get tokens and set user
   ******************************************************************************************************************/
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, { email, password });

      const { accessToken, refreshToken, atExpiresAt, rtExpiresAt } = res.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser({ email });
      setAccessTokenExpiresAt(new Date(atExpiresAt).getTime());
      setRefreshTokenExpiresAt(new Date(rtExpiresAt).getTime());

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('atExpiresAt', atExpiresAt);
      localStorage.setItem('rtExpiresAt', rtExpiresAt);
    } finally {
      setIsLoading(false);
    }
  };

  /******************************************************************************************************************
   * logout: clear session and tell backend to revoke refresh token
   ******************************************************************************************************************/
  const logout = async () => {
    setIsLoading(true);
    try {
      if (refreshToken) {
        await axios.post(`${API_BASE}/auth/logout`, { refreshToken });
      }
    } catch (err) {
      console.log('[AuthContext] Logout failed:', err);
    } finally {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      setAccessTokenExpiresAt(null);
      setRefreshTokenExpiresAt(null);
      localStorage.clear();
      setIsLoading(false);
    }
  };

  /******************************************************************************************************************
   * refresh token: rotate and update tokens
   ******************************************************************************************************************/
  const refresh = async () => {
    if (!refreshToken) throw new Error('Missing refresh token');
    const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });

    const { accessToken: newAccess, refreshToken: newRefresh, atExpiresAt, rtExpiresAt } = res.data;

    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    setAccessTokenExpiresAt(new Date(atExpiresAt).getTime());
    setRefreshTokenExpiresAt(new Date(rtExpiresAt).getTime());

    localStorage.setItem('accessToken', newAccess);
    localStorage.setItem('refreshToken', newRefresh);
    localStorage.setItem('atExpiresAt', atExpiresAt);
    localStorage.setItem('rtExpiresAt', rtExpiresAt);

    console.log('[AuthContext] Tokens refreshed silently');
  };

  /******************************************************************************************************************
   * background refresh: refresh access token ~1 minute before expiry
   ******************************************************************************************************************/
  useEffect(() => {
    if (!refreshToken || !accessTokenExpiresAt) return;

    const bufferMs = 60 * 1000; // refresh 1 minute before expiration
    const delay = accessTokenExpiresAt - Date.now() - bufferMs;

    if (delay <= 0) {
      // if already expired or about to, refresh immediately
      refresh().catch(err => console.log('[AuthContext] Silent refresh failed:', err));
      return;
    }

    const timeout = setTimeout(() => {
      refresh().catch(err => console.log('[AuthContext] Silent refresh failed:', err));
    }, delay);

    return () => clearTimeout(timeout);
  }, [accessTokenExpiresAt, refreshToken]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/********************************************************************************************************************
 * hook to access auth context
 ********************************************************************************************************************/
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
