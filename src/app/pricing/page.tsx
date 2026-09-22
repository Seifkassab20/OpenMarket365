'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackSubscriptionPlans } from '@/lib/data/fallbackData';
import { 
  Check, 
  X, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

export default function PricingPage() {
  const { language, t } = useLanguage();
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
        <div className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
          06 / SUBSCRIPTION INDEX • 0% COMMISSION
        </div>

        <h1 className="text-4xl sm:text-6xl font-serif text-[#202522] tracking-tight">
          {language === 'ar' ? 'باقات الاشتراك للمصدرين المصريين.' : 'Transparent annual tiers.'}
        </h1>

        <p className="text-base text-[#70695f] leading-relaxed">
          {language === 'ar' 
            ? 'اشتراكات سنوية ثابتة دون أي استقطاع عمولة على الصفقات المبرمة. فواتير ضريبية رسمية معتمدة تدعم التحويل البنكي وفوري.'
            : 'Predictable annual memberships with zero transaction fees or trade cuts. Fully audit-ready with official VAT e-invoicing.'
          }
        </p>

        {/* Guarantee Pill */}
        <div className="pt-2 flex items-center justify-center gap-3 text-xs text-[#596348] font-medium">
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
              className={`p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                isPopular
                  ? 'bg-[#202522] text-[#eee8dc] border-[#202522] shadow-lg lg:-translate-y-2'
                  : 'bg-[#e4dac9] text-[#202522] border-[#b9aa95] hover:border-[#202522]'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#9b452f] text-white font-bold text-[9px] tracking-widest uppercase">
                  {language === 'ar' ? 'الأكثر طلباً للمصدرين' : 'RECOMMENDED'}
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] block ${isPopular ? 'text-[#c38b40]' : 'text-[#9b452f]'}`}>
                    {plan.subscription_code} TIER
                  </span>
                  <h3 className={`text-2xl font-serif mt-1 ${isPopular ? 'text-[#eee8dc]' : 'text-[#202522]'}`}>
                    {language === 'ar' ? plan.name_ar : plan.name_en}
                  </h3>
                </div>

                {/* Price Display */}
                <div className={`my-6 pb-6 border-b ${isPopular ? 'border-[#eee8dc]/20' : 'border-[#b9aa95]'}`}>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl sm:text-4xl font-serif font-bold ${isPopular ? 'text-white' : 'text-[#202522]'}`}>
                      ${plan.annual_price_usd?.toLocaleString()}
                    </span>
                    <span className={`text-xs font-sans font-normal ${isPopular ? 'text-[#eee8dc]/60' : 'text-[#70695f]'}`}>/ year</span>
                  </div>
                  {plan.annual_price_egp ? (
                    <div className={`text-xs mt-1 font-mono font-medium ${isPopular ? 'text-[#c38b40]' : 'text-[#9b452f]'}`}>
                      ≈ {plan.annual_price_egp?.toLocaleString()} EGP
                    </div>
                  ) : (
                    <div className="text-xs mt-1 font-semibold text-[#596348]">
                      {language === 'ar' ? 'مجاني للأبد للشركات الناشئة' : 'Free Forever'}
                    </div>
                  )}
                </div>

                {/* Quotas & Features */}
                <ul className={`space-y-3.5 text-xs mb-8 ${isPopular ? 'text-[#eee8dc]/80' : 'text-[#565047]'}`}>
                  <li className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-[#596348]' : 'text-[#596348]'}`} />
                    <span>
                      <strong className={isPopular ? 'text-white' : 'text-[#202522]'}>{plan.max_products && plan.max_products > 1000 ? 'Unlimited' : plan.max_products}</strong> {language === 'ar' ? 'منتجات في المعرض' : 'Published Products'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-[#596348]' : 'text-[#596348]'}`} />
                    <span>
                      <strong className={isPopular ? 'text-white' : 'text-[#202522]'}>{plan.max_images && plan.max_images > 1000 ? 'Unlimited' : plan.max_images}</strong> {language === 'ar' ? 'صور عالية الدقة' : 'High-Res Photos'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    {plan.video_allowed ? (
                      <Check className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-[#596348]' : 'text-[#596348]'}`} />
                    ) : (
                      <X className="w-4 h-4 text-[#70695f]/50 flex-shrink-0" />
                    )}
                    <span className={plan.video_allowed ? (isPopular ? 'text-white font-medium' : 'text-[#202522] font-medium') : 'line-through opacity-60'}>
                      {plan.subscription_code === 'ELT' 
                        ? (language === 'ar' ? 'فيديوهات متعددة وتحديث شهري' : 'Multi-Video Embeds + 30-Day Refresh')
                        : (language === 'ar' ? 'فيديو معرض المصنع بدقة 4K' : '1 Fixed 4K Video Embed')
                      }
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    <Check className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-[#596348]' : 'text-[#596348]'}`} />
                    <span>
                      {language === 'ar' ? 'ظهور مباشر لبيانات الاتصال للمشترين' : 'Direct Contact Display to Buyers'}
                    </span>
                  </li>

                  <li className="flex items-center gap-2.5">
                    {plan.dynamic_refresh_allowed ? (
                      <Check className={`w-4 h-4 flex-shrink-0 ${isPopular ? 'text-[#c38b40]' : 'text-[#9b452f]'}`} />
                    ) : (
                      <X className="w-4 h-4 text-[#70695f]/50 flex-shrink-0" />
                    )}
                    <span className={plan.dynamic_refresh_allowed ? (isPopular ? 'text-white font-medium' : 'text-[#202522] font-medium') : 'opacity-60'}>
                      {language === 'ar' ? 'تحديث المعرض والصور كل 30 يوماً' : 'Dynamic Media Refresh (30-Day)'}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={() => setSelectedPlanModal(plan.subscription_code)}
                  className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isPopular
                      ? 'bg-[#9b452f] hover:bg-[#833824] text-white shadow-sm'
                      : isFree
                      ? 'border border-[#202522] text-[#202522] hover:bg-[#202522] hover:text-[#eee8dc]'
                      : 'bg-[#202522] hover:bg-black text-[#eee8dc]'
                  }`}
                >
                  {isFree 
                    ? (language === 'ar' ? 'ابدأ مجاناً' : 'Get Started Free') 
                    : (language === 'ar' ? 'اشتراك عبر التحويل البنكي' : 'Subscribe via Wire / Fawry')
                  }
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment & Audit Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#e4dac9] border border-[#b9aa95] max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedPlanModal(null)}
              className="absolute top-4 right-4 p-2 text-[#70695f] hover:text-[#202522]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-[#b9aa95]">
              <span className="text-[10px] font-bold text-[#9b452f] uppercase tracking-[0.22em]">
                {language === 'ar' ? 'سداد الاشتراك وتفعيل الباقة' : 'OFFLINE WIRE SETTLEMENT'}
              </span>
              <h3 className="text-2xl font-serif text-[#202522] mt-1">
                {language === 'ar' ? `تأكيد الاشتراك في باقة ${selectedPlanModal}` : `Confirm ${selectedPlanModal} Tier Subscription`}
              </h3>
              <p className="text-xs text-[#70695f] mt-1">
                {language === 'ar' 
                  ? 'يتم مراجعة إيصال السداد واعتماد الفاتورة الضريبية عبر لوحة الإدارة خلال 4 ساعات عمل.'
                  : 'Your bank wire reference will be verified by the admin desk with an official tax invoice issued within 4 business hours.'
                }
              </p>
            </div>

            {paymentSuccess ? (
              <div className="p-6 bg-[#596348]/10 border border-[#596348] text-center space-y-2">
                <ShieldCheck className="w-10 h-10 text-[#596348] mx-auto animate-bounce" />
                <h4 className="text-lg font-serif text-[#202522] font-bold">
                  {language === 'ar' ? 'تم استلام بيانات السداد بنجاح!' : 'Payment Reference Logged!'}
                </h4>
                <p className="text-xs text-[#70695f]">
                  {language === 'ar' ? 'تم قيد الطلب وجاري التحقق من التحويل وتفعيل الحساب.' : 'Reference entered in audit queue. Account quota will be unlocked immediately upon confirmation.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleOfflinePaymentSubmit} className="space-y-4">
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#eee8dc] border border-[#b9aa95] text-xs">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 text-xs font-bold transition-all border ${paymentMethod === 'bank' ? 'bg-[#202522] text-[#eee8dc] border-[#202522]' : 'text-[#70695f] border-transparent'}`}
                  >
                    {language === 'ar' ? 'تحويل بنكي (CIB / NBE)' : 'Bank Wire (CIB)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('fawry')}
                    className={`py-2 text-xs font-bold transition-all border ${paymentMethod === 'fawry' ? 'bg-[#202522] text-[#eee8dc] border-[#202522]' : 'text-[#70695f] border-transparent'}`}
                  >
                    {language === 'ar' ? 'فوري باي (Fawry)' : 'Fawry Business'}
                  </button>
                </div>

                {/* Bank Details Box */}
                {paymentMethod === 'bank' ? (
                  <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] text-xs space-y-2 text-[#565047]">
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">Bank Name:</span>
                      <strong className="text-[#202522]">Commercial International Bank (CIB)</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">Beneficiary:</span>
                      <strong className="text-[#202522]">OpenMarket365 Trade Ltd</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">Account No (EGP):</span>
                      <strong className="text-[#9b452f] font-mono">1000-4920-1928</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">IBAN:</span>
                      <strong className="text-[#202522] font-mono">EG380010000000100049201928</strong>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-[#eee8dc] border border-[#b9aa95] text-xs space-y-2 text-[#565047]">
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">Fawry Merchant Code:</span>
                      <strong className="text-[#9b452f] font-mono">94820</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#70695f]">Service Code:</span>
                      <strong className="text-[#202522]">788 - Corporate Subscriptions</strong>
                    </div>
                  </div>
                )}

                {/* Reference Number Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#202522] mb-1">
                    {language === 'ar' ? 'رقم الحوالة البنكية / مرجع فوري' : 'Bank Wire / Fawry Reference No.'}
                  </label>
                  <input
                    type="text"
                    required
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. TRF-928174092"
                    className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] text-[#202522] text-xs font-mono focus:border-[#202522] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-bold text-xs uppercase tracking-wider bg-[#9b452f] hover:bg-[#833824] text-white transition-colors mt-2"
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

