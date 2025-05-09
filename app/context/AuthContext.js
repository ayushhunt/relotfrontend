'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

const AuthContext = createContext({});

// Protected route prefixes (similar to middleware)
const PROTECTED_PREFIXES = [
  '/userprofile',
  '/dashboard',
  '/settings',
  '/my-account',
  '/orders',
  '/checkout',
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isProtectedRoute = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));

  useEffect(() => {
    const checkAuth = async () => {
      // If route is NOT protected, skip auth check
      if (!isProtectedRoute) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('v1/user/');
        setUser(response.data);
        // No need to redirect, user is authenticated
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
  
        if (isProtectedRoute) {
          router.push('/login'); // only redirect on protected routes
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { id, name, email } = response.data;
      setUser({ id, name, email });
      console.log('Login successful:', response.data);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      router.push('/login');
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const response = await api.get('v1/user/');
      setUser(response.data);
      return true; // User is logged in
    } catch (error) {
      console.warn('Silent auth check failed (no redirect):', error);
      setUser(null);
      return false; // User not logged in
    }
  };
  

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout,checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
