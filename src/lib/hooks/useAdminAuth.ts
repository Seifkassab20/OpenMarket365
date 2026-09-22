'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, UserAccount } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/supabase/client';

export function useAdminAuth(requireAdmin = true) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<UserAccount | null>(null);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        // 1. Check client AuthContext
        if (currentUser && currentUser.role === 'ADMIN' && currentUser.isLoggedIn) {
          if (mounted) {
            setIsAdmin(true);
            setAdminUser(currentUser);
            setIsChecking(false);
          }
          return;
        }

        // 2. Check Supabase auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          // Query user profile from Supabase to verify ADMIN role
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && profile.user_role === 'ADMIN') {
            if (mounted) {
              setIsAdmin(true);
              setAdminUser({
                id: session.user.id,
                name: profile.full_name || 'System Admin',
                email: session.user.email || 'admin@openmarket365.com',
                role: 'ADMIN',
                companyName: profile.company_name || 'Market 365 Governance',
                countryCode: profile.country_code || 'EGY',
                isVerified: true,
                isLoggedIn: true,
              });
              setIsChecking(false);
            }
            return;
          }
        }

        if (mounted) {
          setIsAdmin(false);
          setAdminUser(null);
          setIsChecking(false);
        }
      } catch (err) {
        if (mounted) {
          setIsAdmin(false);
          setIsChecking(false);
        }
      }
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [currentUser]);

  return { isChecking, isAdmin, adminUser };
}
