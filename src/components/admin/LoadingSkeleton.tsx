'use client';

import React from 'react';

export function CardSkeleton() {
  return (
    <div className="p-5 rounded-2xl bg-[#e4dac9] border border-[#b9aa95] animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-20 h-3.5 bg-[#d8ccb8] rounded" />
        <div className="w-8 h-8 bg-[#d8ccb8] rounded-lg" />
      </div>
      <div className="w-32 h-8 bg-[#d8ccb8] rounded" />
      <div className="w-24 h-3 bg-[#d8ccb8] rounded" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 6 }: { cols?: number }) {
  return (
    <tr className="border-b border-[#d1c7b7] animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-[#d8ccb8] rounded w-full max-w-[140px]" />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9]">
      <div className="p-4 border-b border-[#b9aa95] flex items-center justify-between animate-pulse">
        <div className="w-48 h-5 bg-[#d8ccb8] rounded" />
        <div className="w-32 h-8 bg-[#d8ccb8] rounded-lg" />
      </div>
      <table className="w-full text-left">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-[#e4dac9] border border-[#b9aa95] animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="w-32 h-4 bg-[#d8ccb8] rounded" />
          <div className="w-48 h-3 bg-[#d8ccb8] rounded" />
        </div>
        <div className="w-28 h-8 bg-[#d8ccb8] rounded-lg" />
      </div>
      <div className="h-64 bg-[#d8ccb8]/60 rounded-xl" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
      <TableSkeleton rows={6} />
    </div>
  );
}
