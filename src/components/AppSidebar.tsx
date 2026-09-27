'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Smartphone,
  MessageSquare,
  Users,
  CalendarCheck,
  FileText,
  Calculator,
  Settings,
  ShieldCheck,
  Building2,
  Sparkles,
  Compass,
  Key,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_ITEMS = [
  { label: 'Director Overview', href: '/', icon: LayoutDashboard },
  { label: 'How to Use & Demo Guide', href: '/how-to-use', icon: BookOpen, badge: 'Guide' },
  { label: 'WhatsApp Simulator', href: '/simulator', icon: Smartphone, badge: 'Sandbox' },
  { label: 'VIP Client Inbox', href: '/conversations', icon: MessageSquare, badgeCountKey: 'conversations' },
  { label: 'Property Portfolio', href: '/properties', icon: Building2 },
  { label: 'Buyer CRM Pipeline', href: '/leads', icon: Users },
  { label: 'Site Visits & Tours', href: '/appointments', icon: CalendarCheck },
  { label: 'Meta Templates', href: '/templates', icon: FileText },
  { label: 'Brokerage ROI Model', href: '/calculator', icon: Calculator },
  { label: 'Agency Knowledge Base', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(1);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        const unread = (data.leads || []).reduce((acc: number, l: any) => acc + (l.unread_count || 0), 0);
        setUnreadCount(unread);
      } catch (e) {
        // quiet
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-64 bg-[#090D16] border-r border-[#1E293B] flex flex-col h-screen select-none shrink-0 sticky top-0 text-slate-200">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#C5A880] flex items-center justify-center text-[#090D16] shadow-lg shadow-[#D4AF37]/20 font-bold">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-white">PropFlow</span>
              <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                VIP OS
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Autonomous Real Estate Sales</p>
          </div>
        </div>
      </div>

      {/* Agency Portfolio Identifier */}
      <div className="px-3 pt-3">
        <div className="bg-[#111726] p-2.5 rounded-xl border border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center shrink-0 border border-[#D4AF37]/20">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">Skyline Luxury Estates</p>
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[10px] text-slate-400">Golf Course Rd • RERA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-[#182032] text-[#D4AF37] border border-[#D4AF37]/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#111726]'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-500'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                  {item.badge}
                </span>
              )}
              {item.badgeCountKey === 'conversations' && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#090D16] text-[10px] font-extrabold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Authenticated User & Footer Info */}
      <div className="p-3 border-t border-[#1E293B] space-y-2">
        {user && (
          <div className="bg-[#111726] rounded-xl p-2.5 border border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                {user.avatar || 'RO'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="bg-[#0D121F] rounded-xl p-2.5 border border-[#1E293B]">
          <div className="flex items-center space-x-1.5 text-amber-400 mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">HARERA Registered OS</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Encrypted Meta Cloud API • 24/7 VIP Chauffeur Pass
          </p>
        </div>
      </div>
    </aside>
  );
}
