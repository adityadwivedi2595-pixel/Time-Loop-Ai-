'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StoryPlayer } from '@/components/story/StoryPlayer';
import { Story, StoryScene } from '@/types/story';
import { StoryTimelineState } from '@/types/timeline';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { GitBranch, Film, Library, ArrowLeft, RefreshCw } from 'lucide-react';
import { getEraCoverImage } from '@/lib/ai/image-provider';

export default function StoryPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [timelineState, setTimelineState] = useState<StoryTimelineState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<string | null>(null);

  useEffect(() => {
    async function loadStoryData() {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) throw new Error('Story not found');
        const json = await res.json();
        setStory(json.story);

        // Load timeline & current scene
        let loadedTimeline: StoryTimelineState | null = null;
        let loadedScene: StoryScene | null = null;
        try {
          const progRes = await fetch(`/api/stories/${storyId}/progress`);
          if (progRes.ok) {
            const progJson = await progRes.json();
            if (progJson.timelineState) {
              loadedTimeline = progJson.timelineState;
            }
            if (progJson.currentScene) {
              loadedScene = progJson.currentScene;
            }
          }
        } catch {
          // Fallback if network or error
        }

        if (!loadedTimeline) {
          loadedTimeline = {
            current_era: json.story.era_id || 'ancient-india',
            current_chapter: 1,
            current_scene_number: 1,
            character: 'Protagonist',
            relationships: { 'Local Faction': 50, 'Imperial Authority': 50 },
            flags: { initial_arrival: true },
            resources: { temporal_charge: 90, influence: 60 },
            story_summary: json.story.story_summary || json.story.tagline || 'Timeline strand initialization in progress.',
            branch_id: 'main',
            history: [],
            ending_eligibility: ['hero_ending', 'paradox_ending'],
          };
        }
        setTimelineState(loadedTimeline);

        // Fetch scene: if loadedScene has rich narration, use it; otherwise provide epic cinematic prologue
        if (loadedScene && loadedScene.narration && loadedScene.narration.length > 100) {
          setCurrentScene(loadedScene);
        } else {
          const richNarration = `The chronal rift stabilizes over the horizon of ${json.story.title}. A veil of morning incense and temporal static hangs thick in the air. Deep within the ancient stone sanctum, an ethereal resonance vibrates through the earth, signaling that history itself has diverged from its original path. Armed sentries hold their positions in stunned silence as the luminous brass relic begins to oscillate with dangerous power. You step forward into the dawn, knowing that your next decision will either anchor this reality or shatter the timeline forever.`;

          const fallbackScene: StoryScene = {
            id: loadedScene?.id || `scene-initial-${storyId}`,
            story_id: storyId,
            chapter_id: loadedScene?.chapter_id || 'chap-1',
            scene_number: loadedScene?.scene_number || 1,
            title: json.story.title || 'The Chronal Awakening',
            narration: loadedScene?.narration && loadedScene.narration.length > 50 ? loadedScene.narration : richNarration,
            dialogues: loadedScene?.dialogues && loadedScene.dialogues.length > 0 ? loadedScene.dialogues : [
              { character: 'Vanguard Commander', text: 'Halt! That radiance is not of this earthly world. Are you a messenger of the gods, or an omen of ruin?' },
              { character: 'Protagonist', text: 'Neither. I am a traveller of the timestream, and that machine is about to breach containment.' },
            ],
            scene_description: loadedScene?.scene_description || json.story.story_summary || 'An ancient terrace illuminated by torchlight and an oscillating tachyon vortex.',
            visual_prompt: json.story.title,
            image_url: loadedScene?.image_url || getEraCoverImage(`${json.story.era_id || ''} ${json.story.title || ''}`),
            choices: loadedScene?.choices && loadedScene.choices.length > 0 ? loadedScene.choices : [
              {
                id: 'c1',
                choice_text: 'Approach the commander openly and present your credentials as an imperial scholar.',
                consequence_hint: 'Raises court influence (+15), draws political attention.',
              },
              {
                id: 'c2',
                choice_text: 'Deploy your chronal scanner to stabilize the radiating brass mechanism immediately.',
                consequence_hint: 'Prevents spatial rupture, but depletes temporal reserve (-20%).',
              },
              {
                id: 'c3',
                choice_text: 'Mantle into the colonnade shadows to scout the temple vaults before reinforcements arrive.',
                consequence_hint: 'Maintains stealth infiltration and uncovers secret passages.',
              },
            ],
            created_at: new Date().toISOString(),
          };

          setCurrentScene(fallbackScene);
        }
        // Check for local auto-saved checkpoint
        if (typeof window !== 'undefined') {
          try {
            const savedRaw = localStorage.getItem(`timeloop_checkpoint_${storyId}`);
            if (savedRaw) {
              const saved = JSON.parse(savedRaw);
              if (saved.scene) {
                setCurrentScene(saved.scene);
                if (saved.timelineState) setTimelineState(saved.timelineState);
                if (saved.savedAt) setLastAutoSaveTime(saved.savedAt);
              }
            }
          } catch {}
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStoryData();
  }, [storyId]);

  const handleSelectChoice = async (choiceId: string) => {
    if (!currentScene) return;
    setIsProcessingChoice(true);

    try {
      const res = await fetch(`/api/stories/${storyId}/decisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId: currentScene.id,
          choiceId,
          branchId: timelineState?.branch_id || 'main',
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setCurrentScene(json.nextScene);
        setTimelineState(json.updatedState);

        // Auto-save checkpoint to local recovery storage
        const nowStr = new Date().toLocaleTimeString();
        setLastAutoSaveTime(nowStr);
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(
              `timeloop_checkpoint_${storyId}`,
              JSON.stringify({
                scene: json.nextScene,
                timelineState: json.updatedState,
                savedAt: nowStr,
              })
            );
          } catch {}
        }
      } else {
        const err = await res.json();
        alert(`Failed to progress story: ${err.error || 'Server error'}`);
      }
    } catch (err: any) {
      alert(`Network error: ${err.message}`);
    } finally {
      setIsProcessingChoice(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
        <p className="font-mono text-xs text-gray-400">Loading timeline strand from Chronos Archive...</p>
      </div>
    );
  }

  if (!story || !currentScene || !timelineState) {
    return (
      <div className="mx-auto max-w-lg text-center py-20 space-y-4">
        <h2 className="font-display text-xl font-bold text-white">Timeline Strand Not Found</h2>
        <Link href="/dashboard" className="text-xs text-cyan-400 hover:underline">
          Return to Mission Control
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition" title="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-display text-lg font-bold text-white line-clamp-1">{story.title}</h1>
            <p className="text-xs text-gray-400">{story.genre} • {story.tone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {lastAutoSaveTime && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-Saved: {lastAutoSaveTime}
            </span>
          )}

          <Link
            href="/virtual-world"
            className="flex items-center gap-1.5 rounded-lg border border-cyan-400/50 bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-1.5 text-xs font-bold text-white shadow-glow-cyan hover:brightness-110 transition"
          >
            <span>🎮 3D World</span>
          </Link>

          <Link
            href={`/timeline-map/${story.id}`}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/20 px-3 py-1.5 text-xs font-medium text-purple-300 hover:bg-purple-900/40 transition"
          >
            <GitBranch className="h-3.5 w-3.5" />
            <span>Timeline Map</span>
          </Link>

          <Link
            href={`/poster-studio?title=${encodeURIComponent(story.title)}&tagline=${encodeURIComponent(story.tagline || '')}&genre=${story.genre}&era=${story.era_id}`}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/20 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/40 transition"
          >
            <Film className="h-3.5 w-3.5" />
            <span>Create Poster</span>
          </Link>
        </div>
      </div>

      {/* Interactive Story Player Component */}
      <StoryPlayer
        scene={currentScene}
        timelineState={timelineState}
        onSelectChoice={handleSelectChoice}
        isLoading={isProcessingChoice}
      />
    </div>
  );
}
