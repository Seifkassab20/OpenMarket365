'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCategories } from '@/lib/data/fallbackData';
import { FileSpreadsheet, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function CreateRfqPage() {
  const { language, direction, t } = useLanguage();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push('/rfqs');
    }, 2000);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="glass-panel-gold rounded-3xl p-6 sm:p-10 border border-brand-goldBorder shadow-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/10 border border-brand-emeraldLight/30 text-brand-emeraldLight text-xs font-bold mb-3">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>GLOBAL BUYER PROCUREMENT WIZARD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'ar' ? 'طرح طلب توريد دولي جديد' : 'Submit International Buyer RFQ'}
          </h1>
          <p className="text-xs text-brand-dim mt-1">
            {language === 'ar' 
              ? 'يتم إشعار المصدرين المعتمدين والمطابقين للمواصفات تلقائياً عبر المنصة.'
              : 'Directly broadcast your procurement requirements to certified Egyptian packing stations.'
            }
          </p>
        </div>

        {submitted ? (
          <div className="p-8 rounded-2xl bg-brand-emerald/10 border border-brand-emeraldLight/40 text-center space-y-3">
            <ShieldCheck className="w-12 h-12 text-brand-emeraldLight mx-auto animate-bounce" />
            <h3 className="text-lg font-bold text-white">
              {language === 'ar' ? 'تم نشر طلب التوريد بنجاح!' : 'RFQ Successfully Broadcast!'}
            </h3>
            <p className="text-xs text-brand-muted">
              {language === 'ar' ? 'جاري توجيهه للمصدرين المؤهلين لتلقي عروض الأسعار.' : 'Verified exporters in this category have been notified for sealed bidding.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'القطاع السلعي' : 'Commodity Sector'}
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy border border-brand-border text-white focus:border-brand-gold focus:outline-none"
                >
                  {fallbackCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en} ({cat.hs_code ? `HS ${cat.hs_code}` : ''})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'الكمية المطلوبة' : 'Required Quantity'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-2/3 px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none font-mono"
                  />
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-1/3 px-2 py-2.5 rounded-xl bg-brand-navy border border-brand-border text-white text-xs focus:outline-none"
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
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'شرط الشحن (Incoterm)' : 'Incoterm'}
                </label>
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-brand-navy border border-brand-border text-white focus:border-brand-gold focus:outline-none font-bold"
                >
                  <option value="FOB">FOB (Free On Board)</option>
                  <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'ميناء الوصول المستهدف' : 'Destination Port'}
                </label>
                <input
                  type="text"
                  required
                  value={destPort}
                  onChange={(e) => setDestPort(e.target.value)}
                  placeholder="e.g. Port of Rotterdam, Netherlands"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'الموعد الأقصى للتسليم' : 'Delivery Deadline'}
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">
                {language === 'ar' ? 'المواصفات الفنية المطلوبة ومعايير الجودة' : 'Technical Specifications & Quality Requirements'}
              </label>
              <textarea
                rows={3}
                required
                value={specs}
                onChange={(e) => setSpecs(e.target.value)}
                placeholder="Detail crop caliber (e.g. 56/64/72), minimum Brix percentage, acceptable pesticide thresholds, required certificates (GlobalGAP / ISO 22000)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'مواصفات التعبئة والتغليف' : 'Packaging Requirements'}
                </label>
                <input
                  type="text"
                  required
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                  placeholder="e.g. 15kg Telescopic Cartons, 80 per pallet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  {language === 'ar' ? 'شروط السداد المالي' : 'Payment Terms'}
                </label>
                <input
                  type="text"
                  required
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="e.g. 100% Irrevocable L/C at sight"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald transition-all mt-4"
            >
              {language === 'ar' ? 'نشر طلب التوريد للمصدرين' : 'Publish Procurement RFQ to Verified Exporters'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
