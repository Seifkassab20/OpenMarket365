'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, SubscriptionItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminSubscriptionsPage() {
  const { addToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [approveModalItem, setApproveModalItem] = useState<SubscriptionItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<SubscriptionItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await adminService.getSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve subscriptions from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchSearch =
        !search ||
        s.subscription_code.toLowerCase().includes(search.toLowerCase()) ||
        (s.payment_reference && s.payment_reference.toLowerCase().includes(search.toLowerCase())) ||
        (s.companies?.company_name_en &&
          s.companies.company_name_en.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || s.subscription_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [subscriptions, search, statusFilter]);

  const handleApprove = async (sub: SubscriptionItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.approveSubscription(sub.id);
      if (success) {
        addToast(
          'success',
          `Bank wire approved! Plan ${sub.subscription_code} is now ACTIVE.`
        );
        setSubscriptions((prev) =>
          prev.map((item) =>
            item.id === sub.id ? { ...item, subscription_status: 'ACTIVE' } : item
          )
        );
      }
    } catch (err) {
      addToast('error', 'Approval failed');
    } finally {
      setActionLoading(false);
      setApproveModalItem(null);
    }
  };

  const handleReject = async (sub: SubscriptionItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.rejectSubscription(sub.id);
      if (success) {
        addToast('warning', `Payment rejected for plan ${sub.subscription_code}`);
        setSubscriptions((prev) =>
          prev.map((item) =>
            item.id === sub.id ? { ...item, subscription_status: 'SUSPENDED' } : item
          )
        );
      }
    } catch (err) {
      addToast('error', 'Rejection failed');
    } finally {
      setActionLoading(false);
      setRejectModalItem(null);
    }
  };

  const pendingWireCount = subscriptions.filter(
    (s) => s.subscription_status === 'PENDING_PAYMENT'
  ).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Offline Bank Wire & Fawry Payment Ledger
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Audit bank deposit slips, swift transfers, and Fawry reference numbers to activate exporter subscription quotas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#c38b40]/15 border border-[#c38b40]/30 px-3 py-1.5 text-xs font-semibold text-[#9b6820] shadow-sm">
            Pending Wires: <AnimatedCounter end={pendingWireCount} />
          </span>
          <span className="rounded-lg bg-emerald-700/10 border border-emerald-700/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
            Active Plans: <AnimatedCounter end={subscriptions.length - pendingWireCount} />
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
              placeholder="Search by company, Swift reference, or plan code..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
            >
              <option value="ALL">All Payment States</option>
              <option value="PENDING_PAYMENT">PENDING AUDIT</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="SUSPENDED">SUSPENDED</option>
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
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Exporter Enterprise</th>
                    <th className="px-3 py-3.5 font-semibold">Plan Code</th>
                    <th className="px-3 py-3.5 font-semibold">Amount & Currency</th>
                    <th className="px-3 py-3.5 font-semibold">Payment Details</th>
                    <th className="px-3 py-3.5 font-semibold">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Ledger Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredSubscriptions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No matching subscription payments found.
                      </td>
                    </tr>
                  ) : (
                    filteredSubscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Exporter */}
                        <td className="py-3.5 pl-6 pr-3 font-semibold text-[#202522]">
                          {sub.companies?.company_name_en || 'Al-Ahram Agro Export'}
                        </td>

                        {/* Plan */}
                        <td className="px-3 py-3.5">
                          <span className="rounded-md bg-[#eee8dc] px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-800 border border-[#b9aa95]">
                            {sub.subscription_code}
                          </span>
                        </td>

                        {/* Amount */}
                        <td className="px-3 py-3.5 font-mono font-bold text-[#202522]">
                          {sub.amount ? `$${sub.amount.toLocaleString()} ${sub.currency}` : '$1,200 USD'}
                        </td>

                        {/* Payment reference */}
                        <td className="px-3 py-3.5">
                          <div className="font-mono text-[#c38b40] font-semibold">
                            {sub.payment_method || 'BANK_WIRE'}: {sub.payment_reference || 'CIB-EGY-98214'}
                          </div>
                          {sub.payment_notes && (
                            <div className="text-[10px] text-[#70695f]">
                              {sub.payment_notes}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              sub.subscription_status === 'ACTIVE'
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : sub.subscription_status === 'PENDING_PAYMENT'
                                ? 'bg-[#c38b40]/15 text-[#9b6820] border border-[#c38b40]/30'
                                : 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {sub.subscription_status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {sub.subscription_status !== 'ACTIVE' && (
                              <button
                                onClick={() => setApproveModalItem(sub)}
                                className="rounded-md bg-emerald-700/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-700/20 border border-emerald-700/20 transition-colors"
                              >
                                Approve Wire
                              </button>
                            )}

                            {sub.subscription_status !== 'SUSPENDED' && (
                              <button
                                onClick={() => setRejectModalItem(sub)}
                                className="rounded-md bg-rose-700/10 px-2.5 py-1 text-[11px] font-semibold text-rose-800 hover:bg-rose-700/20 border border-rose-700/20 transition-colors"
                              >
                                Reject
                              </button>
                            )}
                          </div>
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

      {/* Approve Modal */}
      <ConfirmationModal
        isOpen={!!approveModalItem}
        title="Approve Bank Wire Payment"
        message={`Confirm receipt of ${approveModalItem?.amount ? `$${approveModalItem.amount}` : 'subscription fee'} for ${approveModalItem?.companies?.company_name_en || 'Exporter'}? Their quota will be activated immediately.`}
        confirmText="Approve Payment"
        confirmVariant="primary"
        isLoading={actionLoading}
        onConfirm={() => approveModalItem && handleApprove(approveModalItem)}
        onCancel={() => setApproveModalItem(null)}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={!!rejectModalItem}
        title="Reject Payment Receipt"
        message={`Are you sure you want to reject payment for ${rejectModalItem?.companies?.company_name_en}? The company will be notified to re-submit proof of deposit.`}
        confirmText="Reject Payment"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={() => rejectModalItem && handleReject(rejectModalItem)}
        onCancel={() => setRejectModalItem(null)}
      />
    </div>
  );
}
