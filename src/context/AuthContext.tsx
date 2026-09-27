'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  terminalId: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: string) => void;
  logout: () => void;
}

const DEMO_DIRECTOR: UserProfile = {
  name: 'Rajiv Oberoi',
  email: 'director@skylineestates.in',
  role: 'Director of Sales & Acquisitions',
  avatar: 'RO',
  terminalId: 'SKY-HQ-TERM-01',
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    try {
      const stored = localStorage.getItem('propflow_auth_user');
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // By default on first load, check if session was remembered or keep null to show login
        // To give immediate demo polish, let's see if session exists
        const defaultSession = localStorage.getItem('propflow_visited');
        if (defaultSession) {
          setUser(DEMO_DIRECTOR);
        }
      }
    } catch (e) {
      // quiet
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, role: string = 'Director of Sales & Acquisitions') => {
    const newUser: UserProfile = {
      name: email.includes('priya') ? 'Priya Sharma' : 'Rajiv Oberoi',
      email,
      role: email.includes('priya') ? 'Senior Luxury Advisor' : role,
      avatar: email.includes('priya') ? 'PS' : 'RO',
      terminalId: 'SKY-HQ-TERM-01',
    };
    setUser(newUser);
    try {
      localStorage.setItem('propflow_auth_user', JSON.stringify(newUser));
      localStorage.setItem('propflow_visited', 'true');
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('propflow_auth_user');
      localStorage.removeItem('propflow_visited');
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
