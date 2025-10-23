import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './context';
import type { User, AuthContextValue } from './types';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          setIsAuthenticated(true);
        }
      } catch (error: unknown) {
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData: User = {
        id: '1',
        name: 'User',
        email,
        role: 'user',
      };
      const token = 'mock-token';
      localStorage.setItem('auth_token', token);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: unknown) {
      console.error('Logout error:', error);
    }
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
