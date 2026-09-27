'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  division: string;
  badgeId: string;
  avatar: string;
  avatarColor: string;
  permissions: string[];
}

export const DEMO_USERS: UserProfile[] = [
  {
    name: 'Rajiv Oberoi',
    email: 'rajiv.oberoi@skylineestates.in',
    role: 'Managing Director & Promoter',
    division: 'Gurugram & Delhi NCR HQ',
    badgeId: '#DIR-NCR-001',
    avatar: 'RO',
    avatarColor: 'from-amber-400 to-amber-600',
    permissions: ['Full Financials', 'RERA Master Slabs', 'Director Takeover', 'WhatsApp Live'],
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@skylineestates.in',
    role: 'VP of Luxury Sales & HNI Relations',
    division: 'Golf Course Road & DLF Phase 5',
    badgeId: '#VP-HNI-402',
    avatar: 'PS',
    avatarColor: 'from-sky-400 to-blue-600',
    permissions: ['VIP Inbound Chat', 'Chauffeur Tours', 'Buyer CRM', 'Site Booking'],
  },
  {
    name: 'Vikram Malhotra',
    email: 'vikram.m@skylineestates.in',
    role: 'Head of Site Operations & Gate Security',
    division: 'Experience Centres (Sec 54 & 65)',
    badgeId: '#OPS-SEC-109',
    avatar: 'VM',
    avatarColor: 'from-emerald-400 to-teal-600',
    permissions: ['Gate Pass Verification', 'Chauffeur Dispatch', 'Visitor Logs'],
  },
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, userOverride?: UserProfile) => void;
  logout: () => void;
}

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
    try {
      const stored = localStorage.getItem('propflow_active_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      // quiet
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string, userOverride?: UserProfile) => {
    const matched = userOverride || DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase()) || {
      name: email.split('@')[0],
      email,
      role: 'Property Executive',
      division: 'Skyline Luxury Estates',
      badgeId: '#EXEC-099',
      avatar: email.substring(0, 2).toUpperCase(),
      avatarColor: 'from-purple-400 to-indigo-600',
      permissions: ['General Access'],
    };

    setUser(matched);
    try {
      localStorage.setItem('propflow_active_user', JSON.stringify(matched));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('propflow_active_user');
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
