'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Compass,
  Users,
  BookOpen,
  Film,
  Mic,
  GitBranch,
  Library,
  Settings,
  Menu,
  X,
  Zap,
  Box,
  Image as ImageIcon,
  ChevronDown,
  Globe
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/heritage', label: '🇮🇳 India Heritage History', icon: Globe, highlight: true },
  { href: '/dashboard', label: 'Mission Control', icon: Zap },
  { href: '/eras', label: 'Time Eras', icon: Compass },
  { href: '/character-studio', label: 'Characters', icon: Users },
  { href: '/character-interaction', label: 'Voice Chat', icon: Mic },
  { href: '/story-config', label: 'New Odyssey', icon: Sparkles },
  { href: '/timeline', label: 'Timeline', icon: GitBranch },
  { href: '/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/poster-studio', label: 'Posters', icon: Film },
  { href: '/what-if', label: 'What If', icon: GitBranch },
  { href: '/endings', label: 'Endings', icon: BookOpen },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Desktop primary links (first 6)
  const primaryLinks = NAV_LINKS.slice(0, 6);
  // Secondary dropdown links
  const moreLinks = NAV_LINKS.slice(6);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#050811]/85 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-500 shadow-glow-purple transition-transform group-hover:scale-105">
            <span className="font-display text-xl font-black text-white">T</span>
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-400 opacity-0 blur transition group-hover:opacity-75" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-lg font-extrabold tracking-wider text-white">TIMELOOP</span>
              <span className="rounded bg-purple-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-purple-300 border border-purple-500/30">AI</span>
            </div>
            <p className="text-[10px] tracking-widest text-cyan-400 font-mono uppercase">Entertainment Edition</p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
                  item.highlight
                    ? 'border border-cyan-400/50 bg-gradient-to-r from-purple-900/60 to-cyan-950/60 text-cyan-300 font-bold shadow-glow-cyan'
                    : isActive
                    ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/40 shadow-sm'
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${item.highlight ? 'text-cyan-400' : isActive ? 'text-cyan-400' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* More Studios Dropdown */}
          <div className="relative">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              onBlur={() => setTimeout(() => setMoreMenuOpen(false), 200)}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white transition"
            >
              <span>More Studios</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {moreMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-[#090d1a] p-2 shadow-2xl backdrop-blur-2xl z-50 space-y-1">
                {moreLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition ${
                        isActive
                          ? 'bg-purple-600/30 text-cyan-300 font-bold'
                          : 'text-gray-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 text-purple-400" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right Action Icons & Status */}
        <div className="hidden sm:flex items-center gap-2">
          {/* India Heritage Explorer Direct Pill */}
          <Link
            href="/heritage"
            className="flex items-center gap-1.5 rounded-full border border-amber-400 bg-gradient-to-r from-amber-600 via-pink-600 to-cyan-500 px-3.5 py-1 text-xs font-black text-white shadow-glow-cyan hover:scale-105 transition"
          >
            <Globe className="h-3.5 w-3.5 fill-white text-amber-200" />
            <span>🇮🇳 Heritage Explorer</span>
          </Link>

          {/* Settings & Telemetry link */}
          <Link
            href="/settings"
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-gray-200 hover:border-purple-500/40 hover:text-white transition"
            title="System Diagnostics & Settings"
          >
            <Settings className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden md:inline">Settings</span>
          </Link>

          {/* Profile Avatar */}
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-gradient-to-tr from-purple-700 to-cyan-600 text-xs font-bold text-white hover:scale-105 transition"
            title="Profile"
          >
            AT
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/5 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#050811]/95 px-4 pt-2 pb-6 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 pt-2">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg p-2.5 text-xs font-medium transition ${
                    item.highlight
                      ? 'border border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold'
                      : isActive
                      ? 'bg-purple-600/20 text-cyan-300 border border-purple-500/40'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4 text-purple-400" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              NVIDIA NIM Active
            </span>
            <Link
              href="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Settings className="h-3.5 w-3.5" />
              Settings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
