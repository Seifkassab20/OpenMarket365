'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { exporterService, ExporterCompany } from '@/lib/services/exporterService';
import { useToast } from '@/components/admin/ToastNotification';
import {
  Building2,
  ShieldCheck,
  ExternalLink,
  Save,
  CheckCircle2,
  UploadCloud,
  Layers,
  MapPin,
  Warehouse,
} from 'lucide-react';

export default function ExporterShowroomPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<ExporterCompany>>({});

  useEffect(() => {
    async function fetchCompany() {
      try {
        const comp = await exporterService.getCompany();
        setFormData(comp);
      } catch {
        addToast('error', 'Failed to load company profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchCompany();
  }, []);

  const handleChange = (field: keyof ExporterCompany, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) return;
    try {
      setSaving(true);
      const res = await exporterService.updateCompany(formData.id, formData);
      if (res.success) {
        addToast('success', res.message);
      }
    } catch {
      addToast('error', 'Error saving showroom specifications.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white px-2 py-0.5 rounded-xs">
              <ShieldCheck className="w-3 h-3" />
              <span>{language === 'ar' ? 'سجل تجاري موثق' : 'CR VERIFIED'}</span>
            </span>
            <span className="text-xs text-[#70695f] font-mono">
              Slug: {formData.slug || 'nile-agro-export'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            {language === 'ar' ? 'الملف التعريفي والمعرض الرقمي' : 'Digital Showroom Profile'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'تعديل بيانات المنشأة ومحطة التعبئة والمواصفات الفنية المعروضة للمشترين الدوليين.'
              : 'Manage packhouse capacities, sorting machinery, cold storage, and public showroom content.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/exporters/${formData.slug || 'nile-agro-export'}`}
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#70695f]" />
            <span>{language === 'ar' ? 'معاينة المعرض العام' : 'Preview Showroom'}</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic Corporate Identity */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522] pb-2 border-b border-[#b9aa95]/60 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#9b452f]" />
            <span>{language === 'ar' ? 'البيانات التجارية الأساسية' : 'Corporate Identity & Registry'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'الاسم بالإنجليزية' : 'Company Name (English)'}
              </label>
              <input
                type="text"
                required
                value={formData.company_name_en || ''}
                onChange={(e) => handleChange('company_name_en', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'الاسم بالعربية' : 'Company Name (Arabic)'}
              </label>
              <input
                type="text"
                value={formData.company_name_ar || ''}
                onChange={(e) => handleChange('company_name_ar', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'رقم السجل التجاري' : 'Commercial Registry (CR)'}
              </label>
              <input
                type="text"
                disabled
                value={formData.cr_number || ''}
                className="w-full px-3 py-2 bg-[#dcd1bf] border border-[#b9aa95] text-[#565047] font-mono rounded-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'البطاقة الضريبية' : 'Tax Card ID'}
              </label>
              <input
                type="text"
                disabled
                value={formData.tax_id || ''}
                className="w-full px-3 py-2 bg-[#dcd1bf] border border-[#b9aa95] text-[#565047] font-mono rounded-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'المحافظة' : 'Governorate'}
              </label>
              <input
                type="text"
                value={formData.governorate || ''}
                onChange={(e) => handleChange('governorate', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'نبذة عن المنشأة (الإنجليزية)' : 'About Company (English)'}
              </label>
              <textarea
                rows={3}
                value={formData.about_en || ''}
                onChange={(e) => handleChange('about_en', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'نبذة عن المنشأة (العربية)' : 'About Company (Arabic)'}
              </label>
              <textarea
                rows={3}
                value={formData.about_ar || ''}
                onChange={(e) => handleChange('about_ar', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Packhouse Facility & Capacities */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522] pb-2 border-b border-[#b9aa95]/60 flex items-center gap-2">
            <Warehouse className="w-4 h-4 text-[#596348]" />
            <span>{language === 'ar' ? 'طاقات المحطة وسلاسل التبريد' : 'Packhouse Infrastructure & Capacity'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'الطاقة التصديرية السنوية (طن)' : 'Annual Capacity (MT)'}
              </label>
              <input
                type="number"
                value={formData.annual_capacity_ml || ''}
                onChange={(e) => handleChange('annual_capacity_ml', Number(e.target.value))}
                placeholder="65000"
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'سعة التبريد والتخزين (طن)' : 'Cold Storage Capacity (MT)'}
              </label>
              <input
                type="number"
                value={formData.cold_storage_capacity_ml || ''}
                onChange={(e) => handleChange('cold_storage_capacity_ml', Number(e.target.value))}
                placeholder="12000"
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'خطوط الفرز والتعبئة' : 'Sorting Machinery'}
              </label>
              <input
                type="text"
                value={formData.sorting_machinery || ''}
                onChange={(e) => handleChange('sorting_machinery', e.target.value)}
                placeholder="e.g. Aweta Dual-Optical 8-Lane Sizer"
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'تاريخ التصدير والموانئ المعتادة' : 'Export Port History'}
              </label>
              <input
                type="text"
                value={formData.export_port_history || ''}
                onChange={(e) => handleChange('export_port_history', e.target.value)}
                placeholder="Damietta, Port Said, Alexandria"
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'معايير الجودة والشهادات' : 'Primary Quality Standards'}
              </label>
              <input
                type="text"
                value={formData.quality_iso || ''}
                onChange={(e) => handleChange('quality_iso', e.target.value)}
                placeholder="ISO 22000, GlobalGAP v6.0, BRCGS"
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Media & Showcase Links */}
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#202522] pb-2 border-b border-[#b9aa95]/60 flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-[#c38b40]" />
            <span>{language === 'ar' ? 'الوسائط والشعار ومعرض الصور' : 'Visual Assets & Showroom Media'}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'رابط الشعار (Logo URL)' : 'Logo Image URL'}
              </label>
              <input
                type="text"
                value={formData.logo_url || ''}
                onChange={(e) => handleChange('logo_url', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'بانر الغلاف الرئيسي' : 'Cover Banner URL'}
              </label>
              <input
                type="text"
                value={formData.cover_banner_url || ''}
                onChange={(e) => handleChange('cover_banner_url', e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 rounded-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving Changes...') : (language === 'ar' ? 'حفظ التعديلات' : 'Save Changes')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
