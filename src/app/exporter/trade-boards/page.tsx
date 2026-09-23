'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import ScrollReveal from '@/components/admin/ScrollReveal';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import {
  Layers,
  Plus,
  Ship,
  Building,
  MapPin,
  Clock,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Tag,
  Boxes,
} from 'lucide-react';

interface TradeListing {
  id: string;
  type: 'DOMESTIC_SURPLUS' | 'DISTRESSED_CARGO';
  titleEn: string;
  titleAr: string;
  commodity: string;
  quantityMt: number;
  pricePerUnit: string;
  currency: 'EGP' | 'USD';
  location: string;
  status: 'ACTIVE' | 'RESERVED' | 'SOLD';
  urgency: 'HIGH' | 'MEDIUM' | 'STANDARD';
  blNumber?: string;
  containerNumber?: string;
  createdAt: string;
}

export default function ExporterTradeBoardsPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const isAr = language === 'ar';

  const [activeBoard, setActiveBoard] = useState<'DOMESTIC' | 'DISTRESSED'>('DISTRESSED');

  // Listings state
  const [listings, setListings] = useState<TradeListing[]>([
    {
      id: 'dist-01',
      type: 'DISTRESSED_CARGO',
      titleEn: 'Valencia Oranges · Diverted Reefer Container',
      titleAr: 'برتقال فالنسيا · حاوية مبردة محولة بميناء جدة',
      commodity: 'Valencia Oranges (Caliber 64-88)',
      quantityMt: 24,
      pricePerUnit: '$490 / MT (Discounted from $680)',
      currency: 'USD',
      location: 'Jeddah Islamic Port (Free Zone)',
      status: 'ACTIVE',
      urgency: 'HIGH',
      containerNumber: 'MSCU 904128-4',
      blNumber: 'BL-MSC-EG-99210',
      createdAt: '1 day ago',
    },
    {
      id: 'dist-02',
      type: 'DISTRESSED_CARGO',
      titleEn: 'IQF Strawberries · En-Route Rotterdam',
      titleAr: 'فراولة مجمدة IQF · في الطريق لميناء روتردام',
      commodity: 'IQF Strawberries (Halves / 10kg cartons)',
      quantityMt: 22,
      pricePerUnit: '$1,350 / MT (Spot Deal)',
      currency: 'USD',
      location: 'Port of Rotterdam Terminal (Arrival Apr 04)',
      status: 'ACTIVE',
      urgency: 'MEDIUM',
      containerNumber: 'CMAU 448192-0',
      blNumber: 'BL-CMA-EG-33120',
      createdAt: '3 days ago',
    },
    {
      id: 'dom-01',
      type: 'DOMESTIC_SURPLUS',
      titleEn: 'Surplus Export-Grade Golden Onions (Cured)',
      titleAr: 'فائض تصديري بصل ذهبي مجفف جاهز للشحن',
      commodity: 'Golden Onions (50-70mm)',
      quantityMt: 80,
      pricePerUnit: '16,500 EGP / MT (Factory Gate)',
      currency: 'EGP',
      location: 'Belbeis Curing Sheds · Sharkia',
      status: 'ACTIVE',
      urgency: 'STANDARD',
      createdAt: '5 days ago',
    },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'DOMESTIC_SURPLUS' | 'DISTRESSED_CARGO'>('DISTRESSED_CARGO');
  const [commodity, setCommodity] = useState('');
  const [quantityMt, setQuantityMt] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [containerNo, setContainerNo] = useState('');
  const [blNo, setBlNo] = useState('');

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodity || !price) return;

    const newListing: TradeListing = {
      id: `list-${Date.now()}`,
      type: modalType,
      titleEn: `${commodity} · Spot Availability`,
      titleAr: `${commodity} · متاح فوري للتصفية`,
      commodity,
      quantityMt: Number(quantityMt) || 20,
      pricePerUnit: modalType === 'DISTRESSED_CARGO' ? `$${price} / MT` : `${price} EGP / MT`,
      currency: modalType === 'DISTRESSED_CARGO' ? 'USD' : 'EGP',
      location: location || 'Alexandria Port / Warehouse',
      status: 'ACTIVE',
      urgency: modalType === 'DISTRESSED_CARGO' ? 'HIGH' : 'STANDARD',
      containerNumber: containerNo || undefined,
      blNumber: blNo || undefined,
      createdAt: 'Just now',
    };

    setListings([newListing, ...listings]);
    setIsModalOpen(false);
    setCommodity('');
    setPrice('');
    setQuantityMt('');
    setLocation('');
    setContainerNo('');
    setBlNo('');
    addToast('success', 'Trade board listing published successfully!');
  };

  const filteredListings = listings.filter((l) =>
    activeBoard === 'DISTRESSED' ? l.type === 'DISTRESSED_CARGO' : l.type === 'DOMESTIC_SURPLUS'
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <ScrollReveal direction="down" delayMs={0}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#9b452f] text-white rounded-xs font-mono">
                SECONDARY TRADE BOARDS · FR-LOC-001 / FR-DST-001
              </span>
              <span className="text-xs text-[#70695f] font-mono">Rapid Liquidation & Spot Resale</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
              {isAr ? 'منصة التصفية وبضائع الموانئ العاجلة' : 'Surplus & Distressed Cargo Desk'}
            </h1>
            <p className="mt-1 text-xs text-[#70695f]">
              {isAr
                ? 'عرض البضائع المحولة بالموانئ الدولية بأسعار مخفضة أو بيع الفائض الزراعي بالجنيه المصري للمصانع المحلية.'
                : 'Directly list en-route diverted reefer containers or factory-gate domestic surplus to wholesale buyers.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/market"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider rounded transition-colors"
            >
              <span>Public Board View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => {
                setModalType(activeBoard === 'DISTRESSED' ? 'DISTRESSED_CARGO' : 'DOMESTIC_SURPLUS');
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isAr ? 'إضافة عرض تصفية' : 'New Spot Listing'}</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Board Selector Tabs */}
      <ScrollReveal direction="down" delayMs={40}>
        <div className="flex items-center gap-3 border-b border-[#b9aa95] pb-px">
          <button
            onClick={() => setActiveBoard('DISTRESSED')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeBoard === 'DISTRESSED'
                ? 'border-[#9b452f] text-[#9b452f] bg-[#e4dac9]/60'
                : 'border-transparent text-[#70695f] hover:text-[#202522]'
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>Distressed / Diverted Cargo (USD)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#9b452f] text-white rounded-full">
              {listings.filter((l) => l.type === 'DISTRESSED_CARGO').length}
            </span>
          </button>

          <button
            onClick={() => setActiveBoard('DOMESTIC')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeBoard === 'DOMESTIC'
                ? 'border-[#596348] text-[#596348] bg-[#e4dac9]/60'
                : 'border-transparent text-[#70695f] hover:text-[#202522]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Domestic Factory Surplus (EGP)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#596348] text-white rounded-full">
              {listings.filter((l) => l.type === 'DOMESTIC_SURPLUS').length}
            </span>
          </button>
        </div>
      </ScrollReveal>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredListings.map((listing, idx) => (
          <ScrollReveal key={listing.id} delayMs={idx * 70} direction="up" className="h-full">
            <div
              className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-6 shadow-sm space-y-4 hover:border-[#202522] transition-all flex flex-col justify-between h-full"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9b452f] block">
                      {listing.type.replace('_', ' ')} · {listing.urgency} URGENCY
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#202522] mt-0.5">
                      {isAr ? listing.titleAr : listing.titleEn}
                    </h3>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase ${
                      listing.status === 'ACTIVE'
                        ? 'bg-emerald-700/15 text-emerald-800 border border-emerald-700/30'
                        : 'bg-[#70695f] text-white'
                    }`}
                  >
                    {listing.status}
                  </span>
                </div>

                {/* Price & Quantity Banner */}
                <div className="p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#70695f] font-mono block">OFFERED SPOT PRICE</span>
                    <span className="text-xl font-serif font-bold text-[#9b452f]">
                      {listing.pricePerUnit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#70695f] font-mono block">AVAILABLE LOT</span>
                    <span className="text-sm font-bold text-[#202522] font-mono">
                      <AnimatedCounter end={listing.quantityMt} duration={1000} /> MT
                    </span>
                  </div>
                </div>

                {/* Shipping Logistics Specs */}
                <div className="space-y-1.5 text-xs text-[#565047] font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#9b452f] shrink-0" />
                    <span>Current Location: <strong className="text-[#202522]">{listing.location}</strong></span>
                  </div>

                  {listing.containerNumber && (
                    <div className="flex justify-between text-[11px]">
                      <span>Container: <strong className="text-[#202522]">{listing.containerNumber}</strong></span>
                      <span>B/L: <strong className="text-[#202522]">{listing.blNumber}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#b9aa95]/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#70695f]">Published {listing.createdAt}</span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setListings((prev) =>
                        prev.map((l) => (l.id === listing.id ? { ...l, status: 'SOLD' } : l))
                      );
                      addToast('info', 'Marked listing as SOLD');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold uppercase rounded bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] text-[#202522]"
                  >
                    Mark as Sold
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* New Listing Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#b9aa95] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-[#9b452f]">
                  SPOT TRADE BOARD REGISTRATION
                </span>
                <h3 className="font-serif text-xl font-bold text-[#202522]">
                  {modalType === 'DISTRESSED_CARGO'
                    ? 'List Distressed / Diverted Container'
                    : 'List Domestic Factory Surplus'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-sm font-bold text-[#70695f] hover:text-[#202522]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
              <div className="flex gap-2 p-1 bg-[#eee8dc] border border-[#b9aa95] rounded">
                <button
                  type="button"
                  onClick={() => setModalType('DISTRESSED_CARGO')}
                  className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded ${
                    modalType === 'DISTRESSED_CARGO' ? 'bg-[#9b452f] text-white' : 'text-[#70695f]'
                  }`}
                >
                  Port Distressed (USD)
                </button>
                <button
                  type="button"
                  onClick={() => setModalType('DOMESTIC_SURPLUS')}
                  className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded ${
                    modalType === 'DOMESTIC_SURPLUS' ? 'bg-[#596348] text-white' : 'text-[#70695f]'
                  }`}
                >
                  Local Surplus (EGP)
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                  Commodity & Variety
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valencia Oranges / Golden Onions / IQF Strawberries"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                    Available Quantity (MT)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 24"
                    value={quantityMt}
                    onChange={(e) => setQuantityMt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                    {modalType === 'DISTRESSED_CARGO' ? 'Discounted Price ($/MT)' : 'Factory Price (EGP/MT)'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={modalType === 'DISTRESSED_CARGO' ? '490' : '16500'}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                  Current Warehouse / Port Location
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jeddah Islamic Port Terminal or Nubaria Packhouse"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                />
              </div>

              {modalType === 'DISTRESSED_CARGO' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                      Container Reefer Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MSCU 904128-4"
                      value={containerNo}
                      onChange={(e) => setContainerNo(e.target.value)}
                      className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-[#70695f] mb-1">
                      Bill of Lading (B/L)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. BL-MSC-EG-99210"
                      value={blNo}
                      onChange={(e) => setBlNo(e.target.value)}
                      className="w-full px-3 py-2 bg-[#eee8dc] border border-[#b9aa95] rounded text-[#202522]"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#b9aa95] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#b9aa95] rounded text-xs font-bold text-[#202522]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#9b452f] hover:bg-[#833824] text-white text-xs font-bold uppercase tracking-wider rounded"
                >
                  Publish to Trade Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
