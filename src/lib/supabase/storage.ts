/**
 * TIMELOOP AI Data Store Abstraction
 * Supports both live Supabase PostgreSQL (with RLS) and high-fidelity local memory/demo persistence.
 */

import { TimeEra } from '@/types/era';
import { CharacterProfile } from '@/types/character';
import { Story, StoryScene, StoryChoice, StoryChapter } from '@/types/story';
import { StoryTimelineState, TimelineDecision } from '@/types/timeline';
import { StoryEndingRecord } from '@/types/ending';
import { createServerClient } from './server';

// 8 Verified Built-in Time Eras
export const INITIAL_ERAS: TimeEra[] = [
  {
    id: 'ancient-india',
    name: 'Ancient India (Vedic & Mauryan Epoch)',
    description: 'Step into the golden age of emperors, grand spiritual debates, sage wisdom, and formidable fortresses along the sacred Sindhu and Ganga rivers.',
    classification: 'historical',
    cover_image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Adventure', 'Mystery', 'Action', 'Thriller'],
    suggested_roles: ['Warrior', 'King', 'Queen', 'Explorer', 'Detective', 'Hero'],
    world_building: 'The bustling capital of Pataliputra rises behind triple-moated timber walls. Monasteries and universities like Takshashila foster deep secrets, while royal spymasters navigate intrigues between ambitious satraps and ascetic sages.',
    prompt_context: 'Historical setting during the Mauryan and Vedic antiquity. Real historical elements must be handled with respect, clearly demarcating cinematic dramatization from verified historical records.',
  },
  {
    id: 'mughal-era',
    name: 'Mughal Era (16th–17th Century)',
    description: 'A magnificent empire of sandstone palaces, Persian-infused court intrigues, jewel-encrusted thrones, and legendary battle strategies.',
    classification: 'historical',
    cover_image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Mystery', 'Thriller', 'Adventure', 'Romance'],
    suggested_roles: ['King', 'Queen', 'Warrior', 'Detective', 'Villain', 'Explorer'],
    world_building: 'The court of the Padishah hums with court poets, master architects, and rival viziers scheming in candlelit marble corridors. Whispers of secret alliances, subterranean treasuries, and midnight rebellions echo through the red ramparts.',
    prompt_context: 'Historical empire in South Asia. Balance imperial splendor with complex diplomatic and tactical dilemmas.',
  },
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt (New Kingdom)',
    description: 'Golden sands along the Nile, colossal stone temples of Karnak and Luxor, hieroglyphic curses, and the sacred rule of living gods.',
    classification: 'historical',
    cover_image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Mystery', 'Adventure', 'Fantasy', 'Thriller'],
    suggested_roles: ['Queen', 'King', 'Explorer', 'Warrior', 'Time Traveller'],
    world_building: 'The fertile black soil of Kemet is surrounded by merciless deserts. High Priests of Amun conduct esoteric rituals beneath star-aligned ceilings, while tomb guardians protect the sacred passages to the Duat.',
    prompt_context: 'Pharaonic New Kingdom era. Emphasize ancient architecture, the Nile as a lifeline, religious reverence, and dynastic politics.',
  },
  {
    id: 'medieval-kingdom',
    name: 'Medieval Kingdom (12th Century Europe)',
    description: 'Feudal castles, chivalric oaths, whispered conspiracies in stone bastions, crusader routes, and the constant threat of siege warfare.',
    classification: 'historical',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Adventure', 'Action', 'Mystery', 'Thriller'],
    suggested_roles: ['Warrior', 'King', 'Queen', 'Villain', 'Hero', 'Explorer'],
    world_building: 'Gargoyles overlook muddy cobblestone courtyards. Knights in chainmail uphold fragile feudal loyalties while rogue barons plot against the royal crown amidst harsh winters and peasant rebellions.',
    prompt_context: 'Western European high medieval period. Grounded in the harsh realities of feudal hierarchy, armor, siege weapons, and honor codes.',
  },
  {
    id: 'world-war-era',
    name: 'World War Era (1940s Espionage)',
    description: 'Shadowy blackouts across London, clandestine resistance cells in occupied Europe, Morse code transmissions, and nerve-wracking undercover operations.',
    classification: 'historical',
    cover_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Thriller', 'Mystery', 'Action', 'Horror'],
    suggested_roles: ['Detective', 'Warrior', 'Scientist', 'Hero', 'Time Traveller'],
    world_building: 'Smoke-filled train stations, radar stations perched on sea cliffs, and underground bunkers where top-secret decryption machines tick away against the countdown of global catastrophe.',
    prompt_context: '1940s wartime atmosphere. Focus on psychological tension, espionage, cryptanalysis, and moral grit.',
  },
  {
    id: 'cyberpunk-future',
    name: 'Neo-Kowloon 2099 (Cyberpunk Future)',
    description: 'Towering megastructures piercing perpetual acid rain, holographic neon advertisements, sentient cyber-gangs, and neuro-linked mega-corporations.',
    classification: 'fictional',
    cover_image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Science Fiction', 'Action', 'Thriller', 'Mystery'],
    suggested_roles: ['Detective', 'Scientist', 'Villain', 'Hero', 'Time Traveller'],
    world_building: 'Synthetic adrenaline and illegal neural augmentations trade hands in the Lower Sump. Above the cloud layer, corporate oligarchs control artificial weather, orbital elevators, and quantum computing nodes.',
    prompt_context: 'Fictional dystopian high-tech future. Focus on neural interfaces, AI overlords, cybernetic modifications, and resistance factions.',
  },
  {
    id: 'space-civilization',
    name: 'Aethelgard Stellar Imperium (Year 3420)',
    description: 'Dyson swarms encompassing dying red giants, relativistic interstellar dreadnoughts, alien embassies on crystalline moons, and quantum stargates.',
    classification: 'fictional',
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Science Fiction', 'Adventure', 'Thriller', 'Action'],
    suggested_roles: ['Explorer', 'Scientist', 'Warrior', 'King', 'Time Traveller'],
    world_building: 'Vast hollowed asteroids serve as orbital metropolises. Factions maneuver for control of antimatter synthesizers while ancient progenitor signals pulse from the galactic core.',
    prompt_context: 'Fictional hard/operatic science-fiction. Grand scale, orbital habitats, faster-than-light diplomacy, and cosmic wonder.',
  },
  {
    id: 'fantasy-universe',
    name: 'The Shattered Realms of Eldoria',
    description: 'Floating elemental continents, primordial arcane ley lines, elder dragons bound by ancient runes, and mythical kingdoms locked in planar war.',
    classification: 'fictional',
    cover_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    suggested_genres: ['Fantasy', 'Adventure', 'Mystery', 'Horror'],
    suggested_roles: ['Hero', 'Villain', 'Queen', 'Warrior', 'Explorer', 'Time Traveller'],
    world_building: 'Crystal spires channel raw celestial magic across the rift islands. Mythical beasts roam twilight forests while ancient forgotten tombs hold relics capable of rewinding the world.',
    prompt_context: 'High fantasy setting with deep arcane lore, magical factions, ancient covenants, and legendary artifacts.',
  },
];

