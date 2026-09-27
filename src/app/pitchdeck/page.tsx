'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Building2,
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  CalendarCheck,
  Calculator,
  Compass,
  Zap,
  ArrowRight,
  Lock,
  Sparkles,
  PhoneCall,
  Car,
  FileText,
  DollarSign,
  Layers,
  Clock,
  CheckCheck,
  Send,
} from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  category: string;
}

const SLIDES: Slide[] = [
  { id: 1, title: 'Executive Overview', category: 'The Proposition' },
  { id: 2, title: 'The ₹50 Cr Industry Problem', category: 'Market Pain' },
  { id: 3, title: 'PropFlow VIP Operating System', category: 'The Solution' },
  { id: 4, title: 'Live Case 1: Midnight Lead Capture', category: 'Real Case' },
  { id: 5, title: 'Live Case 2: Family Advisory', category: 'Real Case' },
  { id: 6, title: 'Live Case 3: VIP Gate Pass & Tour', category: 'Real Case' },
  { id: 7, title: 'Live Case 4: Director Takeover', category: 'Real Case' },
  { id: 8, title: 'The $1,000/mo Unit Economics', category: 'Financial Proof' },
  { id: 9, title: 'Meta 2026 & DPDP Compliance', category: 'Compliance' },
  { id: 10, title: '48-Hour Pilot & Risk-Free Offer', category: 'Closing Offer' },
];

