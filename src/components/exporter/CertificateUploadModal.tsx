'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { X, UploadCloud, FileCheck, ShieldAlert, CheckCircle2, Sparkles, FileText, Loader2 } from 'lucide-react';
import { compressImageToWebP, formatFileSize, CompressionResult } from '@/lib/utils/imageCompressor';

interface CertificateUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (cert: {
    certificate_name: string;
    certificate_number: string;
    valid_from: string;
    valid_to: string;
    document_url?: string;
  }) => void;
}

export default function CertificateUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: CertificateUploadModalProps) {
  const { language } = useLanguage();

  const [certName, setCertName] = useState('GlobalG.A.P. IFA Version 6.0');
  const [certNumber, setCertNumber] = useState('');
  const [validFrom, setValidFrom] = useState('2025-01-01');
  const [validTo, setValidTo] = useState('2027-01-01');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFileName(selected.name);
    setFile(selected);
    setCompressionResult(null);

    if (selected.type.startsWith('image/')) {
      setIsCompressing(true);
      try {
        const result = await compressImageToWebP(selected, 1920, 1920, 0.82);
        setCompressionResult(result);
        setFile(result.file);
      } catch (err) {
        console.error('Image compression failed', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNumber.trim()) return;

    setUploading(true);
    setTimeout(() => {
      onSuccess({
        certificate_name: certName,
        certificate_number: certNumber,
        valid_from: validFrom,
        valid_to: validTo,
        document_url: compressionResult ? compressionResult.dataUrl : 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200',
      });
      setUploading(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-[#e4dac9] border border-[#b9aa95] rounded-xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#9b452f]" />
            <h3 className="text-base font-serif font-bold text-[#202522]">
              {language === 'ar' ? 'رفع شهادة جودة ومطابقة دولية' : 'Upload Compliance Certificate'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#70695f] hover:text-[#202522] hover:bg-[#eee8dc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Compliance Standard */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'المعيار / نوع الشهادة' : 'Certificate Standard'}
            </label>
            <select
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
            >
              <option value="GlobalG.A.P. IFA Version 6.0">GlobalG.A.P. IFA Version 6.0 (Smart Fruit & Veg)</option>
              <option value="BRCGS Food Safety Issue 9">BRCGS Food Safety Issue 9 (Grade AA Packhouse)</option>
              <option value="ISO 22000:2018 Food Safety">ISO 22000:2018 Food Safety Management System</option>
              <option value="USDA NOP Organic Certification">USDA NOP Organic Certification</option>
              <option value="Halal Export Standard (ES 4249)">Halal Export Standard (ES 4249)</option>
              <option value="SMETA 4-Pillar Ethical Trade Audit">SMETA 4-Pillar Ethical Trade Audit (Sedex)</option>
              <option value="FDA Food Facility Registration">US FDA Food Facility Registration (FFR)</option>
            </select>
          </div>

          {/* Certificate Number */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'رقم الشهادة / كود الاعتماد GGN' : 'Certificate Number / GGN Code'}
            </label>
            <input
              type="text"
              required
              value={certNumber}
              onChange={(e) => setCertNumber(e.target.value)}
              placeholder="e.g. GGN-40592817492 or BRC-EG-991"
              className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          {/* Validity Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'تاريخ الإصدار' : 'Valid From'}
              </label>
              <input
                type="date"
                required
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'تاريخ الانتهاء' : 'Valid Until'}
              </label>
              <input
                type="date"
                required
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>

          {/* Document Upload Area */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'ملف الشهادة (PDF / Scan / Image)' : 'Certificate Document (PDF / Scan / Image)'}
            </label>
            <div className="border-2 border-dashed border-[#b9aa95] bg-[#eee8dc] rounded-lg p-4 text-center space-y-2 hover:border-[#9b452f] transition-colors cursor-pointer relative">
              <UploadCloud className="w-7 h-7 text-[#9b452f] mx-auto" />
              <div className="text-xs text-[#202522] font-semibold">
                {fileName || (language === 'ar' ? 'انقر لاختيار مستند الشهادة أو صورة الفحص' : 'Click to select or drag PDF / Image certificate')}
              </div>
              <p className="text-[10px] text-[#70695f]">
                {language === 'ar' ? 'الحد الأقصى 15 ميجابايت • يتم ضغط الصور تلقائياً إلى WebP لتوفير 80% من الباندويث' : 'Max 15MB • Images auto-compressed to WebP (SRS FR-MED-001)'}
              </p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
                id="cert-file-input"
              />
              <label
                htmlFor="cert-file-input"
                className="inline-block px-3 py-1 bg-[#202522] text-[#eee8dc] text-[10px] font-bold uppercase tracking-wider cursor-pointer rounded-xs"
              >
                {language === 'ar' ? 'تصفح الملفات' : 'Browse File'}
              </label>

              {/* Compression in Progress */}
              {isCompressing && (
                <div className="mt-3 p-2 bg-[#dfd4c1] border border-[#b9aa95] rounded text-xs text-[#202522] flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#9b452f]" />
                  <span>{language === 'ar' ? 'جارِ معالجة وضغط الصورة إلى WebP داخل المتصفح...' : 'Compressing image into WebP format...'}</span>
                </div>
              )}

              {/* WebP Compression Savings Result */}
              {compressionResult && (
                <div className="mt-3 p-2.5 bg-[#2d7a58]/10 border border-[#2d7a58]/30 rounded-lg text-xs text-[#2d7a58] flex flex-col sm:flex-row items-center justify-between gap-2 text-start">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#2d7a58] shrink-0" />
                    <span className="font-semibold text-[11px]">
                      {language === 'ar' ? '✓ تم ضغط الصورة إلى WebP بنجاح (FR-MED-001)' : '✓ WebP In-Browser Optimized (FR-MED-001)'}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] bg-[#2d7a58]/20 px-2 py-0.5 rounded">
                    {formatFileSize(compressionResult.originalSize)} → {formatFileSize(compressionResult.compressedSize)} (-{compressionResult.savingsPercent}%)
                  </div>
                </div>
              )}

              {/* PDF Document Indicator */}
              {file && !compressionResult && !isCompressing && (
                <div className="mt-3 p-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-xs text-[#565047] flex items-center justify-center gap-2 font-mono text-[11px]">
                  <FileText className="w-4 h-4 text-[#9b452f]" />
                  <span>{fileName} ({formatFileSize(file.size)})</span>
                </div>
              )}
            </div>
          </div>

          {/* Audit Rule Notice */}
          <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-sm text-[11px] text-[#70695f] flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-[#c38b40] shrink-0 mt-0.5" />
            <p>
              {language === 'ar'
                ? 'تخضع جميع الشهادات المرفوعة للمراجعة والتدقيق بواسطة إدارة الرقابة الوطنية قبل اعتمادها. لن يتم إظهار علامة التوثيق إلا بعد فحص أصل المستند.'
                : 'All uploaded certificates are audited by the National Governance Desk before verification. Exporters cannot self-verify documents.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#565047] hover:text-[#202522] transition-colors"
            >
              {language === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
            >
              {uploading
                ? (language === 'ar' ? 'جاري الرفع والتدقيق...' : 'Uploading Document...')
                : (language === 'ar' ? 'رفع للمراجعة' : 'Submit for Verification')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
