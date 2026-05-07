'use client';

import { getCurrentUser, listTransactions, type ApiTransaction, type ApiUser } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AppContextType {
  user: ApiUser | null;
  session: Session | null;
  transactions: ApiTransaction[];
  loading: boolean;
  refreshData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      setLoading(true);
      const [profile, transactionsResponse] = await Promise.all([
        getCurrentUser(session.access_token),
        listTransactions(session.access_token),
      ]);

      setUser(profile);
      setTransactions(transactionsResponse.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) { setUser(null); setTransactions([]); }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) refreshData();
    else setLoading(false);
  }, [session, refreshData]);

  const signOut = async () => { await supabase.auth.signOut(); };

  return (
    <AppContext.Provider value={{ user, session, transactions, loading, refreshData, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
