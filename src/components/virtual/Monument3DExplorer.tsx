'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  VirtualWorldCanvas, 
  WorldEra, 
  CameraViewMode 
} from '@/components/virtual/VirtualWorldCanvas';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Activity, 
  MapPin, 
  RotateCcw, 
  Zap, 
  ArrowRight,
  Shield,
  Layers,
  BookOpen,
  Eye,
  Info,
  Camera,
  Sun,
  Thermometer,
  Boxes,
  Crown,
  Calendar,
  Languages,
  ExternalLink,
  Globe
} from 'lucide-react';

export interface LocationPhoto {
  url: string;
  title: string;
  caption: string;
  category: 'Exterior' | 'Interior' | 'Aerial' | 'Relic';
}

export interface ArchaeologicalRelic {
  name: string;
  photoUrl: string;
  discoveryDate: string;
  significance: string;
}

export interface HistoricalChapter {
  title: string;
  icon: string;
  content: string;
}

export interface MonumentLocation {
  id: string;
  era: WorldEra;
  name: string;
  historicalPeriod: string;
  exactCoordinates: string;
  rulerOrBuilder: string;
  civilization: string;
  unescoStatus: string;
  weather: string;
  materials: string;
  shortTagline: string;
  architectureSummary: string;
  photos: LocationPhoto[];
  relics: ArchaeologicalRelic[];
  historyChapters: HistoricalChapter[];
  audioGuideEn: string;
  audioGuideHi: string;
  interactiveChoices: {
    title: string;
    description: string;
    reaction: string;
  }[];
}