// In-Memory Database store for demo/development/test fallback
class MemoryStore {
  public eras: Map<string, TimeEra> = new Map();
  public characters: Map<string, CharacterProfile> = new Map();
  public stories: Map<string, Story> = new Map();
  public chapters: Map<string, StoryChapter[]> = new Map(); // story_id -> chapters
  public scenes: Map<string, StoryScene> = new Map(); // scene_id -> scene
  public choices: Map<string, StoryChoice[]> = new Map(); // scene_id -> choices
  public timelineStates: Map<string, StoryTimelineState> = new Map(); // story_id:branch_id -> state
  public decisions: Map<string, TimelineDecision[]> = new Map(); // story_id -> decisions
  public endings: Map<string, StoryEndingRecord[]> = new Map(); // story_id -> endings
  public assets: Map<string, any[]> = new Map(); // user_id -> assets
  public savedItems: Map<string, any[]> = new Map(); // user_id -> saved items

  constructor() {
    INITIAL_ERAS.forEach((era) => this.eras.set(era.id, era));
    this.seedDemoData();
  }

  private seedDemoData() {
    const demoUser = '00000000-0000-0000-0000-000000000001';
    
    // Seed sample character
    const charId = '11111111-1111-1111-1111-111111111111';
    this.characters.set(charId, {
      id: charId,
      user_id: demoUser,
      name: 'Arjun Thorne',
      role: 'Time Traveller',
      personality: ['Resilient', 'Strategic', 'Inquisitive'],
      appearance: 'Tall with sharp obsidian-tinted cybernetic eyes, wearing a weathered chronomancer coat lined with quantum fiber.',
      backstory: 'Former chronal navigator stranded in the timestream after a temporal rift shattered his vessel.',
      abilities: ['Temporal Echo Perception', 'Chrono-Shift Deceleration'],
      strengths: ['Analytical foresight', 'Tactical calm under fire'],
      weaknesses: ['Haunted by alternate reality memories', 'Chronal anchor instability'],
      motivations: ['Prevent the collapse of the prime timeline', 'Find the lost Chronos Archive'],
      visual_prompt: 'Cinematic portrait of a futuristic time traveller in a worn longcoat with glowing chronal gauntlets, dramatic sci-fi lighting, 8k resolution',
      image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      created_at: new Date().toISOString(),
    });

    // Seed sample story
    const storyId = '22222222-2222-2222-2222-222222222222';
    this.stories.set(storyId, {
      id: storyId,
      user_id: demoUser,
      character_id: charId,
      era_id: 'ancient-india',
      title: 'The Chrono-Sutra of Pataliputra',
      tagline: 'When the sands of time run backward, only the daring write history.',
      genre: 'Adventure',
      tone: 'Cinematic & Gritty',
      status: 'active',
      story_summary: 'Arjun Thorne awakens on the banks of the sacred Sindhu river in 320 BCE, witnessing an anomalous brass sphere pulsating with tachyon radiation near the imperial citadel.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    // Seed Chapter 1 & Scene 1
    const chapterId = '33333333-3333-3333-3333-333333333333';
    this.chapters.set(storyId, [
      {
        id: chapterId,
        story_id: storyId,
        chapter_number: 1,
        title: 'The Brass Anomaly',
        content: 'Arrival in the Mauryan borderlands.',
        created_at: new Date().toISOString(),
      },
    ]);

    const sceneId = '44444444-4444-4444-4444-444444444444';
    const scene1: StoryScene = {
      id: sceneId,
      story_id: storyId,
      chapter_id: chapterId,
      scene_number: 1,
      title: 'Echoes by the Sacred River',
      narration: 'Incense and river mist cling to the morning air. Beyond the bamboo grove, the timber bastions of Pataliputra rise against the vermillion dawn. A convoy of royal guards on armored elephants halts as an ethereal humming sound reverberates from a sunken shrine.',
      dialogues: [
        {
          character: 'Royal Guard Commander',
          text: 'Hold your spears! That light is no earthly flame. Who approaches from the mist?',
        },
        {
          character: 'Arjun Thorne',
          text: 'I am a seeker of forgotten stars. I come in peace, but that brass artifact behind you is unstable.',
        },
      ],
      scene_description: 'An ancient riverside temple terrace lit by flickering torchlight and a strange cyan tachyon glow escaping from a submerged bronze mechanism.',
      visual_prompt: 'Ancient Mauryan river temple at sunrise, armored war elephants with silk banners, glowing tachyon artifact in the waters, cinematic lighting, ultra-detailed',
      image_url: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
      choices: [
        {
          id: 'c1',
          choice_text: 'Present the Royal Signet and offer your services as an astrologer-scholar to the Emperor.',
          consequence_hint: 'Increases Influence with the court, but arouses suspicion among rival priests.',
        },
        {
          id: 'c2',
          choice_text: 'Activate your chrono-anchor to scan the artifact before the guards seize it.',
          consequence_hint: 'Reveals crucial tech data, but drains 15% temporal reserve and alarms the commander.',
        },
        {
          id: 'c3',
          choice_text: 'Slip into the bamboo shadows and track the artifact to the imperial palace vaults.',
          consequence_hint: 'Preserves stealth and opens an undercover stealth infiltration branch.',
        },
      ],
      created_at: new Date().toISOString(),
    };

    this.scenes.set(sceneId, scene1);

    // Initial timeline state
    this.timelineStates.set(`${storyId}:main`, {
      current_era: 'ancient-india',
      current_chapter: 1,
      current_scene_number: 1,
      character: 'Arjun Thorne',
      relationships: {
        'Mauryan Emperor': 50,
        'Royal Astrologer': 40,
        'Shadow Spymaster': 45,
      },
      flags: {
        'artifact_detected': true,
        'revealed_identity': false,
        'imperial_warrant': false,
      },
      resources: {
        'influence': 20,
        'reputation': 50,
        'temporal_charge': 100,
      },
      story_summary: 'Arjun Thorne arrived at Pataliputra and encountered the royal vanguard near the submerged brass anomaly.',
      branch_id: 'main',
      history: [],
      ending_eligibility: ['Mystery Ending'],
    });
  }
}

// Global singleton for in-memory store
const globalForMemory = globalThis as unknown as { timeloopMemoryStore: MemoryStore };
export const memoryStore = globalForMemory.timeloopMemoryStore || new MemoryStore();
if (process.env.NODE_ENV !== 'production') globalForMemory.timeloopMemoryStore = memoryStore;

// Unified Data Store Provider
export class DataStore {
  // Check if live Supabase is configured
  public static hasLiveSupabase(): boolean {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  }

  // ERAS
  public static async getEras(): Promise<TimeEra[]> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('eras').select('*');
        if (!error && data && data.length > 0) return data as TimeEra[];
      }
    }
    return Array.from(memoryStore.eras.values());
  }

  public static async getEraById(id: string): Promise<TimeEra | null> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('eras').select('*').eq('id', id).single();
        if (!error && data) return data as TimeEra;
      }
    }
    return memoryStore.eras.get(id) || null;
  }

  // CHARACTERS
  public static async getCharacters(userId: string): Promise<CharacterProfile[]> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('characters').select('*').eq('user_id', userId);
        if (!error && data) return data as CharacterProfile[];
      }
    }
    return Array.from(memoryStore.characters.values()).filter((c) => c.user_id === userId || c.user_id === '00000000-0000-0000-0000-000000000001');
  }

  public static async getCharacterById(id: string, userId?: string): Promise<CharacterProfile | null> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        let query = supabase.from('characters').select('*').eq('id', id);
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.single();
        if (!error && data) return data as CharacterProfile;
      }
    }
    const char = memoryStore.characters.get(id);
    if (!char) return null;
    if (userId && char.user_id !== userId) return null;
    return char;
  }

  public static async saveCharacter(char: CharacterProfile): Promise<CharacterProfile> {
    const id = char.id || `char-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const saved = { ...char, id, created_at: char.created_at || new Date().toISOString() };

    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('characters').upsert(saved);
      }
    }
    memoryStore.characters.set(id, saved);
    return saved;
  }

  public static async deleteCharacter(id: string, userId: string): Promise<boolean> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('characters').delete().eq('id', id).eq('user_id', userId);
      }
    }
    const existing = memoryStore.characters.get(id);
    if (existing && (existing.user_id === userId || existing.user_id === '00000000-0000-0000-0000-000000000001')) {
      memoryStore.characters.delete(id);
      return true;
    }
    return false;
  }

  // STORIES
  public static async getStories(userId: string): Promise<Story[]> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('stories').select('*').eq('user_id', userId).order('updated_at', { ascending: false });
        if (!error && data) return data as Story[];
      }
    }
    return Array.from(memoryStore.stories.values()).filter((s) => s.user_id === userId || s.user_id === '00000000-0000-0000-0000-000000000001');
  }

  public static async getStoryById(id: string, userId?: string): Promise<Story | null> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        let query = supabase.from('stories').select('*').eq('id', id);
        if (userId) query = query.eq('user_id', userId);
        const { data, error } = await query.single();
        if (!error && data) return data as Story;
      }
    }
    const story = memoryStore.stories.get(id);
    if (!story) return null;
    if (userId && story.user_id !== userId) return null;
    return story;
  }

  public static async createStory(story: Partial<Story> & { user_id: string; era_id: string; title: string }): Promise<Story> {
    const id = story.id || `story-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fullStory: Story = {
      id,
      user_id: story.user_id,
      character_id: story.character_id,
      era_id: story.era_id,
      title: story.title,
      tagline: story.tagline || '',
      genre: story.genre || 'Adventure',
      tone: story.tone || 'Cinematic & Gritty',
      status: 'active',
      story_summary: story.story_summary || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('stories').insert(fullStory);
      }
    }
    memoryStore.stories.set(id, fullStory);
    return fullStory;
  }

  // SCENES & CHAPTERS
  public static async getSceneById(sceneId: string): Promise<StoryScene | null> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('story_scenes').select('*, choices:story_choices(*)').eq('id', sceneId).single();
        if (!error && data) return data as StoryScene;
      }
    }
    return memoryStore.scenes.get(sceneId) || null;
  }

  public static async saveScene(scene: StoryScene): Promise<StoryScene> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('story_scenes').upsert({
          id: scene.id,
          story_id: scene.story_id,
          chapter_id: scene.chapter_id,
          scene_number: scene.scene_number,
          title: scene.title,
          narration: scene.narration,
          dialogues: scene.dialogues,
          scene_description: scene.scene_description,
          visual_prompt: scene.visual_prompt,
          image_url: scene.image_url,
        });

        // Insert choices
        if (scene.choices && scene.choices.length > 0) {
          const choicesToInsert = scene.choices.map((c) => ({
            id: c.id,
            scene_id: scene.id,
            choice_text: c.choice_text,
            consequence_hint: c.consequence_hint,
          }));
          await supabase.from('story_choices').upsert(choicesToInsert);
        }
      }
    }
    memoryStore.scenes.set(scene.id, scene);
    return scene;
  }

  // TIMELINE STATES
  public static async getTimelineState(storyId: string, branchId: string = 'main'): Promise<StoryTimelineState | null> {
    const key = `${storyId}:${branchId}`;
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('timeline_states')
          .select('state_json')
          .eq('story_id', storyId)
          .eq('branch_id', branchId)
          .order('version', { ascending: false })
          .limit(1)
          .single();
        if (!error && data?.state_json) return data.state_json as StoryTimelineState;
      }
    }
    return memoryStore.timelineStates.get(key) || null;
  }

  public static async saveTimelineState(storyId: string, branchId: string, state: StoryTimelineState): Promise<StoryTimelineState> {
    const key = `${storyId}:${branchId}`;
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('timeline_states').insert({
          story_id: storyId,
          branch_id: branchId,
          state_json: state,
        });
      }
    }
    memoryStore.timelineStates.set(key, state);
    return state;
  }

  // ENDINGS
  public static async getEndings(storyId: string): Promise<StoryEndingRecord[]> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('story_endings').select('*').eq('story_id', storyId);
        if (!error && data) return data as StoryEndingRecord[];
      }
    }
    return memoryStore.endings.get(storyId) || [];
  }

  public static async saveEnding(ending: StoryEndingRecord): Promise<StoryEndingRecord> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('story_endings').insert(ending);
      }
    }
    const existing = memoryStore.endings.get(ending.story_id) || [];
    existing.push(ending);
    memoryStore.endings.set(ending.story_id, existing);
    return ending;
  }

  // ASSETS & SAVED ITEMS
  public static async getSavedItems(userId: string): Promise<any[]> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        const { data, error } = await supabase.from('saved_items').select('*').eq('user_id', userId);
        if (!error && data) return data;
      }
    }
    return memoryStore.savedItems.get(userId) || [];
  }

  public static async saveItem(userId: string, item: { item_type: string; item_id: string; title: string; metadata?: any }): Promise<any> {
    const record = {
      id: `saved-${Date.now()}`,
      user_id: userId,
      ...item,
      created_at: new Date().toISOString(),
    };
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('saved_items').insert(record);
      }
    }
    const list = memoryStore.savedItems.get(userId) || [];
    list.push(record);
    memoryStore.savedItems.set(userId, list);
    return record;
  }

  public static async deleteSavedItem(userId: string, id: string): Promise<boolean> {
    if (this.hasLiveSupabase()) {
      const supabase = createServerClient();
      if (supabase) {
        await supabase.from('saved_items').delete().eq('id', id).eq('user_id', userId);
      }
    }
    const list = memoryStore.savedItems.get(userId) || [];
    const updated = list.filter((i) => i.id !== id);
    memoryStore.savedItems.set(userId, updated);
    return true;
  }
}
