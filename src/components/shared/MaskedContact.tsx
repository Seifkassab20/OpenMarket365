'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { useAuth } from '@/lib/context/AuthContext';
import { Lock, Unlock, Phone, MessageSquare, Mail, ShieldCheck, X, UserPlus, LogIn, Copy, Check } from 'lucide-react';

interface MaskedContactProps {
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  companyName: string;
  variant?: 'inline' | 'card' | 'button';
}

export default function MaskedContact({
  phone = '+20 100 892 0110',
  whatsapp = '+20 100 892 0110',
  email = 'export@company.com',
  companyName,
  variant = 'card',
}: MaskedContactProps) {
  const { language } = useLanguage();
  const { currentUser } = useAuth();
  // Simulates authenticated state; users can toggle for testing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isUnlocked = isAuthenticated || currentUser.isLoggedIn;
  const [modalOpen, setModalOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const cleanPhone = (phone || '').replace(/\s+/g, '');
  const cleanWhatsapp = (whatsapp || '').replace(/[^0-9]/g, '');

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Masked string representation
  const maskString = (str: string) => {
    if (!str) return '••••••••••••';
    const visible = str.slice(0, 7);
    return `${visible} ••• ••••`;
  };

  if (variant === 'button') {
    if (isUnlocked) {
      return (
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Inquiry for ${companyName} via OpenMarket365`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded text-xs font-mono font-bold bg-[#596348] hover:bg-[#596348]/90 text-white flex items-center gap-1.5 transition-all uppercase tracking-wider"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] bg-[#eee8dc] hover:bg-[#202522] hover:text-[#eee8dc] flex items-center gap-1.5 transition-all uppercase tracking-wider"
        >
          <Lock className="w-3.5 h-3.5 text-[#9b452f]" />
          <span>{language === 'ar' ? 'عرض أرقام التواصل' : 'Reveal Direct Coordinates'}</span>
        </button>

        {modalOpen && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#202522]/80 backdrop-blur-sm">
        <div className="bg-[#eee8dc] border border-[#b9aa95] rounded-xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-[#202522]/60 hover:text-[#202522]"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-[#e4dac9] border border-[#b9aa95] flex items-center justify-center mx-auto mb-3 text-[#9b452f]">
              <Lock className="w-5 h-5" />
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#596348] font-bold mb-1">
              ANTI-BROKER PROTECTION GATE
            </div>
            <h3 className="text-2xl font-serif text-[#202522]">
              {language === 'ar' ? 'بيانات التواصل المباشرة محمية' : 'Verified Direct Contact Gate'}
            </h3>
            <p className="text-xs text-[#202522]/70 mt-2 leading-relaxed">
              {language === 'ar'
                ? `للحفاظ على سرية الصفقات ومنع وسطاء السمسرة، يتم عرض أرقام واتساب وهواتف المصنع لـ "${companyName}" حصرياً للمستوردين المسجلين مجاناً.`
                : `To eliminate broker markups and prevent automated crawling, direct WhatsApp and phone coordinates for "${companyName}" are unmasked exclusively to registered wholesale buyers.`
              }
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/auth/register"
              onClick={() => setModalOpen(false)}
              className="w-full py-3 rounded font-mono font-bold text-xs bg-[#202522] hover:bg-[#202522]/90 text-[#eee8dc] flex items-center justify-center gap-2 transition-all uppercase tracking-wider shadow-sm"
            >
              <UserPlus className="w-4 h-4 text-[#c38b40]" />
              <span>{language === 'ar' ? 'تسجيل حساب مشتري مجاني (فوري)' : 'Register Free Buyer Account'}</span>
            </Link>

            <Link
              href="/auth/login"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded font-mono font-bold text-xs border border-[#b9aa95] bg-[#e4dac9] text-[#202522] hover:border-[#202522] flex items-center justify-center gap-2 transition-all uppercase tracking-wider"
            >
              <LogIn className="w-4 h-4 text-[#596348]" />
              <span>{language === 'ar' ? 'تسجيل الدخول لحساب قائم' : 'Sign In with Existing Account'}</span>
            </Link>

            {/* Quick Demo Mode Reveal Button */}
            <div className="pt-3 border-t border-[#b9aa95]/40 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(true);
                  setModalOpen(false);
                }}
                className="text-[11px] font-mono text-[#9b452f] font-semibold hover:underline inline-flex items-center gap-1 uppercase tracking-wider"
              >
                <Unlock className="w-3 h-3" />
                <span>{language === 'ar' ? 'معاينة تجريبية: فتح البيانات الآن' : 'Demo Mode: Instant-Reveal Contacts'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#e4dac9] border border-[#b9aa95] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#b9aa95]/50">
        <span className="text-[11px] font-mono font-bold text-[#202522] uppercase tracking-wider flex items-center gap-1.5">
          {isUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-[#596348]" />
              <span className="text-[#596348]">{language === 'ar' ? 'بيانات التواصل المباشرة (معتمدة)' : 'Verified Direct Contacts'}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-[#9b452f]" />
              <span>{language === 'ar' ? 'بيانات الاتصال المباشرة' : 'Direct Supplier Contacts'}</span>
            </>
          )}
        </span>

        <button
          onClick={() => setIsAuthenticated(!isUnlocked)}
          className="text-[10px] font-mono text-[#202522]/60 hover:text-[#202522] flex items-center gap-1 transition-colors uppercase tracking-wider"
          title="Toggle between Visitor Masked and Buyer Unmasked mode"
        >
          {isUnlocked ? '[Lock View]' : '[Demo Unlock]'}
        </button>
      </div>

      {isUnlocked ? (
        <div className="space-y-2.5 text-xs font-mono">
          {/* Phone */}
          <div className="flex items-center justify-between p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/60">
            <div className="flex items-center gap-2 text-[#202522]">
              <Phone className="w-3.5 h-3.5 text-[#596348]" />
              <span>{phone}</span>
            </div>
            <button
              onClick={() => copyToClipboard(phone || '', 'phone')}
              className="p-1 rounded text-[#202522]/60 hover:text-[#202522]"
              title="Copy Phone"
            >
              {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-[#596348]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-2.5 rounded bg-[#eee8dc] border border-[#b9aa95]/60">
            <div className="flex items-center gap-2 text-[#202522] truncate max-w-[200px]">
              <Mail className="w-3.5 h-3.5 text-[#9b452f]" />
              <span className="truncate">{email}</span>
            </div>
            <button
              onClick={() => copyToClipboard(email || '', 'email')}
              className="p-1 rounded text-[#202522]/60 hover:text-[#202522]"
              title="Copy Email"
            >
              {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-[#596348]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* WhatsApp Direct Action */}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Inquiry for ${companyName} via OpenMarket365`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded text-xs font-mono font-bold bg-[#596348] hover:bg-[#596348]/90 text-white flex items-center justify-center gap-2 transition-all mt-2 uppercase tracking-wider shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp Directly</span>
          </a>
        </div>
      ) : (
        <div className="space-y-3 font-mono">
          <div className="p-3 rounded bg-[#eee8dc] border border-[#b9aa95]/60 space-y-1.5 text-xs text-[#202522]/50 select-none">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#202522]/40" />
              <span>{maskString(phone || '')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#202522]/40" />
              <span>•••••••@••••••••.com</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 rounded text-xs font-mono font-bold border border-[#b9aa95] text-[#202522] bg-[#eee8dc] hover:bg-[#202522] hover:text-[#eee8dc] transition-all flex items-center justify-center gap-2 uppercase tracking-wider shadow-sm"
          >
            <Lock className="w-3.5 h-3.5 text-[#9b452f]" />
            <span>{language === 'ar' ? 'سجل مجاناً كمشتري لعرض الأرقام' : 'Register Free to Unlock Contacts'}</span>
          </button>
        </div>
      )}

      {modalOpen && renderModal()}
    </div>
  );
}
