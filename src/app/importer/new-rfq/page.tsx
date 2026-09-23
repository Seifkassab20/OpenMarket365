'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import { fallbackCategories, fallbackCompanies } from '@/lib/data/fallbackData';
import {
  importerService,
  validateRfqDates,
  RFQ_CERTIFICATES,
  BroadcastMode,
  NewRfqInput,
} from '@/lib/services/importerService';
import { FileSpreadsheet, ShieldCheck, ArrowLeft, ArrowRight, Paperclip, X } from 'lucide-react';

const STEPS = [
  { en: 'Commodity', ar: 'السلعة' },
  { en: 'Delivery', ar: 'التسليم' },
  { en: 'Compliance', ar: 'الاشتراطات' },
  { en: 'Broadcast', ar: 'الإرسال' },
];

const COUNTRIES = [
  'Netherlands', 'Germany', 'United Kingdom', 'France', 'Italy', 'Spain', 'Belgium',
  'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'United States', 'Canada', 'China', 'Japan', 'Russia',
];

const MAX_FILES = 5;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

const inputClass =
  'w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] focus:border-[#202522] focus:outline-none';
const labelClass = 'block font-bold text-[#202522] uppercase tracking-wider text-[10px] mb-1';

export default function CreateRfqPage() {
  const { language, direction } = useLanguage();
  const { addToast } = useToast();
  const router = useRouter();
  const isAr = language === 'ar';

  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<NewRfqInput, 'attachment_names'>>({
    category_id: fallbackCategories[0]?.id ?? 1,
    commodity: '',
    quantity_mt: 0,
    packaging_spec: '',
    specifications: '',
    destination_country: 'Netherlands',
    destination_port: '',
    incoterm: 'CIF',
    delivery_from: '',
    delivery_to: '',
    quote_deadline: '',
    required_certificates: [],
    broadcast_mode: 'CATEGORY',
    direct_exporter_id: undefined,
  });
  const [files, setFiles] = useState<File[]>([]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleCert = (cert: string) =>
    set(
      'required_certificates',
      form.required_certificates.includes(cert)
        ? form.required_certificates.filter((c) => c !== cert)
        : [...form.required_certificates, cert]
    );

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const bad = incoming.find((f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_FILE_BYTES);
    if (bad) {
      setError(isAr ? `الملف ${bad.name} غير مقبول (PDF/JPG/PNG حتى 10MB).` : `${bad.name} rejected: PDF, JPG or PNG up to 10 MB only.`);
      return;
    }
    const next = [...files, ...incoming].slice(0, MAX_FILES);
    setFiles(next);
    setError(files.length + incoming.length > MAX_FILES ? (isAr ? `الحد الأقصى ${MAX_FILES} ملفات.` : `Maximum ${MAX_FILES} files.`) : '');
  };

  const today = new Date().toISOString().slice(0, 10);

  // Native `required` handles empty fields per step; this covers cross-field rules.
  const stepError = (): string => {
    if (step === 1) {
      const dateError = validateRfqDates(form.quote_deadline, form.delivery_from, form.delivery_to, today);
      if (dateError) return isAr ? dateError.ar : dateError.en;
    }
    if (step === 2 && form.required_certificates.length === 0) {
      return isAr ? 'اختر شهادة واحدة على الأقل.' : 'Select at least one mandatory certificate.';
    }
    if (step === 3 && form.broadcast_mode === 'DIRECT' && !form.direct_exporter_id) {
      return isAr ? 'اختر المصدّر المطلوب.' : 'Choose the exporter to send this RFQ to.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const msg = stepError();
    setError(msg);
    if (msg) return;
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }
    setSubmitting(true);
    try {
      // ponytail: attachment names only; binary upload goes through the R2 presigned endpoint (FR-MED-001).
      const rfq = await importerService.createRfq({ ...form, attachment_names: files.map((f) => f.name) });
      setSubmittedNumber(rfq.rfq_number);
      setTimeout(() => router.push('/importer/rfqs'), 2500);
    } catch {
      addToast('error', isAr ? 'تعذر إرسال طلب التوريد.' : 'Could not submit the RFQ.');
    } finally {
      setSubmitting(false);
    }
  };

  const BackIcon = direction === 'rtl' ? ArrowRight : ArrowLeft;
  const NextIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;
  const category = fallbackCategories.find((c) => c.id === form.category_id);
  const directExporter = fallbackCompanies.find((c) => c.id === form.direct_exporter_id);

  const broadcastOptions: { value: BroadcastMode; en: string; ar: string; descEn: string; descAr: string }[] = [
    {
      value: 'CATEGORY',
      en: 'Category broadcast',
      ar: 'إرسال للقطاع',
      descEn: 'All verified exporters in this commodity sector holding the required certificates.',
      descAr: 'كل المصدرين المعتمدين في هذا القطاع ممن يحملون الشهادات المطلوبة.',
    },
    {
      value: 'DIRECT',
      en: 'Direct exporter inquiry',
      ar: 'طلب مباشر لمصدّر',
      descEn: 'Send privately to one exporter you choose.',
      descAr: 'إرسال خاص لمصدّر واحد تختاره.',
    },
    {
      value: 'AUTO',
      en: 'Automated distribution',
      ar: 'توزيع تلقائي',
      descEn: 'Market 365 matches and alerts the best-fit exporters for you.',
      descAr: 'تقوم المنصة بمطابقة وتنبيه أنسب المصدرين تلقائياً.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link
        href="/importer/rfqs"
        className="inline-flex items-center gap-2 text-xs font-bold text-[#9b452f] hover:underline transition-colors uppercase tracking-[0.16em]"
      >
        <BackIcon className="w-4 h-4" />
        <span>{isAr ? 'العودة إلى طلبات التوريد' : 'Back to RFQs'}</span>
      </Link>

      <div className="bg-[#e4dac9] border border-[#b9aa95] p-6 sm:p-10 shadow-sm">
        <div className="mb-6 pb-6 border-b border-[#b9aa95]">
          <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em] mb-2 flex items-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>{isAr ? 'معالج طلب التوريد' : 'RFQ Wizard'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#202522] tracking-tight">
            {isAr ? 'طرح طلب توريد دولي جديد' : 'Submit Procurement RFQ'}
          </h1>
          <p className="text-xs text-[#70695f] mt-2 leading-relaxed">
            {isAr
              ? 'يراجع فريق المنصة الطلب قبل إرساله للمصدرين المطابقين. تبقى العروض مغلقة وسرية.'
              : 'Our team screens each RFQ before it reaches matching exporters. Quotes stay sealed and private to you.'}
          </p>
        </div>

        {submittedNumber ? (
          <div className="p-8 bg-[#596348]/10 border border-[#596348] text-center space-y-3" role="status">
            <ShieldCheck className="w-12 h-12 text-[#596348] mx-auto" />
            <h3 className="text-xl font-serif text-[#202522] font-bold">
              {isAr ? `تم استلام الطلب ${submittedNumber}` : `${submittedNumber} submitted`}
            </h3>
            <p className="text-xs text-[#70695f]">
              {isAr
                ? 'الطلب الآن قيد المراجعة الإدارية وسيُرسل للمصدرين فور الموافقة.'
                : 'It is now pending admin review and will be broadcast to exporters once approved.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* Stepper */}
            <ol className="grid grid-cols-4 gap-2" aria-label={isAr ? 'خطوات المعالج' : 'Wizard steps'}>
              {STEPS.map((s, i) => (
                <li
                  key={s.en}
                  aria-current={i === step ? 'step' : undefined}
                  className={`border-t-4 pt-2 text-[10px] font-bold uppercase tracking-wider ${
                    i < step ? 'border-[#596348] text-[#596348]' : i === step ? 'border-[#9b452f] text-[#9b452f]' : 'border-[#b9aa95] text-[#70695f]'
                  }`}
                >
                  {i + 1}. {isAr ? s.ar : s.en}
                </li>
              ))}
            </ol>

            {step === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>{isAr ? 'القطاع السلعي' : 'Commodity Sector'}</span>
                    <select
                      value={form.category_id}
                      onChange={(e) => set('category_id', Number(e.target.value))}
                      className={inputClass}
                    >
                      {fallbackCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {(isAr && cat.name_ar) || cat.name_en} {cat.hs_code ? `(HS ${cat.hs_code})` : ''}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>{isAr ? 'السلعة والصنف' : 'Commodity & Variety'}</span>
                    <input
                      required
                      value={form.commodity}
                      onChange={(e) => set('commodity', e.target.value)}
                      placeholder="e.g. Valencia Oranges, calibre 56-80"
                      className={inputClass}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label>
                    <span className={labelClass}>{isAr ? 'الكمية (طن متري)' : 'Quantity (MT)'}</span>
                    <input
                      type="number"
                      required
                      min={1}
                      step="any"
                      value={form.quantity_mt || ''}
                      onChange={(e) => set('quantity_mt', Number(e.target.value))}
                      placeholder="e.g. 120"
                      className={`${inputClass} font-mono`}
                    />
                  </label>
                  <label>
                    <span className={labelClass}>{isAr ? 'مواصفات التعبئة' : 'Packaging Standard'}</span>
                    <input
                      required
                      value={form.packaging_spec}
                      onChange={(e) => set('packaging_spec', e.target.value)}
                      placeholder="e.g. 15kg telescopic cartons, 80 per pallet"
                      className={inputClass}
                    />
                  </label>
                </div>
                <label className="block">
                  <span className={labelClass}>{isAr ? 'المواصفات الفنية' : 'Technical Specifications'}</span>
                  <textarea
                    rows={3}
                    required
                    value={form.specifications}
                    onChange={(e) => set('specifications', e.target.value)}
                    placeholder="Calibre, Brix, moisture %, purity %, residue limits..."
                    className={`${inputClass} leading-relaxed`}
                  />
                </label>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <label>
                    <span className={labelClass}>{isAr ? 'دولة الوصول' : 'Destination Country'}</span>
                    <select
                      value={form.destination_country}
                      onChange={(e) => set('destination_country', e.target.value)}
                      className={inputClass}
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <span className={labelClass}>{isAr ? 'ميناء الوصول' : 'Destination Port'}</span>
                    <input
                      required
                      value={form.destination_port}
                      onChange={(e) => set('destination_port', e.target.value)}
                      placeholder="e.g. Rotterdam"
                      className={inputClass}
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Incoterm</span>
                    <select
                      value={form.incoterm}
                      onChange={(e) => set('incoterm', e.target.value as NewRfqInput['incoterm'])}
                      className={`${inputClass} font-bold`}
                    >
                      <option value="FOB">FOB (Free On Board)</option>
                      <option value="CFR">CFR (Cost and Freight)</option>
                      <option value="CIF">CIF (Cost, Insurance, Freight)</option>
                    </select>
                  </label>
                </div>
                <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <legend className={`${labelClass} col-span-full`}>
                    {isAr ? 'الجدول الزمني' : 'Timeline'}
                  </legend>
                  <label>
                    <span className="block text-[10px] text-[#70695f] mb-1">{isAr ? 'آخر موعد للعروض' : 'Quote deadline'}</span>
                    <input
                      type="date"
                      required
                      min={today}
                      value={form.quote_deadline}
                      onChange={(e) => set('quote_deadline', e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </label>
                  <label>
                    <span className="block text-[10px] text-[#70695f] mb-1">{isAr ? 'بداية نافذة التسليم' : 'Delivery window from'}</span>
                    <input
                      type="date"
                      required
                      min={form.quote_deadline || today}
                      value={form.delivery_from}
                      onChange={(e) => set('delivery_from', e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </label>
                  <label>
                    <span className="block text-[10px] text-[#70695f] mb-1">{isAr ? 'نهاية نافذة التسليم' : 'Delivery window to'}</span>
                    <input
                      type="date"
                      required
                      min={form.delivery_from || today}
                      value={form.delivery_to}
                      onChange={(e) => set('delivery_to', e.target.value)}
                      className={`${inputClass} font-mono`}
                    />
                  </label>
                </fieldset>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <fieldset>
                  <legend className={labelClass}>{isAr ? 'الشهادات الإلزامية' : 'Mandatory Certificates'}</legend>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {RFQ_CERTIFICATES.map((cert) => {
                      const checked = form.required_certificates.includes(cert);
                      return (
                        <label
                          key={cert}
                          className={`flex items-center gap-2 p-2.5 border rounded cursor-pointer font-bold ${
                            checked ? 'border-[#596348] bg-[#596348]/10 text-[#596348]' : 'border-[#b9aa95] bg-[#eee8dc] text-[#202522]'
                          }`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleCert(cert)} className="accent-[#596348]" />
                          {cert}
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-[#70695f] mt-1.5">
                    {isAr
                      ? 'لن يتلقى الطلب إلا المصدرون الحاصلون على هذه الشهادات.'
                      : 'Only exporters holding these certificates will receive the RFQ.'}
                  </p>
                </fieldset>

                <div>
                  <span className={labelClass}>{isAr ? 'المرفقات (اختياري)' : 'Attachments (optional)'}</span>
                  <label className="flex items-center justify-center gap-2 p-4 border border-dashed border-[#b9aa95] bg-[#eee8dc] cursor-pointer hover:border-[#202522] text-[#565047]">
                    <Paperclip className="w-4 h-4" />
                    <span>
                      {isAr ? 'أضف مواصفات أو صور (PDF/JPG/PNG حتى 10MB)' : 'Add spec sheets or photos (PDF, JPG, PNG up to 10 MB)'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="sr-only"
                      onChange={(e) => {
                        addFiles(e.target.files);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="flex items-center justify-between px-3 py-1.5 bg-[#eee8dc] border border-[#b9aa95]">
                          <span className="font-mono truncate">{f.name}</span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((_, j) => j !== i))}
                            aria-label={isAr ? `إزالة ${f.name}` : `Remove ${f.name}`}
                            className="text-[#70695f] hover:text-[#9b452f]"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <fieldset className="space-y-2">
                  <legend className={labelClass}>{isAr ? 'طريقة الإرسال' : 'Broadcast Mode'}</legend>
                  {broadcastOptions.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-3 p-3 border rounded cursor-pointer ${
                        form.broadcast_mode === opt.value ? 'border-[#9b452f] bg-[#9b452f]/5' : 'border-[#b9aa95] bg-[#eee8dc]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="broadcast"
                        checked={form.broadcast_mode === opt.value}
                        onChange={() => set('broadcast_mode', opt.value)}
                        className="mt-0.5 accent-[#9b452f]"
                      />
                      <span>
                        <span className="block font-bold text-[#202522]">{isAr ? opt.ar : opt.en}</span>
                        <span className="block text-[#70695f]">{isAr ? opt.descAr : opt.descEn}</span>
                      </span>
                    </label>
                  ))}
                </fieldset>

                {form.broadcast_mode === 'DIRECT' && (
                  <label className="block">
                    <span className={labelClass}>{isAr ? 'المصدّر' : 'Exporter'}</span>
                    <select
                      required
                      value={form.direct_exporter_id ?? ''}
                      onChange={(e) => set('direct_exporter_id', e.target.value || undefined)}
                      className={inputClass}
                    >
                      <option value="">{isAr ? 'اختر مصدّراً' : 'Choose an exporter'}</option>
                      {fallbackCompanies
                        .filter((c) => c.verification_status === 'VERIFIED')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {(isAr && c.company_name_ar) || c.company_name_en}
                          </option>
                        ))}
                    </select>
                  </label>
                )}

                <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] space-y-1.5">
                  <div className={labelClass}>{isAr ? 'مراجعة الطلب' : 'Review'}</div>
                  {[
                    [isAr ? 'السلعة' : 'Commodity', `${form.commodity} · ${(isAr && category?.name_ar) || category?.name_en}`],
                    [isAr ? 'الكمية' : 'Quantity', `${form.quantity_mt} MT · ${form.packaging_spec}`],
                    [isAr ? 'الوجهة' : 'Destination', `${form.incoterm} ${form.destination_port}, ${form.destination_country}`],
                    [isAr ? 'التسليم' : 'Delivery', `${form.delivery_from} → ${form.delivery_to}`],
                    [isAr ? 'آخر موعد للعروض' : 'Quote deadline', form.quote_deadline],
                    [isAr ? 'الشهادات' : 'Certificates', form.required_certificates.join(', ')],
                    [isAr ? 'المرفقات' : 'Attachments', files.length ? files.map((f) => f.name).join(', ') : '—'],
                    [
                      isAr ? 'الإرسال' : 'Broadcast',
                      form.broadcast_mode === 'DIRECT' && directExporter
                        ? (isAr && directExporter.company_name_ar) || directExporter.company_name_en
                        : broadcastOptions.find((o) => o.value === form.broadcast_mode)?.[isAr ? 'ar' : 'en'],
                    ],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4">
                      <span className="text-[#70695f] shrink-0">{k}</span>
                      <strong className="text-[#202522] text-right truncate">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p role="alert" className="text-[#9b452f] font-bold">
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setStep(step - 1);
                  }}
                  className="px-5 py-3.5 font-bold uppercase tracking-wider bg-[#eee8dc] border border-[#b9aa95] text-[#202522] hover:border-[#202522] flex items-center gap-1.5"
                >
                  <BackIcon className="w-4 h-4" />
                  {isAr ? 'السابق' : 'Back'}
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 font-bold uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] disabled:opacity-60 text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                {step < STEPS.length - 1 ? (
                  <>
                    {isAr ? 'التالي' : 'Next'}
                    <NextIcon className="w-4 h-4" />
                  </>
                ) : submitting ? (
                  isAr ? 'جارٍ الإرسال...' : 'Submitting...'
                ) : isAr ? (
                  'إرسال للمراجعة'
                ) : (
                  'Submit for Review'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
