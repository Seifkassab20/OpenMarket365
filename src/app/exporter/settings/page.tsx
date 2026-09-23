'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/admin/ToastNotification';
import {
  Settings,
  User,
  Shield,
  Bell,
  Lock,
  Globe,
  Save,
  CheckCircle2,
  Building,
  Mail,
  Phone,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';

export default function ExporterSettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const isAr = language === 'ar';

  const [isSaving, setIsSaving] = useState(false);

  // Profile Information
  const [profile, setProfile] = useState({
    name: 'Eng. Tarek Mansour',
    title: 'Export Director & Managing Partner',
    email: 'export@nileagro-eg.com',
    phone: '+20 100 234 5678',
    whatsapp: '+20 100 234 5678',
  });

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    rfqSms: true,
    rfqEmail: true,
    quoteStatusAlert: true,
    mediaRefreshReminder: true,
    weeklyReport: true,
  });

  // Currency Preference
  const [defaultCurrency, setDefaultCurrency] = useState('USD');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast({
        title: isAr ? 'تم حفظ الإعدادات' : 'Settings Saved',
        message: isAr
          ? 'تم حفظ تفضيلات الحساب وبيانات الاتصال التجاري بنجاح.'
          : 'Account preferences and commercial contact settings successfully updated.',
        type: 'success',
      });
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-5 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#9b452f]">
              {isAr ? 'إعدادات الحساب والأمان' : 'EXPORTER CREDENTIALS & SECURITY'}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#2d7a58]/10 text-[#2d7a58] border border-[#2d7a58]/30">
              {isAr ? 'سجل تجاري معتمد' : 'CR-104928-EG Verified'}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#202522]">
            {isAr ? 'إعدادات حساب المصدر والتفضيلات' : 'Exporter Account & Security Settings'}
          </h1>
          <p className="text-xs text-[#70695f]">
            {isAr
              ? 'إدارة بيانات المفوض التجاري، قنوات التنبيهات الفورية للعطاءات، وضوابط الأمان للمظاريف المغلقة.'
              : 'Manage designated commercial contacts, instant RFQ lead notifications, and cryptographic bidding security.'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* SECTION 1: Commercial Representative Profile */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#b9aa95]/40">
            <User className="w-4 h-4 text-[#9b452f]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
              {isAr ? 'بيانات المفوض التجاري المعتمد' : 'Commercial Representative & Export Officer'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'اسم المسؤول التجاري' : 'Representative Full Name'}
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'المسمى الوظيفي' : 'Official Title'}
              </label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs text-[#202522] focus:outline-none focus:border-[#9b452f]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'البريد الإلكتروني المعتمد' : 'Official Corporate Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pl-9 pr-3.5 rtl:pl-3.5 rtl:pr-9 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'رقم الهاتف للتواصل الفوري / واتساب' : 'Direct Telephone / WhatsApp'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 rtl:left-auto rtl:right-3 text-[#70695f]" />
                <input
                  type="tel"
                  required
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 rtl:pl-3.5 rtl:pr-9 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Sovereign Business Verification Status */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#b9aa95]/40">
            <ShieldCheck className="w-4 h-4 text-[#2d7a58]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
              {isAr ? 'السجل التجاري والتحقق السيادي (GOEIC)' : 'Sovereign Verification & Registry Credentials'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-[#70695f] block">
                {isAr ? 'رقم السجل التجاري' : 'Commercial Registry (CR)'}
              </span>
              <span className="font-bold text-[#202522] text-sm">CR-104928-EG</span>
              <span className="text-[10px] text-[#2d7a58] block font-bold">✓ Verified Sovereign Record</span>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-[#70695f] block">
                {isAr ? 'الرقم الضريبي الموحد' : 'Unified Tax ID'}
              </span>
              <span className="font-bold text-[#202522] text-sm">TAX-928103-GIZ</span>
              <span className="text-[10px] text-[#2d7a58] block font-bold">✓ Active Tax Status</span>
            </div>

            <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] text-[#70695f] block">
                {isAr ? 'جهة الاعتماد' : 'Auditing Authority'}
              </span>
              <span className="font-bold text-[#202522] text-sm">GOEIC / Market 365</span>
              <span className="text-[10px] text-[#70695f] block">Inspection Grade AA</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Notification Preferences */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#b9aa95]/40">
            <Bell className="w-4 h-4 text-[#9b452f]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
              {isAr ? 'تفضيلات الإشعارات وقنوات التنبيه' : 'Procurement Alerts & Dispatch Channels'}
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#202522] block">
                  {isAr ? 'إشعارات SMS الفورية للعطاءات الأوروبية' : 'Instant SMS Alerts for Matching European RFQs'}
                </span>
                <span className="text-[11px] text-[#70695f]">
                  {isAr ? 'تنبيه على الهاتف فور طرح مشتري أوروبي لمناقصة تطابق محاصيلك.' : 'Direct SMS notification when a European importer posts an RFQ matching your crop season.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.rfqSms}
                onChange={(e) => setNotifications({ ...notifications, rfqSms: e.target.checked })}
                className="w-4 h-4 accent-[#9b452f]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#202522] block">
                  {isAr ? 'تحديثات حالة العروض والمظاريف المغلقة' : 'Sealed Quotation Status Updates'}
                </span>
                <span className="text-[11px] text-[#70695f]">
                  {isAr ? 'إشعار فوري عند قبول العرض أو طلب تفاوض من المستورد.' : 'Instant notification when a buyer reviews or accepts your commercial quotation.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.quoteStatusAlert}
                onChange={(e) =>
                  setNotifications({ ...notifications, quoteStatusAlert: e.target.checked })
                }
                className="w-4 h-4 accent-[#9b452f]"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-[#eee8dc] border border-[#b9aa95] rounded-xl">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-[#202522] block">
                  {isAr ? 'تذكير تجديد الوسائط الديناميكية (كل 30 يوماً)' : '30-Day Media Refresh Reminder'}
                </span>
                <span className="text-[11px] text-[#70695f]">
                  {isAr ? 'تنبيه عند فتح نافذة تحديث فيديو المحطة والصور الموسمية.' : 'Remind packhouse management when the next seasonal media update window opens.'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifications.mediaRefreshReminder}
                onChange={(e) =>
                  setNotifications({ ...notifications, mediaRefreshReminder: e.target.checked })
                }
                className="w-4 h-4 accent-[#9b452f]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Regional & Currency Configuration */}
        <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#b9aa95]/40">
            <Globe className="w-4 h-4 text-[#9b452f]" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-[#202522]">
              {isAr ? 'التفضيلات الإقليمية والعملة' : 'Regional & Currency Preferences'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'لغة الواجهة التلقائية' : 'Default Interface Language'}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
              >
                <option value="ar">العربية (Arabic - RTL)</option>
                <option value="en">English (International - LTR)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-[#202522]">
                {isAr ? 'عملة التسعير القياسية' : 'Baseline Export Pricing Currency'}
              </label>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#eee8dc] border border-[#b9aa95] rounded-xl text-xs font-mono text-[#202522] focus:outline-none focus:border-[#9b452f]"
              >
                <option value="USD">USD ($) - US Dollar (International Standard)</option>
                <option value="EUR">EUR (€) - Euro (EU Supermarkets)</option>
                <option value="GBP">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold bg-[#9b452f] hover:bg-[#833824] text-white flex items-center gap-2 transition-all shadow-sm"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isAr ? 'حفظ التعديلات' : 'SAVE ACCOUNT SETTINGS'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
