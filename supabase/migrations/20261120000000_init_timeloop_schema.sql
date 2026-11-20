-- ==============================================================================
-- TIMELOOP AI: PostgreSQL Database Schema Migration
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. ERAS (Time Periods)
CREATE TABLE IF NOT EXISTS public.eras (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    classification TEXT NOT NULL CHECK (classification IN ('historical', 'fictional')),
    cover_image TEXT NOT NULL,
    suggested_genres JSONB DEFAULT '[]'::jsonb NOT NULL,
    suggested_roles JSONB DEFAULT '[]'::jsonb NOT NULL,
    world_building TEXT NOT NULL,
    prompt_context TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CHARACTERS
CREATE TABLE IF NOT EXISTS public.characters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    personality JSONB DEFAULT '[]'::jsonb NOT NULL,
    appearance TEXT NOT NULL,
    backstory TEXT NOT NULL,
    abilities JSONB DEFAULT '[]'::jsonb NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb NOT NULL,
    weaknesses JSONB DEFAULT '[]'::jsonb NOT NULL,
    motivations JSONB DEFAULT '[]'::jsonb NOT NULL,
    visual_prompt TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. STORIES
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    character_id UUID REFERENCES public.characters(id) ON DELETE SET NULL,
    era_id TEXT REFERENCES public.eras(id) ON DELETE RESTRICT NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT,
    genre TEXT NOT NULL,
    tone TEXT NOT NULL,
    status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'completed', 'archived')),
    story_summary TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. STORY CHAPTERS
CREATE TABLE IF NOT EXISTS public.story_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    chapter_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (story_id, chapter_number)
);

-- 6. STORY SCENES
CREATE TABLE IF NOT EXISTS public.story_scenes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    chapter_id UUID REFERENCES public.story_chapters(id) ON DELETE CASCADE NOT NULL,
    scene_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    narration TEXT NOT NULL,
    dialogues JSONB DEFAULT '[]'::jsonb NOT NULL,
    scene_description TEXT NOT NULL,
    visual_prompt TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. STORY CHOICES
CREATE TABLE IF NOT EXISTS public.story_choices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scene_id UUID REFERENCES public.story_scenes(id) ON DELETE CASCADE NOT NULL,
    choice_text TEXT NOT NULL,
    consequence_hint TEXT,
    choice_metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 8. STORY DECISIONS
CREATE TABLE IF NOT EXISTS public.story_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    scene_id UUID REFERENCES public.story_scenes(id) ON DELETE CASCADE NOT NULL,
    choice_id UUID REFERENCES public.story_choices(id) ON DELETE CASCADE NOT NULL,
    branch_id TEXT DEFAULT 'main' NOT NULL,
    selected_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. STORY PROGRESS
CREATE TABLE IF NOT EXISTS public.story_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_scene_id UUID REFERENCES public.story_scenes(id) ON DELETE SET NULL,
    current_chapter INTEGER DEFAULT 1 NOT NULL,
    branch_id TEXT DEFAULT 'main' NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TIMELINE STATES
CREATE TABLE IF NOT EXISTS public.timeline_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    branch_id TEXT DEFAULT 'main' NOT NULL,
    version INTEGER DEFAULT 1 NOT NULL,
    state_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. CHARACTER RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.character_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    character_name TEXT NOT NULL,
    relationship_type TEXT DEFAULT 'neutral' NOT NULL,
    score INTEGER DEFAULT 50 NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (story_id, character_name)
);

-- 12. STORY ENDINGS
CREATE TABLE IF NOT EXISTS public.story_endings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    branch_id TEXT DEFAULT 'main' NOT NULL,
    ending_type TEXT NOT NULL CHECK (ending_type IN ('Hero Ending', 'Villain Ending', 'Mystery Ending', 'Tragic Ending', 'Secret Ending', 'Alternate Timeline Ending')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. GENERATED ASSETS
CREATE TABLE IF NOT EXISTS public.generated_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    story_id UUID REFERENCES public.stories(id) ON DELETE SET NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('portrait', 'scene', 'poster', 'audio')),
    asset_url TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. GENERATION JOBS
CREATE TABLE IF NOT EXISTS public.generation_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    story_id UUID REFERENCES public.stories(id) ON DELETE SET NULL,
    job_type TEXT NOT NULL,
    provider TEXT NOT NULL,
    model_id TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. SAVED ITEMS (Personal Library Bookmarks)
CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('story', 'character', 'poster', 'ending', 'scene')),
    item_id TEXT NOT NULL,
    title TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON public.characters(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON public.stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_era_id ON public.stories(era_id);
CREATE INDEX IF NOT EXISTS idx_story_scenes_story_id ON public.story_scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_decisions_story_id ON public.story_decisions(story_id);
CREATE INDEX IF NOT EXISTS idx_story_progress_story_id ON public.story_progress(story_id);
CREATE INDEX IF NOT EXISTS idx_timeline_states_story_branch ON public.timeline_states(story_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_generated_assets_user_id ON public.generated_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON public.saved_items(user_id);