export const MONUMENT_LOCATIONS: MonumentLocation[] = [
  {
    id: 'taj-mahal-agra',
    era: 'taj-mahal',
    name: 'The Taj Mahal (Crown of the Palaces)',
    historicalPeriod: 'Mughal Golden Age (1632 – 1653 AD)',
    exactCoordinates: '27.1751° N, 78.0421° E (Banks of Yamuna River, Agra)',
    rulerOrBuilder: 'Mughal Emperor Shah Jahan for Empress Mumtaz Mahal',
    civilization: 'Mughal Imperial Architecture & Persian-Indian Synthesis',
    unescoStatus: 'UNESCO World Heritage Site (1983) & New 7 Wonders of the World',
    weather: 'River Yamuna Dawn Mist • 24°C • Incense & Rosewater Breeze',
    materials: 'Translucent White Makrana Marble, Red Sikri Sandstone, Pietra Dura Gemstones (Lapis, Jade, Jasper)',
    shortTagline: 'Pure White Makrana Marble Onion Dome, 4 Outward-Leaning Minarets & Reflecting Charbagh Pool',
    architectureSummary: 'An architectural masterpiece of absolute bilateral symmetry. Features a 35-meter bulbous marble dome (Amrud) set upon a high drum, flanked by 4 chattris, four 40-meter three-tiered minarets engineered with a 3-degree outward lean, and a 300-meter Charbagh reflecting canal.',
    photos: [
      {
        url: '/images/taj-mahal-360.jpg',
        title: 'Asli Taj Mahal Street View & Reflecting Pool',
        caption: 'The authentic live view of the Taj Mahal standing before the sacred water canal of Al Hawd al-Kawthar.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        title: 'Iconic Taj Mahal & Bilateral Symmetry',
        caption: 'The symmetrical white Makrana marble facade perfectly reflected in the azure reflection pool.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1587135941948-670b381f08ce?auto=format&fit=crop&w=1200&q=80',
        title: 'Dawn Golden Glow on Makrana Marble',
        caption: 'The sunrise rays casting soft rose and amber hues across the marble dome, showcasing its translucent optical properties.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1200&q=80',
        title: 'Pietra Dura (Parchin Kari) Gem Inlays & Jali',
        caption: 'Floral motifs crafted from lapis lazuli, turquoise, and carnelian inlaid with zero tolerance into white marble.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'Pietra Dura (Parchin Kari) Floral Marble Inlays',
        photoUrl: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Imperial Mughal Artisan Workshops (1638 AD)',
        significance: 'Over 43 varieties of semiprecious gems cut to micron tolerances and inlaid into marble with botanical realism.'
      },
      {
        name: 'Pierced Marble Jali Lattice Screen',
        photoUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Central Cenotaph Chamber (1648 AD)',
        significance: 'Single slabs of Makrana marble intricately carved into lace-like geometric screens that filter natural light.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Commissioned in 1632 by Emperor Shah Jahan. Over 20,000 artisans, masons, calligraphers, and gem cutters from across India, Persia, and the Ottoman Empire worked for 22 years, supported by a fleet of over 1,000 elephants transporting white marble 400 kilometers from the Makrana quarries in Rajasthan.'
      },
      {
        title: 'Engineering Secrets & Symmetrical Marvels',
        icon: '👑',
        content: 'The entire monument sits upon subterranean well foundations filled with Sal-wood timber that requires constant moisture from the Yamuna River to remain rock-hard. The 4 corner minarets were deliberately built with a subtle 3-degree outward lean to ensure they fall away from the central dome in any earthquake.'
      },
      {
        title: 'Archaeological Excavations & Modern Findings',
        icon: '🔍',
        content: 'Studies by the Archaeological Survey of India (ASI) revealed that the color of the Taj Mahal shifts dramatically throughout the day—blush pink at dawn, brilliant white at noon, and iridescent translucent gold under full moonlight (Chamki).'
      }
    ],
    audioGuideEn: 'Welcome to the Taj Mahal in Agra, year 1648 AD. Morning mist gently rises from the Yamuna River. Ahead of you stands the legendary white Makrana marble mausoleum, commissioned by Emperor Shah Jahan in memory of Empress Mumtaz Mahal. Notice the 35-meter bulbous dome crowned by a brass lotus finial, and the four soaring minarets tilted slightly outward.',
    audioGuideHi: 'Aap khade hain vishwo-prasiddha Taj Mahal ke samne, Agra mein. Samrat Shah Jahan ne ise apni priya begum Mumtaz Mahal ki yaad mein 1632 mein banwaya tha. Is adbhut imarat ko banane mein 20,000 se zyada karigaron aur 1,000 hathiyon ne 22 saal kaam kiya. Iska Makrana marble subah gulabi, din mein chamkila safed aur purnima ki raat ko motiyon ki tarah chamakta hai. Iske chaaron minar 3 degree bahar ki taraf jhuke hue hain taaki bhukamp aane par bhi mukhya gumbad surakshit rahe.',
    interactiveChoices: [
      {
        title: 'Walk Along the Sacred Reflection Canal to the Main Plinth',
        description: 'Observe the mirror reflection of the central dome in the still water.',
        reaction: 'You walk past the fragrant cypress trees. The reflection of the white marble dome ripples across the water, revealing the mathematical precision of Mughal bilateral symmetry.'
      },
      {
        title: 'Inspect the Pietra Dura Floral Inlays at the Royal Iwan',
        description: 'Examine the semiprecious lapis lazuli and jade embedded in the white marble.',
        reaction: 'Running your fingers across the cool Makrana marble, you feel the seamless joints of the floral inlay—so precise that not even a razor blade can fit between the gems.'
      },
      {
        title: 'Ascend the Northwestern Minaret Overlooking the Yamuna River',
        description: 'Survey the misty riverbanks and the foundations of Mehtab Bagh.',
        reaction: 'From the top balcony, the view of the Yamuna River stretches across Agra. You see how the river’s water table anchors the subterranean timber foundations of the entire mausoleum.'
      }
    ]
  },
  {
    id: 'delhi-red-fort',
    era: 'delhi-fort',
    name: 'Red Fort of Delhi (Lal Qila)',
    historicalPeriod: 'Mughal Capital (1638 – 1648 AD)',
    exactCoordinates: '28.6562° N, 77.2410° E (Netaji Subhash Marg, Chandni Chowk, Old Delhi)',
    rulerOrBuilder: 'Mughal Emperor Shah Jahan & Architect Ustad Ahmad Lahori',
    civilization: 'Mughal Imperial Sovereign Citadel & Shahjahanabad',
    unescoStatus: 'UNESCO World Heritage Site (Red Fort Complex, 2007)',
    weather: 'Delhi Winter Morning Haze • 20°C • Roasted Spices & Old Delhi Aromas',
    materials: 'Chunar Red Sandstone, Pure White Marble, Gilded Ceilings, Lapis Lazuli',
    shortTagline: 'Massive Octagonal Red Sandstone Ramparts, Lahore Gate & Diwan-i-Khas Hall of Private Audience',
    architectureSummary: 'An imposing octagonal fortified palace city enclosing 254 acres, protected by 2.41 kilometers of red sandstone defensive ramparts rising 33 meters, flanked by a 10-meter deep defensive water moat connected to the Yamuna River.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80',
        title: 'Lahore Gate & Towering Red Sandstone Ramparts',
        caption: 'The colossal red sandstone gateway where the Prime Minister of India addresses the nation on Independence Day.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
        title: 'Red Sandstone Chhatris & Battlements Vista',
        caption: 'Intricate domed kiosks and crenellations along the high fortification walls of Shahjahanabad.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        title: 'Diwan-i-Khas Marble Arcades & Stream of Paradise',
        caption: 'The marble pavilion bearing Amir Khusrau’s Persian verse: If there be a paradise on earth, it is here, it is here, it is here.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1200&q=80',
        title: 'Imperial Mughal Marble Carvings',
        caption: 'Intricate marble reliefs and floral panels that adorned the private chambers of Shah Jahan.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'The Peacock Throne (Takht-i-Taus) Pedestal',
        photoUrl: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Diwan-i-Khas Imperial Dais Records',
        significance: 'Solid gold throne encrusted with rubies, emeralds, pearls, and the legendary Koh-i-Noor diamond.'
      },
      {
        name: 'Nahar-i-Bihisht (Stream of Paradise) Marble Sluices',
        photoUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Imperial Palace Hydraulic Survey',
        significance: 'A continuous flowing marble water canal that cooled the royal apartments via Yamuna river water.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Constructed by Emperor Shah Jahan when he shifted the Mughal capital from Agra to Delhi (Shahjahanabad) in 1638. Designed by Ustad Ahmad Lahori, the builder of the Taj Mahal, the fort took 10 years to complete.'
      },
      {
        title: 'Imperial Court Life & Ceremonies',
        icon: '👑',
        content: 'From the Chhatta Chowk covered bazaar to the Diwan-i-Aam (Hall of Public Audience) where the Emperor heard commoners\' petitions, the Red Fort was the pulsing nerve center of an empire spanning 150 million people.'
      },
      {
        title: 'National Heritage & Modern Legacy',
        icon: '🔍',
        content: 'From the 1857 Indian War of Independence to the annual Independence Day flag hoisting by the Prime Minister, the Red Fort stands as the ultimate architectural symbol of Indian sovereignty.'
      }
    ],
    audioGuideEn: 'Welcome to the Red Fort of Delhi, year 1648 AD. You stand before the formidable Lahore Gate, towering with red sandstone battlements. Within these walls lies the golden capital of Shahjahanabad. Follow the marble Nahar-i-Bihisht stream into the Diwan-i-Khas, where the Peacock Throne once gleamed with the Koh-i-Noor diamond.',
    audioGuideHi: 'Yeh hai Delhi ka etihasik Lal Qila, jise Samrat Shah Jahan ne 1638 se 1648 ke beech apni nayi rajdhani Shahjahanabad ke kendra ke roop mein banwaya tha. 2.4 kilometer lambi lal balua patthar ki deewarein aur Lahore Gate iski pehchan hain. Yahan Diwan-i-Khas mein Koh-i-Noor se jada vishwo-prasiddha Peacock Throne (Takht-i-Taus) rakha rehta tha.',
    interactiveChoices: [
      {
        title: 'Walk Through the Chhatta Chowk Covered Bazaar to Diwan-i-Aam',
        description: 'Experience the 17th-century vaulted arcade where royal merchants sold silk and jewels.',
        reaction: 'The vaulted ceiling echoes with merchants haggling over Kashmir silks and Golconda diamonds as you approach the imperial court.'
      },
      {
        title: 'Inspect Amir Khusrau’s Inscription at the Diwan-i-Khas',
        description: 'Read the famous gold Persian calligraphy: Gar firdaus bar roo-e zameen ast...',
        reaction: 'The golden inscription catches the sunlight across the marble canal. You stand in the exact room where Shah Jahan received foreign ambassadors.'
      },
      {
        title: 'Climb the High Ramparts of Lahore Gate Overlooking Delhi',
        description: 'Survey the bustling bazaar of Chandni Chowk from the fortress battlements.',
        reaction: 'Looking out from the ramparts, you witness the vast panorama of Old Delhi stretching from the Jama Masjid to the Yamuna riverbed.'
      }
    ]
  },
  {
    id: 'agra-fort',
    era: 'agra-fort',
    name: 'Agra Fort (Lal Qila of Agra)',
    historicalPeriod: 'Mughal Empire (1565 – 1573 AD)',
    exactCoordinates: '27.1795° N, 78.0211° E (Agra, Uttar Pradesh)',
    rulerOrBuilder: 'Emperor Akbar the Great & Emperor Shah Jahan',
    civilization: 'Mughal Imperial Military Citadel & Royal Residence',
    unescoStatus: 'UNESCO World Heritage Site (1983)',
    weather: 'Clear Afternoon Sun • 28°C • Warm Sandstone Radiance',
    materials: 'Red Sandstone from Dholpur, Pure White Marble, Semi-Precious Inlays',
    shortTagline: 'Colossal 70-Foot Red Sandstone Walls, Jahangiri Mahal & Musamman Burj Octagonal Tower',
    architectureSummary: 'A massive crescent-shaped fortress spanning 94 acres along the Yamuna River, enclosed by double red sandstone battlement walls 21 meters high, with 4 monumental gates, a 10-meter deep crocodile-infested moat, and over 500 historic palaces.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Agra Fort Colossal Red Sandstone Ramparts',
        caption: 'The sheer 70-foot high red sandstone defensive walls built by Emperor Akbar to defend the Mughal capital.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
        title: 'Jahangiri Mahal Courtyard & Carved Brackets',
        caption: 'A striking fusion of Hindu Gujarati and Islamic architectural styles built for Prince Jahangir.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
        title: 'Musamman Burj & River Yamuna Vista',
        caption: 'The octagonal marble tower offering an unobstructed direct view of the Taj Mahal across the river.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1200&q=80',
        title: 'Sheesh Mahal (Mirror Palace) Inlaid Glass Relic',
        caption: 'Syrian mirror-work tesserae that sparkled like thousands of stars when lit by a single candle.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'Hauz-i-Jahangiri (Great Bath Basin)',
        photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Carved 1610 AD from Single Block of Porphyry',
        significance: 'A colossal monolithic stone cistern 8 feet in diameter used by Emperor Jahangir for aromatic rose-water baths.'
      },
      {
        name: 'Musamman Burj Inlaid Marble Balcony',
        photoUrl: 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Imperial Residence Restoration Survey',
        significance: 'The marble pavilion where Emperor Shah Jahan spent his last 8 years in house arrest, gazing at the Taj Mahal.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Akbar’s Vision',
        icon: '🏗️',
        content: 'Erected by Emperor Akbar on the remains of the older Badalgarh brick fort. Over 4,000 stonecutters worked daily for 8 years to lay Dholpur red sandstone blocks with precision joints that resisted enemy battering rams.'
      },
      {
        title: 'Imperial Palaces & Shah Jahan’s Marble Transformation',
        icon: '👑',
        content: 'While Akbar favored rugged red sandstone, his grandson Shah Jahan replaced many brick structures with pure white Makrana marble pavilions, such as the Khas Mahal, Sheesh Mahal, and the Pearl Mosque (Moti Masjid).'
      },
      {
        title: 'Archaeological Excavations & Underground Chambers',
        icon: '🔍',
        content: 'Surveys uncovered secret subterranean escape passages, deep gunpowder magazines, and water-lifting Persian wheels (saqiya) that pumped Yamuna water into the rooftop gardens.'
      }
    ],
    audioGuideEn: 'Welcome to Agra Fort, the imperial military citadel of the Mughal Empire. Emperor Akbar rebuilt this colossal fortress in 1565 with 70-foot-high red sandstone walls. Across the courtyard sits the delicate marble tower of Musamman Burj, where Shah Jahan spent his final years gazing out across the river at the Taj Mahal.',
    audioGuideHi: 'Aap khade hain Agra ke vishal kile mein, jise Akbar ne 1565 mein banwaya tha. Iski 70 feet unchi lal patthar ki deewarein aur chaaro taraf gehri khai isise ek abhedya qila banati thi. Iske andar sthit Musamman Burj mein Shah Jahan ne apne jeevan ke aakhri 8 saal guzare the, jahan se wo Yamuna ke paar Taj Mahal ko nihara karte the.',
    interactiveChoices: [
      {
        title: 'Stand in the Musamman Burj Marble Pavilion',
        description: 'Look through the marble jali window toward the distant Taj Mahal.',
        reaction: 'A cool river breeze flows through the marble lattice. In the distance across the Yamuna, the white dome of the Taj Mahal gleams in the afternoon sun.'
      },
      {
        title: 'Enter the Sheesh Mahal (Mirror Palace) in Total Darkness',
        description: 'Light a single beeswax taper to witness the Syrian mirror mosaic.',
        reaction: 'A single flame reflects across ten thousand convex mirrors, transforming the dark ceiling into a shimmering galaxy of golden stars.'
      },
      {
        title: 'Inspect the Monolithic Cistern of Jahangir at the Courtyard',
        description: 'Examine the Persian inscriptions carved into the 8-foot porphyry stone basin.',
        reaction: 'You trace the ancient Persian verses carved into the solid rock, recording imperial victories across northern India.'
      }
    ]
  },
  {
    id: 'konark-sun-temple',
    era: 'sun-temple',
    name: 'Konark Sun Temple (Black Pagoda)',
    historicalPeriod: 'Eastern Ganga Dynasty (1250 AD)',
    exactCoordinates: '19.8876° N, 86.0945° E (Bay of Bengal Coast, Puri, Odisha)',
    rulerOrBuilder: 'King Narasimhadeva I',
    civilization: 'Kalinga Temple Architecture & Vedic Solar Tradition',
    unescoStatus: 'UNESCO World Heritage Site (1984)',
    weather: 'Coastal Ocean Breeze • 27°C • Salty Sea Mist & Chlorite Stone Aromas',
    materials: 'Khondalite Stone, Green Chlorite Relief Slabs, Magnetite Lodestones, Iron Dowels',
    shortTagline: 'Colossal 24-Wheeled Stone Chariot of Surya Drawn by 7 Galloping Horses',
    architectureSummary: 'Conceived as the cosmic chariot of the Sun God Surya, featuring 24 monumental carved stone wheels (sundials) 3 meters in diameter, pulled by 7 sculpted stone horses, oriented so the first dawn rays strike the sacred inner sanctum (Garbhagriha).',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
        title: 'Konark Sun Temple Monumental Shikhara',
        caption: 'The majestic Jagamohana assembly hall rising above the coastal sands of Odisha, dedicated to Surya.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
        title: 'The Great 24-Spoked Sun Wheel (Sundial)',
        caption: 'Masterfully carved stone wheel that accurately calculates solar time to the minute using the shadow of the central axle.',
        category: 'Relic'
      },
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        title: 'Natya Mandapa (Hall of Dance) Pillars',
        caption: 'Over 100 intricately sculpted apsaras and musicians demonstrating classical Odissi dance postures.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
        title: 'Kalinga Stone Relics & Solar Deities',
        caption: 'Chlorite stone sculptures of Surya riding his cosmic chariot across the heavens.',
        category: 'Aerial'
      }
    ],
    relics: [
      {
        name: 'The 24-Spoked Astronomical Sundial Wheel',
        photoUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Archaeological Survey of India Restoration (1906)',
        significance: 'Eight major spokes represent the eight praharas (3-hour periods) of the day; beads between spokes measure exact minutes.'
      },
      {
        name: 'Green Chlorite Stone Icon of Surya',
        photoUrl: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Garbhagriha Excavations (National Museum Collection)',
        significance: 'Carved from fine chlorite stone depicting Surya wearing knee-high boots (Udichya posture) and holding lotus blossoms.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Mathematical Wonders',
        icon: '🏗️',
        content: 'Commissioned by King Narasimhadeva I of the Eastern Ganga Dynasty around 1250 AD to celebrate his military victories. Over 1,200 master craftsmen spent 12 years quarrying khondalite stone and assembling the chariot with iron clamps and lodestone magnets.'
      },
      {
        title: 'Astronomical Precision & Scientific Sundial',
        icon: '👑',
        content: 'The 24 wheels are not merely decorative: each wheel is a functional solar chronometer. Placing a finger or stick at the center of the axle casts a shadow that reveals the exact time of day, verified against modern atomic clocks.'
      },
      {
        title: 'The Black Pagoda & Maritime Navigational History',
        icon: '🔍',
        content: 'European sailors named Konark the "Black Pagoda" because its massive magnetic shikhara served as an essential coastal navigational landmark for ships sailing the Bay of Bengal.'
      }
    ],
    audioGuideEn: 'Welcome to the Konark Sun Temple on the shores of the Bay of Bengal, year 1250 AD. King Narasimhadeva I envisioned this temple as a colossal stone chariot of Surya, the Sun God, pulled by seven spirited horses. Notice the twenty-four carved wheels, each serving as an accurate scientific sundial capable of calculating time to the exact minute.',
    audioGuideHi: 'Yeh hai Odisha ka vishwo-prasiddha Konark Surya Mandir, jise 1250 AD mein Raja Narasimhadeva I ne banwaya tha. Is mandir ko Bhagwan Surya ke vishal rath ke roop mein banaya gaya hai, jisme 24 pahiye aur 7 ghode hain. Iske patthar ke pahiye sundials hain jo suraj ki chhaya se bilkul sahi samay batate hain.',
    interactiveChoices: [
      {
        title: 'Calculate Solar Time Using the Konark Wheel Axle Shadow',
        description: 'Examine the shadow cast along the carved spokes of the sundial.',
        reaction: 'The shadow falls precisely between the third spoke and the secondary bead, registering 2:15 PM with astronomical accuracy.'
      },
      {
        title: 'Inspect the Sculptures of the Natya Mandapa (Hall of Dance)',
        description: 'Review the 128 stone dance postures (karanas) of classical Odissi.',
        reaction: 'The chlorite carvings come alive in the coastal light, capturing musicians playing mridanga drums and cymbals in honor of Surya.'
      },
      {
        title: 'Walk to the Seafront Dune Overlooking the Bay of Bengal',
        description: 'Observe where ancient merchant ships navigated using the temple pinnacle.',
        reaction: 'The salt sea breeze whips across the sands as you view the historic maritime coastline where Kalinga ships set sail for Java and Bali.'
      }
    ]
  },
  {
    id: 'giza-ancient-egypt',
    era: 'ancient-egypt',
    name: 'The Great Pyramid of Giza & Sphinx',
    historicalPeriod: 'Ancient Egypt (1340 BCE – 18th Dynasty)',
    exactCoordinates: '29.97° N, 31.13° E (Giza Plateau, Memphis Necropolis)',
    rulerOrBuilder: 'Pharaoh Khufu & Pharaoh Khafre',
    civilization: 'Ancient Egyptian Pharaonic Empire',
    unescoStatus: 'UNESCO World Heritage Site (Memphis & its Necropolis)',
    weather: 'Arid Sahara Desert Sun • 38°C • Khamsin Wind & Sand Haze',
    materials: 'Tura White Limestone, Aswan Red Granite, Electrum Gold Alloy',
    shortTagline: 'Limestone Monolith Crowned by the Golden Electrum Pyramidion & Sphinx',
    architectureSummary: 'Constructed from 2.3 million limestone blocks averaging 2.5 tons each, oriented to true cardinal north with precision within four minutes of arc, crowned by a gold-silver electrum apex capstone.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
        title: 'Great Pyramids of Giza at Sunset',
        caption: 'The majestic limestone monuments of Khufu and Khafre rising above the golden sands of the Sahara.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
        title: 'Karnak Hypostyle Hall of 134 Pillars',
        caption: 'Colossal stone lotus columns reaching 21 meters into the Egyptian sky, etched with vivid hieroglyphic prayers.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
        title: 'The Great Sphinx of Giza Close-Up',
        caption: 'Carved directly from living limestone bedrock, representing Pharaoh Khafre with the body of a crouching lion.',
        category: 'Relic'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        title: 'Golden Treasures & Sacred Hieroglyphs',
        caption: 'Fine gold foil, lapis lazuli inlays, and funerary stelae preserved across 3,300 years of desert history.',
        category: 'Aerial'
      }
    ],
    relics: [
      {
        name: 'The Dream Stele of Thutmose IV',
        photoUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Rediscovered 1818 by Giovanni Caviglia',
        significance: 'Granite slab between the Sphinx paws recording prince Thutmose clearing desert sand in exchange for the crown of Egypt.'
      },
      {
        name: 'Electrum Pyramidion Capstone of the Sun Temple',
        photoUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Dahshur / Memphis Archaeological Surveys',
        significance: 'Polished gold-silver alloy apex block engineered to catch the very first rays of Ra at sunrise across the Nile valley.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Engineered under the vizier Hemiunu over 20 to 27 years. Workers used copper chisels, dolerite hammerstones, and water-lubricated sledges to transport limestone blocks across the Nile from Tura quarries.'
      },
      {
        title: 'Golden Age & Daily Life',
        icon: '👑',
        content: 'Pyramid builders were skilled artisans, masons, and well-nourished seasonal farmers who took tremendous civic pride in erecting the eternal staircase for their Pharaoh.'
      },
      {
        title: 'Archaeological Excavations & Modern Findings',
        icon: '🔍',
        content: 'The 2017 ScanPyramids muon tomography project detected a massive 30-meter hidden void above the Grand Gallery, proving that the Great Pyramid still conceals internal architectural secrets.'
      }
    ],
    audioGuideEn: 'You stand before the Great Pyramid of Giza in 1340 BCE, during Egypt\'s glorious New Kingdom. Golden desert sand ripples across the causeway. Towering before you is the immense limestone monument, capped by the radiant golden pyramidion.',
    audioGuideHi: 'Aap khade hain Giza ke Maha Pyramid ke samne, 1340 BCE ke Prachin Misr mein. Yeh vishal pyramid 23 lakh limestone blocks se bana hai aur iske shikhara par laga swarn electrum capstone suraj ki pehli kiran ko chamkata hai.',
    interactiveChoices: [
      {
        title: 'Align the Golden Electrum Pyramidion Capstone',
        description: 'Ascend the solar dais and synchronize the apex capstone with Sirius.',
        reaction: 'The capstone flares with blinding solar radiance. The celestial disc aligns perfectly with the constellation of Orion, anchoring timeline stability.'
      },
      {
        title: 'Decipher the Hieroglyphic Stelae between the Sphinx Paws',
        description: 'Read the ancient Dream Stele carved from monumental granite.',
        reaction: 'The ancient glyphs glow with azure luminescence, revealing the prophecy: time is not a straight line, but an eternal sacred loop.'
      },
      {
        title: 'Enter the Sunken Inner Sarcophagus Chamber',
        description: 'Explore the grand granite gallery deep inside the pyramid core.',
        reaction: 'Cool air envelops you as you enter the King\'s Chamber. The acoustics amplify your heartbeat against the thousand-ton granite ceiling beams.'
      }
    ]
  },
  {
    id: 'colosseum-roman-empire',
    era: 'roman-empire',
    name: 'The Colosseum & Imperial Roman Forum',
    historicalPeriod: 'Imperial Rome (80 AD – Flavian Dynasty)',
    exactCoordinates: '41.89° N, 12.49° E (Piazza del Colosseo, Rome)',
    rulerOrBuilder: 'Emperor Vespasian & Emperor Titus',
    civilization: 'Roman Empire (Pax Romana)',
    unescoStatus: 'UNESCO World Heritage Site (Historic Centre of Rome)',
    weather: 'Mediterranean Twilight • 24°C • Cypress Breeze & Marble Dust',
    materials: 'Travertine Limestone, Tufa Rock, Roman Pozzolana Concrete, Marble',
    shortTagline: 'Four-Tiered Flavian Amphitheatre & Subterranean Gladiatorial Hypogeum',
    architectureSummary: 'An engineering marvel capable of seating 50,000 spectators, built with 80 arched entrances, Roman hydraulic vaults, retractable fabric sunscreens (velarium), and a two-story underground hypogeum with mechanical elevator lifts.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
        title: 'The Roman Colosseum at Twilight',
        caption: 'The majestic exterior arches of travertine stone illuminated against the Mediterranean night sky.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1200&q=80',
        title: 'Imperial Roman Forum & Triumphal Arches',
        caption: 'The civic and religious heart of the Roman Empire, surrounded by marble senate basilicas and temples.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?auto=format&fit=crop&w=1200&q=80',
        title: 'Subterranean Hypogeum & Arena Level',
        caption: 'The underground network of tunnels, holding pens, and winch-driven lifts that raised gladiators and beasts onto the arena sand.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80',
        title: 'Classical Roman Corinthian Capitals',
        caption: 'Intricately sculpted marble capitals that adorned the imperial emperor podium and temples.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'Gladiator Bronze Murmillo Helmet',
        photoUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Excavated at Pompeii Gladiatorial Barracks',
        significance: 'Heavy bronze crested helmet with lattice eye-guard and engraved relief depicting victory trophies of Rome.'
      },
      {
        name: 'Flavian Imperial Coin of Titus (80 AD)',
        photoUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Rome Capitoline Museum Collections',
        significance: 'Sestertius coin struck to commemorate the 100-day inaugural games of the Amphitheatrum Flavium.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Commissioned by Emperor Vespasian in 72 AD on the site of Nero’s artificial Golden House lake. Completed by his son Titus in 80 AD, it consumed over 100,000 cubic meters of travertine set with 300 tons of iron clamps.'
      },
      {
        title: 'Golden Age & Daily Life',
        icon: '👑',
        content: 'Spectators entered through numbered arches matching their terracotta tokens. Seating was strictly stratified by social class, and the arena could be flooded for naval mock sea battles.'
      },
      {
        title: 'Archaeological Excavations & Modern Findings',
        icon: '🔍',
        content: 'Excavations stripped centuries of debris from the arena floor, revealing the full complexity of the hypogeum tunnels, hydraulic conduits, and exotic animal bones.'
      }
    ],
    audioGuideEn: 'Welcome to the Colosseum in Rome, year 80 AD. The Mediterranean sun warms the grand travertine arches. Fifty thousand Roman citizens roar as trumpets sound the arrival of Emperor Titus at the royal imperial box.',
    audioGuideHi: 'Aap khade hain Rome ke vishal Colosseum mein, 80 AD ke daur mein. Samrat Titus ke samay is stadium mein 50,000 log ek sath baithkar gladiators ke yudh dekhte the. Iske neeche hypogeum namak do-manzila surang system tha.',
    interactiveChoices: [
      {
        title: 'Signal the Emperor from the Imperial Pulvinar Box',
        description: 'Stand with the imperial guard and deliver the royal verdict.',
        reaction: 'The crowd falls silent as your hand gestures toward the arena floor. Fifty thousand voices echo your imperial judgment across the Forum.'
      },
      {
        title: 'Descend into the Subterranean Hypogeum Labyrinth',
        description: 'Inspect the wooden winch pulleys and gladiator armory.',
        reaction: 'Torches flicker against damp travertine walls. You hear the deep growl of lions as counterweighted ropes prepare to elevate the cage to the sand.'
      },
      {
        title: 'Order the Deployment of the Imperial Velarium Awning',
        description: 'Command the Roman sailors from Misenum to unfurl the sun canopy.',
        reaction: 'Sailors pull the perimeter rigging in unison. The vast linen awning billows overhead, casting cooling crimson shade across the entire arena.'
      }
    ]
  },
  {
    id: 'ravenhold-medieval-kingdom',
    era: 'medieval-kingdom',
    name: 'Ravenhold & Mont-Saint-Michel',
    historicalPeriod: 'Medieval Europe (1190 AD – Third Crusade Era)',
    exactCoordinates: '48.63° N, 1.51° W (High Tidal Bluff & Normandy Bay)',
    rulerOrBuilder: 'King Philip II & King Richard the Lionheart',
    civilization: 'High Gothic & Norman Chivalric Era',
    unescoStatus: 'UNESCO World Heritage Site (Mont-Saint-Michel & its Bay)',
    weather: 'North Sea Rain Mist • 14°C • Crackling Pine Wall Torches',
    materials: 'High Granite Bedrock, Hand-Hewn Limestone Blocks, Heavy Oak, Forged Iron',
    shortTagline: 'Concentric Stone Donjon Keep, Crenellated Ramparts & Iron Portcullis',
    architectureSummary: 'An impregnable high stone fortress constructed on sheer natural bedrock cliffs, featuring a four-towered central donjon (keep), arrow loops, machicolations for boiling oil, and heavy iron portcullises that withstood decade-long sieges.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        title: 'High Cliff Fortress at Evening Mist',
        caption: 'The dramatic stone walls and towers rising above the misty river valley and defensive bedrock bluff.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?auto=format&fit=crop&w=1200&q=80',
        title: 'Gothic Castle Ramparts & Watchtowers',
        caption: 'Impregnable stone curtain walls engineered to deflect trebuchet counterweights and battering rams.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80',
        title: 'Fortified Gatehouse & Iron Portcullis',
        caption: 'Heavy oak timber doors reinforced with forged iron studs and double descending portcullis grates.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        title: 'Chivalric Knight Armor & Heraldry',
        caption: 'Master-forged chainmail, heraldic knight shields, and high medieval steel broadswords.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'Norman Forged Iron Portcullis Spikes',
        photoUrl: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Excavated 1874 by French Archaeological Service',
        significance: 'Heavy hand-forged wrought iron portcullis teeth designed to seal the gatehouse against cavalry charges.'
      },
      {
        name: 'Crusader Steel Broadsword with Pommel Inscription',
        photoUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Rhine Valley Bedrock River Excavations',
        significance: 'Pattern-welded carbon steel knight blade inscribed with royal benedictions and family coat of arms.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Engineered as a concentric fortification where each inner line of defense sits higher than the outer curtain wall, providing archers unobstructed field of fire.'
      },
      {
        title: 'Golden Age & Daily Life',
        icon: '👑',
        content: 'During wartime, the citadel became a self-sustaining ecosystem housing blacksmiths, armorers, bowyers, and a deep cistern well carved into bedrock.'
      },
      {
        title: 'Archaeological Excavations & Modern Findings',
        icon: '🔍',
        content: 'Excavations uncovered hidden sally-port escape tunnels, underground granaries, and thousands of forged crossbow bolt tips.'
      }
    ],
    audioGuideEn: 'Welcome to Ravenhold Citadel, year 1190 AD. Smoke and torchlight fill the misty evening air. The massive stone keep towers above the rocky river bluff, flanked by four round defensive bastions with crenellated parapets.',
    audioGuideHi: 'Aap khade hain Ravenhold ke madhyakalin kile mein, 1190 AD mein. Yeh kila pahadon par chatanon ke upar banaya gaya tha taaki dushman ki tofein aur sappers iski surang na bana sakein.',
    interactiveChoices: [
      {
        title: 'Command the Rampart Archers from the High Turret',
        description: 'Direct flaming arrow volleys against approaching siege engines.',
        reaction: 'Archers loose a synchronized volley into the mist. Flaming arrows strike the enemy siege towers, repelling the outer assault.'
      },
      {
        title: 'Reinforce the Lower Iron Portcullis Gatehouse',
        description: 'Inspect the heavy oak and iron portcullis protecting the inner bailey.',
        reaction: 'The heavy portcullis drops with a thunderous clatter into stone grooves, locking the citadel secure against all external breach.'
      },
      {
        title: 'Consult the War Council in the Lord\'s Great Hall',
        description: 'Review parchment tactical maps before the King and royal captains.',
        reaction: 'The royal captains raise their goblets. Your strategic foresight secures royal favor and rallies the garrison to full combat readiness.'
      }
    ]
  },
  {
    id: 'kyoto-feudal-japan',
    era: 'feudal-japan',
    name: 'Kyoto Ginkaku-ji & Samurai Mahal',
    historicalPeriod: 'Feudal Japan (1482 AD – Muromachi Era)',
    exactCoordinates: '35.02° N, 135.79° E (Higashiyama, Kyoto)',
    rulerOrBuilder: 'Shogun Ashikaga Yoshimasa',
    civilization: 'Muromachi Shogunate & Higashiyama Zen Culture',
    unescoStatus: 'UNESCO World Heritage Site (Historic Monuments of Ancient Kyoto)',
    weather: 'Mountain Morning Mist • 18°C • Drifting Cherry Blossoms (Sakura)',
    materials: 'Hinoki Japanese Cypress, Cedar Timber, Bark Shingles, Granite Cobbles',
    shortTagline: 'Two-Tiered Zen Wooden Pavilion, Sacred Koi Pond & Sand Garden (Ginshadan)',
    architectureSummary: 'An exquisite masterpiece of Japanese Zen architecture (Shoin-zukuri style) featuring sliding washi-paper fusuma doors, tatami-matted tea ceremony chambers, curved pagoda eaves, and an ethereal reflecting pond framed by weeping cherry blossoms.',
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
        title: 'Kyoto Pagoda Framed by Spring Cherry Blossoms',
        caption: 'Traditional curved timber eaves and five-storied pagoda rising amidst pastel pink sakura in Kyoto.',
        category: 'Exterior'
      },
      {
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
        title: 'Zen Water Pavilion & Reflective Koi Pond',
        caption: 'The serene reflection of the wooden pavilion across the moss-bordered garden pond.',
        category: 'Interior'
      },
      {
        url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1200&q=80',
        title: 'Bamboo Grove & Stone Lantern Sanctuary',
        caption: 'Lush green Arashiyama bamboo path with centuries-old weathered stone Toro lanterns.',
        category: 'Aerial'
      },
      {
        url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1200&q=80',
        title: 'Samurai Armor & Master-Forged Katana',
        caption: 'Lacquered iron samurai cuirass, horned kabuto helmet, and hand-folded tamahagane steel blade.',
        category: 'Relic'
      }
    ],
    relics: [
      {
        name: 'Master-Forged Tamahagane Katana (Muramasa Lineage)',
        photoUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Kyoto Imperial Shogunate Armory',
        significance: 'High-carbon tatara steel folded over twenty times to achieve razor sharpness and a wavy hamon temper line.'
      },
      {
        name: 'Raku-ware Black Glaze Tea Bowl (Chawan)',
        photoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
        discoveryDate: 'Higashiyama Sen no Rikyu Tea Master Collections',
        significance: 'Hand-molded earthenware embodying wabi-sabi—the sublime beauty found in imperfection and transience.'
      }
    ],
    historyChapters: [
      {
        title: 'Origin, Construction & Architecture',
        icon: '🏗️',
        content: 'Constructed by Shogun Ashikaga Yoshimasa as a mountain retreat from the destructive Onin War, crowned by a bronze phoenix finial facing east.'
      },
      {
        title: 'Golden Age & Daily Life',
        icon: '👑',
        content: 'The Higashiyama villa was the birthplace of quintessential Japanese culture: the formal Tea Ceremony (Chado), Noh theatre drama, and flower arranging (Ikebana).'
      },
      {
        title: 'Archaeological Excavations & Modern Findings',
        icon: '🔍',
        content: 'Scientific dendrochronological analysis of the Hinoki timbers confirmed their harvest between 1480 and 1482.'
      }
    ],
    audioGuideEn: 'Welcome to Kyoto\'s Ginkaku-ji temple and the Higashiyama sanctuary, year 1482 AD. Gentle morning mist curls around the wooden pagoda eaves as pink cherry blossom petals drift into the still koi pond.',
    audioGuideHi: 'Kyoto ke Ginkaku-ji aur samurai mahal mein aapka swagat hai, 1482 AD mein. Hinoki lakdi aur Zen kala se bana yeh pavitra mandir reflective pond ke kinare sthit hai. Charo taraf gulabi sakura ke phool gir rahe hain.',
    interactiveChoices: [
      {
        title: 'Participate in the Wabi-Sabi Zen Tea Ceremony',
        description: 'Sit with the grandmaster in the Dojinsai room and prepare matcha.',
        reaction: 'The tea master whisks the vibrant green matcha into jade froth. The silence of the garden fills your senses, bringing profound inner harmony to the timeline.'
      },
      {
        title: 'Cross the Moon Bridge to Inspect the Sand Garden (Ginshadan)',
        description: 'Walk across the wooden Taiko-bashi bridge over the sacred koi pond.',
        reaction: 'Your steps echo softly on the cedar planks. The raked silver sand reflects the moonlit sky with geometric perfection, channeling cosmic stillness.'
      },
      {
        title: 'Consult the Shogunate Hatamoto Guard at the Red Torii',
        description: 'Review the military dispatches concerning clan skirmishes in Yamashiro.',
        reaction: 'The samurai bows with solemn respect, swearing his clan\'s ironclad allegiance to defend the sanctuary against all rival warlords.'
      }
    ]
  }
];

