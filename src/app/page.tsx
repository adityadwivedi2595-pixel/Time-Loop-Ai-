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
  Box,
  Mic,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Library,
  Users,
  Eye,
  Activity,
  Globe
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

const ALL_FEATURES = [
  {
    title: 'India Heritage History & Voice Guide',
    category: '47 Master Monuments',
    desc: 'Explore authentic documented history, verified archival photographs, then-vs-now comparisons, and human-paced studio neural voice guides across all Indian states.',
    href: '/heritage',
    icon: Globe,
    badge: '🇮🇳 47 Monuments',
    glow: 'cyan'
  },
  {
    title: 'Time Era Selection',
    category: 'Historical Exploration',
    desc: 'Traverse 8 rich eras from Ancient India and Mughal Dynasties to Neo-Tokyo 2099 and Deep Space Kepler Station.',
    href: '/eras',
    icon: Compass,
    badge: '8 Eras Available',
    glow: 'purple'
  },
  {
    title: 'Character Creation Studio',
    category: 'AI Archetypes',
    desc: 'Craft multi-dimensional protagonists and adversaries with custom psychological vectors, backstories, and portrait generation.',
    href: '/character-studio',
    icon: Users,
    badge: 'Archetype Matrix',
    glow: 'purple'
  },
  {
    title: 'Character Interaction & Voice Chat',
    category: '2-Way Dialogue',
    desc: 'Live voice and text conversation with in-character AI personalities. Speak via microphone and listen to real-time speech responses.',
    href: '/character-interaction',
    icon: Mic,
    badge: '2-Way Voice',
    glow: 'cyan'
  },
  {
    title: 'AI Story Generation',
    category: 'NVIDIA NIM Engine',
    desc: 'Initialize cinematic branching odysseys configured by tone, genre, historical era, and secret objectives with Zod-verified schemas.',
    href: '/story-config',
    icon: Sparkles,
    badge: 'Nemotron-3.5 30B',
    glow: 'purple'
  },
  {
    title: 'Interactive Story Mode',
    category: 'Living Timeline',
    desc: 'Experience dynamic 4-paragraph scenes with full audio narration, karaoke subtitles, and choices that alter relationships and endings.',
    href: '/dashboard',
    icon: Play,
    badge: 'Branching Choices',
    glow: 'cyan'
  },
  {
    title: 'Timeline Explorer',
    category: 'Causal Graphs',
    desc: 'Inspect branching timeline strands, historical divergence points, paradox anomaly levels, and unlocked endings.',
    href: '/timeline',
    icon: GitBranch,
    badge: 'Causality Graph',
    glow: 'purple'
  },
  {
    title: 'AI Image & Scene Gallery',
    category: 'Visual Concept Art',
    desc: 'Explore high-resolution cinematic keyframes, environment concept art, and matte paintings captured across all 8 eras.',
    href: '/gallery',
    icon: ImageIcon,
    badge: '8K Concept Vault',
    glow: 'cyan'
  },
  {
    title: 'Movie Poster Studio',
    category: 'Cinema Studio',
    desc: 'Generate theatrical teaser posters with customizable movie billing blocks, taglines, Hollywood styling, and instant PNG export.',
    href: '/poster-studio',
    icon: Film,
    badge: 'Export Posters',
    glow: 'purple'
  },
  {
    title: 'Voice Studio & Acoustics',
    category: 'Chrono-Voice',
    desc: 'High-fidelity audio narration with non-stop sentence queues, keepalive heartbeats, speed controls, and voice selection.',
    href: '/voice-studio',
    icon: Mic,
    badge: 'Non-Stop Speech',
    glow: 'cyan'
  },
  {
    title: 'What If Universe',
    category: 'Alternate Realities',
    desc: 'Simulate radical historical counterfactuals and watch ripple consequences unfold across geopolitics and technological evolution.',
    href: '/what-if',
    icon: GitBranch,
    badge: 'Reality Forking',
    glow: 'purple'
  },
  {
    title: 'Multiple Endings Vault',
    category: 'Destiny Vault',
    desc: 'Unlock Hero, Villain, Mystery, Paradox, and Secret endings governed by backend rules and character relationship scores.',
    href: '/endings',
    icon: Bookmark,
    badge: '5 Ending Types',
    glow: 'cyan'
  },
  {
    title: 'My Story Library',
    category: 'Saved Journeys',
    desc: 'Access your persistent story save states, completed chapters, character portfolios, and generated cinematic movie posters.',
    href: '/library',
    icon: Library,
    badge: 'Auto-Checkpoints',
    glow: 'purple'
  },
  {
    title: 'Settings & Live Diagnostics',
    category: 'System Diagnostics',
    desc: 'Check live connection status across all 7 subsystems, configure graphics quality tiers (Low to Ultra), and test speech output.',
    href: '/settings',
    icon: SettingsIcon,
    badge: '7 Subsystem Probes',
    glow: 'cyan'
  }
];

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows & Cyber Grids */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-purple-900/30 via-indigo-900/20 to-cyan-900/30 blur-[130px]" />
      <div className="pointer-events-none absolute top-[600px] -left-40 h-[500px] w-[500px] rounded-full bg-cyan-900/20 blur-[100px]" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-mono text-amber-300 shadow-glow-amber">
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span>🇮🇳 47 Verified Monuments • Studio Neural Voice Guides • Archival Then vs Now</span>
        </div>

        <h1 className="mx-auto max-w-5xl font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Explore India's Living Heritage.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent glow-text-purple">
            Real History, Asli Photos & Neural Voice.
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-sm sm:text-lg text-gray-300 leading-relaxed font-normal">
          TIMELOOP AI preserves 47 master monuments across all Indian states and UTs with verified historical chronicles, genuine archival photography, Then vs Now time-travel comparisons, and studio-grade neural voice guides.
        </p>

        {/* Hero CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          {/* Main India Heritage Explorer CTA */}
          <Link
            href="/heritage"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-pink-600 to-cyan-400 px-8 py-4 text-sm font-black text-white shadow-glow-cyan hover:scale-105 transition-all"
          >
            <Globe className="h-5 w-5 text-white animate-spin" />
            <span>🇮🇳 INDIA HERITAGE & VOICE EXPLORER</span>
          </Link>

          {/* Story Odyssey CTA */}
          <Link
            href="/story-config"
            className="flex items-center gap-2 rounded-xl border border-purple-500/50 bg-purple-950/40 px-6 py-4 text-sm font-bold text-purple-200 hover:bg-purple-900/60 shadow-glow-purple transition"
          >
            <Play className="h-4 w-4 fill-purple-300" />
            <span>Launch Story Odyssey</span>
          </Link>

          {/* Mission Control Dashboard */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-gray-200 hover:text-white hover:bg-white/10 transition"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Mission Control</span>
          </Link>

          {/* Explore Time Eras */}
          <Link
            href="/eras"
            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-bold text-gray-200 hover:text-white hover:bg-white/10 transition"
          >
            <Compass className="h-4 w-4 text-cyan-400" />
            <span>Explore Time Eras</span>
          </Link>
        </div>

        {/* Live System Capabilities Bar */}
        <div className="mx-auto max-w-4xl pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-amber-400">47 Sites</span>
            <span className="text-xs text-gray-400">Pan-India Monuments</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-cyan-400">Neural Voice</span>
            <span className="text-xs text-gray-400">Studio Hindi & English</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-purple-400">Then vs Now</span>
            <span className="text-xs text-gray-400">Archival Comparison</span>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
            <span className="block font-display text-2xl font-extrabold text-emerald-400">100% Real</span>
            <span className="text-xs text-gray-400">Zero Fake AI / CGI</span>
          </div>
        </div>
      </section>

      {/* FEATURED: INDIAN HERITAGE EXPLORER SPOTLIGHT */}
      <section className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-b from-[#0a0f1d] to-black p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-amber-400" />
                <span>Featured Heritage Landmarks</span>
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
                Discover India's Monumental Wonders
              </h2>
            </div>
            <Link
              href="/heritage"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-display text-xs font-black hover:bg-cyan-400 transition"
            >
              <span>EXPLORE ALL 47 MONUMENTS</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'taj-mahal', name: 'The Taj Mahal', city: 'Agra, Uttar Pradesh', era: '1632 – 1653 AD', img: '/images/monuments/taj-mahal.jpg' },
              { id: 'delhi-red-fort', name: 'Red Fort of Delhi', city: 'Old Delhi, Delhi', era: '1638 – 1648 AD', img: '/images/monuments/delhi-red-fort.jpg' },
              { id: 'hawa-mahal', name: 'Hawa Mahal', city: 'Jaipur, Rajasthan', era: '1799 AD', img: '/images/monuments/hawa-mahal.jpg' },
              { id: 'golden-temple', name: 'The Golden Temple', city: 'Amritsar, Punjab', era: '1588 – 1830 AD', img: '/images/monuments/golden-temple.jpg' },
              { id: 'konark-sun-temple', name: 'Konark Sun Temple', city: 'Puri, Odisha', era: '1250 AD', img: '/images/monuments/konark-sun-temple.jpg' },
              { id: 'qutub-minar', name: 'Qutub Minar Complex', city: 'South Delhi, Delhi', era: '1199 – 1368 AD', img: '/images/monuments/qutub-minar.jpg' },
            ].map((m) => (
              <Link
                key={m.id}
                href={`/heritage?monument=${m.id}`}
                className="group relative rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-cyan-400/60 hover:bg-white/10 transition block space-y-2 p-3"
              >
                <div className="h-44 w-full rounded-xl overflow-hidden bg-black relative border border-white/5">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    {m.era}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 transition">
                    {m.name}
                  </h3>
                  <p className="text-xs text-amber-300/80 font-mono flex items-center gap-1">
                    <span>📍</span>
                    <span>{m.city}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ALL 14 SCREENS DEDICATED HUB SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <Badge variant="cyan">Feature Matrix</Badge>
          <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
            Explore All 14 Interactive Studios & Screens
          </h2>
          <p className="mx-auto max-w-2xl text-xs sm:text-sm text-gray-400">
            Every feature is fully visual, interactive, and connected to our live intelligence architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {ALL_FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link key={feat.href} href={feat.href} className="group">
                <GlassCard
                  glow={feat.glow as any}
                  interactive
                  className="h-full flex flex-col justify-between space-y-3 p-5 transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Badge variant={feat.glow === 'cyan' ? 'cyan' : 'purple'}>
                        {feat.badge}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 block">
                        {feat.category}
                      </span>
                      <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 transition">
                        {feat.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                    <span>Enter Screen</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="border-t border-white/10 bg-[#040712] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Under the Hood: Enterprise Intelligence Architecture
            </h2>
            <p className="text-xs text-gray-400 max-w-xl mx-auto">
              Built on strict TypeScript, WebGL 2.0 Three.js canvas, and official Model Context Protocol (MCP) server tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard glow="cyan" className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">NVIDIA NIM Inference</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Powered by Nemotron-3.5 30B providing sub-second generation with strict Zod runtime JSON validation.
              </p>
            </GlassCard>

            <GlassCard glow="purple" className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Model Context Protocol</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Official TypeScript MCP SDK server exposing structured tool endpoints for scene evaluation, lore discovery, and causal timelines.
              </p>
            </GlassCard>

            <GlassCard glow="cyan" className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Box className="h-5 w-5" />
              </div>
              <h3 className="font-display text-base font-bold text-white">Three.js 3D Engine</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Hardware-accelerated WebGL 3D world with walkable avatar, procedural environments, dynamic shadows, and 2,200 particle stars.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
