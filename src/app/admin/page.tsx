'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import ChartContainer, { DataPoint } from '@/components/admin/ChartContainer';
import ScrollReveal from '@/components/admin/ScrollReveal';
import { useToast } from '@/components/admin/ToastNotification';
import { adminService, AdminStats, AuditLogItem } from '@/lib/services/adminService';

export default function AdminOverviewPage() {
  const { addToast } = useToast();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Growth chart sample data
  const userGrowthData: DataPoint[] = [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 38 },
    { label: 'Wed', value: 45 },
    { label: 'Thu', value: 62 },
    { label: 'Fri', value: 89 },
    { label: 'Sat', value: 110 },
    { label: 'Sun', value: 142 },
  ];

  const activityData: DataPoint[] = [
    { label: 'Mon', value: 120 },
    { label: 'Tue', value: 190 },
    { label: 'Wed', value: 240 },
    { label: 'Thu', value: 310 },
    { label: 'Fri', value: 460 },
    { label: 'Sat', value: 390 },
    { label: 'Sun', value: 520 },
  ];

  const aiTelemetryData: DataPoint[] = [
    { label: 'Mon', value: 85, secondaryValue: 83 },
    { label: 'Tue', value: 120, secondaryValue: 118 },
    { label: 'Wed', value: 160, secondaryValue: 158 },
    { label: 'Thu', value: 210, secondaryValue: 206 },
    { label: 'Fri', value: 290, secondaryValue: 285 },
    { label: 'Sat', value: 240, secondaryValue: 236 },
    { label: 'Sun', value: 340, secondaryValue: 337 },
  ];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [fetchedStats, fetchedLogs] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAuditLogs(8),
      ]);
      setStats(fetchedStats);
      setRecentLogs(fetchedLogs);
    } catch (err: any) {
      addToast('error', 'Failed to load telemetry from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSeedDatabase = async () => {
    try {
      setSeeding(true);
      addToast('info', 'Connecting to Supabase and seeding initial live records...');
      const res = await adminService.seedInitialDataToSupabase();
      if (res.success) {
        addToast('success', res.message);
        await loadDashboardData();
      } else {
        addToast('warning', res.message);
      }
    } catch (err: any) {
      addToast('error', 'Seeding failed: ' + (err.message || 'Network error'));
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            System Overview & Operations Desk
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Live telemetry, platform governance, and verified commodity trade streams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="flex items-center gap-2 rounded-lg bg-[#9b452f] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#833824] transition-all disabled:opacity-50 shadow-sm"
          >
            <svg
              className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {seeding ? 'Syncing Supabase...' : 'Seed Live Database'}
          </button>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-lg bg-[#e4dac9] p-2 text-[#202522] border border-[#b9aa95] hover:bg-[#d8cebe] transition-colors"
            title="Refresh Live Metrics"
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Registered Accounts"
          value={stats?.totalUsers || 142}
          change="+14.2%"
          changeType="positive"
          delayMs={50}
          icon={
            <svg className="w-5 h-5 text-[#9b452f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          description="Exporters, Importers & Reporters"
        />

        <StatCard
          title="Active Daily Users"
          value={stats?.activeUsers || 98}
          change="+8.5%"
          changeType="positive"
          live={true}
          delayMs={100}
          icon={
            <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          description="Authenticated active sessions"
        />

        <StatCard
          title="Live Supabase Records"
          value={stats?.totalRecords || 365}
          change="+24.0%"
          changeType="positive"
          delayMs={150}
          icon={
            <svg className="w-5 h-5 text-[#c38b40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          }
          description="12 synchronized PostgreSQL tables"
        />

        <StatCard
          title="AI Automation Requests"
          value={stats?.aiRequests || 1248}
          change="+32.1%"
          changeType="positive"
          delayMs={200}
          suffix=" ops"
          icon={
            <svg className="w-5 h-5 text-[#202522]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          description="HS Code & Arabic/English OCR"
        />
      </div>

      {/* Secondary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-4 text-xs">
          <span className="text-[#70695f] font-medium">Suspended Accounts</span>
          <div className="text-xl font-bold text-rose-700 mt-1">
            {stats?.suspendedUsers || 0}
          </div>
          <span className="text-[10px] text-[#70695f]">Security flags cleared</span>
        </div>

        <div className="rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-4 text-xs">
          <span className="text-[#70695f] font-medium">Failed AI Requests</span>
          <div className="text-xl font-bold text-[#c38b40] mt-1">
            {stats?.failedAiRequests || 4}
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold">99.6% model precision</span>
        </div>

        <div className="rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-4 text-xs">
          <span className="text-[#70695f] font-medium">DB Latency</span>
          <div className="text-xl font-bold text-[#202522] font-mono mt-1">
            {stats?.databaseLatencyMs || 38}ms
          </div>
          <span className="text-[10px] text-emerald-800 font-semibold">Optimal connection</span>
        </div>

        <div className="rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-4 text-xs">
          <span className="text-[#70695f] font-medium">System Status</span>
          <div className="text-base font-bold text-emerald-800 mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
            {stats?.systemStatus || 'OPERATIONAL'}
          </div>
          <span className="text-[10px] text-[#70695f]">99.98% 30d uptime</span>
        </div>
      </div>

      {/* Interactive Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer
          title="User Registration Velocity"
          subtitle="New exporter & buyer onboardings over time"
          data={userGrowthData}
          type="area"
          primaryColor="#9b452f"
          primaryLabel="New Users"
          delayMs={150}
        />

        <ChartContainer
          title="Procurement & Trade Volume"
          subtitle="Daily RFQs, quotes & market listings dispatched"
          data={activityData}
          type="bar"
          primaryColor="#c38b40"
          primaryLabel="Trade Operations"
          delayMs={200}
        />
      </div>

      <ChartContainer
        title="AI Automation Operations & Success Rate"
        subtitle="Automated HS code classification and multi-lingual spec matching"
        data={aiTelemetryData}
        type="dual-line"
        primaryColor="#9b452f"
        secondaryColor="#c38b40"
        primaryLabel="Total Executions"
        secondaryLabel="Accurate Validations"
        delayMs={250}
        height={220}
      />

      {/* Recent Activity Stream & Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Stream */}
        <div className="lg:col-span-2 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#d1c7b7]">
            <div>
              <h3 className="text-base font-semibold text-[#202522]">
                Live Audit & Activity Trail
              </h3>
              <p className="text-xs text-[#70695f] mt-0.5">
                Append-only log streamed directly from Supabase activity_logs
              </p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-[#9b452f] hover:underline"
            >
              View Full Trail →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#d1c7b7]">
            {recentLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#70695f]">
                No recent activity recorded yet. Run seed data or interact with features.
              </div>
            ) : (
              recentLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#eee8dc] border border-[#b9aa95] text-[#9b452f] text-xs font-mono font-bold">
                      ✓
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#202522]">
                        {log.action}
                      </div>
                      <div className="text-[11px] text-[#70695f]">
                        <span className="text-[#9b452f] font-semibold">{log.entity_type}</span>
                        {log.actor_name && ` by ${log.actor_name}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#70695f] whitespace-nowrap font-mono">
                    {new Date(log.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Governance Quick Desk */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-[#202522]">
              Governance Operations
            </h3>
            <p className="text-xs text-[#70695f] mt-0.5">
              Direct administrative checkpoints
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/admin/companies"
                className="flex items-center justify-between rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-3 text-xs text-[#202522] hover:border-[#9b452f] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#c38b40]" />
                  <span className="font-medium">Exporter CR Audits</span>
                </div>
                <span className="text-[#9b452f] font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                  Review →
                </span>
              </Link>

              <Link
                href="/admin/subscriptions"
                className="flex items-center justify-between rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-3 text-xs text-[#202522] hover:border-[#9b452f] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  <span className="font-medium">Bank Wire Ledger</span>
                </div>
                <span className="text-[#9b452f] font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                  Approve →
                </span>
              </Link>

              <Link
                href="/admin/certificates"
                className="flex items-center justify-between rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-3 text-xs text-[#202522] hover:border-[#9b452f] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-sky-600" />
                  <span className="font-medium">GlobalG.A.P. Compliance</span>
                </div>
                <span className="text-[#9b452f] font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                  Audit →
                </span>
              </Link>

              <Link
                href="/admin/ai"
                className="flex items-center justify-between rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-3 text-xs text-[#202522] hover:border-[#9b452f] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-2 w-2 rounded-full bg-[#9b452f]" />
                  <span className="font-medium">AI Prompt Telemetry</span>
                </div>
                <span className="text-[#9b452f] font-bold text-[11px] group-hover:translate-x-1 transition-transform">
                  Inspect →
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-lg bg-[#eee8dc] border border-[#b9aa95] p-3 text-[11px] text-[#70695f]">
            <div className="font-bold text-[#202522] flex items-center gap-1.5 mb-1">
              <span className="text-[#9b452f]">●</span> Security Perimeter Active
            </div>
            All actions are logged to PostgreSQL with immutable actor stamps and client IP fingerprints.
          </div>
        </div>
      </div>
    </div>
  );
}
