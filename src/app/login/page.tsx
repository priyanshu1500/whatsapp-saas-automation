'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, DEMO_USERS, UserProfile } from '@/context/AuthContext';
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
  Check,
  Eye,
  EyeOff,
  UserCheck,
  Fingerprint,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [selectedUser, setSelectedUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSelectDemo = (u: UserProfile) => {
    setSelectedUser(u);
    setEmail(u.email);
    setPassword('••••••••••••');
  };

  const handleExecuteLogin = (u?: UserProfile) => {
    setIsSubmitting(true);
    const targetUser = u || selectedUser;
    login(targetUser.email, targetUser);
    setTimeout(() => {
      router.push('/');
    }, 350);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteLogin();
  };

  return (
    <div className="min-h-screen w-full bg-[#060911] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Subtle Architectural Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(rgba(212, 175, 55, 0.3) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px, 20px 20px',
          backgroundPosition: '0 0, 20px 20px',
        }}
      />

      {/* Ambient Radial Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[#1E293B]/70 backdrop-blur-md">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-base shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/40">
            P
          </div>
          <div>
            <div className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
              PropFlow OS
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                v2.4 Enterprise
              </span>
            </div>
            <div className="text-xs text-slate-400 font-medium">Skyline Luxury Estates • Gurugram HQ Tenant</div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-[#0C1220] px-3 py-1.5 rounded-full border border-[#1E293B] text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Meta Cloud API 2026 Online</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400/90 font-mono text-[11px] tabular-nums">HARERA #04/2026</span>
          </div>

          <button
            onClick={() => handleExecuteLogin(DEMO_USERS[0])}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#111726] hover:bg-[#182033] border border-amber-500/40 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all shadow-sm"
          >
            <span>Quick Skip to App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 max-w-7xl w-full mx-auto my-auto">
        {/* Title & Philosophy */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Demo Credentials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Authenticate to Command Center
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-3 font-normal leading-relaxed text-wrap pretty">
            Select a verified executive profile below to experience PropFlow OS with role-tailored permissions, real-time WhatsApp telemetry, and RERA pricing controls.
          </p>
        </div>

        {/* Two-Column Grid: Demo ID Cards on Left, Active Sign-In on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3 Executive Demo ID Cards (7 Columns) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-400" />
                Select Demo Executive Profile
              </span>
              <span className="text-[11px] font-mono text-emerald-400">3 VERIFIED IDS ACTIVE</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {DEMO_USERS.map((userItem) => {
                const isSelected = selectedUser.email === userItem.email;
                return (
                  <div
                    key={userItem.email}
                    onClick={() => handleSelectDemo(userItem)}
                    className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden backdrop-blur-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#121A2E] to-[#0E1526] border-amber-500/70 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                        : 'bg-[#0A0F1D]/80 hover:bg-[#0E1528]/90 border-[#1E293B] hover:border-slate-600'
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isSelected && (
                      <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600" />
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Avatar and Identity */}
                      <div className="flex items-start sm:items-center space-x-3.5">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${userItem.avatarColor} flex items-center justify-center text-slate-950 font-bold text-base shadow-md shrink-0 ring-2 ring-white/10`}
                        >
                          {userItem.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-bold text-white tracking-tight group-hover:text-amber-200 transition-colors">
                              {userItem.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/5 border border-white/10 text-slate-300">
                              {userItem.badgeId}
                            </span>
                          </div>
                          <div className="text-xs font-medium text-amber-300/90 mt-0.5">{userItem.role}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{userItem.division}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1E293B]">
                        <span className="text-[11px] font-mono text-slate-400 hidden sm:block">
                          {userItem.email}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExecuteLogin(userItem);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
                            isSelected
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-500/20'
                              : 'bg-[#141C2E] hover:bg-[#1C263D] text-slate-200 border border-[#1E293B]'
                          }`}
                        >
                          <span>Sign In</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Permissions Capsule Tags */}
                    <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 mr-1 tracking-wider">
                        Scopes:
                      </span>
                      {userItem.permissions.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-slate-300 border border-white/5"
                        >
                          ✓ {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Terminal Card (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="bg-[#0B101E]/95 border border-[#1E293B] rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative">
              {/* Top Hairline Glow */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />

              <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#1E293B]">
                <div>
                  <div className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                    <Fingerprint className="w-4 h-4 text-amber-400" />
                    Authentication Console
                  </div>
                  <div className="text-sm font-semibold text-white mt-1">
                    Terminal ID: <span className="font-mono text-amber-300/90">{selectedUser.badgeId}</span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs">
                  {selectedUser.avatar}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 tracking-wide">
                    Executive Work Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="executive@skylineestates.in"
                      className="w-full bg-[#070A12] border border-[#1E293B] rounded-xl pl-9 pr-3 py-2.5 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 tracking-wide">
                      Master Access Key
                    </label>
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Pre-verified
                    </span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#070A12] border border-[#1E293B] rounded-xl pl-9 pr-10 py-2.5 text-base sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-[#1E293B] bg-[#070A12] text-amber-500 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 accent-amber-500"
                    />
                    <span>Remember terminal</span>
                  </label>
                  <span className="text-slate-400 text-[11px]">TLS 1.3 Encrypted</span>
                </div>

                {/* Primary CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-xl shadow-amber-500/20 active:scale-[0.97]"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to Workspace...</span>
                    </div>
                  ) : (
                    <>
                      <span>Enter Workspace as {selectedUser.name}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* SSO Simulation */}
              <div className="mt-5 pt-4 border-t border-[#1E293B] text-center space-y-2">
                <button
                  type="button"
                  onClick={() => handleExecuteLogin(selectedUser)}
                  className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-lg bg-[#111726] hover:bg-[#162033] border border-[#1E293B] text-xs text-slate-300 transition-colors"
                >
                  <Globe2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Authenticate with Okta / Google SSO</span>
                </button>
                <div className="text-[11px] text-slate-400">
                  Instant Access: No registration required for verified demo credentials.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Security & Compliance Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-[#1E293B]/70 text-center text-xs text-slate-400 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-mono text-[11px]">
          <span className="flex items-center gap-1.5 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Meta Business Partner ID #917204
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">ISO 27001 Certified Luxury PropTech Stack</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">Indian DPDP Act 2023 Compliant</span>
        </div>
      </footer>
    </div>
  );
}
