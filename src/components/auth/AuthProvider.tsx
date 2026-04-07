"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { AuthMetadata, UserRole } from "@/types";

interface AuthState {
  loading: boolean;
  isAuthenticated: boolean;
  email: string | null;
  role: UserRole | null;
  agencyId: string | null;
  companyId: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;

      const user = data.session?.user ?? null;
      const metadata = (user?.user_metadata as AuthMetadata | undefined) ?? undefined;
      setIsAuthenticated(Boolean(user));
      setEmail(user?.email ?? null);
      setRole(metadata?.role ?? null);
      setAgencyId(metadata?.agency_id ?? null);
      setCompanyId(metadata?.company_id ?? null);
      setLoading(false);
    };

    loadSession().catch(() => {
      if (!mounted) return;
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      const metadata = (user?.user_metadata as AuthMetadata | undefined) ?? undefined;
      setIsAuthenticated(Boolean(user));
      setEmail(user?.email ?? null);
      setRole(metadata?.role ?? null);
      setAgencyId(metadata?.agency_id ?? null);
      setCompanyId(metadata?.company_id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value: AuthState = {
    loading,
    isAuthenticated,
    email,
    role,
    agencyId,
    companyId,
    signIn: async (emailInput: string, passwordInput: string) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailInput,
        password: passwordInput,
      });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }
  return context;
}
