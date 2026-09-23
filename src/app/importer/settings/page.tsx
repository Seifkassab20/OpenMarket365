'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import { Settings, Building2, MapPin, Anchor, ShieldCheck, Save } from 'lucide-react';

export default function ImporterSettingsPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();

  const [companyName, setCompanyName] = useState('EuroFresh Logistics GmbH');
  const [hubPort, setHubPort] = useState('Port of Rotterdam / Hamburg');
  const [incoterms, setIncoterms] = useState('CIF, CFR');
  const [annualVolume, setAnnualVolume] = useState('18,000 MT');
  const [commodities, setCommodities] = useState('Valencia Oranges, Spring Onions, IQF Strawberries');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', language === 'ar' ? 'تم حفظ تفضيلات المشتريات بنجاح!' : 'Procurement preferences saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-[#b9aa95]">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
            BUYER CLEARANCE
          </span>
          <span className="text-xs text-[#70695f] font-mono">Profile & Sourcing Configuration</span>
        </div>
        <h1 className="font-serif text-3xl font-normal text-[#202522]">
          {language === 'ar' ? 'إعدادات حساب المشتري والموانئ' : 'Buyer Profile & Sourcing Preferences'}
        </h1>
        <p className="mt-1 text-xs text-[#70695f]">
          {language === 'ar'
            ? 'تحديث بيانات شركة الاستيراد، الموانئ المفضلة، والشروط التجارية لتلقي عروض أسعار مطابقة.'
            : 'Configure your company procurement hub, destination ports, and Incoterm preferences.'}
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1">
              Company Legal Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1">
                Primary Receiving Hub / Port
              </label>
              <input
                type="text"
                value={hubPort}
                onChange={(e) => setHubPort(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1">
                Preferred Incoterms
              </label>
              <input
                type="text"
                value={incoterms}
                onChange={(e) => setIncoterms(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1">
                Estimated Annual Import Volume
              </label>
              <input
                type="text"
                value={annualVolume}
                onChange={(e) => setAnnualVolume(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-[#70695f] mb-1">
                Target Sourcing Commodities
              </label>
              <input
                type="text"
                value={commodities}
                onChange={(e) => setCommodities(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] rounded"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#b9aa95] flex items-center justify-end gap-3">
          <Link
            href="/importer"
            className="px-4 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-6 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}
