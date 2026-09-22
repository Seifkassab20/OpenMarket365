'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { adminService, NotificationItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminNotificationsPage() {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await adminService.getNotifications();
      setNotifications(data);
    } catch (err) {
      addToast('error', 'Failed to retrieve notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      const success = await adminService.markNotificationRead(id);
      if (success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
      }
    } catch (err) {
      addToast('error', 'Failed to update alert state');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const success = await adminService.deleteNotification(id);
      if (success) {
        addToast('success', 'Alert removed');
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      addToast('error', 'Failed to delete alert');
    }
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    addToast('success', 'All system notifications marked as read');
  };

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      return severityFilter === 'ALL' || n.severity === severityFilter;
    });
  }, [notifications, severityFilter]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
            System Notification Center
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Real-time compliance alerts, bank wire transfers, and infrastructure health dispatches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg bg-[#c38b40]/15 border border-[#c38b40]/30 px-3 py-1.5 text-xs font-semibold text-[#9b6820] shadow-sm">
            Unread Alerts: <AnimatedCounter end={unreadCount} />
          </span>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="rounded-lg bg-[#9b452f] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#833824] transition-colors shadow-sm"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex gap-2 text-xs overflow-x-auto">
        {(['ALL', 'CRITICAL', 'WARNING', 'INFO', 'SUCCESS'] as const).map((sev) => (
          <button
            key={sev}
            onClick={() => setSeverityFilter(sev)}
            className={`rounded-lg px-3 py-1.5 font-medium transition-all ${
              severityFilter === sev
                ? 'bg-[#9b452f] text-white font-semibold shadow-sm'
                : 'bg-[#e4dac9] text-[#70695f] border border-[#b9aa95] hover:text-[#202522]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <ScrollReveal>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] divide-y divide-[#d1c7b7] shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#70695f]">
              No alerts found for selected severity level.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 flex items-start justify-between gap-4 transition-colors ${
                  item.is_read ? 'bg-transparent' : 'bg-[#dfd4c1]/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span
                    className={`mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full ${
                      item.severity === 'CRITICAL'
                        ? 'bg-rose-600 animate-pulse'
                        : item.severity === 'WARNING'
                        ? 'bg-[#c38b40]'
                        : item.severity === 'SUCCESS'
                        ? 'bg-emerald-600'
                        : 'bg-blue-600'
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-[#202522]">
                        {item.title}
                      </h4>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-mono font-bold ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                            : item.severity === 'WARNING'
                            ? 'bg-[#c38b40]/15 text-[#9b6820] border border-[#c38b40]/30'
                            : item.severity === 'SUCCESS'
                            ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                            : 'bg-blue-700/10 text-blue-800 border border-blue-700/20'
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-[#202522]/85 mt-1">{item.message}</p>
                    <span className="text-[10px] text-[#70695f] mt-2 block font-mono">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!item.is_read && (
                    <button
                      onClick={() => handleMarkRead(item.id)}
                      className="rounded-md bg-[#eee8dc] border border-[#b9aa95] px-2.5 py-1 text-[11px] font-semibold text-[#202522] hover:bg-[#dfd4c1] transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md p-1 text-[#70695f] hover:text-rose-800 hover:bg-rose-700/10 transition-colors"
                    title="Dismiss alert"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
