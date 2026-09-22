'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, CompanyItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminCompaniesPage() {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [verifyModalCompany, setVerifyModalCompany] = useState<CompanyItem | null>(null);
  const [rejectModalCompany, setRejectModalCompany] = useState<CompanyItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCompanies();
      setCompanies(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve companies from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchSearch =
        !search ||
        c.company_name_en.toLowerCase().includes(search.toLowerCase()) ||
        (c.company_name_ar && c.company_name_ar.includes(search)) ||
        (c.cr_number && c.cr_number.includes(search)) ||
        (c.governorate && c.governorate.toLowerCase().includes(search.toLowerCase()));

      const matchStatus = statusFilter === 'ALL' || c.verification_status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [companies, search, statusFilter]);

  const handleVerify = async (company: CompanyItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.verifyCompany(company.id);
      if (success) {
        addToast('success', `${company.company_name_en} Commercial Registry approved`);
        setCompanies((prev) =>
          prev.map((c) => (c.id === company.id ? { ...c, verification_status: 'VERIFIED' } : c))
        );
      }
    } catch (err) {
      addToast('error', 'Verification failed');
    } finally {
      setActionLoading(false);
      setVerifyModalCompany(null);
    }
  };

  const handleReject = async (company: CompanyItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.rejectCompany(company.id);
      if (success) {
        addToast('warning', `${company.company_name_en} verification rejected`);
        setCompanies((prev) =>
          prev.map((c) => (c.id === company.id ? { ...c, verification_status: 'REJECTED' } : c))
        );
      }
    } catch (err) {
      addToast('error', 'Rejection failed');
    } finally {
      setActionLoading(false);
      setRejectModalCompany(null);
    }
  };

  const pendingCount = companies.filter((c) => c.verification_status === 'PENDING').length;
  const verifiedCount = companies.filter((c) => c.verification_status === 'VERIFIED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            Commercial Registry & Facility Audits
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Review Egyptian packhouse facilities, Aweta optical sorting machinery, and CR tax records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#c38b40]/15 border border-[#c38b40]/30 px-3 py-1.5 text-xs font-bold text-[#9b6820]">
            Pending Audits: <AnimatedCounter end={pendingCount} />
          </span>
          <span className="rounded-lg bg-emerald-700/10 border border-emerald-700/20 px-3 py-1.5 text-xs font-bold text-emerald-800">
            Verified: <AnimatedCounter end={verifiedCount} />
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name (EN/AR), CR number, governorate..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none font-medium"
            >
              <option value="ALL">All Verification Statuses</option>
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
                    <th className="py-3.5 pl-6 pr-3 font-bold">Exporter Facility</th>
                    <th className="px-3 py-3.5 font-bold">CR & Tax ID</th>
                    <th className="px-3 py-3.5 font-bold">Governorate</th>
                    <th className="px-3 py-3.5 font-bold">Facility Specs</th>
                    <th className="px-3 py-3.5 font-bold">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-bold">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No matching exporter facilities found.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Company Name */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="font-bold text-[#202522]">
                            {company.company_name_en}
                          </div>
                          {company.company_name_ar && (
                            <div className="text-[11px] text-[#70695f] font-arabic">
                              {company.company_name_ar}
                            </div>
                          )}
                          <div className="text-[10px] text-[#70695f] mt-0.5 font-mono">
                            {company.company_email || 'No email specified'}
                          </div>
                        </td>

                        {/* CR Number & Tax ID */}
                        <td className="px-3 py-3.5">
                          <div className="font-mono text-[#9b452f] font-bold">
                            CR: {company.cr_number || 'Pending Submission'}
                          </div>
                          <div className="font-mono text-[10px] text-[#70695f]">
                            Tax: {company.tax_id || 'N/A'}
                          </div>
                        </td>

                        {/* Governorate */}
                        <td className="px-3 py-3.5 font-medium text-[#202522]">
                          {company.governorate || 'Sharkia'}
                        </td>

                        {/* Facility specs */}
                        <td className="px-3 py-3.5">
                          <div className="text-[#565047] font-medium">
                            {company.sorting_machinery || 'Aweta Optical Sizer'}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-bold">
                            Cold Store: {company.cold_storage_capacity_ml ? `${company.cold_storage_capacity_ml} MT` : '5,000 MT'}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              company.verification_status === 'VERIFIED'
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : company.verification_status === 'REJECTED'
                                ? 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                                : 'bg-[#c38b40]/15 text-[#9b6820] border border-[#c38b40]/30'
                            }`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {company.verification_status}
                          </span>
                        </td>

                        {/* Audit Actions */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {company.verification_status !== 'VERIFIED' && (
                              <button
                                onClick={() => setVerifyModalCompany(company)}
                                className="rounded-md bg-emerald-700 hover:bg-emerald-800 px-3 py-1 text-[11px] font-bold text-white transition-colors shadow-sm"
                              >
                                Approve CR
                              </button>
                            )}

                            {company.verification_status !== 'REJECTED' && (
                              <button
                                onClick={() => setRejectModalCompany(company)}
                                className="rounded-md bg-[#9b452f] hover:bg-[#833824] px-3 py-1 text-[11px] font-bold text-white transition-colors shadow-sm"
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

      {/* Verify Modal */}
      <ConfirmationModal
        isOpen={!!verifyModalCompany}
        title="Approve Commercial Registry & Facility"
        message={`Confirm verified status for ${verifyModalCompany?.company_name_en}? This enables their public verified exporter badge and allows bidding on tenders.`}
        confirmText="Approve Exporter"
        confirmVariant="primary"
        isLoading={actionLoading}
        onConfirm={() => { if (verifyModalCompany) handleVerify(verifyModalCompany); }}
        onCancel={() => setVerifyModalCompany(null)}
      />

      {/* Reject Modal */}
      <ConfirmationModal
        isOpen={!!rejectModalCompany}
        title="Reject Exporter Verification"
        message={`Are you sure you want to reject ${rejectModalCompany?.company_name_en}? The company will be asked to re-upload clear Commercial Registry documentation.`}
        confirmText="Reject CR"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={() => { if (rejectModalCompany) handleReject(rejectModalCompany); }}
        onCancel={() => setRejectModalCompany(null)}
      />
    </div>
  );
}
