'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Story } from '@/types/story';
import { CharacterProfile } from '@/types/character';
import { Library, Play, Trash2, ArrowRight, Sparkles, Filter } from 'lucide-react';

export default function PersonalLibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'stories' | 'characters'>('stories');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/library');
        if (res.ok) {
          const json = await res.json();
          setStories(json.stories || []);
          setCharacters(json.characters || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredStories = stories.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) || s.genre.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCharacters = characters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Badge variant="purple">Player Archive</Badge>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white flex items-center gap-3">
            <Library className="h-8 w-8 text-purple-400" />
            My Personal Chronos Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            All your generated adventures, characters, checkpoints, and unlocked endings stored privately.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          <button
            onClick={() => setActiveTab('stories')}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === 'stories' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved Stories ({stories.length})
          </button>
          <button
            onClick={() => setActiveTab('characters')}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === 'characters' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Characters ({characters.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${activeTab}...`}
          className="w-full max-w-md rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
        />
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-gray-400 animate-pulse">
          Retrieving encrypted library vault...
        </div>
      ) : activeTab === 'stories' ? (
        filteredStories.length === 0 ? (
          <GlassCard className="text-center py-12 space-y-3">
            <Library className="h-8 w-8 text-gray-600 mx-auto" />
            <p className="text-xs text-gray-400">No stories matching your query.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <GlassCard key={story.id} glow="purple" className="flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="cyan">{story.genre}</Badge>
                    <span className="text-[10px] font-mono text-gray-400">{story.era_id}</span>
                  </div>
                  <h3 className="font-display text-base font-bold text-white line-clamp-1">{story.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">{story.story_summary}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={`/story-player/${story.id}`}
                    className="flex items-center gap-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition"
                  >
                    <Play className="h-3 w-3 fill-cyan-300" />
                    <span>Resume Story</span>
                  </Link>

                  <Link href={`/stories/${story.id}`} className="text-xs text-gray-400 hover:text-white">
                    View Details →
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )
      ) : (
        /* Characters Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCharacters.map((char) => (
            <GlassCard key={char.id} glow="cyan" className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl overflow-hidden bg-black flex-shrink-0">
                  {char.image_url ? (
                    <img src={char.image_url} alt={char.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-600 text-xs font-bold">
                      {char.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-display text-sm font-bold text-white">{char.name}</h4>
                  <Badge variant="purple">{char.role}</Badge>
                </div>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{char.backstory}</p>
              <div className="pt-2 border-t border-white/10 flex justify-end">
                <Link
                  href={`/story-config?characterId=${char.id}`}
                  className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>Select for New Odyssey</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
