'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { LoginScreen } from './LoginScreen';
import { AppSidebar } from './AppSidebar';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#080C14] flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/20">
          P
        </div>
        <div className="text-xs uppercase tracking-widest text-amber-400/80 font-mono animate-pulse">
          Initializing PropFlow Secure Tenant...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="h-full bg-[#080C14] text-slate-100 flex overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto flex flex-col h-screen bg-[#080C14]">
        {children}
      </main>
    </div>
  );
}
