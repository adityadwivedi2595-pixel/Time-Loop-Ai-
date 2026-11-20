'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Story } from '@/types/story';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Play, GitBranch, ArrowLeft, BookOpen, Clock } from 'lucide-react';

export default function StoryDetailsPage() {
  const params = useParams();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (res.ok) {
          const json = await res.json();
          setStory(json.story);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [storyId]);

  if (loading || !story) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs text-gray-400 font-mono">
        Retrieving story dossier...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      <Link href="/library" className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Library
      </Link>

      <GlassCard glow="purple" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <Badge variant="cyan">{story.genre}</Badge>
            <h1 className="mt-2 font-display text-3xl font-extrabold text-white">{story.title}</h1>
            <p className="text-xs text-purple-300 italic mt-1">"{story.tagline}"</p>
          </div>

          <Link
            href={`/story-player/${story.id}`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-glow-purple hover:scale-105 transition"
          >
            <Play className="h-3.5 w-3.5 fill-white" />
            <span>Launch Story</span>
          </Link>
        </div>

        <div className="space-y-2">
          <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white">Chronicle Synopsis</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{story.story_summary}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-gray-500 block">Era</span>
            <span className="font-semibold text-white capitalize">{story.era_id.replace('-', ' ')}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Atmosphere</span>
            <span className="font-semibold text-white">{story.tone}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Status</span>
            <span className="font-semibold text-emerald-400 capitalize">{story.status}</span>
          </div>
          <div>
            <span className="text-gray-500 block">Last Divergence</span>
            <span className="font-semibold text-gray-300">{new Date(story.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
