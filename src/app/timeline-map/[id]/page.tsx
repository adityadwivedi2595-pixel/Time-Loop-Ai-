'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TimelineCanvas } from '@/components/timeline/TimelineCanvas';
import { TimelineDecision } from '@/types/timeline';
import { Story } from '@/types/story';
import { ArrowLeft, RefreshCw, GitBranch } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function TimelineMapPage() {
  const params = useParams();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [history, setHistory] = useState<TimelineDecision[]>([]);
  const [activeBranch, setActiveBranch] = useState('main');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTimeline() {
      try {
        const res = await fetch(`/api/stories/${storyId}/timeline`);
        if (res.ok) {
          const json = await res.json();
          setStory(json.story);
          setHistory(json.timelineState?.history || []);
          setActiveBranch(json.branchId || 'main');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, [storyId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="font-mono text-xs text-gray-400">Tracing causal branch graph...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href={`/story-player/${storyId}`} className="text-gray-400 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Timeline Branch Graph</h1>
            <p className="text-xs text-gray-400">{story?.title || 'Interactive Odyssey'}</p>
          </div>
        </div>

        <Link
          href={`/story-player/${storyId}`}
          className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white hover:bg-purple-500 shadow-glow-purple transition"
        >
          Resume Adventure
        </Link>
      </div>

      <TimelineCanvas
        history={history}
        currentSceneTitle={story?.title || 'Current Convergence'}
        activeBranch={activeBranch}
      />
    </div>
  );
}
