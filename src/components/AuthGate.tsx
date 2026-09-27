'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/app/login/page';
import { AppSidebar } from './AppSidebar';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // If directly visiting the /login page, always render it directly with full scroll
  if (pathname === '/login') {
    return (
      <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#060911]">
        {children}
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#060911] flex flex-col items-center justify-center space-y-3 font-sans">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
          P
        </div>
        <div className="text-xs uppercase tracking-widest text-amber-400/80 font-mono animate-pulse">
          Initializing PropFlow Secure Tenant...
        </div>
      </div>
    );
  }

  // If not authenticated, render the top-designer LoginPage directly with smooth scrolling
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-[#060911]">
        <LoginPage />
      </div>
    );
  }

  // Authenticated: Render dashboard layout with sidebar and responsive main container
  return (
    <div className="min-h-screen md:h-screen w-full bg-[#060911] text-slate-100 flex flex-col md:flex-row overflow-x-hidden md:overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto flex flex-col min-h-screen md:h-screen bg-[#080C14]">
        {children}
      </main>
    </div>
  );
}
