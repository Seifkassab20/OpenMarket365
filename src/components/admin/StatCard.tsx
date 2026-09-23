'use client';

import React from 'react';
import AnimatedCounter from './AnimatedCounter';
import ScrollReveal from './ScrollReveal';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  description?: string;
  prefix?: string;
  suffix?: string;
  live?: boolean;
  delayMs?: number;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  description,
  prefix = '',
  suffix = '',
  live = false,
  delayMs = 0,
}: StatCardProps) {
  const isNumeric = typeof value === 'number';

  return (
    <ScrollReveal delayMs={delayMs} className="h-full">
      <div className="relative overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm transition-all duration-300 hover:border-[#202522] hover:shadow-md h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#70695f]">
              {title}
            </span>
            <div className="flex items-center gap-2">
              {live && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700/10 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-700/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  LIVE
                </span>
              )}
              {icon && (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eee8dc] text-[#9b452f] border border-[#b9aa95]">
                  {icon}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-3xl font-bold tracking-tight text-[#202522]">
              {isNumeric ? (
                <AnimatedCounter
                  end={value as number}
                  prefix={prefix}
                  suffix={suffix}
                  duration={1400}
                />
              ) : (
                <span>{value}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#d1c7b7] pt-3 text-xs">
          {change ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold ${
                  changeType === 'positive'
                    ? 'text-emerald-800'
                    : changeType === 'negative'
                    ? 'text-rose-700'
                    : 'text-[#70695f]'
                }`}
              >
                {changeType === 'positive' && '↑ '}
                {changeType === 'negative' && '↓ '}
                {change}
              </span>
              <span className="text-[#70695f]">vs last period</span>
            </div>
          ) : (
            <span className="text-[#70695f]">{description || 'Real-time telemetry'}</span>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
