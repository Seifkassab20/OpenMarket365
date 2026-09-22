'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  SubscriptionQuota,
} from '@/lib/services/exporterService';
import ProductSpecificationBuilder from '@/components/exporter/ProductSpecificationBuilder';
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Upload,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title_en: '',
    title_ar: '',
    hs_code: '0805.10.00',
    category_id: 1,
    price: 650,
    minimum_order_quantity: 24,
    packaging_type: '15kg Telescopic Carton on Euro-Pallets',
    harvest_season_from: 'January',
    harvest_season_to: 'May',
    body_en: '',
    body_ar: '',
    image_url: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?auto=format&fit=crop&q=80&w=800',
    is_published: true,
  });

  const [specs, setSpecs] = useState<Record<string, string | number>>({
    'Brix Content': '12.5%',
    'Juice Percentage': '48%',
    'Calibers': '48, 56, 64, 72, 80, 88, 100, 113, 125',
    'Pesticide Residue': 'EU MRL Compliant',
    'Pre-Cooling': 'Forced-Air Tunnel to +4°C',
  });

  useEffect(() => {
    exporterService.getSubscriptionQuota('c-nileagro-01').then(setQuota);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title_en.trim()) {
      showToast({
        title: isAr ? 'خطأ' : 'Validation Error',
        message: isAr ? 'يرجى إدخال اسم المنتج بالإنجليزية' : 'Please provide English product title',
        type: 'error',
      });
      return;
    }

    if (!formData.hs_code.trim()) {
      showToast({
        title: isAr ? 'خطأ' : 'Validation Error',
        message: isAr ? 'يرجى إدخال كود النظام المنسق (HS Code)' : 'HS Code is mandatory for customs',
        type: 'error',
      });
      return;
    }

    if (quota?.is_product_quota_reached) {
      showToast({
        title: isAr ? 'تجاوز الحد المسموح' : 'Quota Exceeded',
        message: isAr
          ? 'لقد وصلت للحد الأقصى لعدد المنتجات في باقتك الحالية. يرجى الترقية لإضافة منتجات جديدة.'
          : 'You have reached the maximum allowable products for your subscription tier.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await exporterService.createProduct('c-nileagro-01', {
        ...formData,
        company_id: 'c-nileagro-01',
        dynamic_specs: specs,
        slug: formData.title_en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      });

      if (res.success) {
        showToast({
          title: isAr ? 'تم بنجاح' : 'Product Registered',
          message: isAr
            ? 'تمت إضافة المنتج بنجاح إلى كتالوج المعرض الرقمي'
            : 'New export product successfully added to digital showroom catalog',
          type: 'success',
        });
        router.push('/exporter/products');
      } else {
        showToast({
          title: isAr ? 'تنبيه' : 'Notice',
          message: res.message,
          type: 'warning',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل حفظ بيانات المنتج' : 'Failed to save product to showroom',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/exporter/products"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#70695f] hover:text-[#202522] transition-colors"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة لكتالوج المنتجات' : 'Back to Product Catalog'}</span>
        </Link>

        {quota && (
          <span className="text-[10px] font-mono text-[#70695f] bg-[#e4dac9] border border-[#b9aa95] px-2.5 py-1 rounded-md">
            {quota.plan_name_en} • {quota.current_products} / {quota.max_products} {isAr ? 'منتج مسجل' : 'Products used'}
          </span>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm">
        {/* Header Banner */}
        <div className="p-6 border-b border-[#b9aa95] bg-[#dfd4c1]/50 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'كتالوج التصدير الزراعي' : 'EXPORT SPECIFICATION DOSSIER'}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'إدراج منتج زراعي جديد للتصدير' : 'Register New Export Commodity'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'أدخل بيانات المحصول، المعايير الكيميائية والفيزيائية، خيارات التعبئة، والأسعار الاسترشادية للتنافس في العطاءات الدولية.'
              : 'Provide commodity details, physicochemical parameters, packaging configurations, and indicative FOB/CIF baseline pricing.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
          {/* SECTION 1: Product Nomenclature & Customs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'بيانات المنتج والترميز الجمركي' : 'Product Identity & Harmonized Customs (HS)'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522] flex items-center justify-between">
                  <span>{isAr ? 'اسم المنتج (بالإنجليزية) *' : 'Commercial Title (English) *'}</span>
                  <span className="text-[10px] text-[#70695f] font-normal">Primary International</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Egyptian Valencia Oranges (Class A)"
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522] flex items-center justify-between">
                  <span>{isAr ? 'اسم المنتج (بالعربية)' : 'Commercial Title (Arabic)'}</span>
                  <span className="text-[10px] text-[#70695f] font-normal">المسمى المحلي</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: برتقال فالنسيا صيفي مصري نخب أول للتصدير"
                  value={formData.title_ar}
                  onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f] font-arabic"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522] flex items-center justify-between">
                  <span>{isAr ? 'كود النظام المنسق الدولي (HS Code) *' : 'Harmonized System (HS Code) *'}</span>
                  <span className="text-[10px] text-[#9b452f] font-mono">Tariff Compliance</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 0805.10.00"
                  value={formData.hs_code}
                  onChange={(e) => setFormData({ ...formData, hs_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'التصنيف القطاعي' : 'Sector Category'}
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                >
                  <option value={1}>{isAr ? 'الموالح والحمضيات (Citrus)' : 'Fresh Citrus & Oranges'}</option>
                  <option value={2}>{isAr ? 'الفواكه المجمدة IQF (Frozen Fruits)' : 'Frozen Fruits & IQF'}</option>
                  <option value={3}>{isAr ? 'الخضروات الطازجة (Fresh Vegetables)' : 'Fresh Vegetables & Onions'}</option>
                  <option value={4}>{isAr ? 'الأعشاب والنباتات الطبية (Herbs & Spices)' : 'Medicinal Herbs & Aromatics'}</option>
                  <option value={5}>{isAr ? 'التمور ومنتجات النخيل (Egyptian Dates)' : 'Egyptian Medjool & Fresh Dates'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: Commercial Terms & Seasonality */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'الشروط التجارية وموسم الحصاد' : 'Commercial Terms, Pricing & Seasonality'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'السعر الاسترشادي (USD / طن متري)' : 'Indicative Price (USD / MT)'}
                </label>
                <div className="relative">
                  <span className="absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 font-mono font-bold text-xs text-[#70695f]">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-8 pr-3.5 rtl:pl-3.5 rtl:pr-8 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono font-bold text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الحد الأدنى للطلب (MOQ - طن متري)' : 'Minimum Order Quantity (MOQ - MT)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.minimum_order_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minimum_order_quantity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono font-bold text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  />
                  <span className="absolute top-1/2 -translate-y-1/2 right-3 rtl:right-auto rtl:left-3 font-mono text-[10px] text-[#70695f]">
                    MT / 40ft Reefer
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'فترة الحصاد والتصدير' : 'Harvest / Shipping Window'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={formData.harvest_season_from}
                    onChange={(e) => setFormData({ ...formData, harvest_season_from: e.target.value })}
                    className="px-2 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  >
                    {[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.harvest_season_to}
                    onChange={(e) => setFormData({ ...formData, harvest_season_to: e.target.value })}
                    className="px-2 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  >
                    {[
                      'January',
                      'February',
                      'March',
                      'April',
                      'May',
                      'June',
                      'July',
                      'August',
                      'September',
                      'October',
                      'November',
                      'December',
                    ].map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'نوع التعبئة والتغليف والمنصات (Palletization)' : 'Packaging & Pallet Configuration'}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 15kg Open Top Telescopic Carton on Heat-Treated Euro Pallets (100x120cm)"
                value={formData.packaging_type}
                onChange={(e) => setFormData({ ...formData, packaging_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
              />
            </div>
          </div>

          {/* SECTION 3: Dynamic Technical Specifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'المواصفات الفنية الديناميكية (JSONB)' : 'Dynamic Physicochemical Specifications'}
              </h2>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4">
              <ProductSpecificationBuilder initialSpecs={specs} onChange={setSpecs} />
            </div>
          </div>

          {/* SECTION 4: Descriptions & Image */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                4
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'الوصف التصديري والصور' : 'Export Descriptions & Product Imagery'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الوصف التفصيلي (بالإنجليزية)' : 'Dossier Description (English)'}
                </label>
                <textarea
                  rows={4}
                  placeholder="Detail post-harvest treatments, optical sizing, cold-chain protocol, and target markets..."
                  value={formData.body_en}
                  onChange={(e) => setFormData({ ...formData, body_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الوصف التفصيلي (بالعربية)' : 'Dossier Description (Arabic)'}
                </label>
                <textarea
                  rows={4}
                  placeholder="بيان مواصفات الفرز الآلي، التبريد السريع، التعبئة المعتمدة للأسواق العالمية..."
                  value={formData.body_ar}
                  onChange={(e) => setFormData({ ...formData, body_ar: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f] font-arabic"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'رابط صورة المنتج عالية الدقة' : 'High-Resolution Product Image URL'}
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
              />
            </div>

            {/* Publication Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#202522] block">
                  {isAr ? 'نشر المنتج فوراً في المعرض الرقمي' : 'Publish Product to Live Showroom'}
                </span>
                <span className="text-[11px] text-[#70695f] block">
                  {isAr
                    ? 'عند التفعيل، سيظهر هذا المنتج في محرك بحث المنصة لجميع المستوردين الدوليين.'
                    : 'When enabled, this product becomes instantly indexable in the global buyer search catalog.'}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-[#b9aa95] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:left-auto rtl:after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2d7a58]"></div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#b9aa95] flex items-center justify-end gap-3">
            <Link
              href="/exporter/products"
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={isSubmitting || quota?.is_product_quota_reached}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm ${
                quota?.is_product_quota_reached
                  ? 'bg-[#70695f] text-white opacity-60 cursor-not-allowed'
                  : 'bg-[#9b452f] hover:bg-[#833824] text-white'
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isAr ? 'تسجيل المنتج في الكتالوج' : 'SAVE TO EXPORT CATALOG'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
