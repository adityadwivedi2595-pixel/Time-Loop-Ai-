-- ==============================================================================
-- TIMELOOP AI: Row Level Security (RLS) & Storage Policies
-- ==============================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_choices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_endings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;

-- 1. ERAS: Public read access for everyone
CREATE POLICY "Public eras can be read by anyone"
    ON public.eras FOR SELECT
    USING (true);

-- 2. PROFILES: Users can read and update their own profile
CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- 3. CHARACTERS: Users manage their own characters
CREATE POLICY "Users can read own characters"
    ON public.characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create characters"
    ON public.characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
    ON public.characters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
    ON public.characters FOR DELETE
    USING (auth.uid() = user_id);

-- 4. STORIES: Owner-only access
CREATE POLICY "Users can read own stories"
    ON public.stories FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create stories"
    ON public.stories FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stories"
    ON public.stories FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stories"
    ON public.stories FOR DELETE
    USING (auth.uid() = user_id);

-- 5. STORY CHAPTERS & SCENES & CHOICES: Story owner only
CREATE POLICY "Story owner can view chapters"
    ON public.story_chapters FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_chapters.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can insert chapters"
    ON public.story_chapters FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_chapters.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can view scenes"
    ON public.story_scenes FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_scenes.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can insert scenes"
    ON public.story_scenes FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_scenes.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can view choices"
    ON public.story_choices FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.story_scenes sc
        JOIN public.stories s ON s.id = sc.story_id
        WHERE sc.id = story_choices.scene_id AND s.user_id = auth.uid()
    ));

CREATE POLICY "Story owner can insert choices"
    ON public.story_choices FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.story_scenes sc
        JOIN public.stories s ON s.id = sc.story_id
        WHERE sc.id = story_choices.scene_id AND s.user_id = auth.uid()
    ));

-- 6. STORY DECISIONS & PROGRESS & TIMELINE
CREATE POLICY "Story owner can view decisions"
    ON public.story_decisions FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_decisions.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can insert decisions"
    ON public.story_decisions FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_decisions.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Users can view own story progress"
    ON public.story_progress FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own story progress"
    ON public.story_progress FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Story owner can view timeline states"
    ON public.timeline_states FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = timeline_states.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can insert timeline states"
    ON public.timeline_states FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = timeline_states.story_id AND s.user_id = auth.uid()));

-- 7. RELATIONSHIPS & ENDINGS
CREATE POLICY "Story owner can view relationships"
    ON public.character_relationships FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = character_relationships.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can modify relationships"
    ON public.character_relationships FOR ALL
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = character_relationships.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can view endings"
    ON public.story_endings FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_endings.story_id AND s.user_id = auth.uid()));

CREATE POLICY "Story owner can insert endings"
    ON public.story_endings FOR INSERT
    WITH CHECK (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_endings.story_id AND s.user_id = auth.uid()));

-- 8. ASSETS & JOBS & SAVED ITEMS
CREATE POLICY "Users can manage own generated assets"
    ON public.generated_assets FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own generation jobs"
    ON public.generation_jobs FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved items"
    ON public.saved_items FOR ALL
    USING (auth.uid() = user_id);

-- Storage buckets setup (to be executed in Supabase storage config)
-- BUCKETS: 'character-portraits', 'scene-artwork', 'movie-posters'
