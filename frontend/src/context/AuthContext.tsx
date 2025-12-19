// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginAccount, logoutAccount, checkAuthStatus } from '../services/api.services';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await checkAuthStatus();
        setIsAuthenticated(response.isAuthenticated);
        console.log('Is Authenticated:', response.isAuthenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
        console.log('Is Authenticated:', isLoading);
      }
    };
    checkStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await loginAccount({ email, password });
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAccount();
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
