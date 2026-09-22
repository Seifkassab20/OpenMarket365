'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/components/admin/ToastNotification';

export default function AdminLoginPage() {
  const router = useRouter();
  const { switchAccount } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Attempt Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Fallback: Check if this is the admin demo email
        if (email === 'admin@openmarket365.com' && (password === 'admin123' || password === 'admin')) {
          switchAccount('ADMIN');
          addToast('success', 'Authenticated as System Administrator');
          router.push('/admin');
          return;
        }
        throw authError;
      }

      // 2. Verify profile role in Supabase
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_role')
          .eq('id', data.user.id)
          .single();

        if (profile && profile.user_role === 'ADMIN') {
          switchAccount('ADMIN');
          addToast('success', 'Admin session verified');
          router.push('/admin');
        } else {
          await supabase.auth.signOut();
          setError('Access Denied: Account does not have administrative privileges.');
          addToast('error', 'Unauthorized role');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
      addToast('error', 'Login error');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickAdmin = () => {
    switchAccount('ADMIN');
    addToast('success', 'Logged in as System Administrator');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden bg-[#eee8dc]">
      {/* Main card matching webapp editorial aesthetic */}
      <div className="w-full max-w-md rounded-2xl border border-[#b9aa95] bg-[#e4dac9] p-8 shadow-xl relative z-10">
        {/* Brand */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#9b452f] text-white font-bold text-xl shadow-md">
            ٣٦٥
          </div>
          <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight text-[#202522]">
            Governance & Admin Gateway
          </h2>
          <p className="mt-1 text-xs text-[#70695f]">
            Restricted zone. Authorized platform administrators only.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-800">
            {error}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCredentialsSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#202522] uppercase tracking-wider">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@openmarket365.com"
              className="mt-1.5 block w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2.5 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none focus:ring-1 focus:ring-[#9b452f]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#202522] uppercase tracking-wider">
                Password
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="mt-1.5 block w-full rounded-lg border border-[#b9aa95] bg-[#eee8dc] px-3.5 py-2.5 text-xs text-[#202522] placeholder-[#70695f] focus:border-[#9b452f] focus:outline-none focus:ring-1 focus:ring-[#9b452f]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#9b452f] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#833824] transition-all disabled:opacity-50 mt-2 shadow-md uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Sign In with Supabase'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#b9aa95]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-[#70695f]">
            <span className="bg-[#e4dac9] px-2">OR EVALUATE DEMO</span>
          </div>
        </div>

        {/* 1-Click Demo Admin Button */}
        <button
          type="button"
          onClick={handleOneClickAdmin}
          className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#202522] bg-[#202522] hover:bg-black px-4 py-2.5 text-xs font-bold text-[#eee8dc] transition-all shadow-sm uppercase tracking-wider"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          Instant Admin Demo Access
        </button>

        {/* Security Warning Notice */}
        <div className="mt-6 rounded-lg bg-[#eee8dc] border border-[#b9aa95] p-3 text-[10px] text-[#70695f] text-center">
          <span className="font-bold text-[#9b452f]">Security Protocol:</span> IP
          fingerprints and tamper audits are enforced on all session actions.
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-[#70695f] hover:text-[#9b452f] transition-colors font-medium underline"
          >
            ← Return to Market 365 Main Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
