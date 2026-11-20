'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
    }

    // Redirect to dashboard
    router.push('/dashboard');
  };

  const handleDemoLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8 space-y-6" glow="purple">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-glow-purple">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-white">Chronos Clearance Login</h1>
          <p className="text-xs text-gray-400">Enter your credentials to access the timeline archive.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 font-medium">Chronos Email</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@timeloop.ai"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-medium">Temporal Passphrase</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition"
          >
            <span>{isLoading ? 'Verifying Chronos Seal...' : 'Authorize Login'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
          <button
            onClick={handleDemoLogin}
            className="w-full rounded-xl border border-cyan-500/40 bg-cyan-950/30 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/40 transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
            <span>Instant Demo Explorer Clearance</span>
          </button>

          <p className="text-center text-xs text-gray-400">
            Need an account?{' '}
            <Link href="/signup" className="text-purple-400 hover:underline">
              Initialize Chronos Identity
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
