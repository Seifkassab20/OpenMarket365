'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterProduct,
  SubscriptionQuota,
} from '@/lib/services/exporterService';
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ArrowUpDown,
  Tag,
  Boxes,
  ExternalLink,
} from 'lucide-react';

export default function ExporterProductsPage() {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [products, setProducts] = useState<ExporterProduct[]>([]);
  const [quota, setQuota] = useState<SubscriptionQuota | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<ExporterProduct | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [productsData, quotaData] = await Promise.all([
        exporterService.getProducts('c-nileagro-01'),
        exporterService.getSubscriptionQuota('c-nileagro-01'),
      ]);
      setProducts(productsData);
      setQuota(quotaData);
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل كتالوج المنتجات' : 'Failed to load product catalog',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await exporterService.deleteProduct(deleteTarget.id);
      if (res.success) {
        setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        showToast({
          title: isAr ? 'تم الحذف' : 'Product Removed',
          message: isAr
            ? `تم حذف المنتج "${deleteTarget.title_ar || deleteTarget.title_en}" بنجاح`
            : `Product "${deleteTarget.title_en}" removed from showroom`,
          type: 'success',
        });
        setDeleteTarget(null);
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

  const handleTogglePublish = async (product: ExporterProduct) => {
    const newStatus = !product.is_published;
    try {
      const res = await exporterService.updateProduct(product.id, {
        is_published: newStatus,
      });
      if (res.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_published: newStatus } : p))
        );
        showToast({
          title: isAr ? 'تم تحديث الحالة' : 'Status Updated',
          message: newStatus
            ? (isAr ? 'المنتج متاح الآن في المعرض العام' : 'Product is now live on digital showroom')
            : (isAr ? 'تم إخفاء المنتج من العرض العام' : 'Product is now hidden from public showroom'),
          type: 'success',
        });
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'تعذر تغيير حالة النشر' : 'Could not change publication status',
        type: 'error',
      });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.title_ar && p.title_ar.includes(searchQuery)) ||
      p.hs_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.packaging_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL'
        ? true
        : statusFilter === 'PUBLISHED'
        ? p.is_published
        : !p.is_published;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'كتالوج التصدير الزراعي' : 'EXPORT CATALOG MANAGEMENT'}
            </span>
            {quota && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                {quota.current_products} / {quota.max_products} {isAr ? 'منتج مسجل' : 'Products'}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'إدارة كتالوج المنتجات الزراعية' : 'Product Catalog Management'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'إدارة المنتجات، المواصفات الفنية الديناميكية، التعبئة والتغليف، وكود النظام المنسق (HS Code) للمشترين الدوليين.'
              : 'Configure products, dynamic technical specifications, export packaging, and HS codes for international buyers.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/exporter/products/new"
            className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm ${
              quota?.is_product_quota_reached
                ? 'bg-[#70695f] text-white opacity-60 cursor-not-allowed pointer-events-none'
                : 'bg-[#9b452f] hover:bg-[#833824] text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة منتج جديد' : 'ADD NEW PRODUCT'}</span>
          </Link>
        </div>
      </div>

      {/* Quota warning banner if quota is near limit */}
      {quota && quota.current_products >= quota.max_products * 0.9 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#c38b40]/10 border border-[#c38b40]/30 text-[#7a521e]">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#c38b40]" />
          <div className="text-xs flex-1">
            <span className="font-bold">
              {isAr ? 'تنبيه حد الباقة: ' : 'Plan Capacity Notice: '}
            </span>
            {isAr
              ? `لقد استخدمت ${quota.current_products} من أصل ${quota.max_products} منتج متاح في باقتك الحالية (${quota.plan_name_ar}).`
              : `You have utilized ${quota.current_products} of your ${quota.max_products} allowable products under the ${quota.plan_name_en}.`}
          </div>
          <Link
            href="/exporter/subscription"
            className="text-xs font-mono font-bold text-[#9b452f] hover:underline whitespace-nowrap"
          >
            {isAr ? 'ترقية الباقة ←' : 'Upgrade Plan →'}
          </Link>
        </div>
      )}

      {/* Search, Filter & Actions Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
          <input
            type="text"
            placeholder={
              isAr
                ? 'بحث بالاسم، كود HS، أو نوع التعبئة والتغليف...'
                : 'Search by product title, HS code, packaging...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded-lg text-xs text-[#202522] placeholder-[#70695f] focus:outline-none focus:border-[#9b452f]"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#eee8dc] border border-[#b9aa95] rounded-lg p-1 text-xs font-mono">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-[#202522] text-white font-bold'
                  : 'text-[#70695f] hover:text-[#202522]'
              }`}
            >
              {isAr ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('PUBLISHED')}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === 'PUBLISHED'
                  ? 'bg-[#2d7a58] text-white font-bold'
                  : 'text-[#70695f] hover:text-[#202522]'
              }`}
            >
              {isAr ? 'منشور' : 'Live'}
            </button>
            <button
              onClick={() => setStatusFilter('DRAFT')}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === 'DRAFT'
                  ? 'bg-[#70695f] text-white font-bold'
                  : 'text-[#70695f] hover:text-[#202522]'
              }`}
            >
              {isAr ? 'مسودة' : 'Hidden'}
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid / Cards */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl">
          <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#70695f]">
            {isAr ? 'جارِ تحميل كتالوج المنتجات الزراعية...' : 'Loading agricultural export products...'}
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-[#eee8dc] border border-[#b9aa95] flex items-center justify-center mx-auto text-[#70695f]">
            <Package className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-serif font-bold text-[#202522]">
              {isAr ? 'لا توجد منتجات مطابقة للبحث' : 'No Products Found'}
            </h3>
            <p className="text-xs text-[#70695f] max-w-sm mx-auto">
              {isAr
                ? 'جرّب تعديل كلمات البحث أو الفلاتر، أو قم بإضافة محصول تصديري جديد لمعرضك الرقمي.'
                : 'Try adjusting your search criteria or register a new export commodity to your showroom.'}
            </p>
          </div>
          <Link
            href="/exporter/products/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#9b452f] hover:bg-[#833824] text-white rounded-xl text-xs font-mono font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? 'إضافة أول منتج الآن' : 'Add First Product'}</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const hasSpecs = product.dynamic_specs && Object.keys(product.dynamic_specs).length > 0;
            return (
              <div
                key={product.id}
                className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Image & Status Tag */}
                <div className="relative aspect-[16/10] bg-[#eee8dc] border-b border-[#b9aa95] overflow-hidden group">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title_en}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#70695f]">
                      <Package className="w-10 h-10 opacity-40" />
                    </div>
                  )}

                  {/* Badges Over Image */}
                  <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold backdrop-blur-md shadow-sm ${
                        product.is_published
                          ? 'bg-[#2d7a58]/90 text-white'
                          : 'bg-[#70695f]/90 text-white'
                      }`}
                    >
                      {product.is_published
                        ? isAr
                          ? 'منشور في المعرض'
                          : 'LIVE IN SHOWROOM'
                        : isAr
                        ? 'مسودة غير منشورة'
                        : 'DRAFT / HIDDEN'}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3">
                    <span className="px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[#202522]/85 text-[#e4dac9] backdrop-blur-md">
                      HS {product.hs_code}
                    </span>
                  </div>

                  {product.harvest_season_from && (
                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#eee8dc]/95 text-[#202522] border border-[#b9aa95]/80 shadow-sm">
                      <Calendar className="w-3 h-3 text-[#9b452f]" />
                      <span>
                        {product.harvest_season_from} - {product.harvest_season_to}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="space-y-0.5">
                      <h3 className="text-base font-serif font-bold text-[#202522] line-clamp-1 hover:text-[#9b452f] transition-colors">
                        {isAr ? product.title_ar || product.title_en : product.title_en}
                      </h3>
                      {product.title_ar && !isAr && (
                        <p className="text-xs text-[#70695f] font-arabic line-clamp-1">
                          {product.title_ar}
                        </p>
                      )}
                    </div>

                    <p className="text-xs text-[#70695f] line-clamp-2 leading-relaxed">
                      {isAr ? product.body_ar || product.body_en : product.body_en}
                    </p>
                  </div>

                  {/* Commercial Specifications Block */}
                  <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-[#70695f]">
                        {isAr ? 'السعر الاسترشادي' : 'Indicative Price'}
                      </span>
                      <span className="font-mono font-bold text-[#9b452f] text-sm">
                        ${product.price} <span className="text-[10px] text-[#70695f]">/ MT</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#b9aa95]/40 pt-1.5">
                      <span className="text-[10px] font-mono text-[#70695f]">
                        {isAr ? 'الحد الأدنى للطلب (MOQ)' : 'Minimum Order (MOQ)'}
                      </span>
                      <span className="font-mono font-bold text-[#202522]">
                        {product.minimum_order_quantity} MT
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-[#b9aa95]/40 pt-1.5">
                      <span className="text-[10px] font-mono text-[#70695f]">
                        {isAr ? 'التعبئة والتغليف' : 'Packaging'}
                      </span>
                      <span className="font-mono text-[11px] text-[#202522] truncate max-w-[160px]">
                        {product.packaging_type}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Technical Specs Tags */}
                  {hasSpecs && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono font-bold text-[#70695f] uppercase tracking-wider block">
                        {isAr ? 'المواصفات الفنية' : 'Technical Specifications'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(product.dynamic_specs || {})
                          .slice(0, 3)
                          .map(([key, val]) => (
                            <span
                              key={key}
                              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#dfd4c1] text-[#202522] border border-[#b9aa95]/60 truncate max-w-[160px]"
                            >
                              <strong className="text-[#9b452f]">{key}:</strong> {String(val)}
                            </span>
                          ))}
                        {Object.keys(product.dynamic_specs || {}).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#dfd4c1] text-[#70695f]">
                            +{Object.keys(product.dynamic_specs || {}).length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleTogglePublish(product)}
                      className={`text-[10px] font-mono font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                        product.is_published
                          ? 'border-[#70695f] text-[#70695f] hover:bg-[#dfd4c1]'
                          : 'border-[#2d7a58] text-[#2d7a58] hover:bg-[#2d7a58]/10'
                      }`}
                    >
                      {product.is_published
                        ? isAr
                          ? 'إخفاء من العرض'
                          : 'Hide'
                        : isAr
                        ? 'تفعيل النشر'
                        : 'Publish'}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/exporter/products/${product.id}`}
                        className="p-1.5 rounded-lg border border-[#b9aa95] hover:bg-[#eee8dc] text-[#202522] transition-colors"
                        title={isAr ? 'تعديل بيانات المنتج' : 'Edit Product'}
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => setDeleteTarget(product)}
                        className="p-1.5 rounded-lg border border-[#b9aa95] hover:border-[#9b452f] hover:bg-[#9b452f]/10 text-[#70695f] hover:text-[#9b452f] transition-colors"
                        title={isAr ? 'حذف المنتج' : 'Delete Product'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#202522]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 space-y-5 shadow-xl">
            <div className="w-12 h-12 rounded-xl bg-[#9b452f]/10 border border-[#9b452f]/30 flex items-center justify-center text-[#9b452f]">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-serif font-bold text-[#202522]">
                {isAr ? 'تأكيد إزالة المنتج من المعرض' : 'Confirm Product Removal'}
              </h3>
              <p className="text-xs text-[#70695f] leading-relaxed">
                {isAr
                  ? `هل أنت متأكد من رغبتك في حذف "${deleteTarget.title_ar || deleteTarget.title_en}"؟ سيتم حذفه نهائياً من الكتالوج العام ولن يظهر للمستوردين الدوليين.`
                  : `Are you sure you want to delete "${deleteTarget.title_en}"? It will be permanently removed from your digital showroom catalog.`}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
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
