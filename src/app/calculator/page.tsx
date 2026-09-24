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
} from 'lucide-react';

export default function CalculatorPage() {
  // Input parameters based on Section 5 of the PDF
  const [conversationsPerMonth, setConversationsPerMonth] = useState(600);
  const [repliesPerChat, setRepliesPerChat] = useState(6);
  const [reminderTemplatesCount, setReminderTemplatesCount] = useState(400);
  const [marketingFollowupsCount, setMarketingFollowupsCount] = useState(500);
  const [clientMonthlyFee, setClientMonthlyFee] = useState(12000);
  const [clientSetupFee, setClientSetupFee] = useState(30000);

  // Calculations
  const totalServiceReplies = conversationsPerMonth * repliesPerChat;
  const paidServiceReplies = Math.max(0, totalServiceReplies - 1000); // 1,000 free per month
  const serviceCost = paidServiceReplies * 0.115;
  const reminderCost = reminderTemplatesCount * 0.115;
  const marketingCost = marketingFollowupsCount * 0.8631;
  const metaSubtotal = serviceCost + reminderCost + marketingCost;
  const gst = metaSubtotal * 0.18;
  const totalMetaBill = metaSubtotal + gst;

  // AI model costs (Gemini / Claude / OpenAI tokens)
  const aiApiCost = Math.round((totalServiceReplies / 1000) * 250); // ~₹250 per 1k turns
  // Server / Database hosting per client allocation
  const serverCost = 1200;

  const totalMonthlyCost = totalMetaBill + aiApiCost + serverCost;
  const monthlyProfit = clientMonthlyFee - totalMonthlyCost;
  const marginPercent = clientMonthlyFee > 0 ? Math.round((monthlyProfit / clientMonthlyFee) * 100) : 0;
  const firstYearValue = clientSetupFee + clientMonthlyFee * 12;
  const firstYearProfit = clientSetupFee + monthlyProfit * 12;

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Meta Pricing & Agency Retainer Calculator
          </h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
            India Rate Card (Section 5)
          </span>
        </div>
        <p className="text-sm text-slate-500">
          Compute real Meta Cloud API charges, GST, AI model costs, and agency client profit margins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders & Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Client Usage & Pricing Variables
          </h2>

          <div className="space-y-5 text-xs">
            {/* Conversations */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Monthly WhatsApp Conversations</span>
                <span className="text-emerald-600 font-bold">{conversationsPerMonth} chats</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={conversationsPerMonth}
                onChange={(e) => setConversationsPerMonth(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="text-[11px] text-slate-400">Average patient inquiries per month</div>
            </div>

            {/* AI Replies per chat */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Average AI Replies per Conversation</span>
                <span className="text-emerald-600 font-bold">{repliesPerChat} replies</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={repliesPerChat}
                onChange={(e) => setRepliesPerChat(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="text-[11px] text-slate-400">Total service messages: {totalServiceReplies.toLocaleString()}</div>
            </div>

            {/* Reminder Templates */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Utility Appointment Reminders (24h Before)</span>
                <span className="text-emerald-600 font-bold">{reminderTemplatesCount} msgs (₹0.115/ea)</span>
              </div>
              <input
                type="range"
                min="50"
                max="2000"
                step="50"
                value={reminderTemplatesCount}
                onChange={(e) => setReminderTemplatesCount(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Marketing Follow-ups */}
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Marketing Follow-ups ("We Missed You" offers)</span>
                <span className="text-emerald-600 font-bold">{marketingFollowupsCount} msgs (₹0.8631/ea)</span>
              </div>
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={marketingFollowupsCount}
                onChange={(e) => setMarketingFollowupsCount(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">Client Monthly Retainer (₹)</label>
                <input
                  type="number"
                  value={clientMonthlyFee}
                  onChange={(e) => setClientMonthlyFee(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">Typical: ₹8,000–₹15,000/mo</span>
              </div>
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300">One-time Setup Fee (₹)</label>
                <input
                  type="number"
                  value={clientSetupFee}
                  onChange={(e) => setClientSetupFee(Number(e.target.value))}
                  className="w-full mt-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                />
                <span className="text-[10px] text-slate-400">Typical: ₹15,000–₹50,000</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results & Margin Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Monthly Cost Breakdown */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Estimated Monthly Costs</h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>AI Service Replies ({totalServiceReplies.toLocaleString()})</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{serviceCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Utility Reminders ({reminderTemplatesCount})</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{reminderCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Marketing Templates ({marketingFollowupsCount})</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{marketingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>GST on Meta Charges (18%)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>AI Model Tokens (Gemini/GPT)</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{aiApiCost}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Platform Infrastructure share</span>
                <span className="font-semibold text-slate-900 dark:text-white">₹{serverCost}</span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                <span>Total Client Cost</span>
                <span className="text-rose-600">₹{totalMonthlyCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Card: Agency Retainer Profit */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">Agency Profit Margin</span>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {marginPercent}% Margin
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-white">
                ₹{monthlyProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                <span className="text-sm font-normal text-emerald-200"> / month</span>
              </div>
              <p className="text-xs text-emerald-200">Net monthly recurring profit from this single client</p>
            </div>

            <div className="pt-3 border-t border-emerald-800/80 space-y-2 text-xs">
              <div className="flex justify-between text-emerald-100">
                <span>1st Year Contract Value:</span>
                <span className="font-bold text-white">₹{firstYearValue.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>1st Year Net Profit:</span>
                <span className="font-bold text-emerald-300">₹{firstYearProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
