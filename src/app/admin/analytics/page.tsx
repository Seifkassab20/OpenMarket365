'use client';

import React, { useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import ChartContainer, { DataPoint } from '@/components/admin/ChartContainer';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const tradeVolumeData: DataPoint[] = [
    { label: 'Jan', value: 420 },
    { label: 'Feb', value: 680 },
    { label: 'Mar', value: 920 },
    { label: 'Apr', value: 1140 },
    { label: 'May', value: 1480 },
    { label: 'Jun', value: 1820 },
  ];

  const commodityShareData: DataPoint[] = [
    { label: 'Valencia Oranges', value: 1850 },
    { label: 'Red Onions', value: 1240 },
    { label: 'Table Grapes', value: 890 },
    { label: 'Pomegranates', value: 620 },
    { label: 'Medjool Dates', value: 410 },
  ];

  const destinationShareData: DataPoint[] = [
    { label: 'GCC (Saudi, UAE, Kuwait)', value: 42, secondaryValue: 38 },
    { label: 'European Union (NLD, DEU)', value: 34, secondaryValue: 32 },
    { label: 'United Kingdom', value: 14, secondaryValue: 16 },
    { label: 'East Asia & Africa', value: 10, secondaryValue: 14 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Trade Analytics & Intelligence Desk
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Macro commodity flow, port throughput, price realization, and buyer destination indices.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center rounded-lg bg-[#e4dac9] p-1 border border-[#b9aa95] shadow-sm">
          {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                timeRange === r
                  ? 'bg-[#9b452f] text-white shadow-sm'
                  : 'text-[#70695f] hover:text-[#202522]'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Platform Trade GMV"
          value={3480000}
          prefix="$"
          change="+18.4%"
          changeType="positive"
          delayMs={50}
          icon={
            <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="Facilitated B2B transactions"
        />

        <StatCard
          title="Gross Cargo Exported"
          value={4820}
          suffix=" MT"
          change="+12.1%"
          changeType="positive"
          delayMs={100}
          icon={
            <svg className="w-5 h-5 text-[#c38b40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          description="FCL containers shipped"
        />

        <StatCard
          title="Average Deal Cycle"
          value="6.4 Days"
          change="-1.2 Days"
          changeType="positive"
          delayMs={150}
          icon={
            <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="RFQ posting to award"
        />

        <StatCard
          title="Exporter Retention Rate"
          value="94.2%"
          change="+3.2%"
          changeType="positive"
          delayMs={200}
          icon={
            <svg className="w-5 h-5 text-[#9b452f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="Annual subscription renewals"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="Gross Trade Realization ($ in Thousands)"
          subtitle="Cumulative transaction value over time"
          data={tradeVolumeData}
          type="area"
          primaryColor="#9b452f"
          primaryLabel="Trade GMV ($k)"
          delayMs={150}
        />

        <ChartContainer
          title="Top Exported Commodities (Metric Tons)"
          subtitle="Egyptian agricultural category shipment breakdown"
          data={commodityShareData}
          type="bar"
          primaryColor="#c38b40"
          primaryLabel="Volume (MT)"
          delayMs={200}
        />
      </div>

      {/* Conversion Funnel */}
      <ScrollReveal delayMs={250}>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#202522]">
            Procurement Conversion Pipeline
          </h3>
          <p className="text-xs text-[#70695f] mt-0.5">
            Conversion stages from initial portal visitor to executed letter of credit
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="rounded-lg bg-[#eee8dc] p-4 border border-[#b9aa95] text-center">
              <span className="text-[10px] text-[#70695f] uppercase font-bold">1. Visitors</span>
              <div className="text-xl font-bold text-[#202522] mt-1">14,200</div>
              <span className="text-[10px] text-emerald-800 font-medium">100% baseline</span>
            </div>

            <div className="rounded-lg bg-[#eee8dc] p-4 border border-[#b9aa95] text-center">
              <span className="text-[10px] text-[#70695f] uppercase font-bold">2. Showroom View</span>
              <div className="text-xl font-bold text-[#202522] mt-1">4,890</div>
              <span className="text-[10px] text-emerald-800 font-medium">34.4% of total</span>
            </div>

            <div className="rounded-lg bg-[#eee8dc] p-4 border border-[#b9aa95] text-center">
              <span className="text-[10px] text-[#70695f] uppercase font-bold">3. RFQs Posted</span>
              <div className="text-xl font-bold text-[#c38b40] mt-1">840</div>
              <span className="text-[10px] text-[#c38b40] font-medium">17.2% conversion</span>
            </div>

            <div className="rounded-lg bg-[#eee8dc] p-4 border border-[#b9aa95] text-center">
              <span className="text-[10px] text-[#70695f] uppercase font-bold">4. Sealed Quotes</span>
              <div className="text-xl font-bold text-emerald-800 mt-1">2,310</div>
              <span className="text-[10px] text-emerald-800 font-medium">2.75 quotes / RFQ</span>
            </div>

            <div className="rounded-lg bg-[#eee8dc] p-4 border border-[#b9aa95] text-center">
              <span className="text-[10px] text-[#70695f] uppercase font-bold">5. Deal Awarded</span>
              <div className="text-xl font-bold text-emerald-800 mt-1">420</div>
              <span className="text-[10px] text-emerald-800 font-medium">50% tender fill</span>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
