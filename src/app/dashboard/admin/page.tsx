'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  FileText, 
  CreditCard, 
  Activity
} from 'lucide-react';

export default function AdminGovernanceDashboard() {
  const { language } = useLanguage();

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#b9aa95]">
        <div>
          <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>08 / GOVERNANCE & NATIONAL AUDIT CONSOLE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#202522] tracking-tight">
            {language === 'ar' ? 'لوحة إدارة ورقابة المنصة الوطنية' : 'Platform Governance & Audit Desk.'}
          </h1>
          <p className="text-xs text-[#70695f] mt-1">
            Commercial Registry validation, certificate audits, and offline payment approvals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-[#e4dac9] border border-[#b9aa95] text-right">
            <span className="text-[10px] text-[#70695f] block uppercase font-bold tracking-wider">System Security</span>
            <span className="text-xs font-mono font-bold text-[#596348] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>RLS Enforced (Zero Leak)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending Registrations</span>
            <Building2 className="w-4 h-4 text-[#9b452f]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#202522] mt-2">
            {pendingExporters.filter(e => e.status === 'PENDING').length}
          </div>
          <span className="text-[11px] text-[#9b452f] font-medium">Requires Commercial Registry Audit</span>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Certificate Audits</span>
            <FileText className="w-4 h-4 text-[#596348]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#202522] mt-2">
            {pendingCertificates.filter(c => c.status === 'PENDING_AUDIT').length}
          </div>
          <span className="text-[11px] text-[#596348] font-medium">ISO / GlobalGAP Vault Queue</span>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Offline Wire Audits</span>
            <CreditCard className="w-4 h-4 text-[#202522]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#202522] mt-2">
            {offlinePayments.filter(p => p.status === 'PENDING_PAYMENT').length}
          </div>
          <span className="text-[11px] text-[#70695f] font-medium">CIB / Fawry Receipt Verification</span>
        </div>

        <div className="bg-[#e4dac9] border border-[#b9aa95] p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#70695f]">
            <span className="text-[10px] font-bold uppercase tracking-wider">Scraping Tripwires</span>
            <Activity className="w-4 h-4 text-[#9b452f]" />
          </div>
          <div className="text-3xl font-serif font-bold text-[#596348] mt-2">
            0 Leaks
          </div>
          <span className="text-[11px] text-[#70695f] font-medium">50 Reveals/Day Limit Active</span>
        </div>
      </div>

      {/* 1. Exporter CR Verification Queue */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="pb-4 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
            GAFI & COMMERCIAL REGISTRY AUDIT
          </span>
          <h2 className="text-2xl font-serif text-[#202522] mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#9b452f]" />
            <span>{language === 'ar' ? 'قائمة فحص واعتماد السجلات التجارية (CR Verification Queue)' : 'Exporter Legal Registration Audit Queue.'}</span>
          </h2>
          <p className="text-xs text-[#70695f] mt-0.5">
            Verify company legal identity against the General Authority for Investment (GAFI) registry before awarding verified status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#565047]">
            <thead className="bg-[#eee8dc] border-b border-[#b9aa95] text-[#70695f] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-4">CR & Tax Card No.</th>
                <th className="py-3 px-4">Governorate</th>
                <th className="py-3 px-4">Legal Document</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/40">
              {pendingExporters.map((exp) => (
                <tr key={exp.id} className="hover:bg-[#eee8dc]/50 transition-colors">
                  <td className="py-4 px-4 font-serif text-base text-[#202522]">
                    <div>{exp.nameEn}</div>
                    <div className="text-[11px] font-sans text-[#70695f]">{exp.nameAr}</div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <div className="text-[#9b452f] font-bold">{exp.crNumber}</div>
                    <div className="text-[#70695f] text-[10px]">{exp.taxId}</div>
                  </td>
                  <td className="py-4 px-4">{exp.governorate}</td>
                  <td className="py-4 px-4">
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Inspecting ${exp.crNumber} PDF document.`); }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] hover:border-[#202522]"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </a>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      exp.status === 'VERIFIED'
                        ? 'bg-[#596348] text-white'
                        : exp.status === 'REJECTED'
                        ? 'bg-[#9b452f] text-white'
                        : 'bg-[#c38b40] text-white'
                    }`}>
                      {exp.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {exp.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveExporter(exp.id)}
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#596348] hover:bg-[#48503a] text-white flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectExporter(exp.id)}
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#70695f] font-mono">Action Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Certificate Vault Audit Queue */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="pb-4 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#596348] uppercase tracking-[0.22em]">
            QUALITY CERTIFICATION VAULT
          </span>
          <h2 className="text-2xl font-serif text-[#202522] mt-1 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#596348]" />
            <span>{language === 'ar' ? 'فحص واعتماد شهادات الجودة الدولية (Certificate Vault Audit)' : 'Accreditation Vault Audit Queue.'}</span>
          </h2>
          <p className="text-xs text-[#70695f] mt-0.5">
            Validate accreditation legitimacy for GlobalGAP, ISO, Halal, and FDA before displaying trust badges.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#565047]">
            <thead className="bg-[#eee8dc] border-b border-[#b9aa95] text-[#70695f] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Exporter</th>
                <th className="py-3 px-4">Accreditation Standard</th>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Validity Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Audit Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/40">
              {pendingCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-[#eee8dc]/50 transition-colors">
                  <td className="py-4 px-4 font-serif text-base text-[#202522]">{cert.companyName}</td>
                  <td className="py-4 px-4 font-medium">{cert.certName}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#9b452f]">{cert.certNumber}</td>
                  <td className="py-4 px-4">{cert.validUntil}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      cert.status === 'VERIFIED'
                        ? 'bg-[#596348] text-white'
                        : 'bg-[#c38b40] text-white'
                    }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    {cert.status === 'PENDING_AUDIT' ? (
                      <button
                        onClick={() => handleApproveCert(cert.id)}
                        className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#596348] hover:bg-[#48503a] text-white transition-colors"
                      >
                        Approve Badge
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#596348] font-bold">Approved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Offline Payment & Subscription Activation Ledger */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="pb-4 border-b border-[#b9aa95]">
          <span className="text-[10px] font-bold text-[#202522] uppercase tracking-[0.22em]">
            SUBSCRIPTION FISCAL AUDIT
          </span>
          <h2 className="text-2xl font-serif text-[#202522] mt-1 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#202522]" />
            <span>{language === 'ar' ? 'سجل سداد الاشتراكات البنكية وتفعيل الباقات (Offline Wire Audit)' : 'Bank Wire & Fawry Audit Ledger.'}</span>
          </h2>
          <p className="text-xs text-[#70695f] mt-0.5">
            Administrative activation for annual bank wire transfers and Fawry reference codes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#565047]">
            <thead className="bg-[#eee8dc] border-b border-[#b9aa95] text-[#70695f] uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Company</th>
                <th className="py-3 px-4">Tier Code</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method & Ref</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-right">Activation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#b9aa95]/40">
              {offlinePayments.map((pay) => (
                <tr key={pay.id} className="hover:bg-[#eee8dc]/50 transition-colors">
                  <td className="py-4 px-4 font-serif text-base text-[#202522]">{pay.companyName}</td>
                  <td className="py-4 px-4 font-bold text-[#9b452f]">{pay.tier}</td>
                  <td className="py-4 px-4 font-mono font-bold text-[#202522]">{pay.amount}</td>
                  <td className="py-4 px-4 font-mono text-[#596348]">{pay.method} ({pay.reference})</td>
                  <td className="py-4 px-4">{pay.submittedAt}</td>
                  <td className="py-4 px-4 text-right">
                    {pay.status === 'PENDING_PAYMENT' ? (
                      <button
                        onClick={() => handleApprovePayment(pay.id)}
                        className="px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#202522] hover:bg-black text-[#eee8dc] transition-colors"
                      >
                        Approve & Provision
                      </button>
                    ) : (
                      <span className="text-[11px] text-[#596348] font-bold">Plan Activated</span>
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

