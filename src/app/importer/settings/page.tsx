'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import { EyeOff, Save } from 'lucide-react';

const inputClass =
  'w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded';
const labelClass = 'block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1';

export default function ImporterSettingsPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isAr = language === 'ar';

  // FR-AUTH-001 registration fields
  const [companyName, setCompanyName] = useState('EuroFresh Logistics GmbH');
  const [corporateEmail, setCorporateEmail] = useState('procurement@eurofresh-logistics.de');
  const [country, setCountry] = useState('Germany');
  const [whatsapp, setWhatsapp] = useState('+49 40 3099 1120');
  // Sourcing preferences
  const [hubPort, setHubPort] = useState('Port of Rotterdam / Hamburg');
  const [incoterms, setIncoterms] = useState('CIF, CFR');
  const [commodities, setCommodities] = useState('Valencia Oranges, Spring Onions, IQF Strawberries');
  // NFR-SEC-04: hide company name/country from exporter visitor analytics (US-EXP-05)
  const [privateBrowsing, setPrivateBrowsing] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', isAr ? 'تم حفظ ملف المشتري بنجاح!' : 'Buyer profile saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#b9aa95]">
        <h1 className="font-serif text-3xl font-normal text-[#202522]">
          {isAr ? 'ملف المشتري والتفضيلات' : 'Buyer Profile & Preferences'}
        </h1>
        <p className="mt-1 text-xs text-[#70695f]">
          {isAr
            ? 'بيانات شركتك التي تظهر للمصدرين بعد قبول العروض، وتفضيلات التوريد والخصوصية.'
            : 'Company details shared with exporters after you accept a quote, plus sourcing and privacy preferences.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 space-y-6 shadow-sm">
        <fieldset className="space-y-4">
          <legend className="font-serif text-lg text-[#202522] mb-2">{isAr ? 'بيانات الشركة' : 'Company'}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className={labelClass}>{isAr ? 'اسم الشركة' : 'Company Name'}</span>
              <input required value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>{isAr ? 'الدولة' : 'Country'}</span>
              <input required value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>{isAr ? 'البريد الإلكتروني للشركة' : 'Corporate Email'}</span>
              <input
                type="email"
                required
                value={corporateEmail}
                onChange={(e) => setCorporateEmail(e.target.value)}
                className={inputClass}
                dir="ltr"
              />
            </label>
            <label>
              <span className={labelClass}>{isAr ? 'رقم واتساب' : 'WhatsApp Number'}</span>
              <input
                type="tel"
                required
                pattern="\+?[0-9 ]{8,20}"
                title={isAr ? 'رقم دولي، مثال: +49 40 3099 1120' : 'International format, e.g. +49 40 3099 1120'}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={`${inputClass} font-mono`}
                dir="ltr"
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="space-y-4 pt-4 border-t border-[#b9aa95]">
          <legend className="font-serif text-lg text-[#202522] mb-2">{isAr ? 'تفضيلات التوريد' : 'Sourcing Preferences'}</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label>
              <span className={labelClass}>{isAr ? 'ميناء الاستلام الرئيسي' : 'Primary Receiving Port'}</span>
              <input value={hubPort} onChange={(e) => setHubPort(e.target.value)} className={inputClass} />
            </label>
            <label>
              <span className={labelClass}>{isAr ? 'شروط الشحن المفضلة' : 'Preferred Incoterms'}</span>
              <input value={incoterms} onChange={(e) => setIncoterms(e.target.value)} className={inputClass} />
            </label>
          </div>
          <label className="block">
            <span className={labelClass}>{isAr ? 'السلع المستهدفة' : 'Target Commodities'}</span>
            <input value={commodities} onChange={(e) => setCommodities(e.target.value)} className={inputClass} />
          </label>
        </fieldset>

        <fieldset className="pt-4 border-t border-[#b9aa95]">
          <legend className="font-serif text-lg text-[#202522] mb-2">{isAr ? 'الخصوصية' : 'Privacy'}</legend>
          <label className="flex items-start justify-between gap-4 p-4 bg-[#eee8dc] border border-[#b9aa95] rounded cursor-pointer">
            <span className="flex items-start gap-3">
              <EyeOff className="w-4 h-4 mt-0.5 text-[#596348] shrink-0" />
              <span>
                <span className="block text-xs font-bold text-[#202522]">{isAr ? 'التصفح الخاص' : 'Private Browsing'}</span>
                <span className="block text-[11px] text-[#70695f] leading-relaxed">
                  {isAr
                    ? 'عند التفعيل لن يظهر اسم شركتك أو دولتك في إحصائيات زوار ملفات المصدرين.'
                    : "When on, your company name and country won't appear in exporters' profile visitor analytics."}
                </span>
              </span>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={privateBrowsing}
              onChange={(e) => setPrivateBrowsing(e.target.checked)}
              className="mt-1 w-4 h-4 accent-[#596348] shrink-0"
            />
          </label>
        </fieldset>

        <div className="pt-4 border-t border-[#b9aa95] flex items-center justify-end gap-3">
          <Link
            href="/importer"
            className="px-4 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isAr ? 'حفظ' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
