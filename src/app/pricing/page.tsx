'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackSubscriptionPlans } from '@/lib/data/fallbackData';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Building2, 
  Video, 
  HardDrive, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export default function PricingPage() {
  const { language, t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');
  const [selectedPlanModal, setSelectedPlanModal] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'fawry'>('bank');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const plans = fallbackSubscriptionPlans;

  const handleOfflinePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setSelectedPlanModal(null);
      setPaymentSuccess(false);
      setReferenceNumber('');
    }, 2500);
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-goldBorder bg-brand-gold/10 text-brand-gold text-xs font-bold shadow-gold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'نموذج اشتراك بدون عمولات' : '0% COMMISSION B2B MODEL'}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {t('pricingTitle')}
        </h1>

        <p className="text-base text-brand-muted leading-relaxed">
          {t('pricingSubtitle')}
        </p>

        {/* Guarantee Pill */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs text-brand-emeraldLight">
          <ShieldCheck className="w-4 h-4" />
          <span>{language === 'ar' ? 'موثق رسمياً ويشمل الفاتورة الضريبية وسجل المراجعة' : 'Official VAT Tax Invoice & Audit Trail Included'}</span>
        </div>
      </div>

      {/* Plans Grid (4-Tier) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((plan) => {
          const isPopular = plan.subscription_code === 'PRM';
          const isFree = plan.annual_price_usd === 0;

          return (
            <div
              key={plan.subscription_code}
              className={`rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                isPopular
                  ? 'glass-panel-gold border-2 border-brand-gold shadow-goldGlow lg:-translate-y-2'
                  : 'glass-panel hover:border-white/20'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark font-extrabold text-[10px] tracking-wider uppercase shadow-gold">
                  {language === 'ar' ? 'الأكثر طلباً للمصدرين' : 'MOST POPULAR'}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                    {plan.subscription_code} TIER
                  </span>
                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {language === 'ar' ? plan.name_ar : plan.name_en}
                  </h3>
                </div>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-brand-border/60">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      ${plan.annual_price_usd?.toLocaleString()}
                    </span>
                    <span className="text-xs text-brand-dim font-medium">/ year</span>
                  </div>
                  {plan.annual_price_egp ? (
                    <div className="text-xs text-brand-gold mt-1 font-semibold">
                      ≈ {plan.annual_price_egp?.toLocaleString()} EGP
                    </div>
                  ) : (
                    <div className="text-xs text-brand-emeraldLight mt-1 font-semibold">
                      {language === 'ar' ? 'مجاني للأبد للشركات الناشئة' : 'Permanently Free Forever'}
                    </div>
                  )}
                </div>

                {/* Quotas & Features */}
                <ul className="space-y-3.5 text-xs text-brand-text mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand-emeraldLight flex-shrink-0" />
                    <span>
                      <strong>{plan.max_products && plan.max_products > 1000 ? 'Unlimited' : plan.max_products}</strong> {language === 'ar' ? 'منتجات في المعرض' : 'Published Products'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand-emeraldLight flex-shrink-0" />
                    <span>
                      <strong>{plan.max_images && plan.max_images > 1000 ? 'Unlimited' : plan.max_images}</strong> {language === 'ar' ? 'صور عالية الدقة' : 'High-Res Photos'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    {plan.video_allowed ? (
                      <Check className="w-4 h-4 text-brand-emeraldLight flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-brand-dim flex-shrink-0" />
                    )}
                    <span className={plan.video_allowed ? 'text-white font-medium' : 'text-brand-dim line-through'}>
                      {plan.subscription_code === 'ELT' 
                        ? (language === 'ar' ? 'فيديوهات متعددة وتحديث شهري' : 'Multi-Video Embeds + 30-Day Refresh')
                        : (language === 'ar' ? 'فيديو معرض المصنع بدقة 4K' : '1 Fixed 4K Video Embed')
                      }
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-brand-emeraldLight flex-shrink-0" />
                    <span>
                      {language === 'ar' ? 'ظهور مباشر لبيانات الاتصال للمشترين' : 'Direct Contact Display to Buyers'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    {plan.dynamic_refresh_allowed ? (
                      <Check className="w-4 h-4 text-brand-gold flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-brand-dim flex-shrink-0" />
                    )}
                    <span className={plan.dynamic_refresh_allowed ? 'text-white font-medium' : 'text-brand-dim'}>
                      {language === 'ar' ? 'تحديث المعرض والصور كل 30 يوماً' : 'Dynamic Media Refresh (Every 30 Days)'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => setSelectedPlanModal(plan.subscription_code)}
                  className={`w-full py-3 rounded-xl font-bold text-xs tracking-wide transition-all ${
                    isPopular
                      ? 'bg-gradient-to-r from-brand-amber via-brand-gold to-brand-goldDark text-brand-dark hover:brightness-110 shadow-gold'
                      : isFree
                      ? 'border border-brand-border text-white hover:bg-white/5'
                      : 'border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark'
                  }`}
                >
                  {isFree 
                    ? (language === 'ar' ? 'ابدأ مجاناً' : 'Get Started Free') 
                    : (language === 'ar' ? 'اشتراك عبر التحويل البنكي' : 'Subscribe via Bank Transfer')
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment & Audit Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel-gold rounded-3xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
                {language === 'ar' ? 'سداد الاشتراك وتفعيل الباقة' : 'Offline Payment & Audit'}
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                {language === 'ar' ? `تأكيد الاشتراك في باقة ${selectedPlanModal}` : `Confirm ${selectedPlanModal} Subscription`}
              </h3>
              <p className="text-xs text-brand-dim mt-1">
                {language === 'ar' 
                  ? 'يتم مراجعة إيصال السداد واعتماد الفاتورة الضريبية عبر لوحة الإدارة خلال 4 ساعات عمل.'
                  : 'Your payment reference will be verified by the admin desk with an official tax invoice issued within 4 business hours.'
                }
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-6 rounded-2xl bg-brand-emerald/10 border border-brand-emeraldLight/40 text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-brand-emeraldLight mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white">
                  {language === 'ar' ? 'تم استلام بيانات السداد بنجاح!' : 'Payment Receipt Submitted!'}
                </h4>
                <p className="text-xs text-brand-muted">
                  {language === 'ar' ? 'تم قيد الطلب وجاري التحقق من التحويل وتفعيل الحساب.' : 'Reference logged in audit ledger. Account quotas are being provisioned.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleOfflinePaymentSubmit} className="space-y-4">
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-white/5 border border-brand-border text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 rounded-lg font-bold transition-all ${paymentMethod === 'bank' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-brand-muted'}`}
                  >
                    {language === 'ar' ? 'تحويل بنكي (CIB / NBE)' : 'Bank Transfer (CIB)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('fawry')}
                    className={`py-2 rounded-lg font-bold transition-all ${paymentMethod === 'fawry' ? 'bg-brand-gold text-brand-dark shadow-sm' : 'text-brand-muted'}`}
                  >
                    {language === 'ar' ? 'فوري باي (Fawry)' : 'Fawry Business'}
                  </button>
                </div>

                {/* Bank Details Box */}
                {paymentMethod === 'bank' ? (
                  <div className="p-4 rounded-xl bg-white/5 border border-brand-border text-xs space-y-2 text-brand-muted">
                    <div className="flex justify-between">
                      <span>Bank Name:</span>
                      <strong className="text-white">Commercial International Bank (CIB)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Beneficiary:</span>
                      <strong className="text-white">OpenMarket365 Trade Ltd</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Account No (EGP):</span>
                      <strong className="text-brand-gold font-mono">1000-4920-1928</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>IBAN:</span>
                      <strong className="text-brand-gold font-mono">EG380010000000100049201928</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 border border-brand-border text-xs space-y-2 text-brand-muted">
                    <div className="flex justify-between">
                      <span>Fawry Merchant Code:</span>
                      <strong className="text-brand-gold font-mono">94820</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Service Code:</span>
                      <strong className="text-white">788 - Corporate Subscriptions</strong>
                    </div>
                  </div>
                )}

                {/* Reference Number Input */}
                <div>
                  <label className="block text-xs font-semibold text-white mb-1">
                    {language === 'ar' ? 'رقم الحوالة البنكية / مرجع فوري' : 'Bank Transfer / Fawry Reference No.'}
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. TRF-928174092"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-brand-border text-white text-xs font-mono focus:border-brand-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald transition-all"
                >
                  {language === 'ar' ? 'إرسال بيانات السداد للاعتماد' : 'Submit Reference for Verification'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
