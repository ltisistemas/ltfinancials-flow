'use client';

import { getCurrentUser, listTransactions, login, register as registerApi, type ApiTransaction, type ApiUser } from '@/lib/api';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface AppSession {
  access_token: string;
}

interface AppContextType {
  user: ApiUser | null;
  session: AppSession | null;
  transactions: ApiTransaction[];
  loading: boolean;
  refreshData: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const AUTH_TOKEN_STORAGE_KEY = 'ltfinancials-flow.jwt';

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [session, setSession] = useState<AppSession | null>(null);
  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthenticatedData = useCallback(async (token: string) => {
    const [profile, transactionsResponse] = await Promise.all([
      getCurrentUser(token),
      listTransactions(token),
    ]);
    setUser(profile);
    setTransactions(transactionsResponse.data);
  }, []);

  const fetchTransactions = useCallback(async (token: string) => {
    const transactionsResponse = await listTransactions(token);
    setTransactions(transactionsResponse.data);
  }, []);

  const refreshData = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      setLoading(true);
      await fetchAuthenticatedData(session.access_token);
    } catch (e) {
      console.error(e);
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setSession(null);
      setUser(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchAuthenticatedData, session]);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    if (token) {
      setSession({ access_token: token });
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session) refreshData();
    else setLoading(false);
  }, [session, refreshData]);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await login(email, password);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.accessToken);
      setSession({ access_token: response.accessToken });
      setUser(response.user);
      await fetchTransactions(response.accessToken);
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setSession(null);
      setUser(null);
      setTransactions([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const registerUser = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await registerApi(name, email, password);
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.accessToken);
      setSession({ access_token: response.accessToken });
      setUser(response.user);
      await fetchTransactions(response.accessToken);
    } catch (error) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      setSession(null);
      setUser(null);
      setTransactions([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions]);

  const signOut = async () => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setSession(null);
    setUser(null);
    setTransactions([]);
  };

  return (
    <AppContext.Provider value={{ user, session, transactions, loading, refreshData, signIn, register: registerUser, signOut }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
}
