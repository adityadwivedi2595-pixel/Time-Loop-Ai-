'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { speakHeritageText, stopUniversalAudio } from '@/lib/heritage-voice';
import { INDIAN_MONUMENTS_DATABASE } from '@/data/indian-monuments';
import { getMonumentSpecs } from '@/data/heritage-specs-data';
import { 
  Sparkles, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  ExternalLink, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Wind, 
  Cpu, 
  Droplets,
  X
} from 'lucide-react';

export interface PresentationSlideData {
  id: string;
  slideNumber: string;
  title: string;
  titleHi: string;
  subtitle: string;
  subtitleHi: string;
  image: string;
  monumentId: string;
  cards: {
    metric: string;
    textEn: string;
    textHi: string;
    spokenTextEn: string;
    spokenTextHi: string;
  }[];
}

export const PRESENTATION_SLIDES: PresentationSlideData[] = [
  {
    id: 'slide-05',
    slideNumber: '05',
    title: 'SUBTERRANEAN SECRETS & ANCIENT FOUNDATIONS',
    titleHi: 'नींव के भूमिगत रहस्य व प्राचीन इंजीनियरिंग',
    subtitle: 'Subterranean Cutaway: Timber Wells, Geothermal Stepwells & Escape Corridors',
    subtitleHi: 'भूमिगत कट-सेक्शन: काष्ठ कुएं, भूतापीय शीतलन बावड़ियां व गुप्त सुरंगे',
    image: '/images/slides/slide-05-subterranean-cutaway.jpg',
    monumentId: 'taj-mahal',
    cards: [
      {
        metric: '180 WELLS',
        textEn: 'Ebony + Sal timber foundations depend on Yamuna moisture.',
        textHi: 'आबनूस व साल की लकड़ी से बने 180 गहरे कुएं यमुना की नमी पर निर्भर हैं।',
        spokenTextEn: '180 Wells. Ebony and Sal timber foundations depend on continuous Yamuna river moisture to retain stone-like rigidity.',
        spokenTextHi: '180 साल की लकड़ी के कुएं। यमुना के दलदली किनारे पर एक लाख टन भारी संगमरमर को टिकाने के लिए इंजीनियरों ने ज़मीन में गहरे कुएं खोदे और उन्हें साल की लकड़ी से भरा।'
      },
      {
        metric: '-10°C',
        textEn: 'Rani ki Vav and Chand Baori create passive cooling + storage.',
        textHi: 'रानी की वाव और चाँद बावड़ी प्राकृतिक वातानुकूलन व जल संचयन करती हैं।',
        spokenTextEn: 'Minus ten degrees Celsius. Stepwells like Rani ki Vav and Chand Baori utilize multi-tiered subterranean strata for passive geothermal cooling and reservoir storage.',
        spokenTextHi: 'माइनस 10 डिग्री सेल्सियस। रानी की वाव और चाँद बावड़ी जैसी बहुमंजिला बावड़ियां गर्मियों में ज़मीन के नीचे तापमान को 10 डिग्री तक ठंडा बनाए रखती हैं।'
      },
      {
        metric: 'ESCAPE ROUTES',
        textEn: 'Agra, Daulatabad and Jhansi forts concealed royal evacuation tunnels.',
        textHi: 'आगरा, दौलताबाद और झाँसी किलों में शाही आपातकालीन गुप्त सुरंगे छिपी थीं।',
        spokenTextEn: 'Escape Routes. Agra Fort, Daulatabad, and Jhansi forts concealed fortified royal evacuation tunnels beneath their ramparts.',
        spokenTextHi: 'शाही गुप्त सुरंगे। आपातकालीन सुरक्षा के लिए आगरा, दौलताबाद और झाँसी किलों की प्राचीर के नीचे मीलों लंबी गुप्त निकासी सुरंगे बनाई गई थीं।'
      },
      {
        metric: 'NAHR-I-BIHISHT',
        textEn: 'Water channels operated as medieval evaporative air conditioning.',
        textHi: 'नहर-ए-बिहिश्त के जल प्रवाह ने मध्यकालीन वातानुकूलन का काम किया।',
        spokenTextEn: 'Nahr-i-Bihisht. Flowing marble water channels operated as medieval evaporative air conditioning throughout the royal pavilions.',
        spokenTextHi: 'नहर-ए-बिहिश्त। यमुना से खींचा गया निरंतर जल संगमरमर की नालियों और फव्वारों से बहकर महलों को 45 डिग्री की गर्मी में भी प्राकृतिक रूप से शीतल रखता था।'
      }
    ]
  },
  {
    id: 'slide-06',
    slideNumber: '06',
    title: 'TIME-TRAVEL ARCHIVAL COMPARISON: THEN vs NOW',
    titleHi: 'पुराना ज़माना बनाम आधुनिक संरक्षण: देन बनाम नाऊ',
    subtitle: '1858–1947 archives: Samuel Bourne • Felice Beato • Lala Deen Dayal • ASI',
    subtitleHi: '1858–1947 के दुर्लभ ऐतिहासिक अभिलेख बनाम भारतीय पुरातत्व सर्वेक्षण संरक्षण',
    image: '/images/slides/slide-06-time-travel-comparison.jpg',
    monumentId: 'taj-mahal',
    cards: [
      {
        metric: '1942 TAJ CAMOUFLAGE',
        textEn: 'Bamboo scaffolding concealed dome from WWII bomber aircraft.',
        textHi: 'द्वितीय विश्व युद्ध में जापानी हमलों से बचाने को गुंबद पर बांस का मचान लगाया।',
        spokenTextEn: '1942 Taj Camouflage. During World War II, British military architects completely concealed the central dome under bamboo scaffolding to camouflage it from bomber pilots.',
        spokenTextHi: '1942 द्वितीय विश्व युद्ध का बांस मचान। जापानी और जर्मन हवाई हमलों से बचाने के लिए पूरे विशाल गुंबद को पत्तियों और बांस के मचान से छिपा दिया गया था।'
      },
      {
        metric: '1903 KONARK CONSERVATION',
        textEn: '48,000 m³ of sand packed into structure to prevent collapse.',
        textHi: '1903 में जगमोहन हॉल को ढहने से बचाने के लिए 48,000 घन मीटर रेत भरी गई।',
        spokenTextEn: '1903 Konark Sand Conservation. British engineers in 1903 packed 48,000 cubic meters of sand into the Jagamohan hall to preserve its collapsing roof.',
        spokenTextHi: '1903 कोणार्क रेत संरक्षण। ब्रिटिश काल में 128 फीट ऊंचे जगमोहन हॉल को ढहने से बचाने के लिए चारों द्वारों को सील कर भीतर 48,000 क्यूबिक मीटर रेत भर दी गई थी।'
      },
      {
        metric: '1857 RED FORT AFTERMATH',
        textEn: 'Colonial barracks erected after the First War of Independence.',
        textHi: '1857 की क्रांति के बाद अंग्रेजों ने महलों को तोड़कर सैन्य छावनी बैरकें बनाईं।',
        spokenTextEn: '1857 Red Fort Aftermath. Following the uprising, colonial forces demolished Mughal royal apartments and erected military barracks.',
        spokenTextHi: '1857 क्रांति का दमन। प्रथम स्वतंत्रता संग्राम के बाद अंग्रेजों ने अंतिम मुगल सम्राट बहादुर शाह जफर पर मुकदमा चलाया और किले के कई महलों को तोपखाने की बैरकों में बदला।'
      }
    ]
  },
  {
    id: 'slide-09',
    slideNumber: '09',
    title: 'TAJ MAHAL',
    titleHi: 'ताज महल — वास्तुकला व 3D ब्लू-प्रिंट',
    subtitle: 'Agra, Uttar Pradesh • 1631 • Shah Jahan + Ustad Ahmad Lahori',
    subtitleHi: 'आगरा, उत्तर प्रदेश • 1631 ईस्वी • शाहजहाँ व उस्ताद अहमद लाहौरी',
    image: '/images/slides/slide-09-taj-mahal-blueprint.jpg',
    monumentId: 'taj-mahal',
    cards: [
      {
        metric: '15 KM EARTHEN RAMP',
        textEn: 'Makrana marble moved to site through a vast temporary logistics system.',
        textHi: 'मकराना संगमरमर लाने के लिए 15 किमी लंबा कच्चा मिट्टी का रैंप बनाया गया।',
        spokenTextEn: '15 Kilometer Earthen Ramp. Makrana marble blocks weighing tons were transported to site using a massive inclined ramp system and thousands of elephants.',
        spokenTextHi: '15 किलोमीटर विशाल मिट्टी का रैंप। राजस्थान के मकराना से पारदर्शी सफेद संगमरमर लाने के लिए एक हज़ार से अधिक हाथियों और 15 किमी लंबे ढलुआं रैंप का उपयोग किया गया था।'
      },
      {
        metric: 'PIETRA DURA',
        textEn: 'Lapis lazuli, jade, malachite and carnelian inlaid into white marble.',
        textHi: 'लापिस लाजुली, जेड, गोमेद और अकीक रत्नों की बेमिसाल पच्चीकारी।',
        spokenTextEn: 'Pietra Dura. Semi-precious gemstones including lapis lazuli, jade, malachite, and carnelian inlaid flawlessly into white marble surfaces.',
        spokenTextHi: 'पिएत्रा ड्यूरा रत्न पच्चीकारी। दीवारों और मेहराबों पर अट्ठाईस प्रकार के बहुमूल्य रत्नों को सफेद मकराना संगमरमर में तराश कर जड़ा गया है।'
      },
      {
        metric: '35 M DOME • 28 S',
        textEn: 'Outer silhouette encloses an inner acoustic dome with extended resonance.',
        textHi: '35 मीटर ऊंचा दोहरा गुंबद जिसमें आवाज़ की गूंज 28 सेकंड तक रहती है।',
        spokenTextEn: '35 Meter Dome with 28-Second Echo. The double-shell acoustic dome maintains harmonic acoustic resonance for up to 28 seconds.',
        spokenTextHi: '35 मीटर दोहरा गुंबद। मुख्य अमरुद गुंबद डबल-डोम तकनीक से बना है, जिसमें पैदा होने वाली ध्वनि तरंगे अट्ठाईस सेकंड तक लगातार गूंजती रहती हैं।'
      },
      {
        metric: '180 SAL-WOOD WELLS',
        textEn: 'A living foundation system sustained by moisture from the Yamuna.',
        textHi: 'यमुना नदी की नमी से सदियों तक सख्त बनी रहने वाली साल की लकड़ी की नींव।',
        spokenTextEn: '180 Sal-Wood Foundation Wells. A living subterranean engineering foundation sustained by moisture from the adjacent Yamuna river.',
        spokenTextHi: '180 साल की लकड़ी के कुएं। यमुना के दलदली किनारे पर 100,000 टन वजन संभालने के लिए लकड़ी के कुओं की नींव बनाई गई जो केवल पानी की नमी मिलने पर ही पत्थर जैसी सख्त रहती है।'
      }
    ]
  },
  {
    id: 'slide-10',
    slideNumber: '10',
    title: 'HAWA MAHAL',
    titleHi: 'हवा महल — वेंटुरी वायुगतिकी व झरोखे',
    subtitle: 'Jaipur, Rajasthan • 1799 • Lal Chand Usta',
    subtitleHi: 'जयपुर, राजस्थान • 1799 ईस्वी • लाल चंद उस्ता',
    image: '/images/slides/slide-10-hawa-mahal-aerodynamics.jpg',
    monumentId: 'hawa-mahal',
    cards: [
      {
        metric: '953 JHAROKHAS',
        textEn: 'Carved openings operate as Venturi nozzles, accelerating air through the rooms.',
        textHi: 'बारीक नक्काशीदार 953 झरोखे जो वेंटुरी नोज़ल की तरह हवा की गति बढ़ाते हैं।',
        spokenTextEn: '953 Jharokhas. Intricately pierced sandstone jharokhas operate on the Venturi aerodynamic principle, accelerating ambient air through the palace chambers.',
        spokenTextHi: '953 जालीदार नक्काशीदार झरोखे। इसके बाहरी मुखौटे पर नौ सौ तिरपन बारीक खिड़कियां हैं जो वेंटुरी प्रभाव से गर्म हवा को अंदर खींचकर ठंडा कर देती हैं।'
      },
      {
        metric: '5–7°C PASSIVE COOLING',
        textEn: 'Pressure differentials turn the facade into a climate machine.',
        textHi: 'वायु दाब के वैज्ञानिक अंतर से तापमान 5 से 7 डिग्री तक प्राकृतिक रूप से गिरता है।',
        spokenTextEn: '5 to 7 Degrees Celsius Passive Cooling. Pressure differentials created across the pierced honeycomb facade transform the building into a zero-electricity climate machine.',
        spokenTextHi: '5 से 7 डिग्री प्राकृतिक शीतलन। राजस्थान की शुष्क गर्म हवा जब इन छोटे-छोटे छिद्रों से होकर गुज़रती है, तो इसका तापमान बिना किसी बिजली के पांच से सात डिग्री तक घट जाता है।'
      },
      {
        metric: '20 CM AT THE CROWN',
        textEn: 'A 15 m facade stabilized by curved, pyramidal geometry inspired by a sacred crown.',
        textHi: 'शीर्ष पर केवल 20 सेमी मोटाई, जो पिरामिड संतुलन पर बिना नींव के टिकी है।',
        spokenTextEn: '20 Centimeters Width at the Crown. A 15-meter soaring facade stabilized by curved, self-weight pyramidal geometry inspired by Lord Krishna’s sacred crown.',
        spokenTextHi: 'शीर्ष पर केवल 20 सेमी मोटाई। हवा महल की कोई गहरी नींव नहीं है! यह पांच मंजिला इमारत केवल अपनी पिरामिड जैसी घुमावदार बनावट और कान्हा के मुकुट जैसी ज्यामिति पर टिकी है।'
      }
    ]
  },
  {
    id: 'slide-11',
    slideNumber: '11',
    title: 'KONARK SUN TEMPLE',
    titleHi: 'कोणार्क सूर्य मंदिर — खगोलीय धूपघड़ी',
    subtitle: 'Puri, Odisha • 1250 CE • 1,200 artisans • 12 years',
    subtitleHi: 'पुरी, ओडिशा • 1250 ईस्वी • 1,200 शिल्पकार • 12 वर्ष',
    image: '/images/slides/slide-11-konark-chronometer.jpg',
    monumentId: 'konark-sun-temple',
    cards: [
      {
        metric: '24 STONE CHRONOMETERS',
        textEn: 'Wheel spokes resolve solar time through precise shadow geometry.',
        textHi: 'पत्थर के 24 पहिये जो सूर्य की छाया की ज्यामिति से मिनटों तक सटीक समय बताते हैं।',
        spokenTextEn: '24 Stone Chronometers. The 9.9-foot carved chariot wheel spokes resolve precise solar time through meticulous shadow geometry accurate to the minute.',
        spokenTextHi: '24 धूपघड़ी सूर्य चक्र। कोणार्क मंदिर के 24 नक्काशीदार पहिये केवल सजावट नहीं, बल्कि अत्यधिक सटीक धूप-घड़ियां हैं। पहिये की तीलियों पर पड़ने वाली छाया से दिन का सटीक समय मिनटों तक नापा जा सकता है।'
      },
      {
        metric: '52-TON CAPSTONE LEGEND',
        textEn: 'A magnetic lodestone is said to have suspended the sanctum deity.',
        textHi: '52 टन का चुंबकीय लोधस्टोन कलश जिसने गर्भगृह की मुख्य मूर्ति को हवा में रोके रखा।',
        spokenTextEn: '52-Ton Capstone Legend. Ancient maritime accounts recall a colossal natural magnetic lodestone that suspended the sanctum deity between magnetic fields.',
        spokenTextHi: '52 टन चुंबकीय कलश कथा। दंतकथाओं के अनुसार मंदिर के शिखर पर लगा 52 टन का चुंबकीय कलश और दीवारों में जड़े लोहे के गर्डर जहाजों के कंपास को भटका देते थे।'
      },
      {
        metric: '1903 → 2026 CONSERVATION',
        textEn: '48,000 m³ of protective sand was packed into the structure—and is now being removed scientifically by ASI.',
        textHi: '1903 में भरी गई 48,000 घन मीटर रेत को अब एएसआई आधुनिक रोबोटिक्स से निकाल रहा है।',
        spokenTextEn: '1903 to 2026 Conservation. 48,000 cubic meters of sand packed into the sanctum in 1903 is now being systematically evacuated by the Archaeological Survey of India.',
        spokenTextHi: '1903 से 2026 रेत संरक्षण। ब्रिटिश काल में जगमोहन हॉल में भरी गई 48,000 क्यूबिक मीटर रेत को 120 साल बाद भारतीय पुरातत्व सर्वेक्षण आधुनिक रोबोटिक तकनीक से सुरक्षित बाहर निकाल रहा है।'
      }
    ]
  },
  {
    id: 'slide-12',
    slideNumber: '12',
    title: 'RED FORT & QUTUB MINAR',
    titleHi: 'लाल किला व कुतुब मीनार — प्राचीर व प्राचीन धातु विज्ञान',
    subtitle: 'Imperial fortification meets ancient material science.',
    subtitleHi: 'मुगल सैन्य प्राचीर, 72.5 मीटर ईंट मीनार और 1600 वर्ष पुराना जंग-मुक्त लौह स्तंभ',
    image: '/images/slides/slide-12-red-fort-qutub-minar.jpg',
    monumentId: 'delhi-red-fort',
    cards: [
      {
        metric: 'RED FORT • 1648',
        textEn: '2.4 km octagonal ramparts • Lahori Gate barbican • Nahr-i-Bihisht channels • 1857 rebellion',
        textHi: '2.4 किमी अष्टकोणीय लाल प्राचीर • लाहौरी गेट • नहर-ए-बिहिश्त • 1857 स्वतंत्रता संग्राम',
        spokenTextEn: 'Red Fort commissioned in 1648. Featuring 2.4-kilometer octagonal red sandstone ramparts, Lahori Gate barbican, and historic national flag hoisting.',
        spokenTextHi: 'लाल किला 1648। शाहजहाँ द्वारा निर्मित 2.4 किलोमीटर लंबी अष्टकोणीय लाल बलुआ पत्थर की प्राचीर, लाहौरी गेट और नहर-ए-बिहिश्त जल प्रणाली।'
      },
      {
        metric: 'QUTUB MINAR • 1199',
        textEn: '72.5 m brick minaret with seismic fluted ribs and balcony corbels.',
        textHi: '72.5 मीटर ऊंची ईंट मीनार जिसमें भूकंपरोधी खांचेदार पसलियां और बालकनी ब्रैकेट्स हैं।',
        spokenTextEn: 'Qutub Minar built in 1199. A 72.5-meter towering brick minaret reinforced with seismic fluted ribs and ornate cantilevered balcony corbels.',
        spokenTextHi: 'कुतुब मीनार 1199। बहत्तर दशमलव पांच मीटर ऊंची दुनिया की सबसे ऊंची ईंट मीनार, जिसके भूकंपरोधी खांचेदार कंगूरे सदियों से अडिग खड़े हैं।'
      },
      {
        metric: 'GUPTA IRON PILLAR • 1,600 YEARS',
        textEn: 'Rust resistance from a protective misawite crystalline iron hydrogen phosphate layer.',
        textHi: 'मिसवाइट क्रिस्टलीय परत के कारण 1600 वर्षों से खुले आसमान में जंग-मुक्त खड़ा गुप्त लौह स्तंभ।',
        spokenTextEn: 'Gupta Iron Pillar over 1,600 years old. Demonstrates zero rust corrosion due to an ancient protective misawite iron hydrogen phosphate crystalline film.',
        spokenTextHi: 'गुप्त लौह स्तंभ। 1600 वर्षों से बारिश और धूप में खड़ा यह शुद्ध लोहे का स्तंभ प्राचीन भारतीय धातु विज्ञान का चमत्कार है, जिस पर आज तक कभी जंग नहीं लगा।'
      }
    ]
  }
];

