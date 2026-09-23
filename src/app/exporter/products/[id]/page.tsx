'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterProduct,
} from '@/lib/services/exporterService';
import ProductSpecificationBuilder from '@/components/exporter/ProductSpecificationBuilder';
import {
  Package,
  ArrowLeft,
  ArrowRight,
  Save,
  Trash2,
  ExternalLink,
  Calendar,
  AlertCircle,
  Eye,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [product, setProduct] = useState<ExporterProduct | null>(null);
  const [specs, setSpecs] = useState<Record<string, string | number>>({});

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    setIsLoading(true);
    try {
      const found = await exporterService.getProductById(productId);
      if (found) {
        setProduct(found);
        setSpecs(found.dynamic_specs || {});
      } else {
        showToast({
          title: isAr ? 'غير موجود' : 'Not Found',
          message: isAr ? 'لم يتم العثور على المنتج المطلوب' : 'Product could not be located',
          type: 'error',
        });
        router.push('/exporter/products');
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل بيانات المنتج' : 'Failed to retrieve product details',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setIsSaving(true);
    try {
      const res = await exporterService.updateProduct(product.id, {
        ...product,
        dynamic_specs: specs,
      });

      if (res.success) {
        showToast({
          title: isAr ? 'تم التحديث' : 'Specifications Saved',
          message: isAr
            ? 'تم تحديث بيانات المنتج ومواصفاته الفنية في المعرض بنجاح'
            : 'Product details and dynamic specifications successfully updated',
          type: 'success',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحديث المنتج' : 'Failed to update product',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    setIsDeleting(true);
    try {
      const res = await exporterService.deleteProduct(product.id);
      if (res.success) {
        showToast({
          title: isAr ? 'تم الحذف' : 'Product Removed',
          message: isAr ? 'تم حذف المنتج من المعرض بنجاح' : 'Product removed from showroom',
          type: 'success',
        });
        router.push('/exporter/products');
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل حذف المنتج' : 'Failed to delete product',
        type: 'error',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#70695f]">
          {isAr ? 'جارِ تحميل ملف مواصفات المنتج...' : 'Loading product dossier...'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/exporter/products"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#70695f] hover:text-[#202522] transition-colors"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة لكتالوج المنتجات' : 'Back to Product Catalog'}</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/products/${product.slug || product.id}`}
            target="_blank"
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-[#9b452f]" />
            <span>{isAr ? 'معاينة في المعرض العام' : 'Public Preview'}</span>
            <ExternalLink className="w-3 h-3 text-[#70695f]" />
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="p-6 border-b border-[#b9aa95] bg-[#dfd4c1]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
                {isAr ? 'تعديل ملف المنتج التصديري' : 'EXPORT SPECIFICATION DOSSIER'}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                HS {product.hs_code}
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#202522]">
              {isAr ? product.title_ar || product.title_en : product.title_en}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold border border-[#9b452f]/40 hover:bg-[#9b452f]/10 text-[#9b452f] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'حذف المنتج' : 'Delete Product'}</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
          {/* SECTION 1: Titles & Customs */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'المسميات والترميز الجمركي' : 'Product Identity & Harmonized Customs'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'اسم المنتج (بالإنجليزية) *' : 'Commercial Title (English) *'}
                </label>
                <input
                  type="text"
                  required
                  value={product.title_en}
                  onChange={(e) => setProduct({ ...product, title_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'اسم المنتج (بالعربية)' : 'Commercial Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={product.title_ar || ''}
                  onChange={(e) => setProduct({ ...product, title_ar: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] font-arabic"
                  dir="rtl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'كود النظام المنسق الدولي (HS Code) *' : 'Harmonized System (HS Code) *'}
                </label>
                <input
                  type="text"
                  required
                  value={product.hs_code}
                  onChange={(e) => setProduct({ ...product, hs_code: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'التعبئة والتغليف المعتمدة' : 'Standard Export Packaging'}
                </label>
                <input
                  type="text"
                  required
                  value={product.packaging_type}
                  onChange={(e) => setProduct({ ...product, packaging_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Commercial Terms & Pricing */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#b9aa95]/40">
              <span className="w-5 h-5 rounded-full bg-[#9b452f] text-white text-[10px] font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
                {isAr ? 'الأسعار والحد الأدنى وموسم التصدير' : 'Pricing, MOQ & Seasonality'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'السعر الاسترشادي (USD / MT)' : 'Indicative Price (USD / MT)'}
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
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                    className="w-full pl-8 pr-3.5 rtl:pl-3.5 rtl:pr-8 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono font-bold text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الحد الأدنى للطلب (MOQ - MT)' : 'Minimum Order Quantity (MOQ - MT)'}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={product.minimum_order_quantity}
                  onChange={(e) =>
                    setProduct({ ...product, minimum_order_quantity: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono font-bold text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'موسم الحصاد والتصدير' : 'Harvest / Shipping Window'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="From (e.g. Jan)"
                    value={product.harvest_season_from || ''}
                    onChange={(e) =>
                      setProduct({ ...product, harvest_season_from: e.target.value })
                    }
                    className="px-2.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  />
                  <input
                    type="text"
                    placeholder="To (e.g. May)"
                    value={product.harvest_season_to || ''}
                    onChange={(e) => setProduct({ ...product, harvest_season_to: e.target.value })}
                    className="px-2.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                  />
                </div>
              </div>
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
                {isAr ? 'الوصف التصديري والصورة' : 'Export Descriptions & Photography'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الوصف بالإنجليزية' : 'Description (English)'}
                </label>
                <textarea
                  rows={4}
                  value={product.body_en || ''}
                  onChange={(e) => setProduct({ ...product, body_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold text-[#202522]">
                  {isAr ? 'الوصف بالعربية' : 'Description (Arabic)'}
                </label>
                <textarea
                  rows={4}
                  value={product.body_ar || ''}
                  onChange={(e) => setProduct({ ...product, body_ar: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f] font-arabic"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'رابط صورة المنتج' : 'Product Photo URL'}
              </label>
              <input
                type="url"
                value={product.image_url || ''}
                onChange={(e) => setProduct({ ...product, image_url: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
              />
            </div>

            {/* Publication Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#eee8dc] border border-[#b9aa95] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#202522] block">
                  {isAr ? 'نشر المنتج في المعرض الرقمي' : 'Live Showroom Visibility'}
                </span>
                <span className="text-[11px] text-[#70695f] block">
                  {product.is_published
                    ? isAr
                      ? 'المنتج منشور حالياً ومتاح لجميع المستوردين الدوليين'
                      : 'Product is currently live and discoverable in global search'
                    : isAr
                    ? 'المنتج مخفي حالياً ومحفوظ كمسودة خاصة بشركتك'
                    : 'Product is currently hidden as a private company draft'}
                </span>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.is_published}
                  onChange={(e) => setProduct({ ...product, is_published: e.target.checked })}
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
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white transition-all shadow-sm flex items-center gap-2"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{isAr ? 'حفظ التعديلات' : 'SAVE CHANGES'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-[#202522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#9b452f]/10 border border-[#9b452f]/30 flex items-center justify-center text-[#9b452f]">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#202522]">
                {isAr ? 'تأكيد حذف المنتج' : 'Confirm Product Removal'}
              </h3>
              <p className="text-xs text-[#70695f] leading-relaxed">
                {isAr
                  ? `هل أنت متأكد من حذف "${product.title_ar || product.title_en}"؟ سيتم حذف المنتج نهائياً من قاعدة البيانات.`
                  : `Are you sure you want to permanently delete "${product.title_en}" from your catalog?`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] hover:bg-[#dfd4c1] transition-colors"
                disabled={isDeleting}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white transition-colors flex items-center gap-2"
              >
                {isDeleting && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{isAr ? 'تأكيد الحذف' : 'Delete Product'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
