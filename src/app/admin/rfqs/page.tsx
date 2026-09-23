'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, RfqItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminRfqsPage() {
  const { addToast } = useToast();
  const [rfqs, setRfqs] = useState<RfqItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchRfqs = async () => {
    try {
      setLoading(true);
      const data = await adminService.getRfqs();
      setRfqs(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve RFQs from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, []);

  const filteredRfqs = useMemo(() => {
    return rfqs.filter((r) => {
      const matchSearch =
        !search ||
        (r.destination_port && r.destination_port.toLowerCase().includes(search.toLowerCase())) ||
        (r.destination_country_code &&
          r.destination_country_code.toLowerCase().includes(search.toLowerCase())) ||
        (r.incoterm && r.incoterm.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || r.rfq_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [rfqs, search, statusFilter]);

  const handleStatusChange = async (rfqId: string, newStatus: any) => {
    try {
      const success = await adminService.updateRfqStatus(rfqId, newStatus);
      if (success) {
        addToast('success', `Tender RFQ status updated to ${newStatus}`);
        setRfqs((prev) =>
          prev.map((r) => (r.id === rfqId ? { ...r, rfq_status: newStatus } : r))
        );
      }
    } catch (err) {
      addToast('error', 'Failed to update RFQ status');
    }
  };

  const openCount = rfqs.filter((r) => r.rfq_status === 'OPEN').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Procurement & Tender RFQs Desk
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Monitor international trade tenders, target destinations, Incoterms, and sealed quote submissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-emerald-700/10 border border-emerald-700/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
            Open Tenders: <AnimatedCounter end={openCount} />
          </span>
          <span className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] px-3 py-1.5 text-xs font-semibold text-[#202522] shadow-sm">
            Total RFQs: <AnimatedCounter end={rfqs.length} />
          </span>
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
              placeholder="Search by destination port (Rotterdam, Jebel Ali), country code, Incoterm..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
            >
              <option value="ALL">All Tender States</option>
              <option value="OPEN">OPEN (ACTIVE)</option>
              <option value="AWARDED">AWARDED</option>
              <option value="CLOSED">CLOSED</option>
              <option value="CANCELLED">CANCEL TENDER</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Table */}
      <ScrollReveal delayMs={100}>
        <div className="overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Tender ID / Buyer</th>
                    <th className="px-3 py-3.5 font-semibold">Required Volume</th>
                    <th className="px-3 py-3.5 font-semibold">Destination Port</th>
                    <th className="px-3 py-3.5 font-semibold">Incoterm</th>
                    <th className="px-3 py-3.5 font-semibold">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredRfqs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No matching procurement RFQs found.
                      </td>
                    </tr>
                  ) : (
                    filteredRfqs.map((rfq) => (
                      <tr key={rfq.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* ID / Buyer */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="font-mono font-semibold text-[#202522]">
                            RFQ-{rfq.id.slice(0, 8).toUpperCase()}
                          </div>
                          <div className="text-[10px] text-[#70695f]">
                            Buyer ID: {rfq.requester_id.slice(0, 8)}
                          </div>
                        </td>

                        {/* Volume */}
                        <td className="px-3 py-3.5 font-semibold text-emerald-800">
                          {rfq.required_quantity} {rfq.quantity_unit || 'MT'}
                        </td>

                        {/* Destination */}
                        <td className="px-3 py-3.5">
                          <div className="font-medium text-[#202522]">
                            {rfq.destination_port || 'Rotterdam Harbor'}
                          </div>
                          <div className="text-[10px] text-[#c38b40] font-mono">
                            Country: {rfq.destination_country_code || 'NLD'}
                          </div>
                        </td>

                        {/* Incoterm */}
                        <td className="px-3 py-3.5">
                          <span className="rounded-md bg-[#eee8dc] px-2 py-0.5 text-[11px] font-mono font-bold text-[#202522] border border-[#b9aa95]">
                            {rfq.incoterm || 'FOB'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              rfq.rfq_status === 'OPEN'
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : rfq.rfq_status === 'AWARDED'
                                ? 'bg-blue-700/10 text-blue-800 border border-blue-700/20'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {rfq.rfq_status}
                          </span>
                        </td>

                        {/* Governance Status Selector */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <select
                            value={rfq.rfq_status}
                            onChange={(e) => handleStatusChange(rfq.id, e.target.value)}
                            className="rounded-md border border-[#b9aa95] bg-[#eee8dc] px-2 py-1 text-[11px] font-semibold text-[#202522] focus:border-[#9b452f] focus:outline-none"
                          >
                            <option value="OPEN">SET OPEN</option>
                            <option value="AWARDED">SET AWARDED</option>
                            <option value="CLOSED">SET CLOSED</option>
                            <option value="CANCELLED">CANCEL TENDER</option>
                          </select>
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
