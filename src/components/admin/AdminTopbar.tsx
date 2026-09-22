'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, UserAccount } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

interface AdminTopbarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  adminUser: UserAccount | null;
  unreadNotificationsCount?: number;
}

export default function AdminTopbar({
  isMobileOpen,
  setIsMobileOpen,
  adminUser,
  unreadNotificationsCount = 3,
}: AdminTopbarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/admin/login');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/users?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#b9aa95] bg-[#eee8dc]/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left Area: Mobile Menu Toggle & Global Search */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#202522] hover:bg-[#e4dac9] lg:hidden"
          aria-label="Toggle Navigation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full hidden sm:block">
          <div className="relative flex items-center">
            <svg
              className="absolute left-3.5 h-4 w-4 text-[#70695f]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, companies, products, HS codes..."
              className="h-9 w-full rounded-lg border border-[#b9aa95] bg-[#e4dac9] pl-10 pr-12 text-xs text-[#202522] placeholder-[#70695f] transition-colors focus:border-[#9b452f] focus:outline-none focus:ring-1 focus:ring-[#9b452f]"
            />
            <kbd className="absolute right-3 hidden rounded border border-[#b9aa95] bg-[#eee8dc] px-1.5 py-0.5 text-[9px] font-semibold text-[#70695f] sm:inline-block">
              Ctrl+K
            </kbd>
          </div>
        </form>
      </div>

      {/* Right Area: System Status, Notifications, Admin Profile */}
      <div className="flex items-center gap-3">

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#b9aa95] bg-[#e4dac9] text-[#202522] hover:bg-[#d8cebe] transition-colors"
            title="Notifications"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#9b452f] text-[9px] font-bold text-white shadow-sm animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-[#b9aa95] bg-[#eee8dc] p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[#b9aa95]">
                <span className="text-xs font-semibold text-[#202522]">System Alerts</span>
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[11px] text-[#9b452f] font-semibold hover:underline"
                >
                  View all
                </Link>
              </div>
              <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                <div className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] p-2.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#70695f]">
                    <span className="font-semibold text-[#9b6820]">CR AUDIT PENDING</span>
                    <span>10m ago</span>
                  </div>
                  <p className="mt-1 text-[#202522] font-medium text-[11px]">
                    Nile Valley Agro uploaded Commercial Registry doc for verification.
                  </p>
                </div>
                <div className="rounded-lg bg-[#e4dac9] border border-[#b9aa95] p-2.5 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-[#70695f]">
                    <span className="font-semibold text-emerald-700">WIRE TRANSFER</span>
                    <span>1h ago</span>
                  </div>
                  <p className="mt-1 text-[#202522] font-medium text-[11px]">
                    Fawry reference #FW-9821 submitted for Premium Exporter annual plan.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 rounded-lg border border-[#b9aa95] bg-[#e4dac9] p-1.5 pr-3 hover:bg-[#d8cebe] transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#9b452f] text-xs font-bold text-white uppercase">
              {adminUser?.name ? adminUser.name.charAt(0) : 'A'}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#202522] leading-tight">
                {adminUser?.name || 'Administrator'}
              </span>
              <span className="text-[10px] text-[#9b452f] font-mono leading-tight font-bold">
                SUPER ADMIN
              </span>
            </div>
            <svg
              className={`w-3.5 h-3.5 text-[#70695f] transition-transform duration-150 ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Menu Flyout */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-[#b9aa95] bg-[#eee8dc] p-1.5 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-[#b9aa95]">
                <div className="text-xs font-semibold text-[#202522]">
                  {adminUser?.name || 'System Administrator'}
                </div>
                <div className="text-[11px] text-[#70695f] truncate">
                  {adminUser?.email || 'admin@openmarket365.com'}
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#202522] hover:bg-[#e4dac9] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#70695f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Admin Profile
                </Link>

                <Link
                  href="/admin/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-[#202522] hover:bg-[#e4dac9] transition-colors"
                >
                  <svg className="w-4 h-4 text-[#70695f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  System Settings
                </Link>
              </div>

              <div className="pt-1 border-t border-[#b9aa95]">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-rose-700 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
