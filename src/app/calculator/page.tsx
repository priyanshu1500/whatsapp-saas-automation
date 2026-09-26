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
  Building,
  Key,
  ShieldCheck,
  Award,
  Crown,
  ArrowUpRight,
} from 'lucide-react';

export default function CalculatorPage() {
  // Real Estate Variables
  const [avgPropertyPriceCr, setAvgPropertyPriceCr] = useState(5.0); // ₹5.0 Cr
  const [brokerCommissionPct, setBrokerCommissionPct] = useState(2.0); // 2%
  const [monthlyInquiries, setMonthlyInquiries] = useState(500); // 500 WhatsApp buyer chats
  const [incrementalDealsYear, setIncrementalDealsYear] = useState(3); // 3 additional deals closed/yr
  const [softwareMonthlyFeeUSD, setSoftwareMonthlyFeeUSD] = useState(1000); // $1,000/mo
  const [setupFeeINR, setSetupFeeINR] = useState(50000); // ₹50,000 one-time deployment

  // Conversion rates: $1 USD = ~₹84 INR
  const usdToInr = 84;
  const softwareMonthlyFeeINR = softwareMonthlyFeeUSD * usdToInr; // ~₹84,000/mo

  // Deal economics
  const avgPropertyPriceINR = avgPropertyPriceCr * 10000000;
  const commissionPerDealINR = (avgPropertyPriceINR * brokerCommissionPct) / 100;
  const grossClientGainAnnual = incrementalDealsYear * commissionPerDealINR;
  const totalSoftwareAnnualINR = setupFeeINR + softwareMonthlyFeeINR * 12;
  const netClientProfitAnnual = grossClientGainAnnual - totalSoftwareAnnualINR;
  const clientRoiPercent =
    totalSoftwareAnnualINR > 0 ? Math.round((netClientProfitAnnual / totalSoftwareAnnualINR) * 100) : 0;

  // Operating Costs (Agency COGS based on Section 5 India Meta Rate Card)
  const paidConversations = Math.max(0, monthlyInquiries - 1000); // 1,000 free per month
  const serviceCost = paidConversations * 0.115;
  const utilityReminders = Math.round(monthlyInquiries * 0.4) * 0.115; // 40% site visits
  const metaMonthlyBill = (serviceCost + utilityReminders) * 1.18; // +18% GST
  const aiTokenCost = Math.round((monthlyInquiries * 6) / 1000) * 220; // ~₹220 per 1k turns
  const hostingAllocation = 1500;
  const totalAgencyCostMonthly = metaMonthlyBill + aiTokenCost + hostingAllocation;
  const agencyMonthlyProfit = softwareMonthlyFeeINR - totalAgencyCostMonthly;
  const agencyMarginPercent = Math.round((agencyMonthlyProfit / softwareMonthlyFeeINR) * 100);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
            $1,000/Month Luxury PropTech Value Proposition
          </span>
          <span className="text-xs text-slate-400">Section 5 Meta India Compliance</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
          Real Estate Commission ROI & Agency Retainer Model
        </h1>
        <p className="text-sm text-slate-400">
          Demonstrate mathematically why a $1,000/mo ($12,000/yr) PropFlow OS retainer generates 300% - 700% net ROI for high-ticket developers and premier brokerages.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders & Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-[#111625] border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-400" />
              <span>Developer & Brokerage Deal Economics</span>
            </h2>
            <span className="text-xs text-amber-300 font-mono">Real-Time Simulation</span>
          </div>

          <div className="space-y-6 text-xs">
            {/* Avg Property Price Slider */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Average Luxury Property Ticket Size</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  ₹{avgPropertyPriceCr.toFixed(1)} Crores
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="25.0"
                step="0.5"
                value={avgPropertyPriceCr}
                onChange={(e) => setAvgPropertyPriceCr(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>₹2.0 Cr (Premium 3 BHK)</span>
                <span>₹10.0 Cr (Golf Villa)</span>
                <span>₹25.0 Cr (Sea-Facing Penthouse)</span>
              </div>
            </div>

            {/* Broker Commission % */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Brokerage / Sales Commission Rate</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {brokerCommissionPct.toFixed(1)}% (₹{(commissionPerDealINR / 100000).toFixed(1)} Lakh / deal)
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.25"
                value={brokerCommissionPct}
                onChange={(e) => setBrokerCommissionPct(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>1.0% (Standard Builder)</span>
                <span>2.0% (Luxury Market Standard)</span>
                <span>4.0% (Exclusive Mandate)</span>
              </div>
            </div>

            {/* Monthly WhatsApp Inquiries */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">Monthly Inbound WhatsApp Buyer Inquiries</span>
                <span className="text-white font-mono font-bold">{monthlyInquiries} inquiries / mo</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={monthlyInquiries}
                onChange={(e) => setMonthlyInquiries(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                Generated from Meta Instagram/Facebook Ads, 99acres/Housing portals, and site signage
              </div>
            </div>

            {/* Incremental deals closed */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-300">
                  Incremental Deals Closed / Year (from instant &lt;30s AI response)
                </span>
                <span className="text-emerald-400 font-mono font-bold text-sm">
                  +{incrementalDealsYear} Deals / Year
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={incrementalDealsYear}
                onChange={(e) => setIncrementalDealsYear(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="text-[11px] text-slate-500">
                Inquiries that would have gone cold due to 4+ hour human agent delays
              </div>
            </div>

            {/* Software Retainer Pricing */}
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Monthly Retainer ($ USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
                  <input
                    type="number"
                    value={softwareMonthlyFeeUSD}
                    onChange={(e) => setSoftwareMonthlyFeeUSD(Number(e.target.value))}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-xl py-2 pl-7 pr-3 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  ≈ ₹{(softwareMonthlyFeeINR).toLocaleString('en-IN')}/mo
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  One-Time Onboarding (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">₹</span>
                  <input
                    type="number"
                    value={setupFeeINR}
                    onChange={(e) => setSetupFeeINR(Number(e.target.value))}
                    className="w-full bg-[#090D16] border border-slate-800 rounded-xl py-2 pl-7 pr-3 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                  />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Catalog & RERA setup fee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output: Client ROI Card & Agency Economics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Client ROI Card (The $1,000/mo justification) */}
          <div className="bg-[#111625] border border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-xs text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                Client ROI Projection
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                +{clientRoiPercent}% Net ROI
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Additional Commission Earned:</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  +₹{(grossClientGainAnnual / 100000).toFixed(1)} Lakh
                </span>
              </div>

              <div className="flex items-baseline justify-between text-xs">
                <span className="text-slate-400">Annual Software Retainer:</span>
                <span className="font-mono text-slate-300">
                  -₹{(totalSoftwareAnnualINR / 100000).toFixed(2)} Lakh ($12k)
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                <span className="text-xs font-semibold text-white">Net Client Profit Gain:</span>
                <span className="text-2xl font-bold font-mono text-amber-300">
                  ₹{(netClientProfitAnnual / 100000).toFixed(1)} Lakh
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#090D16] border border-slate-800 rounded-xl text-[11px] text-slate-300 leading-relaxed">
              💡 <strong>The Pitch to Real Estate MDs:</strong> Selling just <strong>ONE</strong> single additional luxury apartment of ₹{avgPropertyPriceCr.toFixed(1)} Cr completely pays for the entire annual software cost of PropFlow OS, plus delivers over ₹{(commissionPerDealINR - totalSoftwareAnnualINR > 0 ? (commissionPerDealINR - totalSoftwareAnnualINR) / 100000 : 0).toFixed(1)} Lakh pure profit in your pocket.
            </div>
          </div>

          {/* Agency Gross Margin Card */}
          <div className="bg-[#111625] border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-xs text-white flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Agency SaaS Unit Economics (Per Client)</span>
              </h3>
              <span className="text-[11px] font-bold text-amber-300 font-mono">
                {agencyMarginPercent}% Margin
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Client Revenue:</span>
                <span className="font-mono text-white font-semibold">
                  ₹{softwareMonthlyFeeINR.toLocaleString('en-IN')} ($1,000)
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Meta Cloud API (Section 5 India):</span>
                <span className="font-mono text-slate-300">₹{Math.round(metaMonthlyBill)}/mo</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">AI Tokens (Gemini / Claude):</span>
                <span className="font-mono text-slate-300">₹{aiTokenCost}/mo</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">Cloud & Database Hosting:</span>
                <span className="font-mono text-slate-300">₹{hostingAllocation}/mo</span>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between font-bold">
                <span className="text-emerald-400">Monthly Net Profit Per Client:</span>
                <span className="font-mono text-emerald-400 text-sm">
                  ₹{Math.round(agencyMonthlyProfit).toLocaleString('en-IN')} / mo
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Annualized Net Agency Profit:</span>
                <span>₹{Math.round(setupFeeINR + agencyMonthlyProfit * 12).toLocaleString('en-IN')} / client</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
