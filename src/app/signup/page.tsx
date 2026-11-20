'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Sparkles, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) {
        setError(error.message);
        setIsLoading(false);
        return;
      }
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8 space-y-6" glow="cyan">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 shadow-glow-cyan">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-black text-white">Initialize Traveler Identity</h1>
          <p className="text-xs text-gray-400">Create your private chronal vault on Supabase PostgreSQL.</p>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4 text-xs">
          <div>
            <label className="text-gray-300 font-medium">Traveler Handle</label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Arjun_Chrono"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-medium">Email Coordinate</label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="traveler@domain.com"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 font-medium">Master Passphrase</label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                minLength={6}
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 py-3 text-xs font-bold text-white shadow-glow-cyan hover:opacity-95 transition"
          >
            <span>{isLoading ? 'Registering...' : 'Create Chronos Identity'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
          Already registered?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Login to Vault
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
