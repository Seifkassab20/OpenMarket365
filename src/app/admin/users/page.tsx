'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { adminService, UserProfileItem } from '@/lib/services/adminService';
import { useToast } from '@/components/admin/ToastNotification';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import AnimatedCounter from '@/components/admin/AnimatedCounter';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminUsersPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { addToast } = useToast();
  const [users, setUsers] = useState<UserProfileItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState(initialSearch);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modals state
  const [suspendModalUser, setSuspendModalUser] = useState<UserProfileItem | null>(null);
  const [deleteModalUser, setDeleteModalUser] = useState<UserProfileItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      addToast('error', 'Failed to retrieve users from Supabase');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered & Paginated list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (u.company_name && u.company_name.toLowerCase().includes(search.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(search.toLowerCase())) ||
        (u.country_code && u.country_code.toLowerCase().includes(search.toLowerCase()));

      const matchRole = roleFilter === 'ALL' || u.user_role === roleFilter;
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage]);

  const handleToggleStatus = async (user: UserProfileItem) => {
    const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      setActionLoading(true);
      const success = await adminService.updateUserStatus(user.id, newStatus);
      if (success) {
        addToast(
          newStatus === 'ACTIVE' ? 'success' : 'warning',
          `User ${user.full_name || user.id} is now ${newStatus}`
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
        );
      }
    } catch (err) {
      addToast('error', 'Status update failed');
    } finally {
      setActionLoading(false);
      setSuspendModalUser(null);
    }
  };

  const handleDeleteUser = async (user: UserProfileItem) => {
    try {
      setActionLoading(true);
      const success = await adminService.deleteUser(user.id);
      if (success) {
        addToast('success', `User account deleted`);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
      }
    } catch (err) {
      addToast('error', 'Delete operation failed');
    } finally {
      setActionLoading(false);
      setDeleteModalUser(null);
    }
  };

  const handleRoleChange = async (userId: string, newRole: any) => {
    try {
      const success = await adminService.updateUserRole(userId, newRole);
      if (success) {
        addToast('success', `Role updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, user_role: newRole } : u))
        );
      }
    } catch (err) {
      addToast('error', 'Role update failed');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#b9aa95]">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-[#202522] tracking-tight">
            User Accounts & Security Roster
          </h1>
          <p className="mt-1 text-xs text-[#70695f]">
            Total Registered:{' '}
            <span className="text-[#9b452f] font-bold">
              <AnimatedCounter end={users.length} />
            </span>{' '}
            | Filtered:{' '}
            <span className="text-[#202522] font-bold">
              {filteredUsers.length}
            </span>
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 rounded-lg bg-[#e4dac9] border border-[#b9aa95] px-3.5 py-2 text-xs font-bold text-[#202522] hover:bg-[#d8cebe] transition-all"
        >
          <svg className="w-4 h-4 text-[#9b452f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Sync Roster
        </button>
      </div>

      {/* Filter & Search Bar */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-4">
          <div className="sm:col-span-2">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, company, email, or country..."
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none"
            />
          </div>

          <div>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none font-medium"
            >
              <option value="ALL">All Roles</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EXPORTER">EXPORTER</option>
              <option value="REPORTER">REPORTER</option>
              <option value="VISITOR">VISITOR</option>
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>
        </div>
      </ScrollReveal>

      {/* Table Container */}
      <ScrollReveal delayMs={100}>
        <div className="overflow-hidden rounded-xl border border-[#b9aa95] bg-[#e4dac9] shadow-sm">
          {loading ? (
            <TableSkeleton rows={8} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#b9aa95] bg-[#dfd4c1] text-[#70695f] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3 font-bold">User / Profile</th>
                    <th className="px-3 py-3.5 font-bold">Company & Country</th>
                    <th className="px-3 py-3.5 font-bold">Role</th>
                    <th className="px-3 py-3.5 font-bold">Status</th>
                    <th className="px-3 py-3.5 font-bold">Joined</th>
                    <th className="py-3.5 pl-3 pr-6 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d1c7b7] text-[#202522]">
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-[#70695f]">
                        No matching users found.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#eae1d3] transition-colors">
                        {/* Name & Avatar */}
                        <td className="py-3.5 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eee8dc] text-xs font-bold text-[#9b452f] border border-[#b9aa95]">
                              {user.full_name ? user.full_name.charAt(0) : 'U'}
                            </div>
                            <div>
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="font-bold text-[#202522] hover:text-[#9b452f] transition-colors"
                              >
                                {user.full_name || 'Unnamed Account'}
                              </Link>
                              <div className="text-[11px] text-[#70695f]">
                                {user.email || 'No email associated'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Company & Country */}
                        <td className="px-3 py-3.5">
                          <div className="font-semibold text-[#202522]">
                            {user.company_name || 'Individual / Trader'}
                          </div>
                          <div className="text-[10px] text-[#70695f]">
                            Country: <span className="font-mono text-[#9b452f] font-bold">{user.country_code || 'N/A'}</span>
                          </div>
                        </td>

                        {/* Role Selector */}
                        <td className="px-3 py-3.5">
                          <select
                            value={user.user_role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="rounded-md border border-[#b9aa95] bg-[#eee8dc] px-2 py-1 text-[11px] font-bold text-[#9b452f] focus:border-[#9b452f] focus:outline-none"
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="EXPORTER">EXPORTER</option>
                            <option value="REPORTER">REPORTER</option>
                            <option value="VISITOR">VISITOR</option>
                          </select>
                        </td>

                        {/* Status Badge */}
                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              user.status === 'ACTIVE'
                                ? 'bg-emerald-700/10 text-emerald-800 border border-emerald-700/20'
                                : user.status === 'SUSPENDED'
                                ? 'bg-rose-700/10 text-rose-800 border border-rose-700/20'
                                : 'bg-[#c38b40]/15 text-[#9b6820] border border-[#c38b40]/30'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.status === 'ACTIVE'
                                  ? 'bg-emerald-600'
                                  : user.status === 'SUSPENDED'
                                  ? 'bg-rose-600'
                                  : 'bg-[#c38b40]'
                              }`}
                            />
                            {user.status}
                          </span>
                        </td>

                        {/* Created At */}
                        <td className="px-3 py-3.5 text-[#70695f] font-mono text-[11px]">
                          {new Date(user.created_at).toLocaleDateString([], {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 pl-3 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/users/${user.id}`}
                              className="rounded-md bg-[#eee8dc] border border-[#b9aa95] p-1.5 text-[#202522] hover:text-[#9b452f] hover:border-[#9b452f] transition-colors"
                              title="Inspect User Details"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Link>

                            <button
                              onClick={() => setSuspendModalUser(user)}
                              className={`rounded-md p-1.5 border transition-colors ${
                                user.status === 'ACTIVE'
                                  ? 'bg-[#c38b40]/15 text-[#9b6820] border-[#c38b40]/30 hover:bg-[#c38b40]/25'
                                  : 'bg-emerald-700/10 text-emerald-800 border-emerald-700/20 hover:bg-emerald-700/20'
                              }`}
                              title={user.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            </button>

                            <button
                              onClick={() => setDeleteModalUser(user)}
                              className="rounded-md bg-rose-700/10 border border-rose-700/20 p-1.5 text-rose-800 hover:bg-rose-700/20 transition-colors"
                              title="Delete Account"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Bar */}
          <div className="flex items-center justify-between border-t border-[#b9aa95] px-6 py-3 text-xs text-[#70695f]">
            <div>
              Showing Page <span className="font-bold text-[#202522]">{currentPage}</span> of{' '}
              <span className="font-bold text-[#202522]">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3 py-1.5 font-bold text-[#202522] hover:bg-[#dfd4c1] disabled:opacity-40 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3 py-1.5 font-bold text-[#202522] hover:bg-[#dfd4c1] disabled:opacity-40 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Suspend / Activate Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!suspendModalUser}
        title={suspendModalUser?.status === 'ACTIVE' ? 'Suspend User Account' : 'Reactivate User Account'}
        message={
          suspendModalUser?.status === 'ACTIVE'
            ? `Are you sure you want to suspend ${suspendModalUser.full_name || suspendModalUser.id}? They will be immediately blocked from signing in or posting RFQs.`
            : `Reactivate account for ${suspendModalUser?.full_name || suspendModalUser?.id}? Full trading privileges will be restored.`
        }
        confirmText={suspendModalUser?.status === 'ACTIVE' ? 'Suspend Account' : 'Reactivate Account'}
        confirmVariant={suspendModalUser?.status === 'ACTIVE' ? 'danger' : 'primary'}
        isLoading={actionLoading}
        onConfirm={() => { if (suspendModalUser) handleToggleStatus(suspendModalUser); }}
        onCancel={() => setSuspendModalUser(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteModalUser}
        title="Permanently Delete User"
        message={`Are you sure you want to permanently delete ${deleteModalUser?.full_name || deleteModalUser?.id}? This action is irreversible and cascades to their sessions.`}
        confirmText="Permanently Delete"
        confirmVariant="danger"
        isLoading={actionLoading}
        onConfirm={() => { if (deleteModalUser) handleDeleteUser(deleteModalUser); }}
        onCancel={() => setDeleteModalUser(null)}
      />
    </div>
  );
}