export function Monument3DExplorer() {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | 'gallery' | 'history'>('3d');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('orbit');
  const [audioLanguage, setAudioLanguage] = useState<'hi' | 'en'>('hi');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlayAudio, setAutoPlayAudio] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState<string>('');
  const [discoveredLore, setDiscoveredLore] = useState<{ title: string; text: string } | null>(null);
  const [decisionFeedback, setDecisionFeedback] = useState<string | null>(null);

  const location = MONUMENT_LOCATIONS[selectedLocationIndex];
  const activePhoto = location.photos[selectedPhotoIndex] || location.photos[0];
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // Stop Audio Tour
  const stopAudioTour = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);
    setIsSpeaking(false);
    setActiveSubtitle('');
  }, []);

  // Start / Toggle Non-stop Audio Guide playback
  const startAudioTour = useCallback((textToSpeak?: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    const fullText = textToSpeak || (audioLanguage === 'hi' ? location.audioGuideHi : location.audioGuideEn);
    const sentences = fullText
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (sentences.length === 0) return;

    setIsSpeaking(true);
    let index = 0;

    heartbeatRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 5000);

    const speakNext = () => {
      if (index >= sentences.length) {
        setIsSpeaking(false);
        setActiveSubtitle('');
        if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        return;
      }

      const sentence = sentences[index];
      index++;
      setActiveSubtitle(sentence);

      const utterance = new SpeechSynthesisUtterance(sentence);
      utterance.volume = 1.0;
      utterance.rate = audioLanguage === 'hi' ? 1.05 : 1.15;

      const voices = window.speechSynthesis.getVoices();
      if (audioLanguage === 'hi') {
        const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.includes('Hindi') || v.name.includes('India'));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const natural = voices.find(
          v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Guy'))
        );
        if (natural) utterance.voice = natural;
      }

      utterance.onend = () => speakNext();
      utterance.onerror = () => speakNext();

      (window as any).__tourUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  }, [audioLanguage, location]);

  const toggleAudioTour = useCallback(() => {
    if (isSpeaking) {
      stopAudioTour();
    } else {
      startAudioTour();
    }
  }, [isSpeaking, stopAudioTour, startAudioTour]);

  const handleSelectLocation = (idx: number) => {
    stopAudioTour();
    setDiscoveredLore(null);
    setDecisionFeedback(null);
    setSelectedPhotoIndex(0);
    setSelectedLocationIndex(idx);

    const nextLoc = MONUMENT_LOCATIONS[idx];
    if (autoPlayAudio) {
      setTimeout(() => {
        const text = audioLanguage === 'hi' ? nextLoc.audioGuideHi : nextLoc.audioGuideEn;
        startAudioTour(text);
      }, 400);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 select-none">
      {/* SECTION HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-950/40 px-4 py-1.5 text-xs font-mono text-cyan-300 shadow-glow-cyan">
          <Globe className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
          <span>🌐 BILKUL ASLI 3D 360° ORBIT & REAL HISTORICAL GEOGRAPHY</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          3D 360° Real Monument & Geography.{' '}
          <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
            Screen Round Karke Dekhein Har Taraf Se.
          </span>
        </h2>
        <p className="max-w-3xl mx-auto text-xs sm:text-sm text-gray-300">
          Taj Mahal (Yamuna riverfront, West Mosque & Charbagh cypress garden), Delhi Lal Qila (Lahore Gate & moat), Agra Fort (Musamman Burj), aur Konark Surya Mandir (24 sundial wheels & beach)—ab mouse ya touch se screen 360° round karke ghumayein!
        </p>
      </div>

      {/* 8 HISTORICAL LOCATIONS TABS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {MONUMENT_LOCATIONS.map((loc, idx) => {
          const isSelected = selectedLocationIndex === idx;
          return (
            <button
              key={loc.id}
              onClick={() => handleSelectLocation(idx)}
              className={`text-left rounded-2xl border p-2.5 transition-all flex flex-col justify-between space-y-2 cursor-pointer ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/80 shadow-glow-cyan text-white scale-[1.04] ring-2 ring-cyan-400/50'
                  : 'border-white/10 bg-black/60 text-gray-400 hover:border-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                <img src={loc.photos[0].url} alt={loc.name} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300 font-bold">
                  {loc.historicalPeriod.split('(')[0]}
                </span>
                {isSelected && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>

              <div>
                <h4 className="font-display text-xs font-bold text-white line-clamp-1">{loc.name}</h4>
                <p className="text-[10px] text-amber-300 line-clamp-1">{loc.civilization}</p>
              </div>

              <div className="text-[9px] font-mono font-bold flex items-center gap-1 text-cyan-400">
                <span>{isSelected ? '✓ VIEWING' : 'OPEN 360°'}</span>
                <ArrowRight className="h-2.5 w-2.5" />
              </div>
            </button>
          );
        })}
      </div>

      {/* MAIN INTERACTIVE CONTAINER */}
      <div className="rounded-3xl border-2 border-cyan-500/40 bg-[#040714] p-4 sm:p-6 shadow-2xl space-y-5">
        {/* TOP CONTROL & ENVIRONMENT TELEMETRY BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse shadow-glow-cyan" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display text-base sm:text-lg font-black text-white">
                  {location.name}
                </span>
                <Badge variant="cyan">{location.historicalPeriod}</Badge>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono text-gray-400 flex-wrap mt-0.5">
                <span className="flex items-center gap-1 text-cyan-300">
                  <MapPin className="h-3 w-3 text-cyan-400" />
                  <span>{location.exactCoordinates}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Crown className="h-3 w-3 text-amber-400" />
                  <span>{location.rulerOrBuilder}</span>
                </span>
              </div>
            </div>
          </div>

          {/* VIEW SWITCHER & AUDIO TOUR BUTTONS */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-white/15 bg-black/70 p-1">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-glow-cyan font-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
                <span>🏛️ 3D 360° World Orbit</span>
              </button>

              <button
                onClick={() => setViewMode('gallery')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'gallery'
                    ? 'bg-purple-600 text-white shadow-glow-purple'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Camera className="h-3.5 w-3.5" />
                <span>📸 Real Photos ({location.photos.length})</span>
              </button>

              <button
                onClick={() => setViewMode('history')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                  viewMode === 'history'
                    ? 'bg-amber-500 text-black shadow-glow-cyan font-bold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>📜 Full History</span>
              </button>
            </div>

            {/* Language Selector for Audio Guide */}
            <div className="flex items-center rounded-xl border border-white/15 bg-black/70 p-1">
              <button
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setAudioLanguage('hi');
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  audioLanguage === 'hi' ? 'bg-amber-500/30 text-amber-300 font-bold' : 'text-gray-400 hover:text-white'
                }`}
                title="Hindi / Hinglish Audio Guide"
              >
                🇮🇳 Hindi
              </button>
              <button
                onClick={() => {
                  if (isSpeaking) window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setAudioLanguage('en');
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                  audioLanguage === 'en' ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="English Documentary Narration"
              >
                🇬🇧 English
              </button>
            </div>

            {/* Audio Tour Speaker Button */}
            <button
              onClick={toggleAudioTour}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-md cursor-pointer ${
                isSpeaking
                  ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-glow-purple'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white hover:brightness-110 shadow-glow-cyan'
              }`}
              title="Spoken audio tour of this place"
            >
              {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              <span>{isSpeaking ? 'Stop Audio' : `🔊 Suniye Is Jagah Ki History (${audioLanguage === 'hi' ? 'Hindi' : 'English'})`}</span>
            </button>
          </div>
        </div>

        {/* ACTIVE SPOKEN HISTORY BANNER & REAL-TIME AUDIO CONTROLS */}
        <div className={`p-3 rounded-2xl border transition-all ${
          isSpeaking 
            ? 'border-cyan-400 bg-cyan-950/70 shadow-glow-cyan' 
            : 'border-white/10 bg-black/60'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {isSpeaking ? (
                <div className="flex items-center gap-1 h-4">
                  <span className="w-1 bg-cyan-400 rounded-full animate-pulse h-3" />
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" />
                  <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2.5" />
                  <span className="w-1 bg-pink-400 rounded-full animate-bounce h-3.5" />
                </div>
              ) : (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              )}
              <span className="text-xs font-mono font-bold text-white">
                {isSpeaking ? '🎙️ ABHI BOL RAHI HAI ITIHASIK NARRATION:' : '🔊 AUDIO GUIDE (SPREECH NARRATION):'}
              </span>
              <span className="text-xs font-bold text-amber-300">
                {location.name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAutoPlayAudio(!autoPlayAudio)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-bold transition cursor-pointer ${
                  autoPlayAudio ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/50' : 'bg-white/10 text-gray-400'
                }`}
                title="Automatically speak history when switching monuments"
              >
                {autoPlayAudio ? '✓ Auto-Play on Select: ON' : 'Auto-Play: OFF'}
              </button>

              <button
                onClick={toggleAudioTour}
                className="rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-400 px-3 py-1 text-xs font-bold text-black shadow-glow-cyan cursor-pointer"
              >
                {isSpeaking ? '⏸ Pause Narration' : '▶ Play Full History'}
              </button>
            </div>
          </div>

          {activeSubtitle && (
            <div className="mt-2 pt-2 border-t border-white/10 text-xs sm:text-sm font-semibold text-cyan-200">
              "{activeSubtitle}"
            </div>
          )}
        </div>

        {/* LIVE ENVIRONMENT HUD BADGES */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl border border-white/10 bg-black/50 text-xs font-mono">
          <div className="flex items-center gap-2 text-gray-300">
            <Thermometer className="h-4 w-4 text-rose-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Weather & Atmosphere:</span>
              <span className="font-bold text-white text-[11px]">{location.weather}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Layers className="h-4 w-4 text-cyan-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Primary Materials:</span>
              <span className="font-bold text-cyan-300 text-[11px] line-clamp-1">{location.materials}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Crown className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">Civilization & Dynasty:</span>
              <span className="font-bold text-amber-300 text-[11px] line-clamp-1">{location.civilization}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Shield className="h-4 w-4 text-emerald-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] text-gray-400 block uppercase">World Heritage Status:</span>
              <span className="font-bold text-emerald-300 text-[11px] line-clamp-1">{location.unescoStatus}</span>
            </div>
          </div>
        </div>

        {/* VIEWPORT AREA: 360° ASLI VR CANVAS */}
        {viewMode === '3d' && (
          <div className="relative w-full aspect-[21/9] min-h-[520px] max-h-[740px] rounded-2xl overflow-hidden border border-cyan-500/40 bg-black">
            <VirtualWorldCanvas
              era={location.era}
              quality="high"
              cameraMode={cameraMode}
              onCameraModeChange={setCameraMode}
              isAudioSpeaking={isSpeaking}
              onInteractObject={(name, lore) => setDiscoveredLore({ title: name, text: lore })}
              photosphereUrl={location.photos[0].url}
              initialRenderMode="street-view"
            />

            {/* Live Karaoke Subtitles */}
            {activeSubtitle && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 max-w-2xl w-full px-4 text-center pointer-events-none animate-in fade-in">
                <div className="inline-block rounded-2xl border border-cyan-400/50 bg-black/90 px-6 py-2.5 backdrop-blur-xl shadow-glow-cyan">
                  <p className="font-display text-xs sm:text-sm font-bold text-white tracking-wide">
                    "{activeSubtitle}"
                  </p>
                </div>
              </div>
            )}

            {/* Discovered In-World Lore Modal */}
            {discoveredLore && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full px-4 animate-in fade-in slide-in-from-bottom-3">
                <div className="rounded-2xl border border-cyan-400 bg-black/95 p-4 backdrop-blur-2xl shadow-glow-cyan space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-cyan-400" />
                      <span className="font-display text-sm font-bold text-white uppercase">{discoveredLore.title}</span>
                    </div>
                    <button onClick={() => setDiscoveredLore(null)} className="text-xs text-gray-400 hover:text-white cursor-pointer">✕ Close</button>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">{discoveredLore.text}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'gallery' && (
          <div className="space-y-4">
            <div className="relative w-full aspect-[21/9] min-h-[460px] max-h-[660px] rounded-2xl overflow-hidden border border-purple-500/40 bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="h-full w-full object-cover transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 max-w-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="purple">{activePhoto.category}</Badge>
                  <span className="text-xs font-mono text-cyan-300">Photo {selectedPhotoIndex + 1} of {location.photos.length}</span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-bold text-white">{activePhoto.title}</h3>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 leading-relaxed">{activePhoto.caption}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {location.photos.map((p, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => setSelectedPhotoIndex(pIdx)}
                  className={`text-left rounded-xl border p-2 transition flex items-center gap-3 cursor-pointer ${
                    selectedPhotoIndex === pIdx
                      ? 'border-purple-400 bg-purple-950/60 shadow-glow-purple scale-[1.02]'
                      : 'border-white/10 bg-black/60 hover:border-white/30'
                  }`}
                >
                  <div className="h-14 w-18 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                    <img src={p.url} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono text-purple-300 block uppercase font-bold">{p.category}</span>
                    <h5 className="text-xs font-bold text-white truncate">{p.title}</h5>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {viewMode === 'history' && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-amber-500/30 bg-black/60 p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <BookOpen className="h-6 w-6 text-amber-400" />
                <div>
                  <h3 className="font-display text-xl font-bold text-white">
                    Historical Dossier & Architectural Chronicles: {location.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Compiled from Archaeological Surveys, Inscriptions & Historical Treatises
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {location.historyChapters.map((ch, cIdx) => (
                  <div key={cIdx} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{ch.icon}</span>
                      <h4 className="font-display text-sm font-bold text-white">{ch.title}</h4>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{ch.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MASTER ARCHAEOLOGICAL RELICS & INTERACTIVE TIMELINE CHOICES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* Left: Master Relics & Excavated Artifacts (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/60 p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h4 className="font-display text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                  Excavated Relics at this Location:
                </h4>
              </div>

              <div className="space-y-3">
                {location.relics.map((relic, rIdx) => (
                  <div key={rIdx} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex gap-3 items-center">
                    <div className="h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 bg-black border border-white/10">
                      <img src={relic.photoUrl} alt={relic.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white">{relic.name}</h5>
                      <span className="text-[10px] font-mono text-amber-400 block">{relic.discoveryDate}</span>
                      <p className="text-[11px] text-gray-300 leading-snug">{relic.significance}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1">
                  Architectural Summary:
                </span>
                <p className="text-xs text-gray-300 leading-relaxed">{location.architectureSummary}</p>
              </div>
            </div>
          </div>

          {/* Right: Interactive Timeline Decisions at this Location (Col 7) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400" />
                <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">
                  Interactive Story Choices at this Place:
                </h3>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Click any historical action to simulate what happened at this exact location:
            </p>

            <div className="space-y-2.5">
              {location.interactiveChoices.map((choice, cIdx) => (
                <button
                  key={cIdx}
                  onClick={() => {
                    setDecisionFeedback(choice.reaction);
                    startAudioTour(choice.reaction);
                  }}
                  className="w-full text-left rounded-xl border border-white/10 bg-white/[0.03] p-3.5 hover:border-cyan-400 hover:bg-cyan-950/40 transition group space-y-1 cursor-pointer"
                >
                  <div className="font-display text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md bg-purple-600/40 border border-purple-500/50 flex items-center justify-center text-[11px] font-mono text-purple-300 font-bold">
                      {cIdx + 1}
                    </span>
                    <span>{choice.title}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 pl-7">{choice.description}</p>
                </button>
              ))}
            </div>

            {decisionFeedback && (
              <div className="rounded-xl border border-cyan-400/60 bg-cyan-950/50 p-4 space-y-1 shadow-glow-cyan animate-in fade-in">
                <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest block font-bold">
                  ✓ Timeline Consequence:
                </span>
                <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                  "{decisionFeedback}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
