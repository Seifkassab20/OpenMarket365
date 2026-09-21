'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/context/LanguageContext';
import { fallbackCategories } from '@/lib/data/fallbackData';
import { 
  Citrus, 
  Snowflake, 
  Layers, 
  Flower2, 
  Droplet, 
  Apple, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

export default function CategoryExplorer() {
  const { language, direction, t } = useLanguage();
  const ArrowIcon = direction === 'rtl' ? ArrowLeft : ArrowRight;

  const categoryIcons: Record<string, React.ReactNode> = {
    CITRUS: <Citrus className="w-8 h-8 text-amber-400" />,
    FROZEN_AGRO: <Snowflake className="w-8 h-8 text-cyan-400" />,
    ALLIUM: <Layers className="w-8 h-8 text-yellow-500" />,
    HERBS_SPICES: <Flower2 className="w-8 h-8 text-emerald-400" />,
    OLIVE_OILS: <Droplet className="w-8 h-8 text-lime-400" />,
    DATES_FRUITS: <Apple className="w-8 h-8 text-orange-400" />,
  };

  const categoryDescriptions: Record<string, { en: string; ar: string }> = {
    CITRUS: {
      en: 'Fresh Valencia & Navel oranges, Mandarin, Eureka Lemons. World’s top exporter.',
      ar: 'برتقال صيفي فالنسيا وأبو سرة، يوسفي، وليمون يوريكا. مصر الأولى عالمياً في التصدير.'
    },
    FROZEN_AGRO: {
      en: 'IQF whole strawberries, sweet corn, artichoke bottoms, broccoli, and green beans.',
      ar: 'فراولة كاملة مجمدة IQF، ذرة حلوة، قلوب خرشوف، بروكلي، وفاصوليا خضراء ممتازة.'
    },
    ALLIUM: {
      en: 'Cured red & golden onions, fresh white garlic, and Beauregard sweet potatoes.',
      ar: 'بصل أحمر وذهبي جاف، ثوم بلدي أبيض، وبطاطا حلوة مخصصة لسلاسل السوبرماركت الأوروبية.'
    },
    HERBS_SPICES: {
      en: 'Organic Chamomile flower heads, Peppermint, Spearmint, Basil, and Hibiscus tea cut.',
      ar: 'أزهار بابونج عضوي، نعناع فلفلي، ريحان عطري، وكركديه سوداني معقم بالبخار.'
    },
    OLIVE_OILS: {
      en: 'Extra virgin cold-pressed olive oils, Picual & Manzanilla table olives in brine.',
      ar: 'زيت زيتون بكر ممتاز معصور على البارد، وزيتون مائدة بيكوال ومنزانيللا في محاليل ملحية.'
    },
    DATES_FRUITS: {
      en: 'Siwi and Medjool dates, fresh Wonderful pomegranates, and Tommy Atkins mangoes.',
      ar: 'تمور سيوي ومجدول، رمان وندرول طازج، ومانجو تومي وعويس معتمد للتصدير الجوي والبحري.'
    },
  };

  return (
    <section className="py-20 border-b border-brand-border/60 bg-brand-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="text-xs font-bold text-brand-gold uppercase tracking-wider mb-2">
              {language === 'ar' ? 'التصنيف السلعي والتجاري' : 'Export Commodities Taxonomy'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t('sectionCategories')}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-semibold text-brand-gold hover:text-brand-goldLight flex items-center gap-1 group"
          >
            <span>{t('viewAll')}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid of Sectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fallbackCategories.map((cat) => {
            const desc = categoryDescriptions[cat.code || ''] || { en: '', ar: '' };
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.code}`}
                className="group glass-panel rounded-2xl p-6 hover:glass-panel-gold transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-brand-gold/15 transition-colors">
                      {categoryIcons[cat.code || ''] || <Citrus className="w-8 h-8 text-brand-gold" />}
                    </div>
                    {cat.hs_code && (
                      <span className="px-2 py-1 rounded text-[11px] font-mono font-bold bg-white/5 text-brand-muted border border-brand-border">
                        HS {cat.hs_code}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-brand-gold transition-colors mb-2">
                    {language === 'ar' ? cat.name_ar : cat.name_en}
                  </h3>
                  <p className="text-xs text-brand-dim leading-relaxed mb-4">
                    {language === 'ar' ? desc.ar : desc.en}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs font-semibold text-brand-muted group-hover:text-white">
                  <span>{language === 'ar' ? 'استعراض المحاصيل والأسعار' : 'Explore crops & specs'}</span>
                  <ArrowIcon className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
