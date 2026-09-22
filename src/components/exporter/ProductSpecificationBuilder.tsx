'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface ProductSpecificationBuilderProps {
  initialSpecs?: Record<string, string | number>;
  onChange: (specs: Record<string, string | number>) => void;
}

export default function ProductSpecificationBuilder({
  initialSpecs = {},
  onChange,
}: ProductSpecificationBuilderProps) {
  const { language } = useLanguage();

  const [specsList, setSpecsList] = useState<{ key: string; value: string }[]>(() => {
    const entries = Object.entries(initialSpecs);
    if (entries.length > 0) {
      return entries.map(([k, v]) => ({ key: k, value: String(v) }));
    }
    return [
      { key: 'Brix Content', value: '12%+' },
      { key: 'Calibers / Sizing', value: '48, 56, 64, 72, 88' },
      { key: 'Pesticide Residue', value: 'EU MRL Compliant' },
    ];
  });

  const notifyChange = (updated: { key: string; value: string }[]) => {
    const record: Record<string, string | number> = {};
    updated.forEach((item) => {
      if (item.key.trim()) {
        record[item.key.trim()] = item.value.trim();
      }
    });
    onChange(record);
  };

  const handleUpdate = (index: number, field: 'key' | 'value', val: string) => {
    const next = [...specsList];
    next[index][field] = val;
    setSpecsList(next);
    notifyChange(next);
  };

  const handleAdd = () => {
    const next = [...specsList, { key: '', value: '' }];
    setSpecsList(next);
    notifyChange(next);
  };

  const handleRemove = (index: number) => {
    const next = specsList.filter((_, i) => i !== index);
    setSpecsList(next);
    notifyChange(next);
  };

  const applyPreset = (presetName: string) => {
    let preset: { key: string; value: string }[] = [];
    if (presetName === 'citrus') {
      preset = [
        { key: 'Brix Content', value: '12.5%' },
        { key: 'Juice Percentage', value: '48%' },
        { key: 'Calibers', value: '48, 56, 64, 72, 80, 88, 100, 113, 125' },
        { key: 'Pesticide Residue', value: 'EU MRL Compliant' },
        { key: 'Pre-Cooling', value: 'Forced-Air Tunnel to +4°C' },
      ];
    } else if (presetName === 'frozen') {
      preset = [
        { key: 'Freezing Method', value: 'Fluidized Bed IQF (-38°C)' },
        { key: 'Fruit Sizing', value: '25 - 35 mm calibrated' },
        { key: 'Defect Rate', value: '< 1.5%' },
        { key: 'Packaging', value: '4 x 2.5kg food-grade PE bags' },
      ];
    } else if (presetName === 'onions') {
      preset = [
        { key: 'Stem Length', value: '28 - 32 cm' },
        { key: 'White Stem Portion', value: '> 8 cm' },
        { key: 'Washing System', value: 'Triple Ozonated Wash' },
        { key: 'Packaging', value: 'Styrofoam with top-ice' },
      ];
    }
    setSpecsList(preset);
    notifyChange(preset);
  };

  return (
    <div className="space-y-4">
      {/* Preset Suggestions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-[#70695f] flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#c38b40]" />
          {language === 'ar' ? 'نماذج مواصفات سريعة:' : 'Quick Presets:'}
        </span>
        <button
          type="button"
          onClick={() => applyPreset('citrus')}
          className="px-2 py-0.5 text-[10px] font-semibold bg-[#eee8dc] hover:bg-[#e4dac9] border border-[#b9aa95] text-[#202522] rounded transition-colors"
        >
          {language === 'ar' ? 'موالح وبرتقال' : 'Fresh Citrus'}
        </button>
        <button
          type="button"
          onClick={() => applyPreset('frozen')}
          className="px-2 py-0.5 text-[10px] font-semibold bg-[#eee8dc] hover:bg-[#e4dac9] border border-[#b9aa95] text-[#202522] rounded transition-colors"
        >
          {language === 'ar' ? 'فواكه مجمدة IQF' : 'IQF Frozen Fruits'}
        </button>
        <button
          type="button"
          onClick={() => applyPreset('onions')}
          className="px-2 py-0.5 text-[10px] font-semibold bg-[#eee8dc] hover:bg-[#e4dac9] border border-[#b9aa95] text-[#202522] rounded transition-colors"
        >
          {language === 'ar' ? 'بصل وخضروات طازجة' : 'Fresh Vegetables'}
        </button>
      </div>

      {/* Dynamic Key-Value Inputs */}
      <div className="space-y-2.5">
        {specsList.map((item, index) => (
          <div key={index} className="flex items-center gap-2.5">
            <input
              type="text"
              value={item.key}
              onChange={(e) => handleUpdate(index, 'key', e.target.value)}
              placeholder={language === 'ar' ? 'اسم الخاصية (مثال: نسبة البركس)' : 'Attribute Name (e.g. Brix)'}
              className="flex-1 px-3 py-2 text-xs bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#9b452f] focus:outline-none rounded-sm"
            />
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleUpdate(index, 'value', e.target.value)}
              placeholder={language === 'ar' ? 'القيمة (مثال: 12.5% أو خالي من المعادن)' : 'Value (e.g. 12.5%)'}
              className="flex-1 px-3 py-2 text-xs bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#9b452f] focus:outline-none rounded-sm"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-2 text-[#70695f] hover:text-rose-700 transition-colors"
              title={language === 'ar' ? 'حذف البند' : 'Remove field'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#9b452f] hover:text-[#833824] bg-[#eee8dc] hover:bg-[#e4dac9] border border-dashed border-[#b9aa95] rounded-sm transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{language === 'ar' ? 'إضافة مواصفة فنية جديدة' : 'Add Specification Field'}</span>
      </button>
    </div>
  );
}
