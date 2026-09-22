'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCategories } from '@/lib/data/fallbackData';
import { FileSpreadsheet, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CreateRfqPage() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  const [categoryId, setCategoryId] = useState<number>(1);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Metric Tons');
  const [destCountry, setDestCountry] = useState('NLD');
  const [destPort, setDestPort] = useState('');
  const [incoterm, setIncoterm] = useState('CIF');
  const [deadline, setDeadline] = useState('');
  const [specs, setSpecs] = useState('');
  const [packaging, setPackaging] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('100% L/C at sight');
  const [submitted, setSubmitted] = useState(false);

  const ArrowIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/rfqs');
    }, 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <Link
        href="/rfqs"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#9b452f] hover:underline transition-colors uppercase tracking-[0.16em]"
      >
        <ArrowIcon className="w-4 h-4" />
        <span>{language === 'ar' ? 'العودة إلى مكتب التداول' : 'Back to Trade Desk'}</span>
      </Link>

      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-10 shadow-sm">
        <div className="mb-8 pb-6 border-b border-[#b9aa95]">
          <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>04 / PROCUREMENT WIZARD • GLOBAL BUYER SOLICITATION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#202522] tracking-tight">
            {language === 'ar' ? 'طرح طلب توريد دولي جديد' : 'Submit Procurement RFQ.'}
          </h1>
          <p className="text-xs text-[#70695f] mt-2 leading-relaxed">
            {language === 'ar' 
              ? 'يتم إشعار المصدرين المعتمدين والمطابقين للمواصفات تلقائياً عبر المنصة لتقديم عروض مغلقة.'
              : 'Broadcast verified requirements to certified Egyptian packing stations. Quotes remain sealed and encrypted until unlocked.'
            }
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-[#596348]/10 border border-[#596348] text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-[#596348] mx-auto animate-bounce" />
            <h3 className="text-xl font-serif text-[#202522] font-bold">
              {language === 'ar' ? 'تم نشر طلب التوريد بنجاح!' : 'RFQ Successfully Broadcast!'}
            </h3>
            <p className="text-xs text-[#70695f]">
              {language === 'ar' ? 'جاري توجيهه للمصدرين المؤهلين لتلقي عروض الأسعار.' : 'Verified exporters in this category have been notified for sealed bidding.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'القطاع السلعي' : 'Commodity Sector'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none"
                >
                  {fallbackCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en} ({cat.hs_code ? `HS ${cat.hs_code}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'الكمية المطلوبة' : 'Required Quantity'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-2/3 px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none font-mono"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-1/3 px-2 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs focus:outline-none font-medium"
                  >
                    <option value="Metric Tons">MT</option>
                    <option value="40ft Reefer Containers">Reefers</option>
                    <option value="Kilograms">KG</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'شرط الشحن (Incoterm)' : 'Incoterm'}
                </label>
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none font-bold"
                >
                  <option value="FOB">FOB (Free On Board)</option>
                  <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'ميناء الوصول المستهدف' : 'Destination Port'}
                </label>
                <input
                  type="text"
                  required
                  value={destPort}
                  onChange={(e) => setDestPort(e.target.value)}
                  placeholder="e.g. Port of Rotterdam, Netherlands"
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'الموعد الأقصى للتسليم' : 'Delivery Deadline'}
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                {language === 'ar' ? 'المواصفات الفنية المطلوبة ومعايير الجودة' : 'Technical Specifications & Quality Requirements'}
              </label>
              <textarea
                rows={3}
                required
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="Detail crop caliber (e.g. 56/64/72), minimum Brix percentage, acceptable pesticide thresholds, required certificates (GlobalGAP / ISO 22000)..."
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'مواصفات التعبئة والتغليف' : 'Packaging Requirements'}
                </label>
                <input
                  type="text"
                  required
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="e.g. 15kg Telescopic Cartons, 80 per pallet"
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1">
                  {language === 'ar' ? 'شروط السداد المالي' : 'Payment Terms'}
                </label>
                <input
                  type="text"
                  required
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. 100% Irrevocable L/C at sight"
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 font-bold text-xs uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white transition-colors shadow-sm mt-4"
            >
              {language === 'ar' ? 'نشر طلب التوريد للمصدرين' : 'Publish Procurement RFQ to Verified Exporters'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

