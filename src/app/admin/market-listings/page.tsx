'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, MarketListingItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminMarketListingsPage() {
  const { addToast } = useToast();
  const [listings, setListings] = useState<MarketListingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data = await adminService.getListings();
      setListings(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve secondary market listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const matchSearch =
        !search ||
        (l.title && l.title.toLowerCase().includes(search.toLowerCase())) ||
        (l.location && l.location.toLowerCase().includes(search.toLowerCase()));

      const matchStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ACTIVE' && l.is_active) ||
        (statusFilter === 'INACTIVE' && !l.is_active);

      return matchSearch && matchStatus;
    });
  }, [listings, search, statusFilter]);

  const handleToggleActive = async (listing: MarketListingItem) => {
    try {
      const newStatus = !listing.is_active;
      const success = await adminService.toggleListingActive(listing.id, newStatus);
      if (success) {
        addToast(
          'success',
          `Cargo lot ${newStatus ? 'activated for clearance' : 'paused'}`
        );
        setListings((prev) =>
          prev.map((l) => (l.id === listing.id ? { ...l, is_active: newStatus } : l))
        );
      }
    } catch (err) {
      addToast('error', 'Failed to toggle listing state');
    }
  };

  const activeCount = listings.filter((l) => l.is_active).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            Distressed Cargo & Secondary Port Desk
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Rapid clearance desk for spot port surplus, reefer container cancellations, and expedited consignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-emerald-700/10 border border-emerald-700/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
            Active Spot Cargo: <AnimatedCounter end={activeCount} />
          </span>
          <span className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] px-3 py-1.5 text-xs font-semibold text-[#202522] shadow-sm">
            Total Lots: <AnimatedCounter end={listings.length} />
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
              placeholder="Search by cargo title, port staging location (Dekheila, Damietta, Sokhna)..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
            >
              <option value="ALL">All Lot States</option>
              <option value="ACTIVE">ACTIVE (FOR SALE)</option>
              <option value="INACTIVE">INACTIVE (PAUSED)</option>
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
                    <th className="py-3.5 pl-6 pr-3 font-semibold">Distressed Lot Title</th>
                    <th className="px-3 py-3.5 font-semibold">Port Staging Location</th>
                    <th className="px-3 py-3.5 font-semibold">Available Quantity</th>
                    <th className="px-3 py-3.5 font-semibold">Spot Clearance Price</th>
                    <th className="px-3 py-3.5 font-semibold">Status</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-semibold">Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {filteredListings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No distressed cargo lots currently recorded.
                      </td>
                    </tr>
                  ) : (
                    filteredListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Title */}
                        <td className="py-3.5 pl-6 pr-3 font-semibold text-[#202522]">
                          {listing.title || 'Secondary Spot Cargo Lot'}
                        </td>

                        {/* Location */}
                        <td className="px-3 py-3.5 font-medium text-[#202522]">
                          {listing.location || 'Alexandria Port (Dekheila)'}
                        </td>

                        {/* Quantity */}
                        <td className="px-3 py-3.5 font-semibold text-[#c38b40]">
                          {listing.quantity || 48} {listing.unit || 'MT'}
                        </td>

                        {/* Price */}
                        <td className="px-3 py-3.5 font-mono font-bold text-emerald-800">
                          {listing.price ? `$${listing.price} / MT` : '$420 / MT'}
                        </td>

                        {/* Status */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                              listing.is_active
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : 'bg-[#eee8dc] text-[#70695f] border border-[#b9aa95]'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                listing.is_active ? 'bg-emerald-600' : 'bg-[#70695f]'
                              }`}
                            />
                            {listing.is_active ? 'ACTIVE' : 'PAUSED'}
                          </span>
                        </td>

                        {/* Toggle */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <button
                            onClick={() => handleToggleActive(listing)}
                            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              listing.is_active
                                ? 'bg-[#c38b40]/15 text-[#9b6820] hover:bg-[#c38b40]/25 border border-[#c38b40]/30'
                                : 'bg-emerald-700/10 text-emerald-800 hover:bg-emerald-700/20 border border-emerald-700/20'
                            }`}
                          >
                            {listing.is_active ? 'Pause Listing' : 'Activate Lot'}
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
    </div>
  );
}
