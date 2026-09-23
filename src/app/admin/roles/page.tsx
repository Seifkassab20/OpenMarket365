'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/admin/ToastNotification';
import ScrollReveal from '@/components/admin/ScrollReveal';

interface PermissionDomain {
  domain: string;
  permissions: {
    name: string;
    key: string;
    admin: boolean;
    exporter: boolean;
    reporter: boolean;
    visitor: boolean;
  }[];
}

export default function RolesAndPermissionsPage() {
  const { addToast } = useToast();

  const [domains, setDomains] = useState<PermissionDomain[]>([
    {
      domain: 'USER & ACCESS GOVERNANCE',
      permissions: [
        { name: 'View User Roster', key: 'user.view', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Edit Role Assignments', key: 'user.edit_role', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Suspend / Reactivate Accounts', key: 'user.suspend', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Delete User Profiles', key: 'user.delete', admin: true, exporter: false, reporter: false, visitor: false },
      ],
    },
    {
      domain: 'COMMERCIAL VERIFICATION & CR AUDIT',
      permissions: [
        { name: 'Review Commercial Registry Docs', key: 'company.cr_review', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Verify Exporter Facility & Machinery', key: 'company.facility_audit', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Upload CR & Tax Identification', key: 'company.upload_cr', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'View Verified Showrooms', key: 'company.view_public', admin: true, exporter: true, reporter: true, visitor: true },
      ],
    },
    {
      domain: 'COMMODITIES & HS CODE CATALOG',
      permissions: [
        { name: 'Create / Edit Commodities', key: 'product.create', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'Toggle Product Publish State', key: 'product.publish', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'Assign Official HS Codes', key: 'product.hs_code', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'Delete Product Listings', key: 'product.delete', admin: true, exporter: false, reporter: false, visitor: false },
      ],
    },
    {
      domain: 'FINANCIAL LEDGER & SUBSCRIPTIONS',
      permissions: [
        { name: 'Approve Offline Bank Wire Transfers', key: 'sub.approve_wire', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Audit Fawry Payment References', key: 'sub.audit_fawry', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Submit Offline Payment Receipt', key: 'sub.submit_receipt', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'Manage Plan Quotas', key: 'sub.manage_plans', admin: true, exporter: false, reporter: false, visitor: false },
      ],
    },
    {
      domain: 'TENDER RFQS & SEALED BIDS',
      permissions: [
        { name: 'Publish International Procurement RFQ', key: 'rfq.publish', admin: true, exporter: false, reporter: false, visitor: true },
        { name: 'Submit Sealed Commercial Quotes', key: 'rfq.submit_quote', admin: true, exporter: true, reporter: false, visitor: false },
        { name: 'Unseal & Audit Bid Offers', key: 'rfq.audit_bids', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Award Procurement Contract', key: 'rfq.award', admin: true, exporter: false, reporter: false, visitor: true },
      ],
    },
    {
      domain: 'AI & SYSTEM AUDIT',
      permissions: [
        { name: 'Trigger AI Auto-HS Classifier', key: 'ai.classifier', admin: true, exporter: true, reporter: true, visitor: false },
        { name: 'Access Full activity_logs Trail', key: 'system.audit_logs', admin: true, exporter: false, reporter: false, visitor: false },
        { name: 'Configure Security Policies', key: 'system.security_settings', admin: true, exporter: false, reporter: false, visitor: false },
      ],
    },
  ]);

  const togglePermission = (dIdx: number, pIdx: number, role: 'admin' | 'exporter' | 'reporter' | 'visitor') => {
    if (role === 'admin') {
      addToast('warning', 'Super Admin permissions are protected and cannot be revoked.');
      return;
    }

    setDomains((prev) => {
      const copy = [...prev];
      const target = { ...copy[dIdx].permissions[pIdx] };
      target[role] = !target[role];
      copy[dIdx].permissions[pIdx] = target;
      return copy;
    });

    addToast('success', 'Permission matrix configuration updated');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Role Definitions & Security Matrix
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Role-based access control (RBAC) governing the 12 Supabase database schemas.
          </p>
        </div>

        <button
          onClick={() => addToast('info', 'RBAC policy rules synced with Supabase RLS definitions')}
          className="flex items-center gap-2 rounded-lg bg-[#9b452f] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#833824] transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Sync RBAC Policies
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ADMIN */}
        <ScrollReveal delayMs={50}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-emerald-700/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 font-mono border border-emerald-700/20">
                  ROLE: ADMIN
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-[#202522] mt-3">
                System Administrator
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                Full authority over database records, offline wire transfer verification, compliance approvals, and AI audits.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#b9aa95] text-[11px] text-emerald-800 font-semibold">
              46 Permissions (Unlimited)
            </div>
          </div>
        </ScrollReveal>

        {/* EXPORTER */}
        <ScrollReveal delayMs={100}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-[#c38b40]/15 px-2 py-0.5 text-[10px] font-bold text-[#9b6820] font-mono border border-[#c38b40]/30">
                  ROLE: EXPORTER
                </span>
                <span className="h-2 w-2 rounded-full bg-[#c38b40]" />
              </div>
              <h3 className="text-base font-semibold text-[#202522] mt-3">
                Egyptian Exporter
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                Manages packing station facility, uploads Commercial Registry docs, lists commodities, and bids on tender RFQs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#b9aa95] text-[11px] text-[#9b6820] font-semibold">
              24 Permissions Active
            </div>
          </div>
        </ScrollReveal>

        {/* REPORTER */}
        <ScrollReveal delayMs={150}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-blue-700/10 px-2 py-0.5 text-[10px] font-bold text-blue-800 font-mono border border-blue-700/20">
                  ROLE: REPORTER
                </span>
                <span className="h-2 w-2 rounded-full bg-blue-600" />
              </div>
              <h3 className="text-base font-semibold text-[#202522] mt-3">
                Field Intelligence Reporter
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                Records daily wholesale wholesale prices from Obour, 6th of October, and export port staging hubs.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#b9aa95] text-[11px] text-blue-800 font-semibold">
              12 Permissions Active
            </div>
          </div>
        </ScrollReveal>

        {/* VISITOR / IMPORTER */}
        <ScrollReveal delayMs={200}>
          <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-5 h-full flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-purple-700/10 px-2 py-0.5 text-[10px] font-bold text-purple-800 font-mono border border-purple-700/20">
                  ROLE: VISITOR / BUYER
                </span>
                <span className="h-2 w-2 rounded-full bg-purple-600" />
              </div>
              <h3 className="text-base font-semibold text-[#202522] mt-3">
                Global Commodity Buyer
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                Browses verified commodity catalogues, creates procurement RFQ tenders, and reviews ISO certificates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#b9aa95] text-[11px] text-purple-800 font-semibold">
              8 Permissions Active
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Interactive Permission Matrix */}
      <ScrollReveal delayMs={250}>
        <div className="overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm">
          <div className="p-5 border-b border-[#b9aa95] flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#202522]">
                Interactive Permission Capability Matrix
              </h3>
              <p className="text-xs text-[#70695f] mt-0.5">
                Click any permission toggle to simulate real-time policy adjustments
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 pl-6 pr-4 font-semibold">Capability / Policy Scope</th>
                  <th className="py-3 px-4 text-center font-semibold text-emerald-800">ADMIN</th>
                  <th className="py-3 px-4 text-center font-semibold text-[#9b6820]">EXPORTER</th>
                  <th className="py-3 px-4 text-center font-semibold text-blue-800">REPORTER</th>
                  <th className="py-3 px-4 text-center font-semibold text-purple-800">VISITOR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                {domains.map((domain, dIdx) => (
                  <React.Fragment key={domain.domain}>
                    {/* Domain Header Row */}
                    <tr className="bg-[#ebd8c1]">
                      <td
                        colSpan={5}
                        className="py-2.5 pl-6 pr-4 text-[10px] font-bold uppercase tracking-wider text-[#70695f]"
                      >
                        {domain.domain}
                      </td>
                    </tr>

                    {/* Permissions in Domain */}
                    {domain.permissions.map((p, pIdx) => (
                      <tr key={p.key} className="hover:bg-[#eae1d3] transition-colors">
                        <td className="py-3 pl-6 pr-4 font-medium text-[#202522]">
                          {p.name}
                          <span className="block text-[10px] text-[#70695f] font-mono">
                            {p.key}
                          </span>
                        </td>

                        {/* Admin Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePermission(dIdx, pIdx, 'admin')}
                            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-700/10 text-emerald-800 border border-emerald-700/20"
                            title="Protected admin permission"
                          >
                            ✓
                          </button>
                        </td>

                        {/* Exporter Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePermission(dIdx, pIdx, 'exporter')}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold transition-all ${
                              p.exporter
                                ? 'bg-[#c38b40]/25 text-[#9b6820] border border-[#c38b40]/40'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            {p.exporter ? '✓' : '✕'}
                          </button>
                        </td>

                        {/* Reporter Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePermission(dIdx, pIdx, 'reporter')}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold transition-all ${
                              p.reporter
                                ? 'bg-blue-700/20 text-blue-800 border border-blue-700/30'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            {p.reporter ? '✓' : '✕'}
                          </button>
                        </td>

                        {/* Visitor Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePermission(dIdx, pIdx, 'visitor')}
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold transition-all ${
                              p.visitor
                                ? 'bg-purple-700/20 text-purple-800 border border-purple-700/30'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            {p.visitor ? '✓' : '✕'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
