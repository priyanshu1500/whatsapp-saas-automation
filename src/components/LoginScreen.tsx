'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2,
  Key,
  Globe2,
  Cpu,
} from 'lucide-react';

export function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('director@skylineestates.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email);
      setIsLoading(false);
    }, 400);
  };

  const handleQuickDemo = (demoEmail: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword('••••••••••••');
    setIsLoading(true);
    setTimeout(() => {
      login(demoEmail, roleName);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen w-full bg-[#070A11] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Background Architectural Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(rgba(212, 175, 55, 0.25) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '32px 32px, 16px 16px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      />

      {/* Top Branding Navigation */}
      <header className="relative z-10 px-6 sm:px-10 py-6 flex items-center justify-between border-b border-[#1E293B]/70 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20">
            P
          </div>
          <div>
            <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
              PropFlow OS
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                v2.4 Enterprise
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">Skyline Luxury Estates • Gurugram HQ Tenant</div>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Meta Cloud API 2026 Online</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="tabular-nums font-mono text-[11px]">LATENCY: 14ms</span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md bg-[#0D1322]/90 border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          {/* Champagne Top Accent Line */}
          <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/60 to-transparent"></div>

          {/* Form Header */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/25 text-[10px] font-semibold text-amber-300 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Restricted Director Terminal</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
              Log in to your workspace
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed text-wrap pretty">
              Access the live autonomous WhatsApp concierge, RERA inventory slabs, and VIP site visit pipeline.
            </p>
          </div>

          {/* 1-Click Quick Demo Sign-Ins */}
          <div className="mb-5 p-3 rounded-xl bg-[#090E1A] border border-[#1E293B] space-y-2">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center justify-between">
              <span>Instant Demo Access</span>
              <span className="text-amber-400 font-mono text-[9px]">1-CLICK AUTO-FILL</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('director@skylineestates.in', 'Director of Sales & Acquisitions')}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#111728] hover:bg-[#162035] border border-amber-500/30 text-left transition-colors group"
              >
                <div className="w-7 h-7 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  RO
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 truncate">
                    Rajiv Oberoi
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Director (DLF Ph 5)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('priya@skylineestates.in', 'Senior Luxury Advisor')}
                className="flex items-center space-x-2 p-2 rounded-lg bg-[#111728] hover:bg-[#162035] border border-slate-700 text-left transition-colors group"
              >
                <div className="w-7 h-7 rounded bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-xs shrink-0">
                  PS
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    Priya Sharma
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">Senior Advisor</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide">
                Corporate Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@skylineestates.in"
                  className="w-full bg-[#080C16] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300 tracking-wide">
                  Master Security Password
                </label>
                <a
                  href="#demo"
                  onClick={(e) => {
                    e.preventDefault();
                    setPassword('••••••••••••');
                  }}
                  className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#080C16] border border-[#1E293B] rounded-lg pl-9 pr-3 py-2 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#1E293B] bg-[#080C16] text-amber-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-amber-500"
                />
                <span>Remember session (30 days)</span>
              </label>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 2FA Active
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating Terminal...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* SSO Alternative */}
          <div className="mt-5 pt-4 border-t border-[#1E293B] text-center">
            <button
              type="button"
              onClick={() => handleQuickDemo('director@skylineestates.in', 'Director of Sales & Acquisitions')}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-[#111726] hover:bg-[#162033] border border-[#1E293B] text-xs text-slate-300 transition-colors"
            >
              <Globe2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Authenticate with Okta / Google Workspace SSO</span>
            </button>
          </div>
        </div>
      </main>

      {/* Security & Compliance Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-[#1E293B]/70 text-center text-xs text-slate-400">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Meta Business Partner #917204
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">ISO 27001 Certified Infrastructure</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">Digital Personal Data Protection (DPDP) Act 2023 Compliant</span>
        </div>
      </footer>
    </div>
  );
}
