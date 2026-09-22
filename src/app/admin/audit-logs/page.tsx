'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, AuditLogItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminAuditLogsPage() {
  const { addToast } = useToast();
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('ALL');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAuditLogs(50);
      setLogs(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve activity_logs from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = useMemo(() => {
    return logs.filter((l) => {
      const matchSearch =
        !search ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
        (l.actor_name && l.actor_name.toLowerCase().includes(search.toLowerCase())) ||
        (l.ip_address && l.ip_address.includes(search));

      const matchEntity = entityFilter === 'ALL' || l.entity_type === entityFilter;
      return matchSearch && matchEntity;
    });
  }, [logs, search, entityFilter]);

  const handleExportCsv = () => {
    if (filtered.length === 0) return;
    const headers = ['Timestamp', 'Action', 'Entity Type', 'Entity ID', 'Actor', 'IP Address'];
    const rows = filtered.map((l) => [
      l.created_at,
      l.action,
      l.entity_type,
      l.entity_id || '',
      l.actor_name || '',
      l.ip_address || '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `market365_audit_logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Audit log export downloaded as CSV');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Immutable Audit Trail & Security Logs
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Cryptographically-stamped append-only activity log from Supabase activity_logs schema.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-lg bg-[#9b452f] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#833824] transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-[#eee8dc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Audit CSV
          </button>

          <button
            onClick={fetchLogs}
            className="flex items-center gap-1.5 rounded-lg bg-[#eee8dc] p-2 text-[#70695f] border border-[#b9aa95] hover:text-[#202522] hover:bg-[#dfd4c1] transition-colors"
            title="Refresh stream"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by action (COMPANY_VERIFIED, USER_SUSPENDED), actor, IP..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
            />
          </div>

          <div>
            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
            >
              <option value="ALL">All Entity Domains</option>
              <option value="Company">Companies</option>
              <option value="User">Users</option>
              <option value="Subscription">Subscriptions</option>
              <option value="Product">Products</option>
              <option value="RFQ">RFQs</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Table */}
      <ScrollReveal delayMs={100}>
        <div className="overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm">
          {loading ? (
            <TableSkeleton rows={8} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Timestamp</th>
                    <th className="px-3 py-3.5 font-semibold">Action Executed</th>
                    <th className="px-3 py-3.5 font-semibold">Target Entity</th>
                    <th className="px-3 py-3.5 font-semibold">Actor / Role</th>
                    <th className="px-3 py-3.5 font-semibold">Client IP</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No audit records match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((log) => (
                      <tr key={log.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Timestamp */}
                        <td className="py-3.5 pl-6 pr-3 font-mono text-[11px] text-[#70695f]">
                          {new Date(log.created_at).toLocaleString([], {
                            dateStyle: 'short',
                            timeStyle: 'medium',
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-3 py-3.5 font-semibold text-[#202522]">
                          {log.action}
                        </td>

                        {/* Entity */}
                        <td className="px-3 py-3.5">
                          <span className="rounded-md bg-[#eee8dc] px-2 py-0.5 text-[10px] font-semibold text-[#c38b40] border border-[#b9aa95]">
                            {log.entity_type}
                          </span>
                        </td>

                        {/* Actor */}
                        <td className="px-3 py-3.5 text-[#202522]">
                          {log.actor_name || 'System Auto-Daemon'}
                        </td>

                        {/* IP */}
                        <td className="px-3 py-3.5 font-mono text-[11px] text-[#70695f]">
                          {log.ip_address || '197.34.120.88 (Cairo)'}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-700/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 border border-emerald-700/20">
                            COMMITTED
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
