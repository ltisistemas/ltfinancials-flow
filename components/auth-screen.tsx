'use client';

import React, { useState } from 'react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { useApp } from '@/hooks/use-app';

export function AuthScreen() {
  const { signIn, register } = useApp();
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Falha ao registrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#007acc]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#007acc]/10 blur-[100px] rounded-full delay-700" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <Logo className="scale-110" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {view === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {view === 'login' 
                ? 'Acesse sua conta para gerenciar seu fluxo.' 
                : 'Comece hoje sua jornada para a liberdade financeira.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {view === 'login' ? (
                  <motion.form 
                    key="login-form"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    onSubmit={handleEmailSignIn} 
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          className="pl-10 bg-muted/30 border-border focus:border-primary h-11"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pass" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="pass" 
                          type="password" 
                          placeholder="••••••••" 
                          className="pl-10 bg-muted/30 border-border focus:border-primary h-11"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold mt-2 shadow-lg shadow-primary/20" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Entrar na Conta'}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="signup-form"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onSubmit={handleEmailSignUp} 
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="name" 
                          placeholder="Como quer ser chamado?" 
                          className="pl-10 bg-muted/30 border-border focus:border-primary h-11"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="signup-email" 
                          type="email" 
                          placeholder="seu@email.com" 
                          className="pl-10 bg-muted/30 border-border focus:border-primary h-11"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-pass" className="text-[10px] uppercase font-bold text-muted-foreground ml-1">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input 
                          id="signup-pass" 
                          type="password" 
                          placeholder="Crie uma senha forte" 
                          className="pl-10 bg-muted/30 border-border focus:border-primary h-11"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold mt-2 shadow-lg shadow-primary/20" disabled={loading}>
                      {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Criar minha Conta'}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center">
              <button 
                onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                className="text-xs font-bold text-primary hover:underline uppercase tracking-widest"
              >
                {view === 'login' ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
              </button>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] text-destructive text-center font-bold uppercase tracking-tight"
              >
                {error}
              </motion.p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
