'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Users,
  Sparkles,
  GitBranch,
  Play,
  Film,
  Mic,
  Bookmark,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Story } from '@/types/story';

export default function DashboardPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/stories');
        if (res.ok) {
          const json = await res.json();
          setStories(json.stories || []);
        }
      } catch (err) {
        console.error('Failed to load stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Header & Mission Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="cyan">Command Central</Badge>
            <Badge variant="emerald">Inference: Mistral Large 4</Badge>
          </div>
          <h1 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">
            Mission Control Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Monitor living timeline strands, deploy personalized characters, and resume active odysseys.
          </p>
        </div>

        <Link
          href="/story-config"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition"
        >
          <Sparkles className="h-4 w-4" />
          <span>Start New Odyssey</span>
        </Link>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link href="/eras">
          <GlassCard interactive glow="cyan" className="space-y-2">
            <Compass className="h-6 w-6 text-cyan-400" />
            <h3 className="font-display text-sm font-bold text-white">Explore 8 Eras</h3>
            <p className="text-xs text-gray-400">Ancient India, Mughal Empire, Cyberpunk 2099, Space Civilization & more.</p>
          </GlassCard>
        </Link>

        <Link href="/character-studio">
          <GlassCard interactive glow="purple" className="space-y-2">
            <Users className="h-6 w-6 text-purple-400" />
            <h3 className="font-display text-sm font-bold text-white">AI Character Studio</h3>
            <p className="text-xs text-gray-400">Build custom archetypes with psychological motivations & portraits.</p>
          </GlassCard>
        </Link>

        <Link href="/what-if">
          <GlassCard interactive className="space-y-2">
            <GitBranch className="h-6 w-6 text-pink-400" />
            <h3 className="font-display text-sm font-bold text-white">What If Universe</h3>
            <p className="text-xs text-gray-400">Simulate diverging alternate realities with automated consequence engines.</p>
          </GlassCard>
        </Link>

        <Link href="/poster-studio">
          <GlassCard interactive className="space-y-2">
            <Film className="h-6 w-6 text-amber-400" />
            <h3 className="font-display text-sm font-bold text-white">Movie Poster Studio</h3>
            <p className="text-xs text-gray-400">Generate high-res theatrical posters with customizable typography.</p>
          </GlassCard>
        </Link>
      </div>

      {/* Active Odysseys & Timeline Strands */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            Active Timeline Strands ({stories.length})
          </h2>
          <Link href="/library" className="text-xs text-cyan-400 hover:underline">
            View All in Library →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-gray-400 animate-pulse">
            Scanning temporal databases...
          </div>
        ) : stories.length === 0 ? (
          <GlassCard className="text-center py-12 space-y-3">
            <Compass className="h-10 w-10 text-gray-600 mx-auto" />
            <h4 className="font-display text-sm font-bold text-white">No active timelines initiated</h4>
            <p className="text-xs text-gray-400">Select an era and create your first AI-guided cinematic story.</p>
            <Link
              href="/story-config"
              className="inline-block rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500"
            >
              Launch First Story
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.map((story) => (
              <GlassCard key={story.id} className="flex flex-col justify-between space-y-4" glow="purple">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="purple">{story.genre}</Badge>
                    <span className="text-[10px] font-mono text-gray-400">{story.era_id}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white line-clamp-1">{story.title}</h3>
                  <p className="text-xs text-gray-300 italic line-clamp-1">"{story.tagline}"</p>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{story.story_summary}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/story-player/${story.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition"
                  >
                    <Play className="h-3 w-3 fill-cyan-300" />
                    <span>Play Story</span>
                  </Link>

                  <Link
                    href={`/timeline-map/${story.id}`}
                    className="flex items-center gap-1 text-xs text-purple-300 hover:text-white"
                  >
                    <GitBranch className="h-3.5 w-3.5" />
                    <span>Timeline Map</span>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
