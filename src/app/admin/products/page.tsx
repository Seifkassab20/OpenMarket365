'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, ProductItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminProductsPage() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Delete modal
  const [deleteModalProduct, setDeleteModalProduct] = useState<ProductItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getProducts();
      setProducts(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve products from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        (p.title_en && p.title_en.toLowerCase().includes(search.toLowerCase())) ||
        (p.title_ar && p.title_ar.includes(search)) ||
        (p.hs_code && p.hs_code.includes(search)) ||
        (p.companies?.company_name_en &&
          p.companies.company_name_en.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'PUBLISHED' && p.is_published) ||
        (statusFilter === 'DRAFT' && !p.is_published);

      return matchSearch && matchStatus;
    });
  }, [products, search, statusFilter]);

  const handleTogglePublish = async (product: ProductItem) => {
    try {
      const newStatus = !product.is_published;
      const success = await adminService.toggleProductPublish(product.id, newStatus);
      if (success) {
        addToast(
          'success',
          `${product.title_en || 'Commodity'} is now ${newStatus ? 'Published' : 'Draft'}`
        );
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, is_published: newStatus } : p))
        );
      }
    } catch (err) {
      addToast('error', 'Failed to update publish state');
    }
  };

  const handleDelete = async (product: ProductItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.deleteProduct(product.id);
      if (success) {
        addToast('success', `${product.title_en} removed from catalog`);
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
      }
    } catch (err) {
      addToast('error', 'Delete operation failed');
    } finally {
      setActionLoading(false);
      setDeleteModalProduct(null);
    }
  };

  const publishedCount = products.filter((p) => p.is_published).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Commodity Catalog & HS Code Governance
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Egyptian fresh produce, standardized HS codes, packaging parameters, and wholesale trade volumes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] px-3 py-1.5 text-xs font-semibold text-[#202522] shadow-sm">
            Total Commodities: <AnimatedCounter end={products.length} />
          </span>
          <span className="rounded-lg bg-emerald-700/10 border border-emerald-700/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
            Published Live: <AnimatedCounter end={publishedCount} />
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4 shadow-sm">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by commodity (Valencia, Pomegranate, Onion), HS code, exporter..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
            >
              <option value="ALL">All Listing States</option>
              <option value="PUBLISHED">PUBLISHED (PUBLIC)</option>
              <option value="DRAFT">DRAFT (HIDDEN)</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Table */}
      <ScrollReveal delayMs={100}>
        <div className="overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm">
          {loading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Commodity & Spec</th>
                    <th className="px-3 py-3.5 font-semibold">HS Code</th>
                    <th className="px-3 py-3.5 font-semibold">Exporter Showroom</th>
                    <th className="px-3 py-3.5 font-semibold">Packaging & MOQ</th>
                    <th className="px-3 py-3.5 font-semibold">FOB Reference</th>
                    <th className="px-3 py-3.5 font-semibold">Visibility</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#70695f]">
                        No matching commodities found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Commodity */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="font-semibold text-[#202522]">
                            {product.title_en || 'Untitled Commodity'}
                          </div>
                          {product.title_ar && (
                            <div className="text-[11px] text-[#70695f] font-arabic">
                              {product.title_ar}
                            </div>
                          )}
                        </td>

                        {/* HS Code */}
                        <td className="px-3 py-3.5">
                          <span className="rounded-md bg-[#eee8dc] px-2 py-0.5 text-[11px] font-mono font-bold text-[#c38b40] border border-[#b9aa95]">
                            {product.hs_code || '0805.10'}
                          </span>
                        </td>

                        {/* Exporter */}
                        <td className="px-3 py-3.5 font-medium text-[#202522]">
                          {product.companies?.company_name_en || 'Al-Ahram Agro'}
                        </td>

                        {/* Packaging & MOQ */}
                        <td className="px-3 py-3.5">
                          <div className="text-[#202522]">
                            {product.packaging_type || '15kg Telescopic Carton'}
                          </div>
                          <div className="text-[10px] text-[#70695f]">
                            MOQ: {product.minimum_order_quantity || 24} MT (1 FCL)
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-3 py-3.5 font-mono font-bold text-emerald-800">
                          {product.price ? `$${product.price} / MT` : '$650 / MT'}
                        </td>

                        {/* Published Toggle */}
                        <td className="px-3 py-3.5">
                          <button
                            onClick={() => handleTogglePublish(product)}
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-all ${
                              product.is_published
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                product.is_published ? 'bg-emerald-600' : 'bg-[#70695f]'
                              }`}
                            />
                            {product.is_published ? 'PUBLISHED' : 'DRAFT'}
                          </button>
                        </td>

                        {/* Delete */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <button
                            onClick={() => setDeleteModalProduct(product)}
                            className="rounded-md bg-rose-700/10 p-1.5 text-rose-800 hover:bg-rose-700/20 transition-colors"
                            title="Delete Commodity"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteModalProduct}
        title="Remove Commodity from Catalog"
        message={`Are you sure you want to remove "${deleteModalProduct?.title_en}"? It will no longer appear on public portals or search indexes.`}
        confirmText="Remove Product"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={() => deleteModalProduct && handleDelete(deleteModalProduct)}
        onCancel={() => setDeleteModalProduct(null)}
      />
    </div>
  );
}
