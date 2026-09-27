import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGate } from '@/components/AuthGate';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PropFlow OS — Autonomous Real Estate Operating System ($1,000/mo Enterprise)',
  description: 'Enterprise WhatsApp AI Operating System for luxury real estate developers and high-ticket brokerages.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable} dark h-full`}>
      <body className="h-full bg-[#080C14] text-slate-100 antialiased selection:bg-amber-500/20 selection:text-amber-200 overflow-hidden font-sans">
        <AuthProvider>
          <AuthGate>{children}</AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
