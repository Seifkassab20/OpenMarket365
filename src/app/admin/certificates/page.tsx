'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, CertificateItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminCertificatesPage() {
  const { addToast } = useToast();
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [approveModalItem, setApproveModalItem] = useState<CertificateItem | null>(null);
  const [rejectModalItem, setRejectModalItem] = useState<CertificateItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCertificates();
      setCertificates(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve certificates from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const filteredCertificates = useMemo(() => {
    return certificates.filter((c) => {
      const matchSearch =
        !search ||
        (c.certificate_name && c.certificate_name.toLowerCase().includes(search.toLowerCase())) ||
        (c.certificate_number && c.certificate_number.toLowerCase().includes(search.toLowerCase())) ||
        (c.companies?.company_name_en &&
          c.companies.company_name_en.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || c.verification_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [certificates, search, statusFilter]);

  const handleApprove = async (cert: CertificateItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.verifyCertificate(cert.id);
      if (success) {
        addToast(
          'success',
          `${cert.certificate_name || 'Certificate'} verified successfully`
        );
        setCertificates((prev) =>
          prev.map((c) => (c.id === cert.id ? { ...c, verification_status: 'VERIFIED' } : c))
        );
      }
    } catch (err) {
      addToast('error', 'Verification failed');
    } finally {
      setActionLoading(false);
      setApproveModalItem(null);
    }
  };

  const handleReject = async (cert: CertificateItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.rejectCertificate(cert.id);
      if (success) {
        addToast('warning', `${cert.certificate_name} rejected`);
        setCertificates((prev) =>
          prev.map((c) => (c.id === cert.id ? { ...c, verification_status: 'REJECTED' } : c))
        );
      }
    } catch (err) {
      addToast('error', 'Rejection failed');
    } finally {
      setActionLoading(false);
      setRejectModalItem(null);
    }
  };

  const pendingCount = certificates.filter((c) => c.verification_status === 'PENDING').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Compliance Vault & Certificate Audits
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Inspect GlobalG.A.P., ISO 22000, BRCGS, and Halal credentials submitted by Egyptian packhouses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#c38b40]/15 border border-[#c38b40]/30 px-3 py-1.5 text-xs font-semibold text-[#9b6820] shadow-sm">
            Pending Audits: <AnimatedCounter end={pendingCount} />
          </span>
          <span className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] px-3 py-1.5 text-xs font-semibold text-[#202522] shadow-sm">
            Total Vault Docs: <AnimatedCounter end={certificates.length} />
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
              placeholder="Search by certificate (GlobalG.A.P, ISO), number, or company..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
            >
              <option value="ALL">All Audit Statuses</option>
              <option value="PENDING">PENDING AUDIT</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="REJECTED">REJECTED</option>
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
                    <th className="px-3 py-3.5 font-semibold">Standard & Certification</th>
                    <th className="px-3 py-3.5 font-semibold">Registration Number</th>
                    <th className="px-3 py-3.5 font-semibold">Validity Window</th>
                    <th className="px-3 py-3.5 font-semibold">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No matching compliance certificates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <tr key={cert.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Company */}
                        <td className="py-3.5 pl-6 pr-3 font-semibold text-[#202522]">
                          {cert.companies?.company_name_en || 'Al-Ahram Agro Export'}
                        </td>

                        {/* Certificate Standard */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-emerald-800">
                            {cert.certificate_name || 'GlobalG.A.P. IFA v6'}
                          </div>
                          {cert.document_url && (
                            <a
                              href={cert.document_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-[#70695f] hover:text-[#202522] underline"
                            >
                              View PDF Document ↗
                            </a>
                          )}
                        </td>

                        {/* Number */}
                        <td className="px-3 py-3.5 font-mono text-[#c38b40]">
                          {cert.certificate_number || 'GGN: 4052852000001'}
                        </td>

                        {/* Validity */}
                        <td className="px-3 py-3.5 text-[#70695f] font-mono text-[11px]">
                          {cert.valid_from ? new Date(cert.valid_from).toLocaleDateString() : '2025-01-01'} →{' '}
                          {cert.valid_to ? new Date(cert.valid_to).toLocaleDateString() : '2026-12-31'}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              cert.verification_status === 'VERIFIED'
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : cert.verification_status === 'PENDING'
                                ? 'bg-[#c38b40]/15 text-[#9b6820] border border-[#c38b40]/30'
                                : 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {cert.verification_status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {cert.verification_status !== 'VERIFIED' && (
                              <button
                                onClick={() => setApproveModalItem(cert)}
                                className="rounded-md bg-emerald-700/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 hover:bg-emerald-700/20 border border-emerald-700/20 transition-colors"
                              >
                                Approve
                              </button>
                            )}

                            {cert.verification_status !== 'REJECTED' && (
                              <button
                                onClick={() => setRejectModalItem(cert)}
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
        title="Approve Compliance Certificate"
        message={`Confirm verification of ${approveModalItem?.certificate_name} (${approveModalItem?.certificate_number})? This will award the verified compliance seal to the exporter.`}
        confirmText="Approve Certificate"
        confirmVariant="primary"
        isLoading={actionLoading}
        onConfirm={() => approveModalItem && handleApprove(approveModalItem)}
        onCancel={() => setApproveModalItem(null)}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={!!rejectModalItem}
        title="Reject Certificate Document"
        message={`Are you sure you want to reject this certificate for ${approveModalItem?.companies?.company_name_en}?`}
        confirmText="Reject"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={() => rejectModalItem && handleReject(rejectModalItem)}
        onCancel={() => setRejectModalItem(null)}
      />
    </div>
  );
}
