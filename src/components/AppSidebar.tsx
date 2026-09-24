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
  ChevronDown,
  Sparkles,
  Bot,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'WhatsApp Simulator', href: '/simulator', icon: Smartphone, badge: 'Live Sandbox' },
  { label: 'Live Conversations', href: '/conversations', icon: MessageSquare, badgeCountKey: 'conversations' },
  { label: 'Lead Pipeline CRM', href: '/leads', icon: Users },
  { label: 'Appointments', href: '/appointments', icon: CalendarCheck },
  { label: 'Meta Templates', href: '/templates', icon: FileText },
  { label: 'Meta ROI Calculator', href: '/calculator', icon: Calculator },
  { label: 'Knowledge Base', href: '/settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(1);
  const [selectedClinic, setSelectedClinic] = useState('Smile Clinic Delhi');

  useEffect(() => {
    // Quick polling for unread leads
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
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">WaSaaS</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-semibold px-1.5 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI WhatsApp Agent OS</p>
          </div>
        </div>
      </div>

      {/* Business Switcher */}
      <div className="px-3 pt-3">
        <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{selectedClinic}</p>
              <div className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Meta API v20.0</span>
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
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {item.badge}
                </span>
              )}
              {item.badgeCountKey === 'conversations' && unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold">DPDP Act Compliant</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Encrypted Meta Cloud Webhook • 24h Care Window Tracking
          </p>
        </div>
      </div>
    </aside>
  );
}
