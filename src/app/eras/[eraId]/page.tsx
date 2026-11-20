'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Compass, Sparkles, Shield, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { INITIAL_ERAS } from '@/lib/supabase/storage';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';

export default function EraDetailsPage() {
  const params = useParams();
  const eraId = params.eraId as string;
  const era = INITIAL_ERAS.find((e) => e.id === eraId) || INITIAL_ERAS[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <Link href="/eras" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Era Explorer
      </Link>

      {/* Hero Banner */}
      <div className="relative aspect-[21/9] overflow-hidden rounded-3xl border border-white/10 shadow-glow-card">
        <img src={era.cover_image} alt={era.name} className="h-full w-full object-cover brightness-75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Badge variant={era.classification === 'historical' ? 'emerald' : 'cyan'}>
            {era.classification === 'historical' ? 'Verified Historical Era' : 'Fictional Universe'}
          </Badge>
          <h1 className="font-display text-3xl sm:text-5xl font-black text-white">{era.name}</h1>
        </div>
      </div>

      {/* World-building and Lore Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <GlassCard glow="cyan" className="space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Compass className="h-4 w-4 text-cyan-400" />
              World-Building & Cultural Landscape
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">{era.world_building}</p>
          </GlassCard>

          <GlassCard glow="purple" className="space-y-4">
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              Temporal Story Context & Veracity Guidelines
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">{era.prompt_context}</p>
          </GlassCard>
        </div>

        {/* Sidebar Info & Launch CTA */}
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Suggested Roles</h4>
            <div className="flex flex-wrap gap-2">
              {era.suggested_roles.map((role) => (
                <span key={role} className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-cyan-300">
                  {role}
                </span>
              ))}
            </div>

            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white pt-2 border-t border-white/10">
              Optimal Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {era.suggested_genres.map((genre) => (
                <span key={genre} className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-purple-300">
                  {genre}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10">
              <Link
                href={`/story-config?eraId=${era.id}`}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition"
              >
                <span>Initialize Odyssey in {era.name.split(' ')[0]}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
