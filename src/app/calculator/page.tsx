'use client';

import React, { useState } from 'react';
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Percent,
  CheckCircle,
  HelpCircle,
  Sparkles,
  PieChart,
  Building2,
  DollarSign,
  ShieldCheck,
  Gem,
  Award,
  ArrowUpRight,
} from 'lucide-react';

export default function RealEstateRoiCalculatorPage() {
  // Real Estate High-Ticket ROI Inputs
  const [avgPropertyPriceCr, setAvgPropertyPriceCr] = useState(5.5); // ₹5.5 Cr
  const [brokerCommissionPercent, setBrokerCommissionPercent] = useState(2.0); // 2%
  const [additionalDealsPerYear, setAdditionalDealsPerYear] = useState(3); // 3 deals
  const [softwareMonthlyFeeUsd, setSoftwareMonthlyFeeUsd] = useState(1000); // $1,000/mo

  // WhatsApp & Meta Usage Inputs (Section 5 Rate Card)
  const [conversationsPerMonth, setConversationsPerMonth] = useState(450);
  const [repliesPerChat, setRepliesPerChat] = useState(8);
  const [siteVisitRemindersCount, setSiteVisitRemindersCount] = useState(200);
  const [marketingPrelaunchCount, setMarketingPrelaunchCount] = useState(400);

  // Currency conversion constant: 1 USD ~ ₹84.5 INR
  const softwareMonthlyFeeInr = softwareMonthlyFeeUsd * 84.5;
  const softwareAnnualFeeInr = softwareMonthlyFeeInr * 12;

  // Real Estate ROI Calculations
  const commissionPerDealLakhs = (avgPropertyPriceCr * 100) * (brokerCommissionPercent / 100); // e.g. 550 * 0.02 = 11 Lakhs
  const grossAdditionalCommissionLakhs = commissionPerDealLakhs * additionalDealsPerYear; // e.g. 33 Lakhs
  const grossAdditionalCommissionInr = grossAdditionalCommissionLakhs * 100000;
  const netCommissionProfitInr = grossAdditionalCommissionInr - softwareAnnualFeeInr;
  const clientRoiPercent = softwareAnnualFeeInr > 0 ? Math.round((netCommissionProfitInr / softwareAnnualFeeInr) * 100) : 0;

  // Meta API Costs (Section 5 India Rate Card)
  const totalServiceReplies = conversationsPerMonth * repliesPerChat;
  const paidServiceReplies = Math.max(0, totalServiceReplies - 1000); // First 1,000 free each month
  const serviceCostInr = paidServiceReplies * 0.115;
  const reminderCostInr = siteVisitRemindersCount * 0.115;
  const marketingCostInr = marketingPrelaunchCount * 0.8631;
  const metaSubtotal = serviceCostInr + reminderCostInr + marketingCostInr;
  const gst = metaSubtotal * 0.18;
  const totalMetaBill = metaSubtotal + gst;

  // Server & LLM Token Cost
  const llmCost = Math.round((totalServiceReplies / 1000) * 350); // ~₹350 per 1k high-context turns
  const hostingAlloc = 1800; // Cloud server & Redis
  const totalAgencyCost = totalMetaBill + llmCost + hostingAlloc;
  const agencyMonthlyProfit = softwareMonthlyFeeInr - totalAgencyCost;
  const agencyMarginPercent = softwareMonthlyFeeInr > 0 ? Math.round((agencyMonthlyProfit / softwareMonthlyFeeInr) * 100) : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            $1,000/Month High-Ticket Justification
          </span>
          <span className="text-xs text-slate-400">Section 5 Rate Card & Deal Economics</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Real Estate Brokerage ROI & Meta Unit Economics
        </h1>
        <p className="text-sm text-slate-400">
          Demonstrates how closing just 1 additional luxury apartment per year delivers a 10x return on the $1,000/mo ($12,000/yr) SaaS subscription.
        </p>
      </div>

      {/* Hero ROI Metric Banner */}
      <div className="bg-gradient-to-r from-[#111625] via-[#141b2e] to-[#111625] border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Annual SaaS Investment</div>
            <div className="text-2xl font-bold text-white mt-1">
              $12,000 <span className="text-xs font-normal text-slate-400">/ yr (₹10.14L)</span>
            </div>
            <div className="text-[11px] text-amber-400 mt-1">$1,000/mo retainer tier</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Gross Commission Generated</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{grossAdditionalCommissionLakhs.toFixed(1)} Lakhs
            </div>
            <div className="text-[11px] text-slate-400 mt-1">From {additionalDealsPerYear} extra sales @ {brokerCommissionPercent}%</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Net Client Profit</div>
            <div className="text-2xl font-bold text-amber-300 mt-1">
              ₹{(netCommissionProfitInr / 100000).toFixed(1)} Lakhs
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">After paying full software fee</div>
          </div>

          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Client Software ROI</div>
            <div className="text-3xl font-extrabold text-white mt-1 flex items-center gap-1">
              <span>{clientRoiPercent}%</span>
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">Positive ROI on Deal #1</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Input Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section 1: Real Estate Sales Variables */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-amber-400" />
              <span>Client Deal Economics & Commission Modeling</span>
            </h2>

            {/* Property Avg Ticket */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Average Property Ticket Price</span>
                <span className="text-amber-300 font-bold font-mono">₹{avgPropertyPriceCr.toFixed(1)} Crores</span>
              </div>
              <input
                type="range"
                min="1.5"
                max="20.0"
                step="0.5"
                value={avgPropertyPriceCr}
                onChange={(e) => setAvgPropertyPriceCr(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>₹1.5 Cr (Luxury Apt)</span>
                <span>₹8.5 Cr (Sky Villa)</span>
                <span>₹20 Cr (Ultra Villa)</span>
              </div>
            </div>

            {/* Brokerage Commission % */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Brokerage / Channel Partner Commission</span>
                <span className="text-amber-300 font-bold font-mono">{brokerCommissionPercent.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.25"
                value={brokerCommissionPercent}
                onChange={(e) => setBrokerCommissionPercent(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                Single deal commission: <strong className="text-white">₹{commissionPerDealLakhs.toFixed(2)} Lakhs (~${Math.round(commissionPerDealLakhs * 100000 / 84.5).toLocaleString()} USD)</strong>
              </div>
            </div>

            {/* Additional Deals per Year */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Additional Deals Closed / Year via 24/7 AI Qualification</span>
                <span className="text-emerald-400 font-bold font-mono">{additionalDealsPerYear} closed units</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={additionalDealsPerYear}
                onChange={(e) => setAdditionalDealsPerYear(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-400">
                AI reduces lead drop-off from 4 hours down to 3 seconds, lifting visit show rates by 3.2x.
              </div>
            </div>
          </div>

          {/* Section 2: Meta Cloud API Volume Variables */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Meta Cloud API Volume Variables (India Rate Card)</span>
            </h2>

            {/* Conversations */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Monthly Inbound WhatsApp Conversations</span>
                <span className="text-amber-300 font-bold font-mono">{conversationsPerMonth} inquiries</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={conversationsPerMonth}
                onChange={(e) => setConversationsPerMonth(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Site Visit Utility Reminders */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Site Visit Utility Confirmations (₹0.115/msg)</span>
                <span className="text-amber-300 font-bold font-mono">{siteVisitRemindersCount} msgs</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={siteVisitRemindersCount}
                onChange={(e) => setSiteVisitRemindersCount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Marketing Prelaunch */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Outbound VIP Pre-Launch Marketing (₹0.8631/msg)</span>
                <span className="text-amber-300 font-bold font-mono">{marketingPrelaunchCount} msgs</span>
              </div>
              <input
                type="range"
                min="0"
                max="2000"
                step="50"
                value={marketingPrelaunchCount}
                onChange={(e) => setMarketingPrelaunchCount(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Profit & P&L Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SaaS Agency Margin Card */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-sm text-white flex items-center justify-between border-b border-slate-800 pb-3">
              <span>SaaS Provider Margin ($1,000 Retainer)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {agencyMarginPercent}% Net Margin
              </span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Monthly Client Retainer ($1,000 USD):</span>
                <span className="font-bold text-white font-mono">₹{softwareMonthlyFeeInr.toLocaleString()}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Meta Cloud API Bill (incl 18% GST):</span>
                <span className="font-medium text-red-400 font-mono">-₹{totalMetaBill.toFixed(0)}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">LLM Inference Tokens (Gemini/Claude):</span>
                <span className="font-medium text-red-400 font-mono">-₹{llmCost}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Cloud Hosting & Database Allocation:</span>
                <span className="font-medium text-red-400 font-mono">-₹{hostingAlloc}</span>
              </div>

              <div className="flex justify-between pt-2 text-sm font-bold">
                <span className="text-white">Monthly SaaS Gross Profit:</span>
                <span className="text-emerald-400 font-mono">₹{Math.round(agencyMonthlyProfit).toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Annual ARR Gross Profit:</span>
                <span className="text-amber-300 font-mono">₹{Math.round(agencyMonthlyProfit * 12).toLocaleString()} ($11,100+)</span>
              </div>
            </div>
          </div>

          {/* Meta Cost Breakdown Accordion */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Section 5 Meta India Cost Sheet</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Free Service Tier (1,000 msgs):</span>
                <span className="text-emerald-400 font-semibold">₹0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Paid Service Replies ({paidServiceReplies} @ ₹0.115):</span>
                <span className="font-mono">₹{serviceCostInr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Utility Reminders ({siteVisitRemindersCount} @ ₹0.115):</span>
                <span className="font-mono">₹{reminderCostInr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Marketing Broadcasts ({marketingPrelaunchCount} @ ₹0.8631):</span>
                <span className="font-mono">₹{marketingCostInr.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 font-bold">
                <span>Subtotal Meta:</span>
                <span className="font-mono">₹{metaSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Mandatory 18% GST:</span>
                <span className="font-mono">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-amber-300">
                <span>Total Net Meta Invoice:</span>
                <span className="font-mono">₹{totalMetaBill.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
