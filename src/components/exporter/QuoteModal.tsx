'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ExporterRfq } from '@/lib/services/exporterService';
import { X, Send, Lock, ShieldCheck, DollarSign } from 'lucide-react';

interface QuoteModalProps {
  isOpen: boolean;
  rfq: ExporterRfq | null;
  onClose: () => void;
  onSubmit: (payload: {
    unit_price: number;
    currency: string;
    port_of_loading: string;
    lead_time_days: number;
    valid_until: string;
    commercial_terms: string;
    packaging_details: string;
    delivery_terms: string;
  }) => void;
}

export default function QuoteModal({
  isOpen,
  rfq,
  onClose,
  onSubmit,
}: QuoteModalProps) {
  const { language } = useLanguage();

  const [unitPrice, setUnitPrice] = useState<number>(640);
  const [currency, setCurrency] = useState<string>('USD');
  const [portOfLoading, setPortOfLoading] = useState<string>('Damietta Port, Egypt');
  const [leadTime, setLeadTime] = useState<number>(10);
  const [validUntil, setValidUntil] = useState<string>('2026-10-31');
  const [packagingDetails, setPackagingDetails] = useState<string>('15kg telescopic open-top boxes, 80 boxes per Euro-pallet (100x120cm).');
  const [commercialTerms, setCommercialTerms] = useState<string>('Includes phytosanitary inspection, export declaration, and loading fees.');
  const [deliveryTerms, setDeliveryTerms] = useState<string>('FOB Damietta');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !rfq) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      onSubmit({
        unit_price: Number(unitPrice),
        currency,
        port_of_loading: portOfLoading,
        lead_time_days: Number(leadTime),
        valid_until: validUntil,
        packaging_details: packagingDetails,
        commercial_terms: commercialTerms,
        delivery_terms: deliveryTerms,
      });
      setSubmitting(false);
      onClose();
    }, 600);
  };

  const calculatedTotal = (unitPrice * rfq.required_quantity).toLocaleString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#e4dac9] border border-[#b9aa95] rounded-xl shadow-2xl p-6 space-y-6 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]">
          <div>
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-[#9b452f]" />
              <h3 className="text-base font-serif font-bold text-[#202522]">
                {language === 'ar' ? 'تقديم عرض سعر تجاري مغلق' : 'Submit Sealed Commercial Quotation'}
              </h3>
            </div>
            <p className="text-xs text-[#70695f] mt-0.5">
              RFQ Ref: {rfq.id} • {language === 'ar' ? rfq.commodity_ar : rfq.commodity_en}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#70695f] hover:text-[#202522] hover:bg-[#eee8dc]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RFQ Target Summary */}
        <div className="p-3.5 bg-[#eee8dc] border border-[#b9aa95] rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#70695f] uppercase font-bold block">
              {language === 'ar' ? 'الكمية المطلوبة' : 'Volume'}
            </span>
            <span className="font-serif font-bold text-[#202522] text-sm">
              {rfq.required_quantity} {rfq.quantity_unit}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#70695f] uppercase font-bold block">
              {language === 'ar' ? 'ميناء الوصول' : 'Destination Port'}
            </span>
            <span className="font-semibold text-[#202522] text-xs">
              {rfq.destination_port}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#70695f] uppercase font-bold block">
              {language === 'ar' ? 'شرط الشحن' : 'Incoterms'}
            </span>
            <span className="font-semibold text-[#202522] text-xs">
              {rfq.incoterm}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#70695f] uppercase font-bold block">
              {language === 'ar' ? 'أقصى موعد توريد' : 'Delivery Target'}
            </span>
            <span className="font-semibold text-[#9b452f] text-xs">
              {rfq.delivery_deadline}
            </span>
          </div>
        </div>

        {/* Quotation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Unit Price */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'سعر الوحدة' : 'Unit Price'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none font-bold"
                />
                <span className="absolute left-2.5 top-2 text-[#70695f] font-mono font-bold text-xs">$</span>
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'العملة' : 'Currency'}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            {/* Total Estimated Value */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'إجمالي قيمة العرض' : 'Estimated Total'}
              </label>
              <div className="w-full px-3 py-2 bg-[#dcd1bf] border border-[#b9aa95] text-[#202522] rounded-sm font-bold text-xs font-mono flex items-center justify-between">
                <span>{calculatedTotal}</span>
                <span className="text-[#9b452f] font-mono">{currency}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Port of Loading */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'ميناء الشحن المصري' : 'Port of Loading'}
              </label>
              <select
                value={portOfLoading}
                onChange={(e) => setPortOfLoading(e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              >
                <option value="Damietta Port, Egypt">Damietta Port (ميناء دمياط)</option>
                <option value="Port Said West / East">Port Said (ميناء بورسعيد)</option>
                <option value="Alexandria Sea Port">Alexandria Port (ميناء الإسكندرية)</option>
                <option value="Ain Sokhna Red Sea Port">Ain Sokhna Port (ميناء السخنة)</option>
                <option value="Cairo International Airport (Air Cargo)">Cairo Cargo Terminal (شحن جوي)</option>
              </select>
            </div>

            {/* Lead Time */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'فترة التجهيز (أيام)' : 'Lead Time (Days)'}
              </label>
              <input
                type="number"
                required
                min="1"
                value={leadTime}
                onChange={(e) => setLeadTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none font-bold"
              />
            </div>

            {/* Quote Validity */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                {language === 'ar' ? 'صلاحية العرض حتى' : 'Quote Valid Until'}
              </label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
              />
            </div>
          </div>

          {/* Delivery & Incoterms */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'شروط التسليم المقترحة' : 'Delivery & Incoterm Details'}
            </label>
            <input
              type="text"
              value={deliveryTerms}
              onChange={(e) => setDeliveryTerms(e.target.value)}
              placeholder="e.g. FOB Damietta or CIF Hamburg including marine insurance"
              className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          {/* Packaging Details */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'مواصفات التعبئة والتغليف' : 'Packaging & Palletization Specs'}
            </label>
            <textarea
              rows={2}
              value={packagingDetails}
              onChange={(e) => setPackagingDetails(e.target.value)}
              className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none resize-none"
            />
          </div>

          {/* Commercial Terms & Notes */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#202522] mb-1">
              {language === 'ar' ? 'الشروط التجارية وطريقة السداد' : 'Commercial Terms & Payment Notes'}
            </label>
            <textarea
              rows={2}
              value={commercialTerms}
              onChange={(e) => setCommercialTerms(e.target.value)}
              className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] rounded-sm focus:border-[#9b452f] focus:outline-none resize-none"
            />
          </div>

          {/* Anti-Collusion Confidentiality Guarantee Notice */}
          <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-sm text-[11px] text-[#70695f] flex items-start gap-2">
            <Lock className="w-4 h-4 text-[#9b452f] shrink-0 mt-0.5" />
            <p>
              {language === 'ar'
                ? 'يخضع هذا العرض لقواعد المناقصات المغلقة المشفرة. لن يتمكن أي مصدّر منافس من رؤية أسعارك أو شروطك، وسيتم تسليم العرض مباشرة للمشتري الدولي عبر منصة سوق ٣٦٥.'
                : 'Anti-collusion protocol: Your commercial bid is encrypted and sealed. Competing exporters are strictly prevented from viewing your pricing or terms.'}
            </p>
          </div>

          {/* Actions */}
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
              disabled={submitting}
              className="px-5 py-2.5 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>
                {submitting
                  ? (language === 'ar' ? 'جاري إرسال العرض المغلق...' : 'Submitting Sealed Quote...')
                  : (language === 'ar' ? 'إرسال العرض التجاري' : 'Submit Confidential Quote')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
