import type { Metadata } from 'next';
import './globals.css';
import { AppSidebar } from '@/components/AppSidebar';

export const metadata: Metadata = {
  title: 'WaSaaS - WhatsApp AI Business Agent & Operating System',
  description: 'Commercial AI WhatsApp Agent & Staff Operating System for clinics and high-ticket service businesses.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex overflow-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto flex flex-col h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

