'use client';

import React, { useEffect, useState, useMemo } from 'react';
import StatCard from '@/components/admin/StatCard';
import ChartContainer, { DataPoint } from '@/components/admin/ChartContainer';
import { adminService, AiLogItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminAiMonitoringPage() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState<AiLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [featureFilter, setFeatureFilter] = useState('ALL');

  const aiHourlyData: DataPoint[] = [
    { label: '00:00', value: 42, secondaryValue: 42 },
    { label: '04:00', value: 18, secondaryValue: 18 },
    { label: '08:00', value: 124, secondaryValue: 122 },
    { label: '12:00', value: 290, secondaryValue: 288 },
    { label: '16:00', value: 340, secondaryValue: 338 },
    { label: '20:00', value: 180, secondaryValue: 178 },
  ];

  const fetchAiData = async () => {
    try {
      setLoading(true);
      const fetchedLogs = await adminService.getAiLogs();
      setLogs(fetchedLogs);
    } catch (err) {
      addToast('error', 'Failed to retrieve AI telemetry');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAiData();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        !search ||
        l.input_text.toLowerCase().includes(search.toLowerCase()) ||
        l.output_result.toLowerCase().includes(search.toLowerCase());

      const matchFeature = featureFilter === 'ALL' || l.feature === featureFilter;
      return matchSearch && matchFeature;
    });
  }, [logs, search, featureFilter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            AI & Automation Telemetry Desk
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Monitor machine learning classifiers, OCR pipelines, and multi-lingual trade translators in real time.
          </p>
        </div>

        <button
          onClick={fetchAiData}
          className="flex items-center gap-2 rounded-lg bg-[#9b452f] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#833824] transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Telemetry
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total AI Invocations"
          value={1248}
          change="+32.1%"
          changeType="positive"
          delayMs={50}
          icon={
            <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
          description="Inference queries this month"
        />

        <StatCard
          title="Model Precision Rate"
          value="99.4%"
          change="+0.3%"
          changeType="positive"
          delayMs={100}
          icon={
            <svg className="w-5 h-5 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="Confidence over threshold"
        />

        <StatCard
          title="Average Inference Latency"
          value="182 ms"
          change="-14 ms"
          changeType="positive"
          delayMs={150}
          icon={
            <svg className="w-5 h-5 text-[#c38b40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="End-to-end API turnaround"
        />

        <StatCard
          title="Automation Savings"
          value={482}
          prefix="$"
          change="+28.4%"
          changeType="positive"
          delayMs={200}
          icon={
            <svg className="w-5 h-5 text-[#9b452f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          description="Manual audit hours eliminated"
        />
      </div>

      {/* Real-time Telemetry Chart */}
      <ChartContainer
        title="Hourly AI Invocations & Accuracy Ratio"
        subtitle="Live automated classification runs over 24 hours"
        data={aiHourlyData}
        type="dual-line"
        primaryColor="#9b452f"
        secondaryColor="#c38b40"
        primaryLabel="Total Executions"
        secondaryLabel="Accurate Validations"
        delayMs={150}
        height={220}
      />

      {/* Filterable Log Table */}
      <ScrollReveal delayMs={200}>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#b9aa95] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#202522]">
                Automated Prompt & Inference Log
              </h3>
              <p className="text-xs text-[#70695f]">
                Detailed input payloads and predicted classifications
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompt payload or output..."
                className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3 py-1.5 text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
              />

              <select
                value={featureFilter}
                onChange={(e) => setFeatureFilter(e.target.value)}
                className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3 py-1.5 text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
              >
                <option value="ALL">All Models</option>
                <option value="HS_CODE_CLASSIFIER">HS Code Classifier</option>
                <option value="SPEC_TRANSLATOR">Spec Translator</option>
                <option value="LEAD_MATCHER">Lead Matcher</option>
              </select>
            </div>
          </div>

          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Model / Pipeline</th>
                    <th className="px-3 py-3.5 font-semibold">Input Payload</th>
                    <th className="px-3 py-3.5 font-semibold">Inferred Output</th>
                    <th className="px-3 py-3.5 font-semibold">Confidence</th>
                    <th className="px-3 py-3.5 font-semibold">Latency</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#eae1d3] transition-colors">
                      {/* Model */}
                      <td className="py-3.5 pl-6 pr-3 font-mono text-[11px] font-semibold text-[#9b452f]">
                        {log.feature}
                      </td>

                      {/* Input */}
                      <td className="px-3 py-3.5 max-w-xs truncate text-[#202522]">
                        {log.input_text}
                      </td>

                      {/* Output */}
                      <td className="px-3 py-3.5 font-semibold text-[#202522]">
                        {log.output_result}
                      </td>

                      {/* Confidence */}
                      <td className="px-3 py-3.5 font-mono text-emerald-800">
                        {log.confidence_score}%
                      </td>

                      {/* Latency */}
                      <td className="px-3 py-3.5 font-mono text-[#70695f]">
                        {log.latency_ms}ms
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pl-3 pr-6 text-right">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            log.status === 'SUCCESS'
                              ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                              : 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
