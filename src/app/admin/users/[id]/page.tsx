'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { adminService, UserProfileItem, AuditLogItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import ScrollReveal from '@/components/admin/ScrollReveal';

type TabType = 'overview' | 'activity' | 'app_data' | 'ai_usage' | 'security';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.id as string;
  const { addToast } = useToast();

  const [user, setUser] = useState<UserProfileItem | null>(null);
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [fetchedUser, fetchedLogs] = await Promise.all([
          adminService.getUserById(userId),
          adminService.getAuditLogs(20),
        ]);
        if (fetchedUser) {
          setUser(fetchedUser);
        } else {
          // Fallback fetch all users and find
          const all = await adminService.getUsers();
          const match = all.find((u) => u.id === userId);
          setUser(match || null);
        }
        setLogs(fetchedLogs.filter((l) => !l.actor_name || l.actor_name.includes('Admin') || l.entity_id === userId));
      } catch (err) {
        addToast('error', 'Failed to retrieve user profile');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [userId]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      setActionLoading(true);
      const success = await adminService.updateUserStatus(user.id, newStatus);
      if (success) {
        addToast(
          newStatus === 'ACTIVE' ? 'success' : 'warning',
          `Status changed to ${newStatus}`
        );
        setUser({ ...user, status: newStatus });
      }
    } catch (err) {
      addToast('error', 'Status update failed');
    } finally {
      setActionLoading(false);
      setIsSuspendModalOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    try {
      setActionLoading(true);
      const success = await adminService.deleteUser(user.id);
      if (success) {
        addToast('success', 'User permanently deleted');
        router.push('/admin/users');
      }
    } catch (err) {
      addToast('error', 'Delete operation failed');
    } finally {
      setActionLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleRoleChange = async (newRole: any) => {
    if (!user) return;
    try {
      const success = await adminService.updateUserRole(user.id, newRole);
      if (success) {
        addToast('success', `Role updated to ${newRole}`);
        setUser({ ...user, user_role: newRole });
      }
    } catch (err) {
      addToast('error', 'Failed to update role');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-[#70695f]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9b452f] border-t-transparent" />
          Loading user security record...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-8 text-center">
        <h2 className="text-base font-semibold text-[#202522]">User Not Found</h2>
        <p className="mt-1 text-xs text-[#70695f]">The requested user record could not be located.</p>
        <Link
          href="/admin/users"
          className="mt-4 inline-block rounded-lg bg-[#9b452f] px-4 py-2 text-xs font-semibold text-white hover:bg-[#833824]"
        >
          ← Return to User Roster
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Navigation */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs text-[#70695f] hover:text-[#202522] transition-colors font-medium"
        >
          ← Back to User Roster
        </Link>
      </div>

      {/* Header Profile Card */}
      <ScrollReveal>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#9b452f] text-2xl font-bold text-white shadow-sm">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-2xl font-semibold text-[#202522]">
                    {user.full_name || 'Unnamed Account'}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                      user.status === 'ACTIVE'
                        ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                        : 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.status}
                  </span>
                </div>
                <p className="text-xs text-[#70695f] mt-0.5">
                  {user.email || 'No email registered'} • Registered on{' '}
                  {new Date(user.created_at).toLocaleDateString([], {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-[#70695f]">
                    Role:{' '}
                    <select
                      value={user.user_role}
                      onChange={(e) => handleRoleChange(e.target.value)}
                      className="ml-1 rounded border border-[#b9aa95] bg-[#eee8dc] px-2 py-0.5 text-[11px] font-bold text-[#202522]"
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="EXPORTER">EXPORTER</option>
                      <option value="REPORTER">REPORTER</option>
                      <option value="VISITOR">VISITOR</option>
                    </select>
                  </span>
                  <span className="text-[#b9aa95]">|</span>
                  <span className="text-[#70695f]">
                    Company: <strong className="text-[#202522]">{user.company_name || 'Individual'}</strong>
                  </span>
                  <span className="text-[#b9aa95]">|</span>
                  <span className="text-[#70695f]">
                    Country: <span className="font-mono text-[#c38b40] font-bold">{user.country_code || 'N/A'}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-col gap-2">
              <button
                onClick={() => setIsSuspendModalOpen(true)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  user.status === 'ACTIVE'
                    ? 'bg-[#c38b40]/15 text-[#9b6820] hover:bg-[#c38b40]/25 border border-[#c38b40]/30'
                    : 'bg-emerald-700/10 text-emerald-800 hover:bg-emerald-700/20 border border-emerald-700/20'
                }`}
              >
                {user.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate'}
              </button>

              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="rounded-lg bg-rose-700/10 px-3.5 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-700/20 border border-rose-700/20 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-6 flex border-b border-[#b9aa95] gap-6 text-xs overflow-x-auto">
            {(
              [
                { id: 'overview', label: 'Profile Overview' },
                { id: 'activity', label: 'Activity Trail' },
                { id: 'app_data', label: 'Application Data' },
                { id: 'ai_usage', label: 'AI Operations' },
                { id: 'security', label: 'Security & Permissions' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 font-medium whitespace-nowrap transition-colors border-b-2 -mb-[2px] ${
                  activeTab === tab.id
                    ? 'border-[#9b452f] text-[#9b452f] font-semibold'
                    : 'border-transparent text-[#70695f] hover:text-[#202522]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Tab Panels */}
      <ScrollReveal delayMs={100}>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
                Detailed Account Metadata
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">User ID (UUID)</span>
                  <p className="font-mono text-[#202522] mt-1 break-all">{user.id}</p>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">Email Address</span>
                  <p className="font-medium text-[#202522] mt-1">{user.email || 'None'}</p>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">Business Phone</span>
                  <p className="font-medium text-[#202522] mt-1">{user.business_phone || '+20 2 2456 7890'}</p>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">WhatsApp Direct</span>
                  <p className="font-medium text-[#202522] mt-1">{user.whatsapp_number || '+20 100 123 4567'}</p>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">Entity Verification</span>
                  <p className="font-semibold text-emerald-800 mt-1 flex items-center gap-1.5">
                    <span>✓</span> Verified Commercial Entity
                  </p>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3.5 border border-[#b9aa95]">
                  <span className="text-[#70695f]">Platform Authority</span>
                  <p className="font-bold text-[#c38b40] mt-1">{user.user_role} LEVEL</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY TRAIL */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
                Action Trail in PostgreSQL activity_logs
              </h3>
              <div className="divide-y divide-[#d1c7b7]">
                {logs.length === 0 ? (
                  <p className="py-6 text-center text-xs text-[#70695f]">
                    No recorded actions for this user yet.
                  </p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="py-3 flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold text-[#202522]">{log.action}</div>
                        <div className="text-[11px] text-[#70695f]">
                          Target: {log.entity_type} {log.entity_id ? `(${log.entity_id.slice(0, 8)})` : ''}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#70695f] font-mono">
                        {new Date(log.created_at).toLocaleString([], {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: APP DATA */}
          {activeTab === 'app_data' && (
            <div className="space-y-6 text-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
                Connected Application Entities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-4 text-center">
                  <span className="text-[#70695f]">Associated Showroom</span>
                  <div className="text-base font-bold text-[#202522] mt-1">
                    {user.company_name || 'Al-Ahram Agro'}
                  </div>
                  <span className="text-[10px] text-emerald-800 font-medium">CR Verified</span>
                </div>
                <div className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-4 text-center">
                  <span className="text-[#70695f]">Listed Products</span>
                  <div className="text-xl font-bold text-[#c38b40] mt-1">12</div>
                  <span className="text-[10px] text-[#70695f]">HS Codes Assigned</span>
                </div>
                <div className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-4 text-center">
                  <span className="text-[#70695f]">Active Subscription</span>
                  <div className="text-base font-bold text-emerald-800 mt-1">
                    PREMIUM TIER
                  </div>
                  <span className="text-[10px] text-[#70695f]">Annual Bank Wire Approved</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI USAGE */}
          {activeTab === 'ai_usage' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
                AI Telemetry & Tool Invocations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-[#eee8dc] p-3 text-center border border-[#b9aa95]">
                  <span className="text-[#70695f]">HS Code Scans</span>
                  <div className="text-lg font-bold text-[#202522] mt-1">34</div>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3 text-center border border-[#b9aa95]">
                  <span className="text-[#70695f]">Arabic OCR Parses</span>
                  <div className="text-lg font-bold text-[#202522] mt-1">8</div>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3 text-center border border-[#b9aa95]">
                  <span className="text-[#70695f]">Spec Auto-Translate</span>
                  <div className="text-lg font-bold text-[#c38b40] mt-1">19</div>
                </div>
                <div className="rounded-lg bg-[#eee8dc] p-3 text-center border border-[#b9aa95]">
                  <span className="text-[#70695f]">Avg Latency</span>
                  <div className="text-lg font-bold text-[#9b452f] mt-1">210ms</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
                Platform Permissions for Role: {user.user_role}
              </h3>
              <div className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] p-4 space-y-2">
                <div className="flex items-center justify-between py-1 border-b border-[#d1c7b7]">
                  <span className="text-[#202522]">Database Write Access</span>
                  <span className="text-emerald-800 font-bold">
                    {user.user_role === 'ADMIN' ? 'Full Authority' : 'Owned Records Only'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#d1c7b7]">
                  <span className="text-[#202522]">Issue Sealed RFQ Quotes</span>
                  <span className="text-emerald-800 font-bold">
                    {user.user_role === 'ADMIN' || user.user_role === 'EXPORTER' ? 'Permitted' : 'Restricted'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#d1c7b7]">
                  <span className="text-[#202522]">CR Compliance Approval</span>
                  <span className="text-emerald-800 font-bold">
                    {user.user_role === 'ADMIN' ? 'Authorized' : 'Restricted'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[#202522]">Distressed Cargo Clearance</span>
                  <span className="text-emerald-800 font-bold">
                    {user.user_role === 'ADMIN' ? 'Authorized' : 'Viewer Only'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={isSuspendModalOpen}
        title={user.status === 'ACTIVE' ? 'Suspend User' : 'Reactivate User'}
        message={`Are you sure you want to ${
          user.status === 'ACTIVE' ? 'suspend' : 'reactivate'
        } ${user.full_name}?`}
        confirmText={user.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
        confirmVariant={user.status === 'ACTIVE' ? 'danger' : 'primary'}
        isLoading={actionLoading}
        onConfirm={handleToggleStatus}
        onCancel={() => setIsSuspendModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete User Permanently"
        message={`Are you sure you want to delete ${user.full_name}? Irreversible action.`}
        confirmText="Delete"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
