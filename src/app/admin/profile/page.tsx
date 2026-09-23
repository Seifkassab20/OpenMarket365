'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useToast } from '@/components/admin/ToastNotification';
import ScrollReveal from '@/components/admin/ScrollReveal';

export default function AdminProfilePage() {
  const { currentUser } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState(currentUser?.name || 'Seif Kassab');
  const [email, setEmail] = useState(currentUser?.email || 'admin@openmarket365.com');
  const [phone, setPhone] = useState('+20 100 123 4567');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      addToast('success', 'Admin profile metadata updated successfully');
    }, 500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast('error', 'New passwords do not match');
      return;
    }
    setUpdatingPassword(true);
    setTimeout(() => {
      setUpdatingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      addToast('success', 'Admin security password changed successfully');
    }, 600);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <div className="pb-4 border-b border-[#b9aa95]">
        <h1 className="font-serif text-3xl font-semibold text-[#202522] tracking-tight">
          System Administrator Profile & Credentials
        </h1>
        <p className="mt-1 text-xs text-[#70695f]">
          Manage administrative identity, cryptographic credentials, and multi-factor session security.
        </p>
      </div>

      {/* Admin Identity Card */}
      <ScrollReveal>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-6 border-b border-[#b9aa95]">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#9b452f] text-2xl font-bold text-white shadow-sm">
                {name ? name.charAt(0) : 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-bold text-[#202522]">{name}</h2>
                  <span className="rounded-md bg-emerald-700/10 border border-emerald-700/20 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-800">
                    SUPER ADMIN
                  </span>
                </div>
                <p className="text-xs text-[#70695f] mt-0.5">{email}</p>
                <div className="mt-2 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                  Full Database & RLS Authority
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-[#eee8dc] p-3 border border-[#b9aa95] text-xs">
              <span className="text-[#70695f]">Two-Factor Authentication</span>
              <div className="text-emerald-800 font-bold mt-0.5 flex items-center gap-1.5">
                <span>✓</span> ENFORCED (FIDO2 / TOTP)
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#70695f]">
              Administrative Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Direct Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#202522]">
                  Administrative Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="rounded-lg bg-[#202522] px-4 py-2 text-xs font-semibold text-[#eee8dc] hover:bg-black transition-all disabled:opacity-50 shadow-sm"
              >
                {savingProfile ? 'Updating...' : 'Save Profile Details'}
              </button>
            </div>
          </form>
        </div>
      </ScrollReveal>

      {/* Password Change Card */}
      <ScrollReveal delayMs={100}>
        <div className="rounded-xl border border-[#b9aa95] bg-[#e4dac9] p-6 shadow-sm">
          <h3 className="text-base font-semibold text-[#202522]">
            Change Administrative Password
          </h3>
          <p className="text-xs text-[#70695f] mt-0.5">
            Passwords must contain at least 12 characters including numerals and symbols
          </p>

          <form onSubmit={handleUpdatePassword} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522]">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522]">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2 text-xs text-[#202522] focus:border-[#9b452f] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={updatingPassword}
                className="rounded-lg bg-[#9b452f] px-4 py-2 text-xs font-bold text-white hover:bg-[#833824] transition-all disabled:opacity-50 shadow-sm"
              >
                {updatingPassword ? 'Changing Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </ScrollReveal>
    </div>
  );
}
