'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCompanies, fallbackRfqs, fallbackSubscriptionPlans } from '@/lib/data/fallbackData';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  FileText, 
  CreditCard, 
  FileSpreadsheet, 
  Eye, 
  Download, 
  ExternalLink,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function AdminGovernanceDashboard() {
  const { language, t } = useLanguage();

  // Mock moderation state for testing
  const [pendingExporters, setPendingExporters] = useState([
    {
      id: 'exp-audit-01',
      nameEn: 'El-Marwa Citrus & Fruit Packaging Co.',
      nameAr: 'شركة المروة لتعبئة وتصدير الموالح',
      crNumber: 'CR-99210-EG',
      taxId: 'TAX-88129031',
      governorate: 'Ismailia',
      documentUrl: 'https://example.com/cr_document.pdf',
      submittedAt: '2026-03-20',
      status: 'PENDING',
    },
    {
      id: 'exp-audit-02',
      nameEn: 'Suez Canal Agribusiness Complex',
      nameAr: 'مجمع قناة السويس للصناعات الزراعية',
      crNumber: 'CR-77401-EG',
      taxId: 'TAX-33901928',
      governorate: 'Port Said',
      documentUrl: 'https://example.com/cr_document.pdf',
      submittedAt: '2026-03-21',
      status: 'PENDING',
    },
  ]);

  const [pendingCertificates, setPendingCertificates] = useState([
    {
      id: 'cert-audit-01',
      companyName: 'Nile Agro Export & Logistics',
      certName: 'GlobalGAP Version 6.0 (Smart Fruit & Veg)',
      certNumber: 'GGN-40592817492',
      validUntil: '2027-02-28',
      status: 'PENDING_AUDIT',
    },
    {
      id: 'cert-audit-02',
      companyName: 'Delta Med Herbs & Aromatics',
      certName: 'USDA NOP Organic Handler Certificate',
      certNumber: 'NOP-EG-918274',
      validUntil: '2026-12-31',
      status: 'PENDING_AUDIT',
    },
  ]);

  const [offlinePayments, setOfflinePayments] = useState([
    {
      id: 'sub-audit-01',
      companyName: 'Al-Ahram Delta Agri Corp',
      tier: 'PRM (Premium Showroom)',
      amount: '$1,200 (60,000 EGP)',
      method: 'CIB Bank Wire',
      reference: 'TRF-CIB-928174920',
      submittedAt: '2026-03-21 11:30',
      status: 'PENDING_PAYMENT',
    },
  ]);

  const handleApproveExporter = (id: string) => {
    setPendingExporters(pendingExporters.map(e => e.id === id ? { ...e, status: 'VERIFIED' } : e));
  };

  const handleRejectExporter = (id: string) => {
    setPendingExporters(pendingExporters.map(e => e.id === id ? { ...e, status: 'REJECTED' } : e));
  };

  const handleApproveCert = (id: string) => {
    setPendingCertificates(pendingCertificates.map(c => c.id === id ? { ...c, status: 'VERIFIED' } : c));
  };

  const handleApprovePayment = (id: string) => {
    setOfflinePayments(offlinePayments.map(p => p.id === id ? { ...p, status: 'ACTIVE' } : p));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-brand-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SECURED GOVERNANCE & AUDIT CONSOLE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {language === 'ar' ? 'لوحة إدارة ورقابة المنصة الوطنية' : 'Platform Administration & Verification Desk'}
          </h1>
          <p className="text-xs text-brand-dim mt-1">
            FR-ADM-001 to FR-ADM-005: Commercial Registry validation, certificate audits, and offline payment approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 rounded-2xl glass-panel text-right">
            <span className="text-[10px] text-brand-dim block uppercase">System Security</span>
            <span className="text-xs font-bold text-brand-emeraldLight flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>RLS Enforced (Zero Leak)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-2xl p-5 border-brand-goldBorder/40">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Pending CR Registrations</span>
            <Building2 className="w-4 h-4 text-brand-gold" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {pendingExporters.filter(e => e.status === 'PENDING').length}
          </div>
          <span className="text-[11px] text-brand-gold font-medium">Requires Commercial Registry Audit</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-brand-emeraldLight/40">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Certificate Audits</span>
            <FileText className="w-4 h-4 text-brand-emeraldLight" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {pendingCertificates.filter(c => c.status === 'PENDING_AUDIT').length}
          </div>
          <span className="text-[11px] text-brand-emeraldLight font-medium">ISO / GlobalGAP Vault Queue</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-brand-cyan/40">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Offline Wire Audits</span>
            <CreditCard className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="text-2xl font-extrabold text-white mt-2">
            {offlinePayments.filter(p => p.status === 'PENDING_PAYMENT').length}
          </div>
          <span className="text-[11px] text-brand-cyan font-medium">CIB / Fawry Receipt Verification</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-purple-500/40">
          <div className="flex items-center justify-between text-xs text-brand-dim">
            <span>Anti-Scraping Tripwires</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400 mt-2">
            0 Leaks
          </div>
          <span className="text-[11px] text-brand-dim font-medium">50 Reveals/Day Limit Active</span>
        </div>
      </div>

      {/* 1. Exporter CR Verification Queue (FR-ADM-002) */}
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-gold" />
              <span>{language === 'ar' ? 'قائمة فحص واعتماد السجلات التجارية (CR Verification Queue)' : 'Exporter Commercial Registration (CR) Audit Queue'}</span>
            </h2>
            <p className="text-xs text-brand-dim mt-0.5">
              Verify company legal identity against the General Authority for Investment (GAFI) registry before awarding verified badges.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-muted">
            <thead className="bg-white/5 border-b border-brand-border text-brand-dim uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">CR & Tax Card No.</th>
                <th className="py-3 px-4">Governorate</th>
                <th className="py-3 px-4">Legal Document</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {pendingExporters.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">
                    <div>{exp.nameEn}</div>
                    <div className="text-[11px] text-brand-dim">{exp.nameAr}</div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <div className="text-brand-gold">{exp.crNumber}</div>
                    <div className="text-brand-dim text-[10px]">{exp.taxId}</div>
                  </td>
                  <td className="py-4 px-4">{exp.governorate}</td>
                  <td className="py-4 px-4">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Inspecting ${exp.crNumber} PDF document.`); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/5 border border-brand-border text-brand-gold hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      exp.status === 'VERIFIED'
                        ? 'bg-brand-emerald/20 text-brand-emeraldLight border border-brand-emeraldLight/30'
                        : exp.status === 'REJECTED'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-brand-gold/20 text-brand-gold border border-brand-goldBorder/40'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {exp.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveExporter(exp.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                        <button
                          onClick={() => handleRejectExporter(exp.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-brand-dim">Action Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Certificate Vault Audit Queue (FR-ADM-003) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-emeraldLight" />
            <span>{language === 'ar' ? 'فحص واعتماد شهادات الجودة الدولية (Certificate Vault Audit)' : 'International Accreditation Audit Queue'}</span>
          </h2>
          <p className="text-xs text-brand-dim mt-0.5">
            Validate accreditation legitimacy for GlobalGAP, ISO, Halal, and FDA before displaying trust badges.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-muted">
            <thead className="bg-white/5 border-b border-brand-border text-brand-dim uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Exporter</th>
                <th className="py-3 px-4">Accreditation Standard</th>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Validity Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {pendingCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{cert.companyName}</td>
                  <td className="py-4 px-4 text-brand-text font-medium">{cert.certName}</td>
                  <td className="py-4 px-4 font-mono text-brand-gold">{cert.certNumber}</td>
                  <td className="py-4 px-4">{cert.validUntil}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cert.status === 'VERIFIED'
                        ? 'bg-brand-emerald/20 text-brand-emeraldLight'
                        : 'bg-brand-gold/20 text-brand-gold'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {cert.status === 'PENDING_AUDIT' ? (
                      <button
                        onClick={() => handleApproveCert(cert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald"
                      >
                        Approve Badge
                      </button>
                    ) : (
                      <span className="text-[11px] text-brand-emeraldLight font-bold">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Offline Payment & Subscription Activation Ledger (FR-SUB-004) */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-brand-cyan" />
            <span>{language === 'ar' ? 'سجل سداد الاشتراكات البنكية وتفعيل الباقات (Offline Wire Audit)' : 'Offline Wire & Fawry Payment Audit Ledger'}</span>
          </h2>
          <p className="text-xs text-brand-dim mt-0.5">
            Manual administrative activation for annual bank wire transfers and Fawry reference codes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-brand-muted">
            <thead className="bg-white/5 border-b border-brand-border text-brand-dim uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Tier Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method & Ref</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Activation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40">
              {offlinePayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 font-bold text-white">{pay.companyName}</td>
                  <td className="py-4 px-4 font-bold text-brand-gold">{pay.tier}</td>
                  <td className="py-4 px-4 font-mono text-white">{pay.amount}</td>
                  <td className="py-4 px-4 font-mono text-brand-cyan">{pay.method} ({pay.reference})</td>
                  <td className="py-4 px-4">{pay.submittedAt}</td>
                  <td className="py-4 px-4 text-right">
                    {pay.status === 'PENDING_PAYMENT' ? (
                      <button
                        onClick={() => handleApprovePayment(pay.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald"
                      >
                        Approve & Provision Quotas
                      </button>
                    ) : (
                      <span className="text-[11px] text-brand-emeraldLight font-bold">Plan Activated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
