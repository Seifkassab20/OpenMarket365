'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRoleType = 'VISITOR' | 'EXPORTER' | 'IMPORTER' | 'ADMIN';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  companyName: string;
  countryCode: string;
  isVerified: boolean;
  isLoggedIn: boolean;
}

export const DEMO_ACCOUNTS: Record<UserRoleType, UserAccount> = {
  VISITOR: {
    id: 'visitor-guest',
    name: 'Guest Visitor',
    email: 'guest@openmarket365.com',
    role: 'VISITOR',
    companyName: 'Public Buyer / Guest',
    countryCode: 'GLOBAL',
    isVerified: false,
    isLoggedIn: false,
  },
  EXPORTER: {
    id: 'u1111111-1111-1111-1111-111111111111',
    name: 'Eng. Tarek Mansour',
    email: 'export@nileagro-eg.com',
    role: 'EXPORTER',
    companyName: 'Nile Agro Export Industries',
    countryCode: 'EGY',
    isVerified: true,
    isLoggedIn: true,
  },
  IMPORTER: {
    id: 'u-importer-euro',
    name: 'Markus Weber',
    email: 'procurement@eurofresh-logistics.de',
    role: 'IMPORTER',
    companyName: 'EuroFresh Logistics GmbH (Germany)',
    countryCode: 'DEU',
    isVerified: true,
    isLoggedIn: true,
  },
  ADMIN: {
    id: 'u-admin-gov',
    name: 'Dr. Hesham El-Sayed',
    email: 'compliance@openmarket365.gov.eg',
    role: 'ADMIN',
    companyName: 'OpenMarket365 Governance Authority',
    countryCode: 'EGY',
    isVerified: true,
    isLoggedIn: true,
  },
};

interface AuthContextType {
  currentUser: UserAccount;
  loginAs: (role: UserRoleType, customEmail?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEMO_ACCOUNTS.VISITOR);

  useEffect(() => {
    try {
      const storedRole = localStorage.getItem('om365_user_role') as UserRoleType;
      if (storedRole && DEMO_ACCOUNTS[storedRole]) {
        setCurrentUser(DEMO_ACCOUNTS[storedRole]);
      }
    } catch (e) {
      // localStorage fallback
    }
  }, []);

  const loginAs = (role: UserRoleType, customEmail?: string) => {
    const account = { ...DEMO_ACCOUNTS[role] };
    if (customEmail) {
      account.email = customEmail;
    }
    setCurrentUser(account);
    try {
      localStorage.setItem('om365_user_role', role);
    } catch (e) {
      // localStorage fallback
    }
  };

  const logout = () => {
    setCurrentUser(DEMO_ACCOUNTS.VISITOR);
    try {
      localStorage.removeItem('om365_user_role');
    } catch (e) {
      // localStorage fallback
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loginAs, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
