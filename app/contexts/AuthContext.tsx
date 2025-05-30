'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

/********************************************************************************************************************
 * provider
 ********************************************************************************************************************/
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /******************************************************************************************************************
   * Store and restore tokens from localStorage (or just memory)
   ******************************************************************************************************************/
  useEffect(() => {
    console.log('[AuthContext] Loading tokens from storage...');
    const storedAccess = localStorage.getItem('accessToken');
    const storedRefresh = localStorage.getItem('refreshToken');
    const storedEmail = localStorage.getItem('userEmail');

    if (storedAccess && storedRefresh && storedEmail) {
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      setUser({ email: storedEmail });
      console.log('[AuthContext] Access token, refresh token and user email loaded');
    } else {
    console.log('[AuthContext] No tokens to load');
    }

    setIsLoading(false);
  }, []);

  /******************************************************************************************************************
   * Login: get tokens and set user
   ******************************************************************************************************************/
  const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });

    const { accessToken, refreshToken } = res.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser({ email });

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userEmail', email);
  };

  /******************************************************************************************************************
   * Logout: clear session and tell backend to revoke refresh token
   ******************************************************************************************************************/
  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post(`${API_BASE}/auth/logout`, { refreshToken });
      }
    } catch (err) {
      console.warn('Logout failed:', err);
    }

    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.clear();
  };

  /******************************************************************************************************************
   * Refresh token: rotate and update tokens
   ******************************************************************************************************************/
  const refresh = async () => {
    if (!refreshToken) throw new Error('Missing refresh token');
    const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });

    const { accessToken: newAccess, refreshToken: newRefresh } = res.data;

    setAccessToken(newAccess);
    setRefreshToken(newRefresh);
    localStorage.setItem('accessToken', newAccess);
    localStorage.setItem('refreshToken', newRefresh);
  };

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
 * Hook to access auth context
 ********************************************************************************************************************/
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
