'use client';

import React, { useState } from 'react';
import ScrollReveal from './ScrollReveal';

export interface DataPoint {
  label: string;
  value: number;
  secondaryValue?: number;
}

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  data: DataPoint[];
  type?: 'area' | 'bar' | 'dual-line';
  primaryColor?: string;
  secondaryColor?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  delayMs?: number;
  height?: number;
}

export default function ChartContainer({
  title,
  subtitle,
  data,
  type = 'area',
  primaryColor = '#9b452f', // terracotta brand color
  secondaryColor = '#c38b40', // brass / amber
  primaryLabel = 'Primary',
  secondaryLabel = 'Secondary',
  delayMs = 100,
  height = 240,
}: ChartContainerProps) {
  const [activeRange, setActiveRange] = useState<'7D' | '30D' | '90D'>('7D');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Compute scale max
  const maxValue = Math.max(
    ...data.map((d) => Math.max(d.value, d.secondaryValue || 0)),
    10
  );

  const paddingX = 40;
  const paddingY = 30;
  const chartWidth = 600;
  const chartHeight = height;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.value / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const secondaryPoints = data.map((d, i) => {
    const val = d.secondaryValue || 0;
    const x = paddingX + (i / (data.length - 1 || 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (val / maxValue) * (chartHeight - paddingY * 2);
    return { x, y, val };
  });

  // Area path
  const linePath = points.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );
  const areaPath = `${linePath} L ${points[points.length - 1]?.x || 0} ${
    chartHeight - paddingY
  } L ${points[0]?.x || 0} ${chartHeight - paddingY} Z`;

  const secondaryLinePath = secondaryPoints.reduce(
    (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ''
  );

  return (
    <ScrollReveal delayMs={delayMs} className="w-full">
      <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm transition-all duration-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#d1c7b7]">
          <div>
            <h3 className="text-base font-semibold text-[#202522]">{title}</h3>
            {subtitle && <p className="text-xs text-[#70695f] mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {/* Legend */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#565047] font-medium">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: primaryColor }}
                />
                {primaryLabel}
              </span>
              {type === 'dual-line' && (
                <span className="flex items-center gap-1.5 text-[#565047] font-medium">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: secondaryColor }}
                  />
                  {secondaryLabel}
                </span>
              )}
            </div>

            {/* Time range selector */}
            <div className="flex items-center rounded-lg bg-[#eee8dc] p-0.5 border border-[#b9aa95]">
              {(['7D', '30D', '90D'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRange(r)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-colors ${
                    activeRange === r
                      ? 'bg-[#202522] text-[#eee8dc]'
                      : 'text-[#70695f] hover:text-[#202522]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="mt-4 relative w-full overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full overflow-visible"
            style={{ maxHeight: `${height}px` }}
          >
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.30" />
                <stop offset="100%" stopColor={primaryColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {[0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
              return (
                <g key={idx}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#d1c7b7"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] fill-[#70695f] font-mono"
                  >
                    {Math.round(maxValue * pct)}
                  </text>
                </g>
              );
            })}

            {/* Area or Bars */}
            {type === 'bar' ? (
              data.map((d, i) => {
                const barWidth = Math.max(14, (chartWidth - paddingX * 2) / data.length - 12);
                const x =
                  paddingX +
                  (i / (data.length - 1 || 1)) * (chartWidth - paddingX * 2) -
                  barWidth / 2;
                const barHeight = (d.value / maxValue) * (chartHeight - paddingY * 2);
                const y = chartHeight - paddingY - barHeight;
                const isHovered = hoveredIndex === i;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="cursor-pointer"
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      fill={isHovered ? '#b04f36' : primaryColor}
                      className="transition-colors duration-200"
                    />
                  </g>
                );
              })
            ) : (
              <>
                {/* Area Gradient fill */}
                {type === 'area' && <path d={areaPath} fill={`url(#grad-${title})`} />}

                {/* Primary Stroke Line */}
                <path
                  d={linePath}
                  fill="none"
                  stroke={primaryColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Secondary Stroke Line */}
                {type === 'dual-line' && (
                  <path
                    d={secondaryLinePath}
                    fill="none"
                    stroke={secondaryColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                )}

                {/* Data Points */}
                {points.map((p, i) => {
                  const isHovered = hoveredIndex === i;
                  return (
                    <g
                      key={i}
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="cursor-pointer"
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isHovered ? 6 : 4}
                        fill="#eee8dc"
                        stroke={primaryColor}
                        strokeWidth="2.5"
                        className="transition-all duration-150"
                      />
                    </g>
                  );
                })}
              </>
            )}

            {/* X-axis labels */}
            {points.map((p, i) => (
              <text
                key={i}
                x={p.x}
                y={chartHeight - 8}
                textAnchor="middle"
                className="text-[10px] fill-[#70695f] font-medium"
              >
                {p.label}
              </text>
            ))}
          </svg>

          {/* Hover Tooltip Overlay */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <div
              className="absolute pointer-events-none rounded-lg bg-[#202522] border border-[#363e39] text-[#eee8dc] px-2.5 py-1.5 shadow-lg text-xs"
              style={{
                left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
                top: '10px',
                transform: 'translateX(-50%)',
              }}
            >
              <div className="font-semibold">{points[hoveredIndex].label}</div>
              <div className="flex items-center gap-1.5 text-[#c38b40] font-bold">
                <span>{primaryLabel}:</span>
                <span>{points[hoveredIndex].value.toLocaleString()}</span>
              </div>
              {type === 'dual-line' && points[hoveredIndex].secondaryValue !== undefined && (
                <div className="flex items-center gap-1.5 text-[#d1c7b7] font-semibold text-[11px]">
                  <span>{secondaryLabel}:</span>
                  <span>{points[hoveredIndex].secondaryValue?.toLocaleString()}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
}
