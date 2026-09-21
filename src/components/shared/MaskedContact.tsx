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
  const { language, t } = useLanguage();
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
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald flex items-center gap-1.5 transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Direct</span>
          </a>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark flex items-center gap-1.5 transition-all"
        >
          <Lock className="w-3.5 h-3.5 text-brand-gold" />
          <span>{language === 'ar' ? 'عرض أرقام التواصل' : 'Reveal Contacts (Free)'}</span>
        </button>

        {modalOpen && renderModal()}
      </>
    );
  }

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="glass-panel-gold rounded-3xl max-w-md w-full p-6 sm:p-8 relative">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-brand-muted hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/20 border border-brand-goldBorder flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-brand-gold" />
            </div>
            <h3 className="text-xl font-extrabold text-white">
              {language === 'ar' ? 'بيانات التواصل المباشرة محمية' : 'Verified Direct Contact Gate'}
            </h3>
            <p className="text-xs text-brand-dim mt-2 leading-relaxed">
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
              className="w-full py-3 rounded-xl font-bold text-xs bg-brand-emerald hover:bg-brand-emeraldLight text-white shadow-emerald flex items-center justify-center gap-2 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسجيل حساب مشتري مجاني (فوري)' : 'Register Free Buyer Account'}</span>
            </Link>

            <Link
              href="/auth/login"
              onClick={() => setModalOpen(false)}
              className="w-full py-2.5 rounded-xl font-bold text-xs border border-brand-border text-white hover:border-brand-gold hover:text-brand-gold flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{language === 'ar' ? 'تسجيل الدخول لحساب قائم' : 'Sign In with Existing Account'}</span>
            </Link>

            {/* Quick Demo Mode Reveal Button */}
            <div className="pt-3 border-t border-brand-border/60 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsAuthenticated(true);
                  setModalOpen(false);
                }}
                className="text-[11px] text-brand-gold font-semibold hover:underline inline-flex items-center gap-1"
              >
                <Unlock className="w-3 h-3" />
                <span>{language === 'ar' ? 'معاينة تجريبية: فتح البيانات الآن' : 'Test Mode: Click to Instant-Reveal Contacts'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-brand-border/80 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          {isUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-brand-emeraldLight" />
              <span className="text-brand-emeraldLight">{language === 'ar' ? 'بيانات التواصل المباشرة (معتمدة)' : 'Verified Direct Contacts'}</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-brand-gold" />
              <span>{language === 'ar' ? 'بيانات الاتصال المباشرة' : 'Direct Supplier Contacts'}</span>
            </>
          )}
        </span>

        <button
          onClick={() => setIsAuthenticated(!isUnlocked)}
          className="text-[10px] text-brand-dim hover:text-brand-gold flex items-center gap-1 transition-colors"
          title="Toggle between Visitor Masked and Buyer Unmasked mode"
        >
          {isUnlocked ? '[Lock View]' : '[Demo Unlock]'}
        </button>
      </div>

      {isUnlocked ? (
        <div className="space-y-2.5 text-xs">
          {/* Phone */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-brand-border">
            <div className="flex items-center gap-2 text-white font-mono">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              <span>{phone}</span>
            </div>
            <button
              onClick={() => copyToClipboard(phone || '', 'phone')}
              className="p-1 rounded text-brand-dim hover:text-white"
              title="Copy Phone"
            >
              {copiedType === 'phone' ? <Check className="w-3.5 h-3.5 text-brand-emeraldLight" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-brand-border">
            <div className="flex items-center gap-2 text-white font-mono truncate max-w-[200px]">
              <Mail className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="truncate">{email}</span>
            </div>
            <button
              onClick={() => copyToClipboard(email || '', 'email')}
              className="p-1 rounded text-brand-dim hover:text-white"
              title="Copy Email"
            >
              {copiedType === 'email' ? <Check className="w-3.5 h-3.5 text-brand-emeraldLight" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* WhatsApp Direct Action */}
          <a
            href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(`Inquiry for ${companyName} via OpenMarket365`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald flex items-center justify-center gap-2 transition-all mt-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp Directly</span>
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-white/5 border border-brand-border space-y-1.5 text-xs font-mono text-brand-muted select-none">
            <div className="flex items-center gap-2 text-brand-dim">
              <Phone className="w-3.5 h-3.5 text-brand-dim" />
              <span>{maskString(phone || '')}</span>
            </div>
            <div className="flex items-center gap-2 text-brand-dim">
              <Mail className="w-3.5 h-3.5 text-brand-dim" />
              <span>•••••••@••••••••.com</span>
            </div>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-2.5 rounded-xl text-xs font-bold border border-brand-goldBorder text-brand-gold bg-brand-gold/10 hover:bg-brand-gold hover:text-brand-dark transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'سجل مجاناً كمشتري لعرض الأرقام' : 'Register Free to Unlock Contacts'}</span>
          </button>
        </div>
      )}

      {modalOpen && renderModal()}
    </div>
  );
}
