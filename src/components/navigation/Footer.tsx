import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, Shield, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#03060f] py-12 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                T
              </div>
              <span className="font-display font-extrabold text-white tracking-wider">TIMELOOP AI</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Don't Just Watch History. Become Part of It. Next-generation interactive cinematic storytelling powered by NVIDIA NIM & MCP.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-mono">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              Living Timeline Engine v1.0
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Experience</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li><Link href="/eras" className="hover:text-cyan-300 transition">Explore Eras</Link></li>
              <li><Link href="/character-studio" className="hover:text-cyan-300 transition">AI Character Studio</Link></li>
              <li><Link href="/story-config" className="hover:text-cyan-300 transition">Interactive Story Player</Link></li>
              <li><Link href="/what-if" className="hover:text-cyan-300 transition">What If Universe</Link></li>
            </ul>
          </div>

          {/* Studios & Engines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Studios</h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li><Link href="/poster-studio" className="hover:text-cyan-300 transition">Movie Poster Studio</Link></li>
              <li><Link href="/voice-studio" className="hover:text-cyan-300 transition">Voice & Narration</Link></li>
              <li><Link href="/endings" className="hover:text-cyan-300 transition">Ending Gallery</Link></li>
              <li><Link href="/library" className="hover:text-cyan-300 transition">Personal Archive</Link></li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Tech Foundation</h4>
            <p className="text-xs text-gray-400">
              Architected on NVIDIA NIM (Mistral Large 4), internal Model Context Protocol (MCP) server, Next.js 14 App Router, and Supabase PostgreSQL with RLS.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-purple-300">NVIDIA NIM</span>
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-cyan-300">MCP SDK</span>
              <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-emerald-300">Supabase RLS</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 TIMELOOP AI. B.Tech AI/ML Production Capstone.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span className="text-gray-400">Server Status: <span className="text-emerald-400 font-mono">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
