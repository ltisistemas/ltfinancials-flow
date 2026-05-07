'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Transaction } from '@prisma/client';
import { Session } from '@supabase/supabase-js';

interface AppContextType {
  user: User | null;
  session: Session | null;
  transactions: Transaction[];
  loading: boolean;
  refreshData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email: string, name?: string) => {
    const { data: userData } = await supabase
      .from('User')
      .select('*')
      .eq('id', userId)
      .single();

    if (!userData) {
      const { data: newUser } = await supabase
        .from('User')
        .insert([{ id: userId, email: email, name: name || 'User', saldo_atual: 0, salario_mensal: 0 }])
        .select()
        .single();
      return newUser as unknown as User;
    }
    return userData as unknown as User;
  }, []);

  const refreshData = useCallback(async () => {
    if (!session?.user) return;
    try {
      setLoading(true);
      const profile = await fetchProfile(session.user.id, session.user.email!, session.user.user_metadata?.full_name);
      if (profile) {
        setUser(profile);
        const { data: transData } = await supabase.from('Transaction').select('*').eq('userId', profile.id).order('dataVencimento', { ascending: false });
        if (transData) setTransactions(transData as unknown as Transaction[]);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }, [session, fetchProfile]);

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
