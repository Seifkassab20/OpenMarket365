'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterCertificate,
} from '@/lib/services/exporterService';
import CertificateUploadModal from '@/components/exporter/CertificateUploadModal';
import {
  FileCheck,
  ShieldCheck,
  Clock,
  AlertTriangle,
  UploadCloud,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Calendar,
  Lock,
  Search,
} from 'lucide-react';

export default function ExporterCertificatesPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [certificates, setCertificates] = useState<ExporterCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    setIsLoading(true);
    try {
      const data = await exporterService.getCertificates('c-nileagro-01');
      setCertificates(data);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل سجل الشهادات' : 'Failed to retrieve certificates',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = async (certData: {
    certificate_name: string;
    certificate_number: string;
    valid_from: string;
    valid_to: string;
    document_url?: string;
  }) => {
    try {
      const res = await exporterService.uploadCertificate('c-nileagro-01', certData);
      if (res.success && res.certificate) {
        setCertificates((prev) => [res.certificate!, ...prev]);
        showToast({
          title: isAr ? 'تم الرفع بنجاح' : 'Certificate Uploaded',
          message: isAr
            ? 'تم إرسال الشهادة لفريق التدقيق والمطابقة. حالتها الآن: قيد المراجعة.'
            : 'Certificate uploaded. Verification is now pending admin audit.',
          type: 'success',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل إرسال ملف الشهادة' : 'Failed to submit certificate file',
        type: 'error',
      });
    }
  };

  // Check for certificates expiring within 45 days
  const expiringSoon = certificates.filter((c) => {
    if (c.verification_status !== 'VERIFIED') return false;
    const expiry = new Date(c.valid_to).getTime();
    const now = new Date('2026-09-22').getTime();
    const daysUntilExpiry = (expiry - now) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 45;
  });

  const filteredCerts = certificates.filter((c) =>
    c.certificate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.certificate_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'خزينة شهادات الجودة والمطابقة الدولية' : 'QUALITY COMPLIANCE & ACCREDITATION VAULT'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/10 text-[#2d7a58] border border-[#2d7a58]/30">
              {certificates.filter((c) => c.verification_status === 'VERIFIED').length} {isAr ? 'شهادة معتمدة' : 'Verified'}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'شهادات الجودة والمطابقة التصديرية' : 'Compliance & Food Safety Certificates'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'شهادات GlobalGAP، BRCGS، ISO 22000، و Sedex تمنح شركتك أولوية المطابقة في العطاءات الدولية وعلامة الموثوقية الذهبية.'
              : 'GlobalGAP, BRCGS, ISO, and SMETA certifications provide golden verification trust badges and prime matching in international RFQ tenders.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-2 transition-all shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          <span>{isAr ? 'رفع شهادة مطابقة جديدة' : 'UPLOAD CERTIFICATE'}</span>
        </button>
      </div>

      {/* Expiry Alert Warning Banner */}
      {expiringSoon.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[#c38b40]/15 border border-[#c38b40]/40 text-[#7a521e]">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-[#c38b40] mt-0.5" />
          <div className="space-y-1 flex-1 text-xs">
            <div className="font-bold text-sm">
              {isAr ? 'تنبيه اقتراب موعد تجديد الشهادات' : 'Certificate Expiry Approaching'}
            </div>
            <p className="leading-relaxed">
              {isAr
                ? `الشهادات التالية تنتهي صلاحيتها قريباً: ${expiringSoon.map((c) => c.certificate_name).join('، ')}. يرجى رفع وثيقة التجديد لتفادي فقدان شارة الاعتماد الذهبية في المعرض الدولي.`
                : `The following certifications are approaching expiration: ${expiringSoon.map((c) => c.certificate_name).join(', ')}. Please submit renewal documentation to maintain verified status.`}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs font-mono font-bold text-[#9b452f] hover:underline whitespace-nowrap pt-1"
          >
            {isAr ? 'رفع التجديد الآن ←' : 'Renew Now →'}
          </button>
        </div>
      )}

      {/* Audit & Regulatory Integrity Notice */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
        <Lock className="w-5 h-5 text-[#9b452f] flex-shrink-0" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold text-[#9b452f]">
            {isAr ? 'بروتوكول التحقق السيادي (Anti-Fraud Policy): ' : 'Sovereign Verification Protocol: '}
          </span>
          {isAr
            ? 'لا يمكن للمصدر اعتماد الشهادات ذاتياً. تخضع جميع الشهادات المرفوعة للفحص والتحقق من الأرقام التسلسلية (GGN / BRC Audit Directory) بواسطة مسؤولي الرقابة والتفتيش بالمنصة.'
            : 'Certificates cannot be self-verified. Every uploaded document is cross-checked against official databases (GlobalG.A.P. GGN Search, BRCGS Directory) by Market 365 compliance officers before publication.'}
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-3 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
          <input
            type="text"
            placeholder={isAr ? 'بحث باسم الشهادة أو رقم GGN...' : 'Search by certificate name or GGN number...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded-lg text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
          />
        </div>

        <span className="text-xs font-mono text-[#70695f]">
          {filteredCerts.length} {isAr ? 'شهادة مسجلة' : 'Documents'}
        </span>
      </div>

      {/* Certificates Table */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-mono text-[#70695f]">
              {isAr ? 'جارِ فحص وتدقيق سجل الشهادات...' : 'Auditing certification repository...'}
            </p>
          </div>
        ) : filteredCerts.length === 0 ? (
          <div className="py-16 text-center space-y-3 p-6">
            <ShieldAlert className="w-12 h-12 text-[#70695f] mx-auto opacity-50" />
            <p className="text-sm font-serif font-bold text-[#202522]">
              {isAr ? 'لا توجد شهادات مطابقة' : 'No Certificates Found'}
            </p>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'قم برفع شهادات المزرعة ومحطة التعبئة لتعزيز مصداقيتك أمام المستوردين الدوليين.'
                : 'Upload your farm and packhouse compliance certificates to boost international buyer confidence.'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 px-4 py-2 bg-[#9b452f] text-white rounded-xl text-xs font-mono font-bold"
            >
              {isAr ? 'رفع شهادة' : 'Upload Certificate'}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right">
              <thead className="bg-[#dfd4c1] border-b border-[#b9aa95] text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f]">
                <tr>
                  <th className="py-3.5 px-4">{isAr ? 'الشهادة والمعيار الدولي' : 'Accreditation Standard'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'رقم التسجيل / GGN' : 'Registration / GGN'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'فترة الصلاحية' : 'Validity Window'}</th>
                  <th className="py-3.5 px-4">{isAr ? 'حالة الاعتماد' : 'Verification Status'}</th>
                  <th className="py-3.5 px-4 text-center">{isAr ? 'الوثيقة الأصلية' : 'Audit Document'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#b9aa95]/40 font-mono">
                {filteredCerts.map((cert) => {
                  const isVerified = cert.verification_status === 'VERIFIED';
                  const isPending = cert.verification_status === 'PENDING';
                  const isRejected = cert.verification_status === 'REJECTED';
                  const isExpired = cert.verification_status === 'EXPIRED';

                  return (
                    <tr
                      key={cert.id}
                      className="hover:bg-[#dfd4c1]/40 transition-colors"
                    >
                      <td className="py-4 px-4 font-sans">
                        <div className="font-bold text-sm text-[#202522] flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#9b452f] flex-shrink-0" />
                          <span>{cert.certificate_name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-1 rounded bg-[#eee8dc] border border-[#b9aa95] text-[#202522] font-mono text-[11px] font-bold">
                          {cert.certificate_number}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[11px] text-[#70695f]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#9b452f]" />
                          <span>
                            {cert.valid_from} → {cert.valid_to}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {isVerified && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2d7a58]/15 text-[#2d7a58] border border-[#2d7a58]/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isAr ? 'معتمدة ومطابقة' : 'VERIFIED'}</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#c38b40]/15 text-[#c38b40] border border-[#c38b40]/30 animate-pulse">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{isAr ? 'قيد المراجعة والتدقيق' : 'PENDING AUDIT'}</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#9b452f]/15 text-[#9b452f] border border-[#9b452f]/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'مرفوضة / غير مطابقة' : 'REJECTED'}</span>
                          </span>
                        )}
                        {isExpired && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#70695f]/15 text-[#70695f] border border-[#70695f]/30">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{isAr ? 'منتهية الصلاحية' : 'EXPIRED'}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        {cert.document_url ? (
                          <a
                            href={cert.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#b9aa95] text-[#202522] hover:bg-[#eee8dc] transition-colors text-[11px]"
                          >
                            <span>{isAr ? 'عرض الوثيقة' : 'View PDF'}</span>
                            <ExternalLink className="w-3 h-3 text-[#70695f]" />
                          </a>
                        ) : (
                          <span className="text-[#70695f] text-[11px]">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <CertificateUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