export default function PitchDeckPage() {
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const totalSlides = SLIDES.length;

  const nextSlide = () => {
    if (currentSlide < totalSlides) setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 1) setCurrentSlide((prev) => prev - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col justify-between selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Top Deck Navigation Bar */}
      <header className="px-6 py-4 border-b border-[#1E293B] bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#C5A880] text-[#090D16] flex items-center justify-center font-black shadow-lg shadow-[#D4AF37]/20">
            <Compass className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight text-white">PropFlow VIP OS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                Executive Pitch Deck
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Slide {currentSlide} of {totalSlides}: {SLIDES[currentSlide - 1].title}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick jump menu */}
          <div className="hidden md:flex items-center gap-1 bg-[#111726] border border-[#1E293B] p-1 rounded-xl">
            {SLIDES.map((s) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(s.id)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                  currentSlide === s.id
                    ? 'bg-[#D4AF37] text-[#090D16] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#182032]'
                }`}
                title={`Slide ${s.id}: ${s.title}`}
              >
                {s.id}
              </button>
            ))}
          </div>

          <button
            onClick={prevSlide}
            disabled={currentSlide === 1}
            className="p-2 rounded-xl bg-[#111726] border border-[#1E293B] text-slate-300 hover:text-white disabled:opacity-30 transition"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides}
            className="p-2 rounded-xl bg-[#111726] border border-[#1E293B] text-slate-300 hover:text-white disabled:opacity-30 transition"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-[#111726] border border-[#1E293B] text-slate-300 hover:text-[#D4AF37] transition hidden sm:flex"
            title="Toggle Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-[#111726] border border-[#1E293B] text-slate-300 hover:text-[#D4AF37] transition hidden sm:flex"
            title="Print Pitch Deck"
          >
            <Printer className="w-4 h-4" />
          </button>

          <Link
            href="/simulator"
            className="ml-2 px-3 py-1.5 text-xs font-bold bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] rounded-xl shadow-lg shadow-[#D4AF37]/20 transition flex items-center gap-1.5"
          >
            <Smartphone className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Live</span> Sandbox
          </Link>
        </div>
      </header>

      {/* Main Slide Canvas */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 sm:p-10 flex flex-col justify-center">
        {/* ========================================================================= */}
        {/* SLIDE 1: COVER & EXECUTIVE SUMMARY */}
        {/* ========================================================================= */}
        {currentSlide === 1 && (
          <div className="space-y-8 animate-enter">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-extrabold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise Real Estate Operating System • 2026
              </div>

              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                Turn Every WhatsApp Inquiry into a <span className="text-[#D4AF37] font-serif italic">₹10 Cr+ Deal.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
                The autonomous 24/7 AI sales infrastructure designed specifically for India's top builders, luxury developers, and brokerage directors. Qualifies Ultra-HNIs in fluent Hinglish, issues RERA price quotes, and books private chauffeur site visits with zero human delay.
              </p>
            </div>

            {/* 4 Proof Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Pipeline Grounding</span>
                <p className="text-2xl font-extrabold text-white mt-1">₹48.5 Cr</p>
                <p className="text-[11px] text-[#D4AF37]">Active HNI buyer pipeline</p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Response Latency</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-1">&lt; 1.2s</p>
                <p className="text-[11px] text-slate-400">24/7 Instant response</p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Site Tour Show-Up</span>
                <p className="text-2xl font-extrabold text-teal-300 mt-1">89.4%</p>
                <p className="text-[11px] text-slate-400">Via VIP security gate pass</p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl">
                <span className="text-[10px] uppercase font-bold text-slate-500">Developer Net ROI</span>
                <p className="text-2xl font-extrabold text-[#D4AF37] mt-1">225%+</p>
                <p className="text-[11px] text-slate-400">Paid on Deal #1</p>
              </div>
            </div>

            {/* Target Audience Bar */}
            <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Engineered for Indian Real Estate Leaders:</span>
              <div className="flex flex-wrap items-center gap-3 text-slate-300 font-mono text-[11px]">
                <span className="px-2.5 py-1 bg-[#182032] rounded-md border border-[#1E293B]">DLF Phase 5 & Golf Course Rd</span>
                <span className="px-2.5 py-1 bg-[#182032] rounded-md border border-[#1E293B]">Worli & Bandra (Mumbai)</span>
                <span className="px-2.5 py-1 bg-[#182032] rounded-md border border-[#1E293B]">Whitefield (Bangalore)</span>
                <span className="px-2.5 py-1 bg-[#182032] rounded-md border border-[#1E293B]">Tier-1 International Channel Partners</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 2: THE ₹50 CRORE PROBLEM IN REAL ESTATE */}
        {/* ========================================================================= */}
        {currentSlide === 2 && (
          <div className="space-y-6 animate-enter">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">
                The Crisis Facing Indian Real Estate Sales in 2026
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Where 68% of Luxury Buyer Leads Quietly Evaporate
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Real estate companies spend ₹5 Lakhs to ₹50 Lakhs per month on Meta and Google ads, yet lose the majority of high-ticket buyers to these four fatal operational bottlenecks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#111726] border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-rose-400 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>1. The Midnight Lead Black Hole</span>
                  </div>
                  <span className="bg-rose-500/10 px-2 py-0.5 rounded text-[10px]">68% Drop-off</span>
                </div>
                <h3 className="text-sm font-bold text-white">Ultra-HNIs Browse at Night; Sales Teams Sleep</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  C-suite executives and business owners browse Instagram and property portals between 10:30 PM and 1:30 AM. When an inquiry comes in, human brokers don't reply until 2:00 PM the next day. By then, the HNI has engaged with another builder.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111726] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2. The "Press 1 for 3 BHK" Bot Disaster</span>
                  </div>
                  <span className="bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">Insults HNIs</span>
                </div>
                <h3 className="text-sm font-bold text-white">Rigid Menus Alienate ₹10 Cr+ Buyers</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Cheap chatbots send robotic number trees or crash when the buyer asks natural questions like <em>"familt of 4 ke lie best kyarahgea"</em> or <em>"ghar dikhado"</em>. High-ticket buyers immediately block the number.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111726] border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-rose-400 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>3. Meta WhatsApp Bans & Penalties</span>
                  </div>
                  <span className="bg-rose-500/10 px-2 py-0.5 rounded text-[10px]">Policy Fines</span>
                </div>
                <h3 className="text-sm font-bold text-white">Meta Jan 15 2026 Task Policy Bans Cold Spam</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Broadcasting unsolicited marketing PDFs triggers spam reports and instant WABA account blocks. Brokers lose access to verified green badges and thousands of prospect dialogues overnight.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111726] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    <span>4. Site Tour No-Shows at the Gate</span>
                  </div>
                  <span className="bg-amber-500/10 px-2 py-0.5 rounded text-[10px]">45% No-Show</span>
                </div>
                <h3 className="text-sm font-bold text-white">Friction at Security Gates Kills Showing Momentum</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Buyers agree to visit but forget or get interrogated by security guards at the society perimeter. Without verified gate passes and accompanied chauffeur pickup, conversion collapses.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 3: THE SOLUTION - PROPFLOW VIP OPERATING SYSTEM */}
        {/* ========================================================================= */}
        {currentSlide === 3 && (
          <div className="space-y-6 animate-enter">
            <div>
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                The Complete Operating System
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Autonomous Intelligence from First Ping to Closed Deed
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                PropFlow OS integrates 5 specialized engines into one centralized real estate command center.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <h3 className="text-xs font-bold text-white">Hinglish & Hindi NLP Engine</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Understands typos, colloquial slang (<em>"ghar dikhao"</em>, <em>"rate kya hai"</em>), and family living requirements in &lt; 1.2s.
                </p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <h3 className="text-xs font-bold text-white">HARERA Grounding Engine</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Quotes verified RERA pricing in ₹ Crores and carpet areas. Zero AI hallucinations or legal misrepresentation.
                </p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <h3 className="text-xs font-bold text-white">VIP Gate Pass & Chauffeur</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Instantly issues digital security access passes (#VIP-XXXX) with chauffeur dispatch to boost physical attendance to 89%.
                </p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                  04
                </div>
                <h3 className="text-xs font-bold text-white">1-Click Director Takeover</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pauses the AI cleanly when ₹10 Cr+ custom payment plans are demanded, alerting leadership for WhatsApp takeover.
                </p>
              </div>

              <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  05
                </div>
                <h3 className="text-xs font-bold text-white">₹ Crores Pipeline CRM</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Tracks deal values in Crores and calculates real-time 2% brokerage commissions in Lakhs across active negotiation stages.
                </p>
              </div>
            </div>

            {/* Architecture Strip */}
            <div className="p-4 bg-[#090D16] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold text-[#D4AF37]">Zero-Latency Local Architecture:</span>
              <span className="text-slate-400 text-[11px]">
                Runs without external cloud AI dependencies during peak hours • Instant 1ms execution • 100% Data Isolation
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 4: REAL CASE 1 - MIDNIGHT LEAD CAPTURE */}
        {/* ========================================================================= */}
        {currentSlide === 4 && (
          <div className="space-y-6 animate-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Live Test Case Scenario 01 • Midnight Lead Capture
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Buyer Texts: <span className="font-mono text-[#D4AF37]">"ghar dikhado"</span>
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                1ms Latency • Verified RERA Pricing
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Phone Frame Capture */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[340px] bg-[#0B141A] rounded-[32px] p-3 shadow-2xl border-4 border-[#1E293B] space-y-3">
                  <div className="bg-[#182032] p-2.5 rounded-2xl flex items-center gap-2.5 border-b border-[#1E293B]">
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#090D16] font-bold text-xs flex items-center justify-center">
                      SE
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Skyline Luxury Estates</h4>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        online 24/7 (AI Concierge)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-[11px] p-1">
                    <div className="flex justify-end">
                      <div className="bg-[#005C4B] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow">
                        ghar dikhado
                        <div className="text-[9px] text-right text-slate-300 mt-1">11:32 PM ✓✓</div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-[#182032] text-slate-100 p-2.5 rounded-2xl rounded-tl-none max-w-[90%] space-y-1.5 border border-[#1E293B] shadow">
                        <p>Namaste! Skyline Luxury Estates me hamare paas Gurugram ki premier locations par luxury residences available hain:</p>
                        <p className="text-[10px] text-[#D4AF37]">
                          🏙️ <strong>The Grand Horizon Sky Villas:</strong> ₹8.50 Cr – ₹14.0 Cr (4,250 sq.ft)<br />
                          🌳 <strong>The Crestview Golf Villas:</strong> ₹11.50 Cr – ₹18.0 Cr (5,800 sq.ft)<br />
                          ✨ <strong>Skyline Lumina 3 & 4 BHK:</strong> ₹3.40 Cr – ₹5.80 Cr (2,250 sq.ft)
                        </p>
                        <p className="text-[10px]">Aapko kis type ki property dekhni hai? Floor plans bhej du ya site visit arrange karwa du?</p>
                        <div className="text-[9px] text-right text-slate-400">11:32 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What this means for the Developer */}
              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                  <h3 className="font-bold text-white text-sm">Why Indian Builders Love This:</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero Drop-Off:</strong> While competitors are offline, your agency delivers instant portfolio breakdowns within 1 second.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>RERA Accurate:</strong> Exact price brackets in ₹ Crores and carpet area in sq.ft prevent misrepresentation liability.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Proactive Close:</strong> Moves immediately to qualification, asking if the buyer wants floor plans or a private tour.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-[#090D16] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between text-[#D4AF37]">
                  <span>Live Sandbox Result:</span>
                  <span className="font-bold">Intent: question (portfolio) • Cost: ₹0.00 (Service Reply)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 5: REAL CASE 2 - FAMILY ADVISORY */}
        {/* ========================================================================= */}
        {currentSlide === 5 && (
          <div className="space-y-6 animate-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Live Test Case Scenario 02 • Consultative Advisory
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Typo-Tolerant: <span className="font-mono text-[#D4AF37]">"familt of 4 ke lie best kyarahgea"</span>
                </h2>
              </div>
              <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
                Lifestyle & School Proximity Matching
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Phone Frame Capture */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[340px] bg-[#0B141A] rounded-[32px] p-3 shadow-2xl border-4 border-[#1E293B] space-y-3">
                  <div className="space-y-2 text-[11px] p-1">
                    <div className="flex justify-end">
                      <div className="bg-[#005C4B] text-white p-2.5 rounded-2xl rounded-tr-none max-w-[85%] shadow">
                        familt of 4 ke lie best kyarahgea
                        <div className="text-[9px] text-right text-slate-300 mt-1">11:34 PM ✓✓</div>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-[#182032] text-slate-100 p-2.5 rounded-2xl rounded-tl-none max-w-[92%] space-y-1.5 border border-[#1E293B] shadow">
                        <p className="font-semibold text-white">Aapki family of 4 ke liye 2 best options hain:</p>
                        <p className="text-[10px] text-teal-300">
                          🌟 <strong>Top Choice: Skyline Lumina 3 & 4 BHK</strong> (₹3.40 Cr – ₹5.80 Cr)<br />
                          • 2,250 sq.ft me master suite + 2 kids bedrooms + family lounge.<br />
                          • 82% open greens, kids play zones, aur The Shri Ram School 10 min door.
                        </p>
                        <p className="text-[10px] text-[#D4AF37]">
                          🏙️ <strong>Ultra-Luxury Upgrade: Grand Horizon 4 BHK Sky Villa</strong> (₹8.50 Cr+)<br />
                          • Duplex penthouse with private elevator direct to your foyer.
                        </p>
                        <p className="text-[10px]">Aapka budget bracket kya rahega (₹3.5–6 Cr ya ₹8 Cr+)?</p>
                        <div className="text-[9px] text-right text-slate-400">11:34 PM</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultative Value */}
              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                  <h3 className="font-bold text-white text-sm">Consultative Selling Intelligence:</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Typo Immunity:</strong> Automatically fixes mobile typing slips (<em>familt</em> $\rightarrow$ <em>family</em>, <em>kyarahgea</em> $\rightarrow$ <em>kya rahega</em>).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Family Context:</strong> Highlights dedicated children's bedrooms, open greens, and international schools nearby.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Price Anchoring:</strong> Anchors an entry luxury option (₹3.4 Cr) alongside an ultra-luxury upgrade (₹8.5 Cr+).</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl text-slate-400 text-[11px]">
                  <strong>Other Trained Profiles:</strong> Joint Family (5+ members with elderly parents), Couples (3 BHK low-maintenance), High-Yield Investors (8.2% Commercial).
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 6: REAL CASE 3 - SITE VISIT & VIP GATE PASS */}
        {/* ========================================================================= */}
        {currentSlide === 6 && (
          <div className="space-y-6 animate-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Live Test Case Scenario 03 • Tour Booking & Access Pass
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  VIP Gate Pass: <span className="font-mono text-emerald-400">#SKY-VIP-7171</span>
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                89.4% Physical Showing Attendance
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Digital Pass Card Mockup */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[360px] bg-gradient-to-b from-[#182032] to-[#111726] border-2 border-[#D4AF37] rounded-3xl p-6 shadow-2xl text-xs space-y-4 relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-white uppercase tracking-wider text-[11px]">Skyline Luxury Estates</span>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                      CONFIRMED VIP PASS
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-400 uppercase tracking-widest">Digital Security Gate Pass</div>
                    <div className="text-2xl font-black text-[#D4AF37] font-mono tracking-wider">#SKY-VIP-7171</div>
                    <p className="text-[11px] text-slate-300">Buyer: Vikramaditya Singhania</p>
                    <p className="text-[11px] text-slate-300">Project: Skyline Lumina 3 & 4 BHK</p>
                    <p className="text-[11px] text-slate-300">Host: Raghav Singhal (Managing Director)</p>
                    <p className="text-[11px] text-slate-300">Schedule: Tomorrow at 11:00 AM</p>
                    <p className="text-[11px] text-emerald-400 font-semibold">Chauffeur: Private Mercedes-Benz Assigned</p>
                  </div>

                  <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>HARERA-GGM-2024-9182</span>
                    <span>Level 18, Two Horizon Centre</span>
                  </div>
                </div>
              </div>

              {/* Conversion Metrics */}
              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                  <h3 className="font-bold text-white text-sm">How This Closes Deals:</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>High Psychological Commitment:</strong> When a buyer receives a dedicated gate pass with their name, no-show rates drop from 45% to below 11%.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Automated 24h Cron Reminders:</strong> Automated Meta utility templates dispatch 24h before the tour with driving directions and chauffeur details.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero Security Friction:</strong> Society guards scan or verify the pass instantly, preserving the luxury buyer's dignity.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex items-center justify-between text-[#D4AF37]">
                  <span>Database State:</span>
                  <span className="font-bold">Lead Status: SITE_VISIT_BOOKED • Calendar Synced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 7: REAL CASE 4 - DIRECTOR TAKEOVER & CRM */}
        {/* ========================================================================= */}
        {currentSlide === 7 && (
          <div className="space-y-6 animate-enter">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                  Live Test Case Scenario 04 • Human Takeover & CRM
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight">
                  Seamless Managing Director Handover
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                1-Click Bot Pause • Zero Message Collision
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Live Inbox / CRM Mockup */}
              <div className="lg:col-span-6 space-y-3">
                <div className="bg-[#111726] border border-[#1E293B] rounded-2xl p-4 shadow-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#1E293B] pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-xs">
                        MD
                      </div>
                      <div>
                        <h4 className="font-bold text-white">Raghav Singhal (Managing Director)</h4>
                        <span className="text-[10px] text-amber-400">Broker Takeover Mode Active</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37]">
                      Lead: Vikramaditya (₹14 Cr)
                    </span>
                  </div>

                  <div className="p-3 bg-[#090D16] rounded-xl border border-[#1E293B] space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Customer Note</div>
                    <p className="text-slate-300 text-[11px] italic">
                      "I want to speak directly with Director Raghav Singhal about customized 20:80 subvention payment structures."
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex-1 py-2 bg-[#D4AF37] text-[#090D16] font-bold rounded-xl text-xs hover:bg-[#C5A880] transition">
                      Dispatch Custom 20:80 Term Sheet
                    </button>
                    <button className="px-3 py-2 bg-[#182032] border border-[#1E293B] text-slate-300 font-semibold rounded-xl text-xs hover:text-white transition">
                      Resume AI
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-[#090D16] border border-[#1E293B] rounded-xl flex items-center justify-between text-[11px] text-slate-400">
                  <span>CRM Stage: <strong className="text-white">NEGOTIATION</strong></span>
                  <span>Est. Deal Value: <strong className="text-[#D4AF37]">₹14.0 Cr</strong></span>
                  <span>Est. Brokerage: <strong className="text-emerald-400">₹28.0 Lakhs</strong></span>
                </div>
              </div>

              {/* Strategic Value */}
              <div className="lg:col-span-6 space-y-4 text-xs">
                <div className="p-4 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                  <h3 className="font-bold text-white text-sm">Why HNI Clients Demand This:</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>AI Knows When to Step Back:</strong> When a buyer asks to negotiate commercial terms, the AI never argues or guesses. It politely escalates to human leadership.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Zero Chat Jitter:</strong> When the Managing Director takes over, the bot is completely silenced. No double-messaging or awkward clashes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Pre-Approved Meta Templates:</strong> Leaders can fire RERA-approved payment brochures and directions with 1 click.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 8: THE $1,000/MO UNIT ECONOMICS */}
        {/* ========================================================================= */}
        {currentSlide === 8 && (
          <div className="space-y-6 animate-enter">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
                The Financial Model That Closes Every Indian Real Estate Owner
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Software Pays for Itself on <span className="text-[#D4AF37] font-serif italic">Deal #1</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                The easiest commercial pitch in SaaS: A single additional closed unit in Gurgaon, Mumbai, or Bangalore generates more commission than the entire annual software fee.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-500">Annual Software Cost</span>
                <p className="text-3xl font-black text-white">$12,000</p>
                <p className="text-xs text-slate-400">~₹10.14 Lakhs per year ($1,000/mo)</p>
                <div className="pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-[#1E293B]">
                  Covers unlimited WhatsApp qualification, RERA grounding, site tour calendar, and CRM pipeline.
                </div>
              </div>

              <div className="p-5 bg-[#111726] border border-[#D4AF37]/50 rounded-2xl space-y-2 bg-[#D4AF37]/5">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Brokerage on 1 Single Closed Deal</span>
                <p className="text-3xl font-black text-[#D4AF37]">₹11.0 Lakhs</p>
                <p className="text-xs text-slate-300">2% Developer Fee on ₹5.5 Cr Unit</p>
                <div className="pt-2 text-[11px] text-[#D4AF37] font-semibold leading-relaxed border-t border-[#D4AF37]/20">
                  ⚡ 108% Software Payback achieved on the very first transaction closed from midnight traffic.
                </div>
              </div>

              <div className="p-5 bg-[#111726] border border-emerald-500/50 rounded-2xl space-y-2 bg-emerald-950/20">
                <span className="text-[10px] uppercase font-bold text-emerald-400">Conservative 3-Deal Upside</span>
                <p className="text-3xl font-black text-emerald-300">+₹22.86 Lakhs</p>
                <p className="text-xs text-emerald-400">Pure Net Client Profit (+225% ROI)</p>
                <div className="pt-2 text-[11px] text-emerald-200/90 leading-relaxed border-t border-emerald-500/20">
                  ₹33.0 L gross commission minus ₹10.14 L software fee = ₹22.86 L pure bottom-line profit.
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="p-4 bg-[#090D16] border border-[#1E293B] rounded-2xl overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#1E293B] text-slate-500 text-[10px] uppercase">
                    <th className="py-2">Project / Asset Tier</th>
                    <th className="py-2">Average Ticket</th>
                    <th className="py-2">Developer Brokerage (2%)</th>
                    <th className="py-2">Annual SaaS Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-slate-300">
                  <tr>
                    <td className="py-2.5 font-semibold text-white">Skyline Lumina (Luxury Condos)</td>
                    <td className="py-2.5">₹3.80 Cr</td>
                    <td className="py-2.5 font-bold text-emerald-400">₹7.60 Lakhs</td>
                    <td className="py-2.5 text-slate-400">1.3 Deals to Payback</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">The Grand Horizon (Duplex Sky Villas)</td>
                    <td className="py-2.5">₹9.50 Cr</td>
                    <td className="py-2.5 font-bold text-emerald-400">₹19.00 Lakhs</td>
                    <td className="py-2.5 text-[#D4AF37] font-bold">1 Deal = 187% Payback</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold text-white">The Crestview Signature (Golf Villas)</td>
                    <td className="py-2.5">₹14.50 Cr</td>
                    <td className="py-2.5 font-bold text-emerald-400">₹29.00 Lakhs</td>
                    <td className="py-2.5 text-[#D4AF37] font-bold">1 Deal = 286% Payback</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 9: META 2026 POLICY & DPDP COMPLIANCE */}
        {/* ========================================================================= */}
        {currentSlide === 9 && (
          <div className="space-y-6 animate-enter">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block mb-1">
                Enterprise Regulatory Moat
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                100% Compliant with Meta’s Jan 15, 2026 Enterprise Policy
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Generic AI tools are getting banned across WhatsApp. PropFlow is built specifically to thrive within Meta's new task-focused enterprise framework.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-5 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Meta Task-Focused Guardrails</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Meta's Jan 15, 2026 policy bans general chatbot chatter (jokes, poetry, essay writing, coding) on commercial WhatsApp accounts. PropFlow strictly refuses off-topic queries and redirects buyers back to real estate transactions.
                </p>
                <div className="p-2.5 bg-[#090D16] rounded-lg border border-[#1E293B] text-[11px] text-slate-400 font-mono">
                  Test Query: "Write a poem" → Refused with polite RERA real estate redirection.
                </div>
              </div>

              <div className="p-5 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>24-Hour Free Service Window Optimization</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  When a customer messages your business, Meta opens a 24-hour service window where inbound service replies are <strong>₹0.00 / message</strong>. PropFlow handles the entire qualification and booking for zero Meta fee.
                </p>
                <div className="p-2.5 bg-[#090D16] rounded-lg border border-[#1E293B] text-[11px] text-emerald-400 font-mono">
                  Saves ~₹45,000/month compared to paying ₹0.86/msg on broadcast marketing blasts.
                </div>
              </div>

              <div className="p-5 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <span>HARERA Legal Grounding</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  All property listings are tied to verified regulatory IDs (<span className="text-[#D4AF37] font-mono">RC/REP/HARERA/GGM/2023/88</span>). Sales teams can rest easy knowing automated conversations are legally defensible.
                </p>
              </div>

              <div className="p-5 bg-[#111726] border border-[#1E293B] rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Indian DPDP Act & HMAC Security</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Cryptographic HMAC SHA-256 signature verification on every inbound webhook ensures zero packet forging. Full customer data isolation compliant with India's Digital Personal Data Protection (DPDP) Act 2023.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SLIDE 10: 48-HOUR PILOT & RISK-FREE CLOSING OFFER */}
        {/* ========================================================================= */}
        {currentSlide === 10 && (
          <div className="space-y-8 animate-enter">
            <div>
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest block mb-1">
                The Implementation & Risk-Free Commercial Offer
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Live on Your Inventory in <span className="text-[#D4AF37] font-serif italic">48 Hours.</span>
              </h2>
              <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
                Zero engineering headache for your team. We ingest your floor plans, RERA numbers, and sales collateral and have your WhatsApp concierge operational by Thursday.
              </p>
            </div>

            {/* The 14-Day Pilot Guarantee Card */}
            <div className="bg-gradient-to-r from-[#111726] via-[#182032] to-[#111726] border-2 border-[#D4AF37]/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 text-[#D4AF37] font-extrabold text-sm uppercase tracking-wider">
                <ShieldCheck className="w-5 h-5" />
                The 14-Day Guaranteed Pilot
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                "If we don't generate at least 5 confirmed, accompanied VIP site visits in the first 14 days, you pay nothing."
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                We take all the risk. Test PropFlow OS on your live ad traffic or past database leads. Watch your response time plummet from 14 hours to 1 second, and your site visit calendar fill up with verified HNI buyers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1E293B] text-xs">
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Setup Time</span>
                  <p className="font-bold text-white mt-0.5">48 Hours Turnkey</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Contract Terms</span>
                  <p className="font-bold text-white mt-0.5">Monthly Flex ($1,000/mo)</p>
                </div>
                <div>
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Meta API WABA Setup</span>
                  <p className="font-bold text-emerald-400 mt-0.5">Included at Zero Cost</p>
                </div>
              </div>
            </div>

            {/* Closing CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/simulator"
                className="px-6 py-3.5 text-xs font-bold bg-[#D4AF37] hover:bg-[#C5A880] text-[#090D16] rounded-xl shadow-xl shadow-[#D4AF37]/20 transition flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4 fill-current" />
                Test Live Simulator with Buyer Prompts
              </Link>
              <Link
                href="/calculator"
                className="px-6 py-3.5 text-xs font-bold bg-[#111726] border border-[#1E293B] hover:border-[#D4AF37] text-white rounded-xl transition flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-[#D4AF37]" />
                Customize Brokerage ROI Proposal
              </Link>
              <Link
                href="/how-to-use"
                className="px-6 py-3.5 text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                View 5-Minute Pitch Script →
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Deck Footer */}
      <footer className="px-6 py-3 border-t border-[#1E293B] bg-[#090D16] flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>Skyline Luxury Estates • PropFlow OS v2.4</span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400">HARERA-GGM-2024-9182</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">Use arrow keys (← →) or spacebar to navigate</span>
          <div className="w-24 h-1.5 bg-[#182032] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#D4AF37] transition-all duration-300"
              style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
