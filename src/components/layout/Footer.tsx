'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ShieldCheck, Award, Building2, Anchor, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="border-t border-brand-border bg-brand-dark text-brand-muted text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-border/60">
          {/* Col 1: Platform identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-amber via-brand-gold to-brand-goldDark flex items-center justify-center font-bold text-brand-dark text-lg shadow-gold">
                365
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                OpenMarket<span className="text-brand-gold">365</span>
              </span>
            </div>
            <p className="text-brand-dim text-xs leading-relaxed max-w-sm">
              {language === 'ar' 
                ? 'المنصة الرقمية الموحدة لترويج الصادرات المصرية. ربط محطات التعبئة والمصانع المعتمدة بكبرى سلاسل التوريد والأسواق الدولية بدون وسطاء وعمولات صفرية.'
                : 'Egypt’s national digital B2B trade gateway. Connecting verified agricultural packers and industrial manufacturers directly with global importers, hypermarkets, and commodities desks.'
              }
            </p>
            <div className="flex items-center gap-4 text-xs text-brand-dim pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-emeraldLight" />
                <span>Commercial Registry Audit</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-brand-gold" />
                <span>ISO & GlobalGAP Vault</span>
              </div>
            </div>
          </div>

          {/* Col 2: Core Markets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'ar' ? 'القطاعات التصديرية' : 'Export Sectors'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=CITRUS" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'الموالح والحمضيات' : 'Fresh Citrus & Oranges'}</Link></li>
              <li><Link href="/products?category=FROZEN_AGRO" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'فراولة وخضروات مجمدة' : 'IQF Frozen Fruits & Veg'}</Link></li>
              <li><Link href="/products?category=ALLIUM" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'بصل وثوم مصري' : 'Onions & Fresh Garlic'}</Link></li>
              <li><Link href="/products?category=HERBS_SPICES" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'أعشاب ونباتات طبية' : 'Herbs, Basil & Chamomile'}</Link></li>
              <li><Link href="/products?category=OLIVE_OILS" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'زيت زيتون بكر ممتاز' : 'Extra Virgin Olive Oil'}</Link></li>
            </ul>
          </div>

          {/* Col 3: Trade Desks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'ar' ? 'المكاتب التجارية' : 'Trade Desks'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/rfqs" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'طلبات التوريد الدولية' : 'Live Importer RFQs'}</Link></li>
              <li><Link href="/market" className="hover:text-brand-amber transition-colors flex items-center gap-1"><span>{language === 'ar' ? 'بورصة بضائع الموانئ' : 'Distressed Cargo Desk'}</span><span className="text-[10px] px-1 bg-brand-amber/20 text-brand-amber rounded">PORT</span></Link></li>
              <li><Link href="/exporters" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'معارض المصدرين المعتمدين' : 'Verified Exporter Directory'}</Link></li>
              <li><Link href="/pricing" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'باقات الاشتراك والرسوم 0%' : 'Zero-Commission Tiers'}</Link></li>
              <li><Link href="/media" className="hover:text-brand-gold transition-colors">{language === 'ar' ? 'برنامج هنقدر التلفزيوني' : '"Yes We Can" TV Series'}</Link></li>
            </ul>
          </div>

          {/* Col 4: Institutional Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              {language === 'ar' ? 'الهيئات والموانئ' : 'Port & Authority Links'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1 hover:text-brand-gold transition-colors">
                <Anchor className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Alexandria Port Authority</span>
              </li>
              <li className="flex items-center gap-1 hover:text-brand-gold transition-colors">
                <Anchor className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Damietta Port Authority</span>
              </li>
              <li className="flex items-center gap-1 hover:text-brand-gold transition-colors">
                <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>Agri Export Council (AEC)</span>
              </li>
              <li className="flex items-center gap-1 hover:text-brand-gold transition-colors">
                <Building2 className="w-3.5 h-3.5 text-brand-gold" />
                <span>General Auth. for Investment (GAFI)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-dim">
          <div>
            © 2026 {t('footerRights')}
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">{language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
            <span className="hover:text-white cursor-pointer">{language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}</span>
            <span className="hover:text-white cursor-pointer">{language === 'ar' ? 'ميثاق النزاهة ومنع التواطؤ' : 'Anti-Collusion Sealed Bid Charter'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
