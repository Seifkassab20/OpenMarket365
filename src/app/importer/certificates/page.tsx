'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ShieldCheck, Award, CheckCircle2, FileCheck2, ExternalLink } from 'lucide-react';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function ImporterCertificatesPage() {
  const { language } = useLanguage();

  const standards = [
    {
      name: 'GlobalG.A.P. IFA v6.0 Fruit & Vegetables',
      scope: 'European Union & UK Supermarket Baseline',
      desc: 'Mandatory standard for food safety, traceability, worker welfare, and integrated pest management (IPM). All active Egyptian packhouses maintain certified GGN numbers.',
      status: 'VERIFIED ON MARKET 365',
      authorities: 'Control Union Egypt, TÜV Nord, SGS Egypt',
    },
    {
      name: 'BRCGS Global Standard for Food Safety Issue 9',
      scope: 'Tier-1 UK & European Retail Direct Supply',
      desc: 'Rigorous standard covering HACCP food safety plan, factory environmental standards, product and process control, and personnel hygiene.',
      status: 'GRADE A / AA RECOGNISED',
      authorities: 'BRCGS Accredited Certification Bodies',
    },
    {
      name: 'EU Organic Regulation (EU) 2018/848',
      scope: 'Certified Organic Herbs & Fresh Produce',
      desc: 'Prohibits synthetic fertilisers and chemical pesticides. Strict annual soil residue testing and unannounced audits by accredited inspection bodies.',
      status: 'AUDITED & ACTIVE',
      authorities: 'CERES Germany, CCPB, ECOA',
    },
    {
      name: 'SMETA 4-Pillar Social Audit (Sedex)',
      scope: 'Ethical Trade & Labour Standards',
      desc: 'Evaluates packhouse labour standards, health & safety, environmental management, and business ethics.',
      status: 'SEDEX UPLOADED',
      authorities: 'Sedex Information Exchange',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
                COMPLIANCE DESK
              </span>
              <span className="text-xs text-[#70695f] font-mono">Verified Export Certifications</span>
            </div>
            <h1 className="font-serif text-3xl font-normal text-[#202522]">
              {language === 'ar' ? 'فحص اشتراطات الجودة ومطابقة الشهادات' : 'Compliance & Quality Standards'}
            </h1>
            <p className="mt-1 text-xs text-[#70695f]">
              {language === 'ar'
                ? 'معايير الجودة والشهادات الدولية المعتمدة لموردي الحاصلات الزراعية على منصة ماركت 365.'
                : 'Audit criteria and verified international food safety standards enforced for Egyptian export packhouses.'}
            </p>
          </div>

          <Link
            href="/importer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
          >
            <span>{language === 'ar' ? 'العودة للوحة المشتريات' : 'Back to Procurement Desk'}</span>
          </Link>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {standards.map((std, i) => (
          <ScrollReveal key={i} delayMs={i * 80} direction="up">
            <div
              className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 space-y-4 hover:border-[#202522] transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#596348] uppercase tracking-wider block">
                    {std.scope}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#202522] mt-0.5">
                    {std.name}
                  </h3>
                </div>
                <span className="px-2 py-0.5 bg-[#596348] text-white text-[9px] font-bold uppercase rounded-xs shrink-0">
                  {std.status}
                </span>
              </div>

              <p className="text-xs text-[#565047] leading-relaxed">
                {std.desc}
              </p>

              <div className="pt-2 text-[11px] font-mono text-[#70695f]">
                Accredited Auditing Bodies: <strong className="text-[#202522]">{std.authorities}</strong>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
