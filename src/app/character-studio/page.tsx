'use client';

import React, { useEffect, useState } from 'react';
import { CharacterProfile, CharacterRole } from '@/types/character';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { Users, Sparkles, Plus, Trash2, ArrowRight, Shield, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const AVAILABLE_ROLES: CharacterRole[] = [
  'Warrior',
  'King',
  'Queen',
  'Detective',
  'Scientist',
  'Explorer',
  'Villain',
  'Hero',
  'Time Traveller',
];

export default function CharacterStudioPage() {
  const [characters, setCharacters] = useState<CharacterProfile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CharacterRole>('Time Traveller');
  const [eraName, setEraName] = useState('Cyberpunk Future');
  const [customSeed, setCustomSeed] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'gallery'>('create');

  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    try {
      const res = await fetch('/api/characters');
      if (res.ok) {
        const json = await res.json();
        setCharacters(json.characters || []);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eraName, role: selectedRole, customSeed }),
      });
      if (res.ok) {
        const data = await res.json();
        await loadCharacters();
        setActiveTab('gallery');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await fetch(`/api/characters/${id}`, { method: 'DELETE' });
      await loadCharacters();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Badge variant="purple">Archetype Matrix</Badge>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
            AI Character Studio
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Design deep, multi-dimensional protagonists and adversaries powered by NVIDIA NIM & AI portraits.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === 'create' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Create New Character
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`rounded-lg px-4 py-2 transition ${
              activeTab === 'gallery' ? 'bg-purple-600 text-white font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            Saved Characters ({characters.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-6 space-y-5">
            <GlassCard glow="purple" className="space-y-4">
              <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-400" />
                Character Configuration
              </h3>

              <div>
                <label className="text-xs text-gray-400 block mb-2 font-medium">Select Archetype Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_ROLES.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`rounded-lg border p-2 text-xs font-medium transition ${
                        selectedRole === role
                          ? 'border-purple-500 bg-purple-950/50 text-purple-300'
                          : 'border-white/10 bg-white/[0.02] text-gray-400 hover:text-white'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Target Era Context</label>
                <select
                  value={eraName}
                  onChange={(e) => setEraName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white focus:border-purple-400 focus:outline-none"
                >
                  <option value="Ancient India">Ancient India (Vedic & Mauryan)</option>
                  <option value="Mughal Era">Mughal Era</option>
                  <option value="Ancient Egypt">Ancient Egypt</option>
                  <option value="Medieval Kingdom">Medieval Kingdom</option>
                  <option value="World War Era">World War Era (1940s Espionage)</option>
                  <option value="Cyberpunk Future">Cyberpunk Future (Neo-Kowloon 2099)</option>
                  <option value="Space Civilization">Space Civilization (Aethelgard Imperium)</option>
                  <option value="Fantasy Universe">The Shattered Realms of Eldoria</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 font-medium">Custom Seed / Persona Directions</label>
                <textarea
                  rows={3}
                  value={customSeed}
                  onChange={(e) => setCustomSeed(e.target.value)}
                  placeholder="e.g. A cynical detective carrying a broken tachyon pocket watch, reluctant to trust anyone..."
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 py-3 text-xs font-bold text-white shadow-glow-purple hover:opacity-95 transition"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>NVIDIA NIM Synthesizing Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Character with NVIDIA NIM</span>
                  </>
                )}
              </button>
            </GlassCard>
          </div>

          {/* Live Preview Info */}
          <div className="lg:col-span-6 space-y-4">
            <GlassCard glow="cyan" className="space-y-4">
              <h3 className="font-display text-base font-bold text-white">Character Identity Matrix</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                NVIDIA NIM evaluates your chosen archetype and generates a strictly validated schema containing:
              </p>
              <ul className="text-xs text-gray-400 space-y-2 list-disc pl-5">
                <li><strong className="text-white">Personality Quad-Vector:</strong> Core behavioral traits and ethical compass.</li>
                <li><strong className="text-white">Cinematic Visual Prompt:</strong> High-res prompt for portrait generation.</li>
                <li><strong className="text-white">Motivations & Flaws:</strong> Driving goals that unlock specific story endings.</li>
                <li><strong className="text-white">Special Abilities:</strong> Tactical skills applicable during branching scene choices.</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      ) : (
        /* Characters Gallery */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <GlassCard key={char.id} className="space-y-4 flex flex-col justify-between" glow="purple">
              <div>
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-xl overflow-hidden border border-white/20 bg-black flex-shrink-0">
                    {char.image_url ? (
                      <img src={char.image_url} alt={char.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-600">
                        <Users className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white">{char.name}</h3>
                    <Badge variant="cyan">{char.role}</Badge>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-300 italic">"{char.appearance}"</p>
                <p className="mt-2 text-xs text-gray-400 line-clamp-3">{char.backstory}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {char.personality?.map((trait, i) => (
                    <span key={i} className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-purple-300">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/story-config?characterId=${char.id}`}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
                >
                  <span>Use in Odyssey</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>

                <button
                  onClick={() => handleDelete(char.id)}
                  className="text-gray-500 hover:text-rose-400 transition"
                  title="Delete character"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
