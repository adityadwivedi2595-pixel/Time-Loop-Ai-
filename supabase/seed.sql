-- ==============================================================================
-- TIMELOOP AI: Seed Data for Initial Eras
-- ==============================================================================

INSERT INTO public.eras (
    id,
    name,
    description,
    classification,
    cover_image,
    suggested_genres,
    suggested_roles,
    world_building,
    prompt_context
) VALUES
(
    'ancient-india',
    'Ancient India (Vedic & Mauryan Epoch)',
    'Step into the golden age of emperors, grand spiritual debates, sage wisdom, and formidable fortresses along the sacred Sindhu and Ganga rivers.',
    'historical',
    'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1200&q=80',
    '["Adventure", "Mystery", "Action", "Thriller"]'::jsonb,
    '["Warrior", "King", "Queen", "Explorer", "Detective", "Hero"]'::jsonb,
    'The bustling capital of Pataliputra rises behind triple-moated timber walls. Monasteries and universities like Takshashila foster deep secrets, while royal spymasters navigate intrigues between ambitious satraps and ascetic sages.',
    'Historical setting during the Mauryan and Vedic antiquity. Real historical elements must be handled with respect, clearly demarcating cinematic dramatization from verified historical records.'
),
(
    'mughal-era',
    'Mughal Era (16th–17th Century)',
    'A magnificent empire of sandstone palaces, Persian-infused court intrigues, jewel-encrusted thrones, and legendary battle strategies.',
    'historical',
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    '["Mystery", "Thriller", "Adventure", "Romance"]'::jsonb,
    '["King", "Queen", "Warrior", "Detective", "Villain", "Explorer"]'::jsonb,
    'The court of the Padishah hums with court poets, master architects, and rival viziers scheming in candlelit marble corridors. Whispers of secret alliances, subterranean treasuries, and midnight rebellions echo through the red ramparts.',
    'Historical empire in South Asia. Balance imperial splendor with complex diplomatic and tactical dilemmas.'
),
(
    'ancient-egypt',
    'Ancient Egypt (New Kingdom)',
    'Golden sands along the Nile, colossal stone temples of Karnak and Luxor, hieroglyphic curses, and the sacred rule of living gods.',
    'historical',
    'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    '["Mystery", "Adventure", "Fantasy", "Thriller"]'::jsonb,
    '["Queen", "King", "Explorer", "Warrior", "Time Traveller"]'::jsonb,
    'The fertile black soil of Kemet is surrounded by merciless deserts. High Priests of Amun conduct esoteric rituals beneath star-aligned ceilings, while tomb guardians protect the sacred passages to the Duat.',
    'Pharaonic New Kingdom era. Emphasize ancient architecture, the Nile as a lifeline, religious reverence, and dynastic politics.'
),
(
    'medieval-kingdom',
    'Medieval Kingdom (12th Century Europe)',
    'Feudal castles, chivalric oaths, whispered conspiracies in stone bastions, crusader routes, and the constant threat of siege warfare.',
    'historical',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    '["Adventure", "Action", "Mystery", "Thriller"]'::jsonb,
    '["Warrior", "King", "Queen", "Villain", "Hero", "Explorer"]'::jsonb,
    'Gargoyles overlook muddy cobblestone courtyards. Knights in chainmail uphold fragile feudal loyalties while rogue barons plot against the royal crown amidst harsh winters and peasant rebellions.',
    'Western European high medieval period. Grounded in the harsh realities of feudal hierarchy, armor, siege weapons, and honor codes.'
),
(
    'world-war-era',
    'World War Era (1940s Espionage)',
    'Shadowy blackouts across London, clandestine resistance cells in occupied Europe, Morse code transmissions, and nerve-wracking undercover operations.',
    'historical',
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    '["Thriller", "Mystery", "Action", "Horror"]'::jsonb,
    '["Detective", "Warrior", "Scientist", "Hero", "Time Traveller"]'::jsonb,
    'Smoke-filled train stations, radar stations perched on sea cliffs, and underground bunkers where top-secret decryption machines tick away against the countdown of global catastrophe.',
    '1940s wartime atmosphere. Focus on psychological tension, espionage, cryptanalysis, and moral grit.'
),
(
    'cyberpunk-future',
    'Neo-Kowloon 2099 (Cyberpunk Future)',
    'Towering megastructures piercing perpetual acid rain, holographic neon advertisements, sentient cyber-gangs, and neuro-linked mega-corporations.',
    'fictional',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    '["Science Fiction", "Action", "Thriller", "Mystery"]'::jsonb,
    '["Detective", "Scientist", "Villain", "Hero", "Time Traveller"]'::jsonb,
    'Synthetic adrenaline and illegal neural augmentations trade hands in the Lower Sump. Above the cloud layer, corporate oligarchs control artificial weather, orbital elevators, and quantum computing nodes.',
    'Fictional dystopian high-tech future. Focus on neural interfaces, AI overlords, cybernetic modifications, and resistance factions.'
),
(
    'space-civilization',
    'Aethelgard Stellar Imperium (Year 3420)',
    'Dyson swarms encompassing dying red giants, relativistic interstellar dreadnoughts, alien embassies on crystalline moons, and quantum stargates.',
    'fictional',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    '["Science Fiction", "Adventure", "Thriller", "Action"]'::jsonb,
    '["Explorer", "Scientist", "Warrior", "King", "Time Traveller"]'::jsonb,
    'Vast hollowed asteroids serve as orbital metropolises. Factions maneuver for control of antimatter synthesizers while ancient progenitor signals pulse from the galactic core.',
    'Fictional hard/operatic science-fiction. Grand scale, orbital habitats, faster-than-light diplomacy, and cosmic wonder.'
),
(
    'fantasy-universe',
    'The Shattered Realms of Eldoria',
    'Floating elemental continents, primordial arcane ley lines, elder dragons bound by ancient runes, and mythical kingdoms locked in planar war.',
    'fictional',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    '["Fantasy", "Adventure", "Mystery", "Horror"]'::jsonb,
    '["Hero", "Villain", "Queen", "Warrior", "Explorer", "Time Traveller"]'::jsonb,
    'Crystal spires channel raw celestial magic across the rift islands. Mythical beasts roam twilight forests while ancient forgotten tombs hold relics capable of rewinding the world.',
    'High fantasy setting with deep arcane lore, magical factions, ancient covenants, and legendary artifacts.'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    classification = EXCLUDED.classification,
    cover_image = EXCLUDED.cover_image,
    suggested_genres = EXCLUDED.suggested_genres,
    suggested_roles = EXCLUDED.suggested_roles,
    world_building = EXCLUDED.world_building,
    prompt_context = EXCLUDED.prompt_context;
