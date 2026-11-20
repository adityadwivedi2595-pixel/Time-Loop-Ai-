'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { StoryPlayer } from '@/components/story/StoryPlayer';
import { Story, StoryScene } from '@/types/story';
import { StoryTimelineState } from '@/types/timeline';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { GitBranch, Film, Library, ArrowLeft, RefreshCw } from 'lucide-react';

export default function StoryPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const storyId = params.id as string;

  const [story, setStory] = useState<Story | null>(null);
  const [currentScene, setCurrentScene] = useState<StoryScene | null>(null);
  const [timelineState, setTimelineState] = useState<StoryTimelineState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingChoice, setIsProcessingChoice] = useState(false);

  useEffect(() => {
    async function loadStoryData() {
      try {
        const res = await fetch(`/api/stories/${storyId}`);
        if (!res.ok) throw new Error('Story not found');
        const json = await res.json();
        setStory(json.story);

        // Load timeline & current scene
        const progRes = await fetch(`/api/stories/${storyId}/progress`);
        if (progRes.ok) {
          const progJson = await progRes.json();
          setTimelineState(progJson.timelineState);
        }

        // Fetch scene: if not directly returned, load default scene 1
        const defaultScene: StoryScene = {
          id: `scene-initial-${storyId}`,
          story_id: storyId,
          chapter_id: 'chap-1',
          scene_number: 1,
          title: json.story.title || 'Echoes by the Sacred River',
          narration: json.story.story_summary || 'Incense and river mist cling to the morning air. Beyond the bamboo grove, the timber bastions rise against the vermillion dawn. A convoy of royal guards halts as an ethereal humming sound reverberates from a sunken shrine.',
          dialogues: [
            { character: 'Royal Guard Commander', text: 'Hold your spears! That light is no earthly flame. Who approaches from the mist?' },
            { character: 'Protagonist', text: 'I am a seeker of forgotten stars. I come in peace, but that brass artifact is unstable.' },
          ],
          scene_description: 'An ancient riverside temple terrace lit by flickering torchlight and a strange cyan tachyon glow escaping from a submerged bronze mechanism.',
          visual_prompt: 'Ancient river temple at sunrise, armored guards, glowing tachyon artifact in the waters, cinematic lighting',
          image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
          choices: [
            {
              id: 'c1',
              choice_text: 'Present your signet and offer your services as a royal scholar to the Emperor.',
              consequence_hint: 'Raises court influence (+15), but arouses suspicion among rival priests.',
            },
            {
              id: 'c2',
              choice_text: 'Activate your chrono-anchor to scan the artifact before the guards seize it.',
              consequence_hint: 'Gathers crucial technical data, but drains temporal charge and alarms the commander.',
            },
            {
              id: 'c3',
              choice_text: 'Slip into the bamboo shadows and track the artifact to the vaults unseen.',
              consequence_hint: 'Preserves stealth and opens an undercover infiltration branch.',
            },
          ],
          created_at: new Date().toISOString(),
        };

        setCurrentScene(defaultScene);
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

        <div className="flex items-center gap-2">
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
