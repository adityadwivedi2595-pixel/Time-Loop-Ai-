'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  GitBranch,
  Shield,
  Film,
  Zap,
  ArrowRight,
  Play,
  Layers,
  Cpu,
  Bookmark,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows & Cyber Grids */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-cyan-900/30 blur-[130px]" />
      <div className="pointer-events-none absolute top-[600px] -left-40 h-[500px] w-[500px] rounded-full bg-cyan-900/20 blur-[100px]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-mono text-purple-300 shadow-glow-purple">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>NVIDIA NIM + MCP Interactive Story Engine</span>
        </div>

        <h1 className="mx-auto max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Don't Just Watch History.{' '}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent glow-text-purple">
            Become Part of It.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-lg text-gray-300 leading-relaxed font-normal">
          TIMELOOP AI is a next-generation interactive cinematic universe. Step across ancient empires, dystopian cyberpunk metropolises, and stellar civilizations where every decision rewrites destiny.
        </p>

        {/* CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/story-config"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 px-8 py-4 text-sm font-bold text-white shadow-glow-purple hover:scale-105 transition-all"
          >
            <Play className="h-4 w-4 fill-white" />
            <span>Launch Your Odyssey</span>
          </Link>

          <Link
            href="/eras"
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-gray-200 hover:border-cyan-500/50 hover:bg-white/10 transition"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Explore Time Eras</span>
          </Link>
        </div>

        {/* Live System Capabilities Bar */}
        <div className="mx-auto max-w-4xl pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-white">8 Eras</span>
            <span className="text-xs text-gray-400">Historical & Fictional</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-cyan-400">Mistral Large 4</span>
            <span className="text-xs text-gray-400">NVIDIA NIM Inference</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-purple-400">12 MCP Tools</span>
            <span className="text-xs text-gray-400">Official Protocol SDK</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-emerald-400">Stateful Branches</span>
            <span className="text-xs text-gray-400">Living Timeline Engine</span>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="cyan">Core Innovation</Badge>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            The Living Timeline Engine
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-400">
            A story must not behave like a fixed chatbot conversation. In TIMELOOP AI, every choice persists mathematically across character relationships, hidden world events, and ending eligibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard glow="purple" className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <GitBranch className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Non-Linear Branching</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Explore alternate timeline branches without overwriting your original progress. Fork new parallel realities at any critical historical checkpoint.
            </p>
          </GlassCard>

          <GlassCard glow="cyan" className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">NVIDIA NIM Server-Side</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Sub-second cinematic text generation powered by Mistral Large 4 with exponential backoff, retry mechanisms, and strict Zod runtime verification.
            </p>
          </GlassCard>

          <GlassCard glow="purple" className="space-y-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-display text-lg font-bold text-white">Model Context Protocol</h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Internal TypeScript MCP server exposing 12 structured, authenticated tools that decouple tool execution from untrusted client parameters.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Interactive Studios Quick Access */}
      <section className="border-t border-white/10 bg-[#040712] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Full Entertainment Suite
            </h2>
            <p className="text-xs text-gray-400">Beyond interactive scenes, dive into dedicated creative studios.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/character-studio" className="group">
              <GlassCard interactive className="space-y-3 h-full">
                <div className="h-8 w-8 rounded-lg bg-purple-600/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <Shield className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition">AI Character Studio</h4>
                <p className="text-xs text-gray-400">Craft heroes, villains, and time travellers with AI generated psychological profiles and portraits.</p>
              </GlassCard>
            </Link>

            <Link href="/poster-studio" className="group">
              <GlassCard interactive className="space-y-3 h-full">
                <div className="h-8 w-8 rounded-lg bg-cyan-600/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <Film className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition">Movie Poster Studio</h4>
                <p className="text-xs text-gray-400">Generate theatrical teaser posters with editable film typography and instant PNG export.</p>
              </GlassCard>
            </Link>

            <Link href="/what-if" className="group">
              <GlassCard interactive className="space-y-3 h-full">
                <div className="h-8 w-8 rounded-lg bg-pink-600/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                  <GitBranch className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition">What If Universe</h4>
                <p className="text-xs text-gray-400">Simulate radical counterfactual history from any imaginative prompt with full ripple consequences.</p>
              </GlassCard>
            </Link>

            <Link href="/endings" className="group">
              <GlassCard interactive className="space-y-3 h-full">
                <div className="h-8 w-8 rounded-lg bg-amber-600/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                  <Bookmark className="h-4 w-4" />
                </div>
                <h4 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition">Ending Vault</h4>
                <p className="text-xs text-gray-400">Unlock Hero, Villain, Mystery, Tragic, and Secret endings governed by backend rules.</p>
              </GlassCard>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
