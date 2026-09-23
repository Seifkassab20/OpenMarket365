'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import { importerService, ShipmentTracking } from '@/lib/services/importerService';
import { Ship, Thermometer, Container, MapPin, Anchor, ArrowLeft } from 'lucide-react';

export default function ImporterShipmentsPage() {
  const { language } = useLanguage();
  const { addToast } = useToast();
  const [shipments, setShipments] = useState<ShipmentTracking[]>([]);

  useEffect(() => {
    importerService.getShipments().then(setShipments);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#596348] text-white rounded-xs">
              REEFER FLEET & LOGISTICS
            </span>
            <span className="text-xs text-[#70695f] font-mono">Live Telemetry & Marine Voyaging</span>
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#202522]">
            {language === 'ar' ? 'تتبع شحنات التبريد والموانئ' : 'Reefer Containers Tracking'}
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            {language === 'ar'
              ? 'متابعة مسار الحاويات المبردة المغادرة من الإسكندرية ودمياط ودرجات حرارة التبريد 4°C.'
              : 'Monitor active refrigerated container voyages departing Egyptian terminals to European & Gulf ports.'}
          </p>
        </div>

        <Link
          href="/importer"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#e4dac9] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider transition-colors rounded-sm"
        >
          <span>{language === 'ar' ? 'العودة للوحة المشتريات' : 'Back to Procurement Desk'}</span>
        </Link>
      </div>

      <div className="space-y-4">
        {shipments.map((ship) => (
          <div
            key={ship.id}
            className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 space-y-4 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#b9aa95]/60 pb-3">
              <div className="flex items-center gap-2">
                <Container className="w-4 h-4 text-[#9b452f]" />
                <span className="font-mono text-sm font-bold text-[#202522]">
                  {ship.container_number}
                </span>
                <span className="text-[10px] font-mono text-[#70695f]">
                  (Booking: {ship.booking_ref})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#596348] text-white text-[10px] font-bold uppercase font-mono">
                  <Thermometer className="w-3 h-3" />
                  Steady at {ship.set_temperature_c.toFixed(1)}°C
                </span>
                <span className="px-2 py-0.5 bg-[#202522] text-[#eee8dc] text-[10px] font-bold uppercase rounded-xs">
                  {ship.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#70695f] block">COMMODITY & PACKHOUSE</span>
                <div className="font-serif font-bold text-[#202522] text-sm mt-0.5">{ship.commodity}</div>
                <div className="text-[#565047]">{ship.supplier_name}</div>
                <div className="text-[#70695f] font-mono text-[10px] mt-0.5">Payload: {ship.quantity_mt} MT</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#70695f] block">LINE & VESSEL</span>
                <div className="font-bold text-[#202522] mt-0.5">{ship.shipping_line}</div>
                <div className="text-[#565047] font-mono">{ship.vessel_name}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#70695f] block">ROUTING</span>
                <div className="font-bold text-[#202522] mt-0.5">{ship.port_of_departure}</div>
                <div className="text-[#565047]">→ {ship.port_of_arrival}</div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#70695f] block">SCHEDULE TELEMETRY</span>
                <div className="font-mono text-[#202522]">ETD: {ship.etd}</div>
                <div className="font-mono font-bold text-[#9b452f]">ETA: {ship.eta}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#b9aa95]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#70695f]">
                <span>Bill of Lading: <strong className="text-[#202522]">{ship.bill_of_lading_number}</strong></span>
                <span>•</span>
                <span>Phyto: <strong className="text-[#596348]">{ship.phytosanitary_cert_number}</strong></span>
              </div>

              <button
                onClick={() => addToast('info', `Downloaded shipping packet for ${ship.container_number}`)}
                className="px-3 py-1.5 bg-[#eee8dc] border border-[#b9aa95] hover:border-[#202522] text-[#202522] text-xs font-bold uppercase tracking-wider rounded transition-colors"
              >
                Download Cargo Packet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
