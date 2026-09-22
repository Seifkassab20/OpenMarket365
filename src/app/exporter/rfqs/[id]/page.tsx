'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  exporterService,
  ExporterRfq,
  ExporterCertificate,
} from '@/lib/services/exporterService';
import QuoteModal from '@/components/exporter/QuoteModal';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Send,
  Lock,
  ShieldCheck,
  Ship,
  Clock,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Package,
  CreditCard,
} from 'lucide-react';

export default function RfqDetailPage() {
  const params = useParams();
  const router = useRouter();
  const rfqId = params?.id as string;

  const { language } = useLanguage();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [rfq, setRfq] = useState<ExporterRfq | null>(null);
  const [certs, setCerts] = useState<ExporterCertificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  useEffect(() => {
    if (rfqId) {
      loadData();
    }
  }, [rfqId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [rfqData, certsData] = await Promise.all([
        exporterService.getRfqById(rfqId),
        exporterService.getCertificates('c-nileagro-01'),
      ]);
      if (rfqData) {
        setRfq(rfqData);
        setCerts(certsData);
      } else {
        showToast({
          title: isAr ? 'غير موجود' : 'Not Found',
          message: isAr ? 'طلب عرض السعر غير متوفر' : 'RFQ Lead could not be found',
          type: 'error',
        });
        router.push('/exporter/rfqs');
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل تحميل بيانات العطاء' : 'Failed to retrieve RFQ details',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuoteSubmit = async (payload: {
    unit_price: number;
    currency: string;
    port_of_loading: string;
    lead_time_days: number;
    valid_until: string;
    commercial_terms: string;
    packaging_details: string;
    delivery_terms: string;
  }) => {
    if (!rfq) return;

    try {
      const res = await exporterService.submitQuote('c-nileagro-01', rfq.id, payload);
      if (res.success) {
        showToast({
          title: isAr ? 'تم إرسال العرض بنجاح' : 'Sealed Quote Submitted',
          message: isAr
            ? 'تم إرسال عرض السعر التجاري المشفر للمستورد الدولي مباشرة وفق بروتوكول المناقصات المغلقة.'
            : 'Quote sealed and submitted to international buyer under confidential tender protocol.',
          type: 'success',
        });
        setIsQuoteModalOpen(false);
        router.push('/exporter/quotes');
      }
    } catch {
      showToast({
        title: isAr ? 'خطأ' : 'Error',
        message: isAr ? 'فشل إرسال عرض السعر' : 'Failed to submit quote',
        type: 'error',
      });
    }
  };

  if (isLoading || !rfq) {
    return (
      <div className="py-24 text-center space-y-3 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl max-w-4xl mx-auto">
        <div className="w-8 h-8 border-2 border-[#9b452f] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-mono text-[#70695f]">
          {isAr ? 'جارِ فحص دفتر شروط العطاء...' : 'Accessing tender dossier...'}
        </p>
      </div>
    );
  }

  // Check matching certificates
  const verifiedCertNames = certs
    .filter((c) => c.verification_status === 'VERIFIED')
    .map((c) => c.certificate_name.toLowerCase());

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/exporter/rfqs"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#70695f] hover:text-[#202522] transition-colors"
        >
          {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{isAr ? 'العودة لقائمة العطاءات' : 'Back to Matching RFQs'}</span>
        </Link>

        <span className="text-[10px] font-mono text-[#70695f] bg-[#e4dac9] border border-[#b9aa95] px-2.5 py-1 rounded-md">
          {isAr ? 'حالة العطاء:' : 'Status:'} <strong className="text-[#2d7a58]">{rfq.rfq_status}</strong>
        </span>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl overflow-hidden shadow-sm">
        {/* Header Banner */}
        <div className="p-6 md:p-8 border-b border-[#b9aa95] bg-[#dfd4c1]/50 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#9b452f] text-white uppercase">
                  {rfq.category_code || 'TENDER'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#eee8dc] border border-[#b9aa95] text-[#202522]">
                  {rfq.destination_country_code}
                </span>
                <span className="text-xs font-mono text-[#70695f]">
                  {isAr ? 'المشتري الدولي:' : 'Verified Buyer:'} <strong>{rfq.requester_name}</strong>
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#202522]">
                {isAr ? rfq.commodity_ar || rfq.commodity_en : rfq.commodity_en}
              </h1>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 text-center md:text-right rtl:md:text-left space-y-0.5 flex-shrink-0">
              <span className="text-[10px] font-mono text-[#70695f] uppercase tracking-wider block">
                {isAr ? 'الحجم المطلوب' : 'Target Volume'}
              </span>
              <span className="text-2xl font-mono font-bold text-[#9b452f] block">
                {rfq.required_quantity} <span className="text-xs font-normal text-[#202522]">{rfq.quantity_unit}</span>
              </span>
            </div>
          </div>

          {/* Anti-collusion Notice Banner */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-[#eee8dc] border border-[#b9aa95] text-xs">
            <Lock className="w-4 h-4 text-[#9b452f] flex-shrink-0" />
            <span className="text-[#70695f]">
              <strong className="text-[#202522]">
                {isAr ? 'نظام العطاءات المشفرة:' : 'Confidential Sealed Tender:'}{' '}
              </strong>
              {isAr
                ? 'عرضك التجاري محمي ومحجوب عن جميع الشركات المصدرة الأخرى، ويصل فقط للمشتري المعتمد.'
                : 'Your quotation is encrypted under sealed envelope rules. Competing exporters cannot view your bid.'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Key Logistics Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                <Ship className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>{isAr ? 'ميناء الوصول' : 'Destination Port'}</span>
              </div>
              <div className="font-mono font-bold text-xs text-[#202522]">{rfq.destination_port}</div>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                <Package className="w-3.5 h-3.5 text-[#c38b40]" />
                <span>{isAr ? 'شروط الشحن (Incoterm)' : 'Incoterms'}</span>
              </div>
              <div className="font-mono font-bold text-xs text-[#202522]">{rfq.incoterm}</div>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                <Calendar className="w-3.5 h-3.5 text-[#2d7a58]" />
                <span>{isAr ? 'موعد التسليم المطلوب' : 'Delivery Target'}</span>
              </div>
              <div className="font-mono font-bold text-xs text-[#202522]">{rfq.delivery_deadline}</div>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#70695f]">
                <Clock className="w-3.5 h-3.5 text-[#9b452f]" />
                <span>{isAr ? 'إغلاق تقديم العروض' : 'Quotation Deadline'}</span>
              </div>
              <div className="font-mono font-bold text-xs text-[#9b452f]">
                {rfq.quote_deadline ? new Date(rfq.quote_deadline).toLocaleDateString() : 'Active'}
              </div>
            </div>
          </div>

          {/* Section: Technical Specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9b452f]" />
              <span>{isAr ? 'المواصفات الفنية ومعايير الجودة' : 'Technical Specifications & Sizing Requirements'}</span>
            </h3>
            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 text-xs text-[#202522] leading-relaxed">
              {rfq.technical_specifications || (isAr ? 'لا توجد شروط خاصة إضافية' : 'Standard grade specifications apply.')}
            </div>
          </div>

          {/* Section: Packaging Requirements */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#c38b40]" />
              <span>{isAr ? 'اشتراطات التعبئة ومنصات الشحن (Palletization)' : 'Packaging & Palletization Protocols'}</span>
            </h3>
            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 text-xs text-[#202522] leading-relaxed">
              {rfq.packaging_requirements || (isAr ? 'معايير التصدير الأوروبية القياسية' : 'Standard export palletization.')}
            </div>
          </div>

          {/* Section: Payment Terms */}
          {rfq.payment_terms && (
            <div className="space-y-3">
              <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2d7a58]" />
                <span>{isAr ? 'شروط السداد والدفع المقترحة' : 'Payment Terms'}</span>
              </h3>
              <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-4 text-xs text-[#202522] leading-relaxed flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-[#2d7a58] flex-shrink-0" />
                <span>{rfq.payment_terms}</span>
              </div>
            </div>
          )}

          {/* Section: Mandatory Quality Certifications Check */}
          <div className="space-y-3">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9b452f]" />
              <span>{isAr ? 'الشهادات الإلزامية المطلوبة وفحص مطابقة شركتك' : 'Mandatory Certifications & Company Eligibility'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {rfq.mandatory_certificates?.map((certReq) => {
                const isMatched = verifiedCertNames.some((c) =>
                  c.includes(certReq.toLowerCase())
                );
                return (
                  <div
                    key={certReq}
                    className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
                      isMatched
                        ? 'bg-[#2d7a58]/10 border-[#2d7a58]/30 text-[#2d7a58]'
                        : 'bg-[#c38b40]/10 border-[#c38b40]/30 text-[#7a521e]'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold block">{certReq}</span>
                      <span className="text-[10px]">
                        {isMatched
                          ? isAr
                            ? 'معتمدة في خزينة شركتك'
                            : 'Verified in your vault'
                          : isAr
                          ? 'مطلوب إرفاقها بالعرض'
                          : 'Required with bid'}
                      </span>
                    </div>
                    {isMatched ? (
                      <CheckCircle2 className="w-5 h-5 text-[#2d7a58]" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-[#c38b40]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission CTA Footer */}
          <div className="pt-6 border-t border-[#b9aa95] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left rtl:sm:text-right">
              <span className="text-xs font-mono font-bold text-[#202522] block">
                {isAr ? 'جاهز لتقديم عرض السعر التجاري؟' : 'Ready to submit your commercial bid?'}
              </span>
              <span className="text-[11px] text-[#70695f]">
                {isAr
                  ? 'سيتم تسجيل العرض وحفظه بصفحة عروضك مع تنبيهك فور رد المستورد.'
                  : 'Your bid will be archived in your quotes register with instant alerts on buyer response.'}
              </span>
            </div>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'تقديم عرض سعر مشفر الآن' : 'SUBMIT SEALED QUOTE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quote Submission Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        rfq={rfq}
        onClose={() => setIsQuoteModalOpen(false)}
        onSubmit={handleQuoteSubmit}
      />
    </div>
  );
}
