'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/hooks/use-app';
import { Logo } from '@/components/logo';
import { AuthScreen } from '@/components/auth-screen';
import { 
  Wallet, Plus, History, TrendingUp, BrainCircuit, CreditCard, 
  LogOut, ArrowUpRight, ArrowDownRight, Calendar, Sparkles
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { processFinancialInput } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { user, session, transactions, loading, refreshData, signOut } = useApp();
  const [nlpInput, setNlpInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNlpProcess = async () => {
    if (!nlpInput.trim() || !user) return;
    setIsProcessing(true);
    try {
      const results = await processFinancialInput(nlpInput);
      for (const trans of results) {
        await supabase.from('Transaction').insert([{ ...trans, userId: user.id, dataVencimento: new Date(trans.dataVencimento).toISOString() }]);
        if (trans.saldoMutation !== 0) {
          await supabase.from('User').update({ saldo_atual: (user.saldo_atual || 0) + trans.saldoMutation }).eq('id', user.id);
        }
      }
      setNlpInput('');
      await refreshData();
    } catch (error) { console.error(error); } finally { setIsProcessing(false); }
  };

  const stats = useMemo(() => {
    const totalEntradas = transactions.filter(t => t.tipo === 'entrada' && t.status === 'pago').reduce((acc, t) => acc + t.valorFinal, 0);
    const totalSaidas = transactions.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valorFinal, 0);
    return { totalEntradas, totalSaidas };
  }, [transactions]);

  if (loading) return <div className="h-screen flex items-center justify-center"><BrainCircuit className="animate-spin" /></div>;
  if (!session) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 glass flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={signOut}><LogOut className="w-5 h-5" /></Button>
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center font-bold text-primary">{user?.name?.substring(0,1)}</div>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="glass-card p-6 md:col-span-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Saldo</h3>
            <p className="text-3xl font-bold font-mono">R$ {user?.saldo_atual.toLocaleString('pt-BR')}</p>
            <div className="mt-4 pt-4 border-t border-border flex justify-between text-[10px] font-bold">
              <span className="text-primary tracking-widest">IN: R${stats.totalEntradas}</span>
              <span className="text-destructive tracking-widest">OUT: R${stats.totalSaidas}</span>
            </div>
          </Card>

          <Card className="glass-card p-6 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" /><h4 className="text-xs font-bold uppercase">Entrada Rápida</h4></div>
            <div className="relative">
              <textarea 
                className="w-full h-24 bg-muted border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-all" 
                placeholder="O que aconteceu?" value={nlpInput} onChange={e => setNlpInput(e.target.value)}
              />
              <Button className="absolute bottom-2 right-2 h-8" onClick={handleNlpProcess} disabled={isProcessing}>{isProcessing ? '...' : 'Processar'}</Button>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList className="glass border-border"><TabsTrigger value="history">Histórico</TabsTrigger></TabsList>
          <TabsContent value="history" className="mt-4">
            <Card className="glass-card overflow-hidden">
              <ScrollArea className="h-[400px]">
                {transactions.map((t) => (
                  <div key={t.id} className="p-4 border-b border-border/50 flex justify-between items-center hover:bg-muted/30 transition-colors">
                    <div>
                      <p className="text-sm font-bold">{t.descricao}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{format(new Date(t.dataVencimento), 'dd/MM/yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn("text-sm font-mono font-bold", t.tipo === 'entrada' ? 'text-primary' : '')}>R$ {t.valorFinal}</p>
                      <Badge variant="outline" className="text-[8px] uppercase">{t.status}</Badge>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
