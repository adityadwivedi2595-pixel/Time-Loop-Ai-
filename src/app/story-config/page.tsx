'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { INITIAL_ERAS } from '@/lib/supabase/storage';
import { CharacterProfile } from '@/types/character';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Compass, Users, Play, RefreshCw } from 'lucide-react';

const GENRES = ['Adventure', 'Mystery', 'Thriller', 'Horror', 'Fantasy', 'Science Fiction', 'Action', 'Romance'];
const TONES = [
  'Cinematic & Gritty',
  'Epic & Mythological',
  'Dark & Suspenseful',
  'Witty & Adventurous',
  'Philosophical & Thought-Provoking',
];

function StoryConfigForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const defaultEraId = searchParams.get('eraId') || 'ancient-india';
  const defaultCharId = searchParams.get('characterId') || '';

  const [selectedEraId, setSelectedEraId] = useState(defaultEraId);
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [selectedCharId, setSelectedCharId] = useState(defaultCharId);
  const [genre, setGenre] = useState('Adventure');
  const [tone, setTone] = useState('Cinematic & Gritty');
  const [customInstructions, setCustomInstructions] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const res = await fetch('/api/characters');
        if (res.ok) {
          const json = await res.json();
          setCharacters(json.characters || []);
          if (!selectedCharId && json.characters?.length > 0) {
            setSelectedCharId(json.characters[0].id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadCharacters();
  }, []);

  const handleLaunch = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eraId: selectedEraId,
          characterId: selectedCharId,
          genre,
          tone,
          customInstructions,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        router.push(`/story-player/${json.story.id}`);
      } else {
        const err = await res.json();
        alert(`Failed to launch story: ${err.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const selectedEra = INITIAL_ERAS.find((e) => e.id === selectedEraId) || INITIAL_ERAS[0];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <Badge variant="cyan">Odyssey Initialization Matrix</Badge>
        <h1 className="mt-2 font-display text-3xl font-black text-white sm:text-4xl">
          Configure Your Adventure
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Set temporal parameters, select your protagonist, and engage NVIDIA NIM to craft your opening timeline.
        </p>
      </div>

      <div className="space-y-6">
        {/* Era Selection */}
        <GlassCard glow="cyan" className="space-y-3">
          <label className="font-display text-sm font-bold text-white flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            1. Target Time Era
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {INITIAL_ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEraId(era.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedEraId === era.id
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <span className="block font-display text-xs font-bold text-white line-clamp-1">{era.name}</span>
                <span className="text-[10px] text-gray-400 capitalize">{era.classification}</span>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Character Selection */}
        <GlassCard glow="purple" className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-display text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-400" />
              2. Protagonist
            </label>
            <button
              onClick={() => router.push('/character-studio')}
              className="text-xs text-purple-400 hover:underline"
            >
              + Create New Character
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => setSelectedCharId(char.id || '')}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedCharId === char.id
                    ? 'border-purple-400 bg-purple-950/40 shadow-glow-purple'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-black flex-shrink-0">
                    {char.image_url && <img src={char.image_url} alt={char.name} className="h-full w-full object-cover" />}
                  </div>
                  <div>
                    <span className="block font-display text-xs font-bold text-white">{char.name}</span>
                    <span className="text-[10px] text-cyan-300">{char.role}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Genre & Tone Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GlassCard className="space-y-3">
            <label className="font-display text-xs font-bold uppercase tracking-wider text-white">Genre</label>
            <div className="grid grid-cols-2 gap-2">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGenre(g)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                    genre === g ? 'border-purple-400 bg-purple-950/50 text-white' : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="space-y-3">
            <label className="font-display text-xs font-bold uppercase tracking-wider text-white">Atmospheric Tone</label>
            <div className="space-y-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`w-full rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                    tone === t ? 'border-cyan-400 bg-cyan-950/50 text-white' : 'border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Custom Story Seed */}
        <GlassCard className="space-y-2">
          <label className="font-display text-xs font-bold uppercase tracking-wider text-white">
            Custom Plot Directives (Optional)
          </label>
          <textarea
            rows={2}
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g. Include an enigmatic double agent who knows the secret origins of the chronal anomaly..."
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-cyan-400 focus:outline-none"
          />
        </GlassCard>

        {/* Launch Button */}
        <button
          onClick={handleLaunch}
          disabled={isDeploying}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 py-4 text-sm font-bold text-white shadow-glow-purple hover:scale-[1.01] transition"
        >
          {isDeploying ? (
            <span className="animate-pulse">Weaving Master Narrative via NVIDIA NIM...</span>
          ) : (
            <>
              <Play className="h-4 w-4 fill-white" />
              <span>Initiate Interactive Odyssey</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function StoryConfigPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono text-gray-400">
          <RefreshCw className="h-5 w-5 animate-spin text-cyan-400 mr-2" />
          Loading Story Configurator...
        </div>
      }
    >
      <StoryConfigForm />
    </Suspense>
  );
}