interface PresentationSlidesShowcaseProps {
  currentMonumentId?: string;
  language?: 'hi' | 'en';
  onSelectMonument?: (monumentId: string) => void;
}

export function PresentationSlidesShowcase({
  currentMonumentId,
  language = 'hi',
  onSelectMonument
}: PresentationSlidesShowcaseProps) {
  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [activeCardIdx, setActiveCardIdx] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingCardIdx, setSpeakingCardIdx] = useState<number | null>(null);
  const [isFullscreenModalOpen, setIsFullscreenModalOpen] = useState<boolean>(false);

  // If a monument is active that does not have one of the 4 featured slide artworks,
  // dynamically generate a high-detail architectural presentation slide matching the exact same layout.
  const customSlide = useMemo<PresentationSlideData | null>(() => {
    if (!currentMonumentId) return null;
    if (['taj-mahal', 'hawa-mahal', 'konark-sun-temple', 'delhi-red-fort', 'qutub-minar'].includes(currentMonumentId)) {
      return null;
    }
    const mon = INDIAN_MONUMENTS_DATABASE.find((m) => m.id === currentMonumentId);
    if (!mon) return null;
    const dossier = getMonumentSpecs(currentMonumentId);
    return {
      id: `slide-${currentMonumentId}`,
      slideNumber: 'ARCH',
      title: mon.name.toUpperCase(),
      titleHi: `${mon.hindiName} — 3D ब्लू-प्रिंट व वास्तुकला`,
      subtitle: `${mon.city}, ${mon.state} • ${mon.historicalPeriod} • ${mon.dynastyOrBuilder}`,
      subtitleHi: `${mon.city}, ${mon.state} • ${mon.historicalPeriod} • ${mon.dynastyOrBuilder}`,
      image: mon.photos[0]?.url || `/images/monuments/${mon.id}.jpg`,
      monumentId: mon.id,
      cards: dossier.specs.slice(0, 4).map((s) => ({
        metric: s.metric,
        textEn: s.summaryEn,
        textHi: s.summaryHi,
        spokenTextEn: `${s.titleEn}. ${s.summaryEn} ${s.detailEn}`,
        spokenTextHi: `${s.titleHi}। ${s.summaryHi} ${s.detailHi}`
      }))
    };
  }, [currentMonumentId]);

  // Synchronize current slide with the selected monument whenever it changes,
  // and strictly halt any audio from playing across monuments.
  useEffect(() => {
    stopUniversalAudio();
    setIsSpeaking(false);
    setSpeakingCardIdx(null);
    setActiveCardIdx(0);

    if (!currentMonumentId) return;

    if (currentMonumentId === 'taj-mahal') {
      setCurrentSlideIdx(2); // Slide 09: Taj Mahal
    } else if (currentMonumentId === 'hawa-mahal') {
      setCurrentSlideIdx(3); // Slide 10: Hawa Mahal
    } else if (currentMonumentId === 'konark-sun-temple') {
      setCurrentSlideIdx(4); // Slide 11: Konark Sun Temple
    } else if (currentMonumentId === 'delhi-red-fort' || currentMonumentId === 'qutub-minar') {
      setCurrentSlideIdx(5); // Slide 12: Red Fort & Qutub Minar
    } else {
      setCurrentSlideIdx(-1); // -1 indicates custom dynamic slide for this monument
    }
  }, [currentMonumentId]);

  const slide = currentSlideIdx === -1 && customSlide 
    ? customSlide 
    : (PRESENTATION_SLIDES[currentSlideIdx] || PRESENTATION_SLIDES[0]);

  const handleNextSlide = () => {
    stopUniversalAudio();
    setIsSpeaking(false);
    setSpeakingCardIdx(null);
    setActiveCardIdx(0);
    const nextIdx = currentSlideIdx === -1 ? 0 : (currentSlideIdx + 1) % PRESENTATION_SLIDES.length;
    setCurrentSlideIdx(nextIdx);
    const targetSlide = PRESENTATION_SLIDES[nextIdx];
    if (targetSlide?.monumentId && onSelectMonument) {
      onSelectMonument(targetSlide.monumentId);
    }
  };

  const handlePrevSlide = () => {
    stopUniversalAudio();
    setIsSpeaking(false);
    setSpeakingCardIdx(null);
    setActiveCardIdx(0);
    const prevIdx = currentSlideIdx === -1 
      ? PRESENTATION_SLIDES.length - 1 
      : (currentSlideIdx - 1 + PRESENTATION_SLIDES.length) % PRESENTATION_SLIDES.length;
    setCurrentSlideIdx(prevIdx);
    const targetSlide = PRESENTATION_SLIDES[prevIdx];
    if (targetSlide?.monumentId && onSelectMonument) {
      onSelectMonument(targetSlide.monumentId);
    }
  };

  const handleSelectSlidePill = (idx: number) => {
    stopUniversalAudio();
    setIsSpeaking(false);
    setSpeakingCardIdx(null);
    setActiveCardIdx(0);
    setCurrentSlideIdx(idx);
    const targetSlide = PRESENTATION_SLIDES[idx];
    if (targetSlide?.monumentId && onSelectMonument) {
      onSelectMonument(targetSlide.monumentId);
    }
  };

  const handlePlayCardAudio = (cardIdx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (speakingCardIdx === cardIdx) {
      stopUniversalAudio();
      setSpeakingCardIdx(null);
      setIsSpeaking(false);
      return;
    }

    setActiveCardIdx(cardIdx);
    const card = slide.cards[cardIdx];
    if (!card) return;

    const textToSpeak = language === 'hi' ? card.spokenTextHi : card.spokenTextEn;

    setSpeakingCardIdx(cardIdx);
    setIsSpeaking(true);
    speakHeritageText(
      textToSpeak,
      language,
      'male',
      () => {
        setSpeakingCardIdx(cardIdx);
        setIsSpeaking(true);
      },
      () => {
        setSpeakingCardIdx(null);
        setIsSpeaking(false);
      }
    );
  };

  const handlePlayFullSlideAudio = () => {
    if (isSpeaking && speakingCardIdx === null) {
      stopUniversalAudio();
      setIsSpeaking(false);
      return;
    }

    const titleText = language === 'hi' ? `${slide.titleHi}। ${slide.subtitleHi}। ` : `${slide.title}. ${slide.subtitle}. `;
    const cardsText = slide.cards.map(c => language === 'hi' ? c.spokenTextHi : c.spokenTextEn).join(' ');
    const fullText = titleText + cardsText;

    setIsSpeaking(true);
    setSpeakingCardIdx(null);
    speakHeritageText(
      fullText,
      language,
      'male',
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  return (
    <section className="relative rounded-3xl border border-cyan-500/30 bg-[#070b14] p-5 sm:p-7 space-y-6 shadow-2xl overflow-hidden group">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-black tracking-widest border border-amber-400/40">
            SLIDE {slide.slideNumber}
          </span>
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
            {language === 'hi' ? 'हाई-डिटेल मास्टर प्रेजेंटेशन' : 'High-Detail Master Presentation Showcase'}
          </span>
        </div>

        {/* Slide navigation controls */}
        <div className="flex items-center gap-2">
          {/* Quick jump pills */}
          <div className="hidden md:flex items-center gap-1.5 mr-2">
            {PRESENTATION_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSelectSlidePill(idx)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer border ${
                  currentSlideIdx === idx
                    ? 'bg-cyan-500 text-black border-cyan-400 shadow-glow-cyan'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10'
                }`}
                title={s.title}
              >
                {s.slideNumber}
              </button>
            ))}
            {customSlide && (
              <button
                onClick={() => {
                  stopUniversalAudio();
                  setIsSpeaking(false);
                  setSpeakingCardIdx(null);
                  setActiveCardIdx(0);
                  setCurrentSlideIdx(-1);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer border ${
                  currentSlideIdx === -1
                    ? 'bg-amber-500 text-black border-amber-400 shadow-glow-amber'
                    : 'bg-white/5 text-amber-300 border-amber-500/30 hover:bg-amber-500/10'
                }`}
                title="Active Monument Architectural Slide"
              >
                ACTIVE
              </button>
            )}
          </div>

          <button
            onClick={handlePrevSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono text-gray-300 px-1">
            {currentSlideIdx === -1 ? 'ARCH' : `${currentSlideIdx + 1} / ${PRESENTATION_SLIDES.length}`}
          </span>
          <button
            onClick={handleNextSlide}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Next Slide"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Fullscreen Zoom */}
          <button
            onClick={() => setIsFullscreenModalOpen(true)}
            className="p-2 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-400/40 transition cursor-pointer ml-1"
            title="Full-Resolution Inspect"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Title & Audio Overview */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1 max-w-3xl">
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
            {language === 'hi' ? slide.titleHi : slide.title}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-cyan-400 rounded-full my-1.5" />
          <p className="text-xs sm:text-sm font-mono text-cyan-300">
            {language === 'hi' ? slide.subtitleHi : slide.subtitle}
          </p>
        </div>

        {/* Listen Full Slide Narration */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayFullSlideAudio}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
              isSpeaking && speakingCardIdx === null
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-glow-cyan animate-pulse'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-black hover:opacity-95'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            <span>
              {isSpeaking && speakingCardIdx === null
                ? (language === 'hi' ? 'स्लाइड गाइड चल रही है...' : 'Speaking Slide Guide...')
                : (language === 'hi' ? 'स्लाइड का पूर्ण विवरण सुनें' : 'Listen Full Slide Narration')}
            </span>
          </button>

          {onSelectMonument && (
            <button
              onClick={() => onSelectMonument(slide.monumentId)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20 text-xs font-mono transition cursor-pointer"
              title="Explore this monument below"
            >
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{language === 'hi' ? 'स्मारक खोलें' : 'Open Monument'}</span>
            </button>
          )}
        </div>
      </div>

      {/* HIGH-DETAIL VISUAL CANVAS (Exact 16:9 Slide Artwork) */}
      <div 
        className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-cyan-400/40 bg-black shadow-2xl group/canvas cursor-pointer"
        onClick={() => setIsFullscreenModalOpen(true)}
      >
        <img
          src={slide.image}
          alt={slide.title}
          className="h-full w-full object-contain bg-black transition-transform duration-700 group-hover/canvas:scale-[1.02]"
        />

        {/* Subtle glowing vignette */}
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/15 rounded-2xl" />

        {/* Bottom hover prompt */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400/40 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 pointer-events-none">
          <Maximize2 className="h-3.5 w-3.5" />
          <span>{language === 'hi' ? 'क्लिक करके फुल-स्क्रीन बड़ा करें' : 'Click to inspect full resolution'}</span>
        </div>
      </div>

      {/* INTERACTIVE SPEC CARDS ROW (Exact Metrics from Slide) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${slide.cards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
        {slide.cards.map((card, cIdx) => {
          const isActive = activeCardIdx === cIdx;
          const isCardSpeaking = speakingCardIdx === cIdx;

          return (
            <div
              key={cIdx}
              onClick={() => setActiveCardIdx(cIdx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group/card ${
                isActive
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-glow-cyan ring-1 ring-cyan-400/40'
                  : 'border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              {/* Left glowing accent line */}
              <div 
                className={`absolute left-0 top-0 bottom-0 w-1.5 transition-colors ${
                  isActive ? 'bg-gradient-to-b from-amber-400 to-cyan-400' : 'bg-transparent group-hover/card:bg-white/20'
                }`}
              />

              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs sm:text-sm font-display font-black text-amber-400 uppercase tracking-wide">
                  {card.metric}
                </span>

                <button
                  onClick={(e) => handlePlayCardAudio(cIdx, e)}
                  className={`p-1.5 rounded-lg border transition ${
                    isCardSpeaking
                      ? 'bg-emerald-500 text-black border-emerald-400 animate-pulse'
                      : 'bg-white/10 hover:bg-cyan-500 hover:text-black border-white/15 text-cyan-300'
                  }`}
                  title={isCardSpeaking ? 'Stop Audio' : 'Listen Card Narration'}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <p className="text-xs text-gray-200 leading-relaxed font-mono">
                {language === 'hi' ? card.textHi : card.textEn}
              </p>
            </div>
          );
        })}
      </div>

      {/* FULL-RESOLUTION LIGHTBOX MODAL */}
      {isFullscreenModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setIsFullscreenModalOpen(false)}
        >
          {/* Header */}
          <div className="w-full flex items-center justify-between text-white border-b border-white/15 pb-3">
            <div className="space-y-0.5">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono text-xs font-black tracking-widest border border-amber-400/40">
                SLIDE {slide.slideNumber}
              </span>
              <h3 className="text-base sm:text-lg font-display font-black text-white mt-1">
                {language === 'hi' ? slide.titleHi : slide.title}
              </h3>
            </div>

            <button
              onClick={() => setIsFullscreenModalOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Big Image Viewer */}
          <div 
            className="relative max-w-6xl max-h-[78vh] w-full flex items-center justify-center my-auto overflow-hidden rounded-2xl border border-cyan-400/30 bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="max-h-[78vh] max-w-full object-contain shadow-2xl"
            />
          </div>

          {/* Footer Controls */}
          <div className="w-full max-w-4xl flex items-center justify-between p-3 rounded-2xl bg-black/85 border border-white/15">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrevSlide();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-gray-300">
              Slide {currentSlideIdx + 1} of {PRESENTATION_SLIDES.length}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextSlide();
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white transition"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
