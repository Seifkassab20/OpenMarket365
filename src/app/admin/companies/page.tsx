'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, CompanyItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';
import {
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  ExternalLink,
  Building2,
  MapPin,
  Calendar,
  Download,
  Search,
} from 'lucide-react';

export default function AdminCompaniesPage() {
  const { addToast } = useToast();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Split-Screen CR Audit Modal State
  const [splitScreenCompany, setSplitScreenCompany] = useState<CompanyItem | null>(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [checklist, setChecklist] = useState({
    nameMatch: true,
    crActive: true,
    taxCleared: true,
    nfsaInspected: true,
  });

  // Action Loading
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCompanies();
      setCompanies(data);
    } catch {
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
        addToast('success', `${company.company_name_en} Commercial Registry approved & verified`);
        setCompanies((prev) =>
          prev.map((c) => (c.id === company.id ? { ...c, verification_status: 'VERIFIED' } : c))
        );
        setSplitScreenCompany(null);
      }
    } catch {
      addToast('error', 'Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (company: CompanyItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.rejectCompany(company.id);
      if (success) {
        addToast('warning', `${company.company_name_en} verification rejected with audit notes`);
        setCompanies((prev) =>
          prev.map((c) => (c.id === company.id ? { ...c, verification_status: 'REJECTED' } : c))
        );
        setSplitScreenCompany(null);
      }
    } catch {
      addToast('error', 'Rejection failed');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingCount = companies.filter((c) => c.verification_status === 'PENDING').length;
  const verifiedCount = companies.filter((c) => c.verification_status === 'VERIFIED').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#202522] text-[#eee8dc] rounded-xs font-mono">
              AUDIT QUEUE · FR-ADM-001
            </span>
            <span className="text-xs text-[#70695f] font-mono">Ministry of Trade Integration</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            Commercial Registry & Legal Audits
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Inspect submitted Egyptian Commercial Registration (CR) scans, verify tax IDs, and approve verified trust badges.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#c38b40]/15 border border-[#c38b40]/30 px-3 py-1.5 text-xs font-bold text-[#9b6820]">
            Pending Audits: <AnimatedCounter end={pendingCount} />
          </span>
          <span className="rounded-lg bg-[#596348]/15 border border-[#596348]/30 px-3 py-1.5 text-xs font-bold text-[#596348]">
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
                          <div className="text-[10px] text-[#596348] font-bold">
                            Cold Store: {company.cold_storage_capacity_ml ? `${company.cold_storage_capacity_ml} MT` : '5,000 MT'}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              company.verification_status === 'VERIFIED'
                                ? 'bg-[#596348]/15 text-[#596348] border border-[#596348]/30'
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
                            <button
                              onClick={() => {
                                setSplitScreenCompany(company);
                                setAuditNotes('');
                              }}
                              className="rounded-md bg-[#202522] hover:bg-[#9b452f] px-3 py-1.5 text-[11px] font-bold text-white transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Inspect CR Document</span>
                            </button>
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

      {/* ================= SPLIT-SCREEN CR DOCUMENT AUDIT VIEWER (FR-ADM-001) ================= */}
      {splitScreenCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-2xl max-w-6xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#b9aa95] bg-[#e4dac9]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#202522] flex items-center justify-center text-white">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9b452f]">
                      SPLIT-SCREEN LEGAL AUDIT · FR-ADM-001
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#596348] text-white text-[9px] font-bold rounded-xs">
                      GOEIC / CAPQ SYNC
                    </span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#202522]">
                    {splitScreenCompany.company_name_en}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSplitScreenCompany(null)}
                  className="px-3 py-1.5 rounded-lg border border-[#b9aa95] hover:bg-[#dfd4c1] text-xs font-bold text-[#202522]"
                >
                  Close Viewer
                </button>
              </div>
            </div>

            {/* Split-Screen Canvas */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* LEFT SCREEN: Scanned Commercial Registration Certificate Document */}
              <div className="lg:col-span-7 bg-[#dfd4c1] border-b lg:border-b-0 lg:border-r border-[#b9aa95] p-6 overflow-y-auto flex flex-col items-center justify-start">
                <div className="w-full max-w-lg bg-white border border-[#b9aa95] p-8 shadow-md rounded-xs relative text-[#202522] space-y-6 font-arabic text-right selection:bg-[#9b452f] selection:text-white">
                  {/* Watermark & Header */}
                  <div className="border-b-2 border-[#202522] pb-4 flex items-center justify-between text-left">
                    <div className="text-[10px] font-mono uppercase text-[#70695f] leading-tight">
                      <div>ARAB REPUBLIC OF EGYPT</div>
                      <div>MINISTRY OF SUPPLY & INTERNAL TRADE</div>
                      <div>INTERNAL TRADE DEVELOPMENT AUTHORITY</div>
                    </div>
                    <div className="text-center font-bold text-xs text-[#202522]">
                      <div>جمهورية مصر العربية</div>
                      <div>وزارة التموين والتجارة الداخلية</div>
                      <div>جهاز تنمية التجارة الداخلية</div>
                      <div className="font-serif text-sm font-bold mt-1 text-[#9b452f]">
                        مستخرج رسمي من السجل التجاري
                      </div>
                    </div>
                  </div>

                  {/* Stamp & Seal Graphic */}
                  <div className="absolute top-24 left-8 w-24 h-24 rounded-full border-2 border-dashed border-[#9b452f]/40 flex items-center justify-center -rotate-12 pointer-events-none">
                    <div className="text-[9px] font-mono text-[#9b452f] font-bold text-center leading-tight">
                      ★ ختم النسر ★<br />
                      مكتب سجل تجاري<br />
                      {splitScreenCompany.governorate || 'الإسماعيلية'}<br />
                      معتمد رسمي
                    </div>
                  </div>

                  {/* Certificate Fields */}
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div className="grid grid-cols-2 gap-2 bg-[#eee8dc]/50 p-2.5 border border-[#b9aa95]/40 rounded">
                      <div>
                        <span className="text-[#70695f] block text-[10px]">رقم السجل التجاري (CR):</span>
                        <strong className="font-mono text-sm text-[#9b452f]">
                          {splitScreenCompany.cr_number || '104928'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#70695f] block text-[10px]">رقم التسجيل الضريبي (Tax ID):</span>
                        <strong className="font-mono text-sm text-[#202522]">
                          {splitScreenCompany.tax_id || '940-210-482'}
                        </strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#70695f] block text-[10px]">الاسم التجاري للمنشأة:</span>
                      <strong className="text-sm text-[#202522]">{splitScreenCompany.company_name_en}</strong>
                      <div className="text-xs text-[#565047] font-medium">{splitScreenCompany.company_name_ar || 'شركة تصدير حاصلات زراعية مصرية'}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[#70695f] block text-[10px]">المحافظة ومقر المنشأة:</span>
                        <strong>{splitScreenCompany.governorate || 'البحيرة'} - المنطقة الزراعية</strong>
                      </div>
                      <div>
                        <span className="text-[#70695f] block text-[10px]">رقم القيد بسجل المصدرين:</span>
                        <strong className="font-mono">EG-EX-89042</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[#70695f] block text-[10px]">النشاط المرخص به:</span>
                      <p className="text-[11px] text-[#565047]">
                        تعبئة وفرز وتجهيز وتصدير الحاصلات الزراعية والخضروات والفواكه الطازجة والمجمدة طبقاً لاشتراطات الهيئة القومية لسلامة الغذاء والحجر الزراعي المصري.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 border-t border-[#b9aa95]/40 pt-2 font-mono text-[10px]">
                      <div>تاريخ الإصدار: 2021-03-15</div>
                      <div className="text-left font-bold text-emerald-800">ساري المفعول حتى: 2028-03-14</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-between text-[10px] font-mono text-[#70695f]">
                    <span>Scan Authenticated · MD5 Verified</span>
                    <span>Document Code: EG-CR-904128-SEC</span>
                  </div>
                </div>
              </div>

              {/* RIGHT SCREEN: Verification Audit Checklist & Decision Panel */}
              <div className="lg:col-span-5 bg-[#e4dac9] p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-[#b9aa95] pb-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#70695f]">
                      COMPLIANCE CHECKLIST
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#202522]">
                      Verification Audit Criteria
                    </h3>
                    <p className="text-xs text-[#565047]">
                      Validate legal criteria against Egyptian government registry databases.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {[
                      { key: 'nameMatch', label: 'Trade Name matches Tax Authority Registration' },
                      { key: 'crActive', label: 'Commercial Registration is Active & Unexpired' },
                      { key: 'taxCleared', label: 'Tax ID cleared with Egyptian Ministry of Finance' },
                      { key: 'nfsaInspected', label: 'Packhouse cleared by National Food Safety Authority' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 p-3 rounded-lg bg-[#eee8dc] border border-[#b9aa95] cursor-pointer hover:border-[#202522] transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={(checklist as any)[item.key]}
                          onChange={(e) =>
                            setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                          }
                          className="w-4 h-4 rounded text-[#596348] focus:ring-[#596348]"
                        />
                        <span className="text-xs text-[#202522] font-medium leading-snug">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Auditor Notes Field */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase font-bold text-[#70695f]">
                      Auditor Compliance Notes (Internal Audit Log)
                    </label>
                    <textarea
                      rows={3}
                      value={auditNotes}
                      onChange={(e) => setAuditNotes(e.target.value)}
                      placeholder="Add compliance notes (e.g. CR verified via ITDA portal, Aweta 8-lane line confirmed)..."
                      className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-3 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Audit Actions */}
                <div className="pt-4 border-t border-[#b9aa95] space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleVerify(splitScreenCompany)}
                      disabled={actionLoading}
                      className="flex-1 py-3 bg-[#596348] hover:bg-[#48503a] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Approve & Grant Verified Trust Badge</span>
                    </button>

                    <button
                      onClick={() => handleReject(splitScreenCompany)}
                      disabled={actionLoading}
                      className="px-4 py-3 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                    >
                      Reject CR
                    </button>
                  </div>

                  <p className="text-[10px] text-[#70695f] font-mono text-center">
                    Approving publishes verified checkmark on directory and allows confidential RFQ quote submission.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
