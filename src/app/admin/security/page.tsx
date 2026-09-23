'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  ShieldAlert,
  ShieldCheck,
  Bot,
  Eye,
  AlertTriangle,
  Lock,
  RefreshCw,
  Ban,
  Activity,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';

export default function AdminSecurityPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [botModeActive, setBotModeActive] = useState(true);

  // Honeytoken tripwire records
  const [honeytokens, setHoneytokens] = useState([
    {
      id: 'ht-01',
      decoyName: 'Al-Farah Nile Trading Est. (Synthetic Decoy)',
      commodity: 'Valencia Oranges · Premium Grade',
      decoyPhone: '+20 109 000 8899',
      triggeredCount: 3,
      lastAccessIp: '185.220.101.44 (Scraper Botnet Exit Node)',
      status: 'TRIPPED & BLOCKED',
      timestamp: '2 hours ago',
    },
    {
      id: 'ht-02',
      decoyName: 'Delta Royal Herbs & Botanical (Synthetic Decoy)',
      commodity: 'Organic Chamomile Fine Cut',
      decoyPhone: '+20 112 000 7711',
      triggeredCount: 0,
      lastAccessIp: 'None (Dormant)',
      status: 'MONITORING',
      timestamp: 'Active since 2026-03-01',
    },
  ]);

  // Rate-limited accounts
  const [rateLimitedBuyers, setRateLimitedBuyers] = useState([
    {
      id: 'usr-bot-01',
      email: 'crawler_bot@global-food-scraping.biz',
      company: 'Automated Crawler Agent',
      revealsToday: 51,
      maxQuota: 50,
      status: 'AUTO_BLOCKED_RATE_LIMIT',
      flaggedAt: 'Today, 14:22',
    },
    {
      id: 'usr-buyer-02',
      email: 'procurement@nordic-citrus-import.se',
      company: 'Nordic Citrus AB',
      revealsToday: 48,
      maxQuota: 50,
      status: 'WARNING_NEAR_LIMIT',
      flaggedAt: 'Today, 17:05',
    },
  ]);

  const handleResetLimit = (id: string, email: string) => {
    setRateLimitedBuyers((prev) =>
      prev.map((b) => (b.id === id ? { ...b, revealsToday: 0, status: 'RESET_CLEARED' } : b))
    );
    addToast('success', `Reset contact reveal quota for ${email}`);
  };

  const handleInjectHoneytoken = () => {
    addToast('info', 'Injected new synthetic decoy record with canary tracking phone number.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#9b452f] text-white rounded-xs font-mono">
              SECURITY & ANTI-SCRAPING · FR-SEC-001
            </span>
            <span className="text-xs text-[#70695f] font-mono">Vercel Edge Firewall & Honeytokens</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            Directory Protection & Threat Defense
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Enforce 50-reveal/day rate limits, monitor synthetic canary honeytokens, and prevent competitor directory theft.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setBotModeActive(!botModeActive);
              addToast('info', `Cloudflare Bot Fight Mode ${!botModeActive ? 'Activated' : 'Suspended'}`);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
              botModeActive
                ? 'bg-[#596348] text-white hover:bg-[#48503a]'
                : 'bg-[#9b452f] text-white hover:bg-[#833824]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Bot Fight Mode: {botModeActive ? 'ACTIVE' : 'DISABLED'}</span>
          </button>
        </div>
      </div>

      {/* 4 Telemetry Defense Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Daily Contact Reveals
            </span>
            <Eye className="w-4 h-4 text-[#596348]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">284 / 1,500</div>
          <div className="text-[10px] text-[#596348] font-bold">19% of network cap utilized</div>
        </div>

        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Rate-Limited Accounts
            </span>
            <Ban className="w-4 h-4 text-[#9b452f]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#9b452f]">
            {rateLimitedBuyers.filter((b) => b.revealsToday >= b.maxQuota).length} Blocked
          </div>
          <div className="text-[10px] text-[#70695f] font-mono">Exceeded 50 reveals/day limit</div>
        </div>

        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Canary Honeytokens
            </span>
            <ShieldAlert className="w-4 h-4 text-[#c38b40]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">{honeytokens.length} Injected</div>
          <div className="text-[10px] text-[#9b452f] font-bold">1 Tripwire trigger logged</div>
        </div>

        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider font-mono">
              Edge Bot Challenges
            </span>
            <Activity className="w-4 h-4 text-[#202522]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#202522]">1,420</div>
          <div className="text-[10px] text-[#596348] font-bold">99.8% scrapers deflected</div>
        </div>
      </div>

      {/* Section 1: Rate-Limiting Protection (50 reveals/day) */}
      <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-[#b9aa95]/60 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#70695f]">
              PER-ACCOUNT QUOTA DEFENSE · NFR-SEC-02
            </span>
            <h2 className="text-xl font-serif font-bold text-[#202522]">
              Active Contact Reveal Rate Limits
            </h2>
            <p className="text-xs text-[#565047]">
              Enforces a strict ceiling of 50 supplier contact unmasks per day per verified importer account to halt mass harvesting.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#dfd4c1] border-b border-[#b9aa95] text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f]">
              <tr>
                <th className="py-3 px-4">Buyer Account</th>
                <th className="py-3 px-4">Company Entity</th>
                <th className="py-3 px-4">Today Reveals</th>
                <th className="py-3 px-4">Quota Status</th>
                <th className="py-3 px-4 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/40 font-mono">
              {rateLimitedBuyers.map((b) => (
                <tr key={b.id} className="hover:bg-[#dfd4c1]/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#202522]">{b.email}</td>
                  <td className="py-3 px-4 font-sans text-[#565047]">{b.company}</td>
                  <td className="py-3 px-4">
                    <span className={b.revealsToday >= b.maxQuota ? 'text-[#9b452f] font-bold' : 'text-[#202522]'}>
                      {b.revealsToday} / {b.maxQuota}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'AUTO_BLOCKED_RATE_LIMIT'
                          ? 'bg-rose-700/15 text-rose-800 border border-rose-700/30'
                          : b.status === 'WARNING_NEAR_LIMIT'
                          ? 'bg-amber-600/15 text-amber-800 border border-amber-600/30'
                          : 'bg-emerald-700/15 text-emerald-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleResetLimit(b.id, b.email)}
                      className="px-2.5 py-1 bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-[10px] font-bold uppercase rounded transition-colors"
                    >
                      Reset Quota
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: Synthetic Honeytokens Directory Defense */}
      <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] overflow-hidden shadow-sm space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#b9aa95]/60 pb-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#9b452f]">
              CANARY DEFENSE · LEGAL PROOF OF THEFT
            </span>
            <h2 className="text-xl font-serif font-bold text-[#202522]">
              Synthetic Honeytoken Exporter Records
            </h2>
            <p className="text-xs text-[#565047]">
              Fictitious decoy records inserted into the directory with traceable canary phone numbers to legally prove database infringement.
            </p>
          </div>

          <button
            onClick={handleInjectHoneytoken}
            className="px-3.5 py-2 bg-[#202522] hover:bg-[#9b452f] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
          >
            + Deploy Canary Decoy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {honeytokens.map((ht) => (
            <div
              key={ht.id}
              className="p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#b9aa95]/40 pb-2">
                <div>
                  <h3 className="font-serif font-bold text-sm text-[#202522]">{ht.decoyName}</h3>
                  <div className="text-[11px] text-[#70695f] font-mono">{ht.commodity}</div>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                    ht.status.includes('TRIPPED')
                      ? 'bg-rose-700 text-white'
                      : 'bg-[#596348] text-white'
                  }`}
                >
                  {ht.status}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-[#565047]">
                <div className="flex justify-between">
                  <span>Canary Phone:</span>
                  <strong className="text-[#9b452f]">{ht.decoyPhone}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Triggers Logged:</span>
                  <strong className="text-[#202522]">{ht.triggeredCount} attempts</strong>
                </div>
                <div className="flex justify-between">
                  <span>Last Source IP:</span>
                  <strong className="text-[#202522]">{ht.lastAccessIp}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
