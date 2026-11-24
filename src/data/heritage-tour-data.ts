/**
 * TIMELOOP AI — Comprehensive Authentic Indian Heritage Tour Data
 * 
 * Deep, thorough, educational historical guide scripts explaining:
 * 1. Genesis & History: Who built it, exact year, dynasty, royal purpose, architectural vision.
 * 2. Architecture & Construction ("Kaise Bana"): Materials, artisans, elephants/transport,
 *    engineering feats (double-domes, interlocking stones, acoustics, seismic tilt, carvings).
 * 3. Historical Era vs Modern Conservation ("Purana Zamana vs Naya"):
 *    Real archival conditions (wartime camouflage, historical damages, British colonial use)
 *    vs modern scientific ASI, UNESCO, and Supreme Court eco-zone preservation.
 * 4. Subterranean Foundations & Engineering Secrets:
 *    Underground well foundations (e.g. Sal timber), seismic balances, hidden chambers,
 *    water channel cooling, and astronomical alignment.
 */

import { IndianMonument } from './indian-monuments';
import { ALL_47_MONUMENTS_DATA } from './monument-all-tours';

export interface BespokeTourStepData {
  stepNumber: number;
  badgeHi: string;
  badgeEn: string;
  titleHi: string;
  titleEn: string;
  eraHi: string;
  eraEn: string;
  imageOffset?: number;
  spokenHi: string;
  spokenEn: string;
  subtitleHi: string;
  subtitleEn: string;
  structuralHighlightHi: string;
  structuralHighlightEn: string;
  tag: 'STRUCTURE' | 'ARCHITECTURE' | 'TIME_TRAVEL' | 'SECRET';
}

export const BESPOKE_MONUMENT_TOURS: Record<string, BespokeTourStepData[]> = {
  // =========================================================================
  // 1. TAJ MAHAL — AGRA
  // =========================================================================
  'taj-mahal': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: शाही इतिहास और निर्माण का आरंभ',
      badgeEn: 'Step 1: Royal History & Architectural Genesis',
      titleHi: 'मुगल स्थापत्य का अमर शाहकार — ताजमहल',
      titleEn: 'The Immortal Marble Monument of Love',
      eraHi: '1632 – 1653 ईस्वी (मुगल स्वर्णिम युग)',
      eraEn: '1632 – 1653 AD (Mughal Golden Age)',
      imageOffset: 0,
      spokenHi: 'ताजमहल का निर्माण 1632 में पांचवें मुगल बादशाह शाह जहाँ ने अपनी प्रिय बेगम मुमताज़ महल की याद में शुरू करवाया था। मुख्य वास्तुकार उस्ताद अहमद लाहौरी के निर्देशन में पूरे हिंदुस्तान, फारस, तुर्की और मध्य एशिया से बीस हज़ार से अधिक कुशल कारीगर, सुलेखक और संगतराश बुलाए गए थे। राजस्थान के मकराना से सर्वोत्तम श्रेणी का पारदर्शी सफेद संगमरमर लाने के लिए एक हज़ार से अधिक हाथियों का बेड़ा लगाया गया था। बाईस वर्षों की अनवरत मेहनत और उस दौर के बत्तीस मिलियन रुपयों की लागत से यह बेमिसाल स्मारक बनकर तैयार हुआ।',
      spokenEn: 'The Taj Mahal was commissioned in 1632 by the fifth Mughal Emperor Shah Jahan in eternal memory of his beloved empress, Mumtaz Mahal. Under chief architect Ustad Ahmad Lahori, over twenty thousand master artisans, calligraphers, and sculptors were gathered from across India, Persia, and Central Asia. A fleet of over one thousand elephants transported translucent white marble from Makrana, Rajasthan. It took twenty-two years of relentless craftsmanship and thirty-two million Mughal rupees to complete this universal masterpiece.',
      subtitleHi: 'शाह जहाँ द्वारा मुमताज़ महल की याद में 1632 से 1653 तक 20,000 कारीगरों और 1,000 हाथियों की मदद से निर्मित।',
      subtitleEn: 'Commissioned by Shah Jahan in 1632; crafted over 22 years by 20,000 master artisans using Makrana marble.',
      structuralHighlightHi: 'शैली: पूर्ण सममित मुगल वास्तुकला • मुख्य पत्थर: शुद्ध मकराना सफेद संगमरमर',
      structuralHighlightEn: 'Style: Pure Bilateral Symmetry • Material: Translucent Makrana Marble',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: बनावट, नक्काशी और वास्तुकला विज्ञान',
      badgeEn: 'Step 2: Architecture, Masonry & Acoustic Engineering',
      titleHi: 'पैंतीस मीटर दोहरा गुंबद और भूकंप-रोधी झुकी मीनारें',
      titleEn: '35m Acoustic Double-Dome & Earthquake-Safe Minarets',
      eraHi: 'मुगल इंजीनियरिंग एवं पिएट्रा ड्यूरा का चरमोत्कर्ष',
      eraEn: 'Pietra Dura Inlay & Structural Engineering Apex',
      imageOffset: 1,
      spokenHi: 'ताजमहल की बनावट में अद्भुत वैज्ञानिक और वास्तुशिल्प संतुलन देखने को मिलता है। इसका पैंतीस मीटर ऊँचा मुख्य अमरुद गुंबद दोहरी परत यानी डबल-डोम तकनीक से बना है, जिसमें अंदर पैदा होने वाली आवाज़ अट्ठाईस सेकंड तक गूंजती रहती है। इसके चारों कोनों पर खड़ी बयालीस मीटर ऊँची मीनारें बाहर की ओर ढाई डिग्री झुकी हुई हैं, ताकि कभी भीषण भूकंप आए तो वे मुख्य मकबरे पर न गिरकर बाहर की तरफ गिरें। दीवारों पर अट्ठाईस प्रकार के बहुमूल्य रत्नों — जैसे नीलम, जेड, लापिस लाजुली और फिरोजा — की पिएट्रा ड्यूरा पच्चीकारी की गई है, जो फूलों की पंखुड़ियों में प्राकृतिक रंग भरती है।',
      spokenEn: 'The construction of the Taj Mahal incorporates ingenious structural and acoustic engineering. Its 35-meter central bulbous dome features a double-shell acoustic design sustaining resonance for twenty-eight seconds. All four 42-meter minarets were deliberately engineered leaning 2.5 degrees outward, ensuring that in any catastrophic earthquake they collapse outward away from the central tomb. The walls are embellished with delicate Pietra Dura inlay using twenty-eight varieties of semi-precious gems — including lapis lazuli, jade, turquoise, and carnelian — seamlessly fitted into marble petals.',
      subtitleHi: 'डबल-डोम गुंबद (28 सेकंड गूंज), 2.5° बाहर झुकी भूकंप-रोधी 4 मीनारें और 28 दुर्लभ रत्नों की पच्चीकारी।',
      subtitleEn: '35m acoustic double dome with 28s echo, 2.5° outward earthquake-safe minarets, and 28-gem Pietra Dura inlay.',
      structuralHighlightHi: 'डबल-डोम ध्वनिकी • 2.5 डिग्री बाहर झुकी 4 मीनारें • 28 दुर्लभ रत्नों की पच्चीकारी',
      structuralHighlightEn: 'Acoustic Double-Shell Dome • 2.5° Outward Earthquake-Safe Tilt • 28-Gem Inlay',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक संरक्षण',
      badgeEn: 'Step 3: Archival Camouflage vs Modern Environmental Care',
      titleHi: '1942 विश्व युद्ध का रक्षा-कवच बनाम आज का ताज ट्रैपेज़ियम ज़ोन',
      titleEn: '1942 WWII Bamboo Camouflage vs Taj Trapezium Protection',
      eraHi: '1942 युद्धकालीन अभिलेख ➔ आज का वैज्ञानिक संरक्षण',
      eraEn: '1942 Wartime Archives ➔ Modern UNESCO Restoration',
      imageOffset: 0,
      spokenHi: 'इतिहास के पन्नों में ताजमहल ने कई संकट झेले हैं। 1942 में दूसरे विश्व युद्ध के दौरान, जब जापानी और जर्मन हवाई बमबारी का खतरा पैदा हुआ था, तब ब्रिटिश पुरातत्वविदों ने पूरे विशाल गुंबद को बांस और पत्तियों के विशाल मचान से पूरी तरह ढक दिया था, ताकि आसमान से पायलटों को यह केवल बांस का जंगल दिखाई दे। 1965 और 1971 के युद्धों में भी इसे हरे कपड़े से छिपाया गया था। आज आधुनिक दौर में, वायु प्रदूषण और एसिड रेन से बचाने के लिए भारत के सर्वोच्च न्यायालय ने दस हज़ार चार सौ वर्ग किलोमीटर का ताज ट्रैपेज़ियम ज़ोन बनाया है, जहाँ कोयला उद्योग प्रतिबंधित हैं, और भारतीय पुरातत्व सर्वेक्षण प्राकृतिक मुल्तानी मिट्टी के लेप से इसकी मूल सफेद आभा को सुरक्षित रखता है।',
      spokenEn: 'Across centuries, the Taj Mahal has survived turbulent military crises. In 1942 during World War II, facing potential Japanese air raids, British military architects completely concealed the massive central dome under colossal bamboo scaffolding and camouflage netting so high-altitude bombers saw only a forest canopy. Similar camouflage was applied during the 1965 and 1971 conflicts. Today, to combat atmospheric pollution, the Supreme Court established the 10,400-sq-km Taj Trapezium Zone banning coal emissions, while the ASI periodically applies natural Multani Mitti clay packs to restore the marble’s pristine translucence.',
      subtitleHi: '1942 में हवाई हमलों से बचाने के लिए बांस से ढका गुंबद बनाम आज का ताज ट्रैपेज़ियम ज़ोन और क्ले-पैक शोधन।',
      subtitleEn: '1942 WWII protective bamboo concealment vs modern Taj Trapezium eco-zone and Fuller’s earth clay-pack care.',
      structuralHighlightHi: '1942 युद्धकालीन बांस का छलावरण • मुल्तानी मिट्टी क्ले पैक शोधन',
      structuralHighlightEn: '1942 Wartime Bamboo Concealment • Full Modern Eco-Zone Protection',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का गहरा रहस्य और जल-संतुलन',
      badgeEn: 'Step 4: Subterranean Sal-Wood Well Foundations',
      titleHi: 'यमुना किनारे दलदल में एक लाख टन वजन संभालने वाले काष्ठ कुएं',
      titleEn: 'Hydrological Sal Timber Wells Supporting 100,000 Tons',
      eraHi: 'प्राचीन भूमिगत जल-संतुलन विज्ञान',
      eraEn: 'Underground Hydrological Engineering',
      imageOffset: 1,
      spokenHi: 'ताजमहल की सबसे विस्मयकारी इंजीनियरिंग इसकी ज़मीन के नीचे छिपी है। यमुना नदी के दलदली किनारे पर एक लाख टन भारी संगमरमर के ढांचे को टिकाने के लिए, मुगल इंजीनियरों ने ज़मीन में गहरे कुएं खोदे और उन्हें साल की लकड़ी के लट्ठों और पत्थरों से भरा। साल की लकड़ी की अनोखी खूबी यह है कि वह हवा में सूखने पर कमजोर होती है, लेकिन यदि उसे लगातार पानी की नमी मिलती रहे, तो वह सदियों तक पत्थर की तरह कठोर बनी रहती है। यही कारण है कि यमुना का निरंतर बहता जल ताजमहल की नींव की जीवन-रेखा है, जो चार सौ वर्षों से इस महाकाय इमारत को रत्ती भर भी झुकने नहीं दे रही है।',
      spokenEn: 'The most extraordinary engineering marvel of the Taj Mahal lies beneath the earth. To support one hundred thousand tons of marble on the loose silt of the Yamuna riverbank, Mughal engineers sank deep masonry wells packed with solid Sal timber logs and mortar. Sal wood possesses the unique metallurgical property of hardening into stone-like rigidity as long as it remains submerged in moisture. The continuous hydrological flow of the Yamuna River serves as the literal lifeblood of the Taj foundations, keeping the monument flawlessly balanced for over four centuries.',
      subtitleHi: 'यमुना के जल से सदियों तक पत्थर जैसी मजबूत रहने वाली 180 साल-काष्ठ कुओं की भूमिगत नींव।',
      subtitleEn: '180 subterranean Sal-wood masonry wells sustained by Yamuna river moisture to anchor 100,000 tons.',
      structuralHighlightHi: '180 गहरे साल-काष्ठ कुएं • जल-निर्भर संरचनात्मक मजबूती',
      structuralHighlightEn: '180 Deep Sal-Timber Wells • Moisture-Dependent Structural Rigidity',
      tag: 'SECRET'
    }
  ],

  // =========================================================================
  // 2. DELHI RED FORT — OLD DELHI
  // =========================================================================
  'delhi-red-fort': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: शाही इतिहास और राजधानी निर्माण',
      badgeEn: 'Step 1: Imperial History & Capital Citadel',
      titleHi: 'शाहजहानाबाद का गौरवशाली लाल किला',
      titleEn: 'The Imperial Citadel of Shahjahanabad',
      eraHi: '1638 – 1648 ईस्वी (मुगल काल)',
      eraEn: '1638 – 1648 AD (Mughal Era)',
      imageOffset: 0,
      spokenHi: 'दिल्ली के लाल किले का निर्माण 1638 में मुगल सम्राट शाह जहाँ ने शुरू करवाया था, जब उन्होंने अपनी शाही राजधानी को आगरा से दिल्ली स्थानांतरित करने का ऐतिहासिक निर्णय लिया। यमुना नदी के पश्चिमी किनारे पर उस्ताद अहमद लाहौरी की देखरेख में धौलपुर के लाल बलुआ पत्थर से इस विशाल किले का निर्माण दस वर्षों में पूरा हुआ। लगभग दो सौ छप्पन एकड़ में फैला यह किला केवल एक सैन्य छावनी नहीं, बल्कि तत्कालीन दुनिया की सबसे वैभवशाली नगरी — शाहजहानाबाद का राजनीतिक और सांस्कृतिक दिल था।',
      spokenEn: 'The Red Fort of Delhi was commissioned in 1638 by Emperor Shah Jahan upon his historic decision to shift the Mughal capital from Agra to Delhi. Overlooking the Yamuna floodplain, chief architect Ustad Ahmad Lahori oversaw its construction from Dholpur red sandstone over a ten-year span. Spanning 256 acres, this fortress served as the political, ceremonial, and cultural heart of Shahjahanabad — the most opulent city of the contemporary seventeenth-century world.',
      subtitleHi: 'शाह जहाँ द्वारा 1638 से 1648 के बीच निर्मित भव्य मुगल शाही किला और शाहजहानाबाद का केंद्र।',
      subtitleEn: 'Imperial Mughal capital citadel constructed between 1638 and 1648 by Shah Jahan.',
      structuralHighlightHi: 'शैली: शाहजहानी मुगल दुर्ग • मुख्य पत्थर: धौलपुर लाल बलुआ पत्थर',
      structuralHighlightEn: 'Style: Shahjahani Mughal Fortification • Material: Dholpur Red Sandstone',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: स्थापत्य, मेहराब और नहर-ए-बहिश्त',
      badgeEn: 'Step 2: Architecture, Pavilions & Water Engineering',
      titleHi: 'लाहौरी गेट प्राचीर, दीवान-ए-खास और स्वर्ग की नहर',
      titleEn: 'Lahori Gate Bastions, Diwan-i-Khas & Nahr-i-Bihisht',
      eraHi: 'मुगल स्थापत्य और जल-प्रशीतन तकनीक',
      eraEn: 'Imperial Architecture & Hydraulic Cooling',
      imageOffset: 1,
      spokenHi: 'लाल किले की बाहरी सुरक्षा दीवारें ढाई किलोमीटर लंबी और तैंतीस मीटर ऊँची हैं, जिन्हें गहरी खाई और अष्टकोणीय बुर्जों से अभेद्य बनाया गया था। इसके अंदर प्रवेश करते ही छत्ता चौक बाज़ार, जनता के लिए दीवान-ए-आम और शुद्ध सफेद संगमरमर का दीवान-ए-खास स्थित है, जहाँ विश्वप्रसिद्ध मयूर सिंहासन रखा जाता था। महलों के बीच से नहर-ए-बहिश्त यानी स्वर्ग की नहर बहती थी, जो यमुना के ठंडे पानी को संगमरमर के फव्वारों और कमरों से गुजारकर दिल्ली की भीषण गर्मी में भी महलों को प्राकृतिक रूप से वातानुकूलित रखती थी।',
      spokenEn: 'The defensive red ramparts stretch 2.4 kilometers and rise up to thirty-three meters, reinforced by a deep moat and octagonal bastions. Inside lies the vaulted Chhatta Chowk bazaar, the monumental Diwan-i-Aam public hall, and the pure white marble Diwan-i-Khas which once held the famed Peacock Throne. Flowing through the royal pavilions was the Nahr-i-Bihisht (Stream of Paradise), channeling diverted Yamuna waters through marble channels and cascading fountains to provide natural air conditioning in extreme Delhi summers.',
      subtitleHi: '2.4 किमी लंबी प्राचीर, संगमरमर का दीवान-ए-खास और महलों को ठंडा रखने वाली नहर-ए-बहिश्त जल प्रणाली।',
      subtitleEn: '2.4 km ramparts, marble Diwan-i-Khas, and natural cooling Nahr-i-Bihisht stream channels.',
      structuralHighlightHi: '2.4 किमी लंबी प्राचीर • संगमरमर का दीवान-ए-खास • नहर-ए-बहिश्त',
      structuralHighlightEn: '2.4 km Sandstone Ramparts • Marble Diwan-i-Khas • Nahr-i-Bihisht Cooling',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक भारत',
      badgeEn: 'Step 3: Colonial Destruction vs Sovereign Nationhood',
      titleHi: '1857 का विनाशकारी दौर बनाम स्वतंत्रता दिवस का ध्वजारोहण',
      titleEn: '1857 Rebellion Destruction vs Independence Day Flag Hoisting',
      eraHi: '1857 ब्रिटिश छावनी ➔ आज का स्वतंत्र भारत',
      eraEn: '1857 British Garrison ➔ Sovereign Indian Democracy',
      imageOffset: 0,
      spokenHi: '1857 के प्रथम स्वतंत्रता संग्राम के बाद लाल किले का इतिहास एक दर्दनाक मोड़ से गुजरा। अंतिम मुगल सम्राट बहादुर शाह ज़फ़र को बंदी बनाकर रंगून भेज दिया गया और ब्रिटिश सेना ने किले के अस्सी प्रतिशत सुंदर शाही महलों, हरम और बागों को तोपों से ढहाकर उनकी जगह लाल ईंटों की बदरंग बैरकें खड़ी कर दीं। लेकिन 15 अगस्त 1947 को भारत के स्वतंत्र होते ही पहले प्रधानमंत्री पंडित जवाहरलाल नेहरू ने इसके लाहौरी गेट पर पहली बार तिरंगा फहराया। आज यह किला देश की संप्रभुता का सर्वोच्च प्रतीक है, जहाँ से प्रतिवर्ष देश के प्रधानमंत्री राष्ट्र को संबोधित करते हैं।',
      spokenEn: 'Following the 1857 Indian Rebellion, the Red Fort witnessed catastrophic devastation. After exiling Emperor Bahadur Shah Zafar, British forces systematically demolished eighty percent of the exquisite Mughal garden pavilions, courtyards, and harem quarters, replacing them with austere military barracks. Yet on 15 August 1947, Prime Minister Jawaharlal Nehru raised independent India’s tricolor from the Lahori Gate ramparts. Today, preserved as a UNESCO World Heritage site, it stands as the preeminent symbol of sovereign Indian democracy.',
      subtitleHi: '1857 में ब्रिटिश सेना द्वारा तोड़े गए महलों से लेकर आज स्वतंत्र भारत के राष्ट्रीय ध्वजारोहण का प्रतीक।',
      subtitleEn: 'Devastated by colonial forces in 1857, now the sovereign venue for the annual Independence Day address.',
      structuralHighlightHi: 'ऐतिहासिक लाहौरी गेट • राष्ट्रीय संप्रभुता का प्रतीक',
      structuralHighlightEn: 'Historic Lahori Gate Rampart • Sovereign Tricolor Bastion',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और गुप्त जलमार्ग',
      badgeEn: 'Step 4: Subterranean Passages & River Watergates',
      titleHi: 'यमुना नदी तल से जुड़े भूमिगत गुप्त गलियारे और तहखाने',
      titleEn: 'Subterranean River Watergates & Emergency Escape Vaults',
      eraHi: 'सैन्य सुरक्षा एवं भूमिगत जल विज्ञान',
      eraEn: 'Military Defense & Hydraulic Engineering',
      imageOffset: 1,
      spokenHi: 'लाल किले की नींव का सबसे बड़ा राज़ इसका पुराना यमुना नदी संबंध था। सत्रहवीं सदी में यमुना नदी सीधे किले की पूर्वी दीवारों को छूकर बहती थी, जहाँ खिज्री गेट जैसे विशेष जल-द्वार बनाए गए थे। इन द्वारों से शाही नौकाएं सीधे किले के तहखानों में प्रवेश कर सकती थीं, जिससे आपातकाल में रसद पहुँचाई जाती थी। किले के नीचे परस्पर जुड़ी हुई गुप्त सुरंगों और तहखानों का जाल था, जो संकट के समय सम्राट और शाही परिवार को सुरक्षित बाहर निकालने के लिए नदी और पुरानी दिल्ली के अन्य दुर्गों से जुड़े हुए थे।',
      spokenEn: 'The hidden engineering secret of the Red Fort lies in its original hydrological connection to the Yamuna. In the seventeenth century, the river washed directly against the eastern ramparts where watergates like the Khizri Gate allowed boats to enter subterranean docks beneath the palace. Beneath the fort floor lay a labyrinth of vaulted tunnels and escape corridors designed to ferry the royal family and critical state archives safely to the river or neighboring outposts during military sieges.',
      subtitleHi: 'पुराने यमुना तट से जुड़े भूमिगत जल-द्वार और आपातकालीन शाही निकास सुरंगों का जाल।',
      subtitleEn: 'Subterranean river watergates and emergency imperial escape routes beneath eastern bastions.',
      structuralHighlightHi: 'खिज्री जल-द्वार • भूमिगत आपातकालीन गुप्त सुरंगें',
      structuralHighlightEn: 'Subterranean Watergates • Emergency Escape Vaults',
      tag: 'SECRET'
    }
  ],

  // =========================================================================
  // 3. HAWA MAHAL — JAIPUR
  // =========================================================================
  'hawa-mahal': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: शाही इतिहास और निर्माण का उद्देश्य',
      badgeEn: 'Step 1: Rajput Royal Genesis & Purdah Heritage',
      titleHi: 'गुलाबी नगरी का मुकुट — हवा महल',
      titleEn: 'Crown of the Pink City — Palace of Winds',
      eraHi: '1799 ईस्वी (कछवाहा राजपूत स्वर्णिम काल)',
      eraEn: '1799 AD (Kachhwaha Rajput Golden Age)',
      imageOffset: 0,
      spokenHi: 'जयपुर के विश्वप्रसिद्ध हवा महल का निर्माण 1799 में कछवाहा राजपूत शासक महाराजा सवाई प्रताप सिंह ने करवाया था। भगवान श्रीकृष्ण के परम भक्त होने के कारण महाराजा ने मुख्य वास्तुकार लाल चंद उस्ताद से इस महल का ढांचा कान्हा के मुकुट जैसा बनवाया था। पांच मंजिला यह अनूठी इमारत लाल और गुलाबी बलुआ पत्थर से तराशी गई है, जो जयपुर के सिटी पैलेस परिसर का विस्तार थी। इसका मुख्य उद्देश्य शाही रानियों और राजकुमारियों को बिना किसी अजनबी की नज़र में आए, बाज़ार की चहल-पहल, तीज-गणगौर की सवारियों और शाही जुलूसों का आनंद देना था।',
      spokenEn: 'The world-famed Hawa Mahal was commissioned in 1799 by the Kachhwaha Rajput ruler, Maharaja Sawai Pratap Singh. A devoted follower of Lord Krishna, the Maharaja instructed master architect Lal Chand Ustad to sculpt its facade in the form of Krishna’s celestial crown. Constructed of indigenous red and pink sandstone, this five-story palace served as an extension of the City Palace complex, purposefully designed so royal women observing purdah could observe street festivals, religious processions, and vibrant bazaars without being seen by the public.',
      subtitleHi: 'महाराजा सवाई प्रताप सिंह द्वारा 1799 में भगवान कृष्ण के मुकुट स्वरूप निर्मित पाँच मंज़िला गुलाबी महल।',
      subtitleEn: 'Sculpted in 1799 by Maharaja Sawai Pratap Singh in the shape of Krishna’s crown with 953 casements.',
      structuralHighlightHi: 'शैली: राजपूत-मुगल स्थापत्य • मुख्य पत्थर: गुलाबी एवं लाल बलुआ पत्थर',
      structuralHighlightEn: 'Style: Rajput-Mughal Synthesis • Material: Pink & Red Sandstone',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: वेंटुरी प्रभाव और 953 नक्काशीदार झरोखे',
      badgeEn: 'Step 2: Venturi Aerodynamic Cooling & 953 Jharokhas',
      titleHi: 'बिना बिजली का प्राकृतिक वातानुकूलन और जालीदार झरोखे',
      titleEn: 'Natural Venturi Air-Conditioning & Lattice Screens',
      eraHi: 'प्राचीन राजपूताना वायुगतिकी विज्ञान',
      eraEn: 'Traditional Aerodynamic & Fluid Dynamics',
      imageOffset: 1,
      spokenHi: 'हवा महल की वास्तुकला प्राचीन भौतिकी और वायुगतिकी का बेमिसाल उदाहरण है। इसके बाहरी मुखौटे पर नौ सौ तिरपन बारीक नक्काशीदार खिड़कियां यानी झरोखे बने हैं, जिन पर संगमरमर की जाली का काम है। जब राजस्थान की शुष्क गर्म हवा इन छोटे-छोटे छिद्रों से होकर गुज़रती है, तो वेंटुरी प्रभाव के कारण हवा का दबाव बढ़ता है और उसका तापमान प्राकृतिक रूप से घट जाता है। इसके अलावा महल के बीच में लगे फव्वारे आने वाली हवा को नम कर देते थे, जिससे गर्मियों के पैंतालीस डिग्री तापमान में भी महल अंदर से बिल्कुल ठंडा बना रहता था।',
      spokenEn: 'The architecture of Hawa Mahal represents an ingenious application of fluid aerodynamics. Its street facade incorporates 953 intricately carved casements, or jharokhas, screened with delicate sandstone latticework. As hot desert winds strike the honeycomb facade, the Venturi effect accelerates air through the small perforations, dramatically dropping the ambient temperature. Fountains positioned at the courtyards humidified the draft, keeping the inner royal chambers chilled even during searing forty-five degree desert summers without any electricity.',
      subtitleHi: '953 झरोखों से वेंटुरी प्रभाव द्वारा 45° की गर्मी में भी महल को प्राकृतिक रूप से ठंडा रखने की तकनीक।',
      subtitleEn: '953 carved casements generating natural Venturi airflow air-conditioning in desert heat.',
      structuralHighlightHi: '953 नक्काशीदार झरोखे • वेंटुरी प्रभाव प्राकृतिक कूलिंग',
      structuralHighlightEn: '953 Jharokha Casements • Venturi Natural Air-Conditioning',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक दौर',
      badgeEn: 'Step 3: Royal Purdah Tradition vs Modern World Heritage',
      titleHi: 'राजपूती पर्दा प्रथा का साक्षी बनाम विश्व पर्यटन का सिरमौर',
      titleEn: '18th-Century Purdah Balcony vs UNESCO World Heritage Icon',
      eraHi: '18वीं सदी का पर्दा दौर ➔ आधुनिक यूनेस्को धरोहर',
      eraEn: '18th-Century Purdah Era ➔ Modern UNESCO World Heritage',
      imageOffset: 0,
      spokenHi: 'पुराने ज़माने में हवा महल केवल महिलाओं का महल था, जहाँ पुरुषों का प्रवेश वर्जित था। रानियां इन झरोखों के पीछे बैठकर सुरक्षित रूप से बाहरी दुनिया का अवलोकन करती थीं, जबकि बाहर से देखने वाले किसी भी व्यक्ति को केवल जालीदार नक्काशी ही नज़र आती थी। सदियों के बाद, जब सामंती व्यवस्था समाप्त हुई, तो यह महल राजस्थान सरकार के पुरातत्व विभाग के संरक्षण में आया। आज यह यूनेस्को विश्व धरोहर शहर जयपुर का सबसे लोकप्रिय वैश्विक पहचान-चिह्न है, जिसे प्रतिवर्ष दुनिया भर से लाखों पर्यटक देखने आते हैं।',
      spokenEn: 'In historical eras, Hawa Mahal was an exclusive royal women’s sanctuary where male entry was strictly forbidden. Sitting behind the dense sandstone filigree, royal ladies had an unobstructed panoramic view of the bustling streets, while remaining completely invisible from outside. Today, with the passage of feudal dynasties, the monument is meticulously conserved by Rajasthan State Archaeology. It stands as the quintessential global postcard of the Pink City, celebrated worldwide for its visionary climate-responsive design.',
      subtitleHi: 'शाही महिलाओं के जुलूस देखने का गुप्त झरोखा आज राजस्थान का सबसे प्रसिद्ध वैश्विक धरोहर प्रतीक है।',
      subtitleEn: 'From an exclusive royal purdah viewing gallery to the world-renowned emblem of Rajasthan.',
      structuralHighlightHi: 'पारंपरिक जालीदार स्क्रीन • राज्य संरक्षित स्मारक',
      structuralHighlightEn: 'Purdah Lattice Screens • Protected State Heritage Landmark',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और गुरुत्वाकर्षण संतुलन',
      badgeEn: 'Step 4: Foundationless Gravity Balance & Thin Walls',
      titleHi: 'बिना गहरी नींव के खड़ी बीस सेंटीमीटर पतली पांच मंजिला इमारत',
      titleEn: 'Foundationless Pyramidal Balance on 20 cm Thin Walls',
      eraHi: 'अद्वितीय पिरामिड गुरुत्वाकर्षण इंजीनियरिंग',
      eraEn: 'Pyramidal Self-Weight Gravity Equilibrium',
      imageOffset: 1,
      spokenHi: 'हवा महल का सबसे चौंकाने वाला रहस्य यह है कि ज़मीन के नीचे इसकी कोई गहरी नींव नहीं है! यह इमारत केवल अपनी पिरामिड जैसी घुमावदार बनावट और स्वयं के वजन के संतुलन पर टिकी है। इसके निचले हिस्से की दीवारें चौड़ी हैं, लेकिन जैसे-जैसे इमारत ऊपर जाती है, यह पतली होती जाती है — यहाँ तक कि पाँचवीं मंजिल की दीवार की मोटाई केवल बीस सेंटीमीटर यानी आठ इंच है! इसके अलावा महल के अंदर ऊपर चढ़ने के लिए कोई सीढ़ियां नहीं हैं, बल्कि रानियों की पोशाकों और पालकियों को आसानी से ले जाने के लिए ढलवां रैंप यानी रास्ते बनाए गए हैं।',
      spokenEn: 'The most astonishing engineering secret of Hawa Mahal is that it possesses no conventional deep underground foundation! The entire five-story structure remains standing through delicate pyramidal curvature and self-weight gravitational balance. The lower base walls are broad, but taper progressively toward the apex — with the fifth-story walls measuring barely twenty centimeters, or eight inches, in thickness! Furthermore, the interior features no staircases; instead, smooth inclined ramps were constructed to allow royal attendants to wheel palanquins gracefully.',
      subtitleHi: 'बिना गहरी नींव के केवल 20 सेमी पतली दीवार और सीढ़ियों की जगह रैंप वाली गुरुत्वाकर्षण-संतुलित संरचना।',
      subtitleEn: 'Standing without deep foundation on 20 cm thin top walls, engineered with ramps instead of stairs.',
      structuralHighlightHi: '20 सेमी पतली दीवार • बिना गहरी नींव के पिरामिड संतुलन • आंतरिक रैंप',
      structuralHighlightEn: '20 cm Thin Top Wall • Pyramid Self-Weight Balance • Interior Ramps',
      tag: 'SECRET'
    }
  ],

  // =========================================================================
  // 4. GOLDEN TEMPLE — AMRITSAR
  // =========================================================================
  'golden-temple': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: आध्यात्मिक स्थापना और पावन इतिहास',
      badgeEn: 'Step 1: Spiritual Foundation & Holy Genesis',
      titleHi: 'श्री हरिमंदिर साहिब का दिव्य इतिहास',
      titleEn: 'Spiritual Genesis of Sri Harmandir Sahib',
      eraHi: '1588 – 1604 ईस्वी (सिख गुरु काल)',
      eraEn: '1588 – 1604 AD (Sikh Guru Era)',
      imageOffset: 0,
      spokenHi: 'अमृतसर के पावन श्री हरिमंदिर साहिब की रूपरेखा पांचवें सिख गुरु, गुरु अर्जुन देव जी ने तैयार की थी। सर्वधर्म समभाव और आपसी भाईचारे का संदेश देने के लिए, गुरु जी ने दिसंबर 1588 में लाहौर के प्रसिद्ध सूफी संत हज़रत मियां मीर जी से इसकी पहली नींव की ईंट रखवाई थी। 1604 ईस्वी में गुरु अर्जुन देव जी ने यहाँ सिखों के पवित्र ग्रंथ — श्री गुरु ग्रंथ साहिब जी का पहला प्रकाश किया और बाबा बुड्ढा जी को प्रथम मुख्य ग्रंथी नियुक्त किया। यह पावन स्थल बिना किसी जाति, धर्म या वर्ग के भेदभाव के संपूर्ण मानवता के लिए खुला है।',
      spokenEn: 'The divine concept of Sri Harmandir Sahib was envisioned by the fifth Sikh Guru, Guru Arjan Dev Ji. To enshrine the universal message of interfaith brotherhood and humility, Guru Ji invited the revered Sufi saint of Lahore, Hazrat Mian Mir, to lay the foundation stone in December 1588. In 1604 AD, the holy scripture Sri Guru Granth Sahib was ceremonially consecrated inside the sanctum with Baba Buddha Ji appointed as the first head granthi. It stands welcoming all human beings without distinction.',
      subtitleHi: 'गुरु अर्जुन देव जी द्वारा स्थापित और सूफी संत हज़रत मियां मीर द्वारा 1588 में रखी गई पावन नींव।',
      subtitleEn: 'Conceived by Guru Arjan Dev Ji with foundation laid by Sufi saint Hazrat Mian Mir in 1588.',
      structuralHighlightHi: 'शैली: सिख वास्तुकला • चारों दिशाओं में खुले चार प्रवेश द्वार',
      structuralHighlightEn: 'Style: Sikh Architecture • Four Entrances Welcoming All Humanity',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: स्वर्ण आवरण, सरोवर और वास्तुकला',
      badgeEn: 'Step 2: Gilded Copper, Amrit Sarovar & Architecture',
      titleHi: 'अमृत सरोवर के केंद्र में 500 किलोग्राम शुद्ध स्वर्ण आवरण',
      titleEn: '500 kg Pure Gold Leaf Centered in the Sacred Pool',
      eraHi: 'सिख साम्राज्य का स्वर्णिम काल (1830 ईस्वी)',
      eraEn: 'Golden Era of the Sikh Empire (1830 AD)',
      imageOffset: 1,
      spokenHi: 'हरिमंदिर साहिब की सबसे अनोखी वास्तुकला यह है कि यह बाकी आसपास की ज़मीन से निचले स्तर पर बना है, ताकि श्रद्धालु नीचे उतरकर अंदर आएं जो अहंकार त्यागने और विनम्रता का प्रतीक है। इसके चारों दिशाओं में चार प्रवेश द्वार हैं, जो दर्शाते हैं कि यहाँ हर धर्म और वर्ण के व्यक्ति का समान स्वागत है। 1830 ईस्वी में शेर-ए-पंजाब महाराजा रणजीत सिंह ने मंदिर की ऊपरी मंजिलों और गुंबद पर पाँच सौ किलोग्राम शुद्ध सोने की नक्काशीदार परतें चढ़वाईं, जिसके बाद से इसे विश्व भर में "गोल्डन टेम्पल" के नाम से जाना जाने लगा।',
      spokenEn: 'The architecture of Harmandir Sahib uniquely commands humility: unlike conventional temples built on elevated platforms, it is constructed at a lower level than the surrounding parikrama, requiring devotees to step downward. Its four entrances face north, south, east, and west, symbolizing that all four varnas and every creed are welcomed equally. In 1830 AD, Maharaja Ranjit Singh adorned the marble sanctum with over five hundred kilograms of intricately embossed gold leaf, bestowing its globally celebrated title — The Golden Temple.',
      subtitleHi: 'निचले स्तर पर निर्मित विनम्रता का प्रतीक, चारों दिशाओं के चार द्वार और 500 किग्रा शुद्ध स्वर्ण परत।',
      subtitleEn: 'Lowered floor representing humility, four cardinal entrances, and 500 kg of pure gilded gold leaf.',
      structuralHighlightHi: '500 किग्रा शुद्ध स्वर्ण आवरण • अमृत सरोवर का पावन जल',
      structuralHighlightEn: '500 kg Pure Gold Leaf • Centered in Sacred Amrit Sarovar Pool',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक दौर',
      badgeEn: 'Step 3: Historical Invasions vs World’s Largest Free Kitchen',
      titleHi: 'अहमद शाह अब्दाली के हमलों से उबरना बनाम 24 घंटे का लंगर',
      titleEn: 'Survival Against Afghan Invasions vs World’s Largest Free Langar',
      eraHi: '18वीं सदी के युद्ध ➔ आज का चौबीस घंटे सेवा स्थल',
      eraEn: '18th-Century Sacrifices ➔ Modern 24/7 Langar',
      imageOffset: 0,
      spokenHi: '18वीं सदी में अफगान आक्रमणकारी अहमद शाह अब्दाली ने हरिमंदिर साहिब पर कई बार हमले किए और बारूद से पवित्र सरोवर को भर दिया था। लेकिन सिख योद्धाओं ने अदम्य साहस से हर बार इसे दोबारा पवित्र किया और इसका पुनर्निर्माण कराया। आज आधुनिक दौर में, यह स्थान दुनिया में निःस्वार्थ सेवा का सबसे बड़ा केंद्र है। यहाँ की गुरु का लंगर रसोई चौबीसों घंटे चलती है, जहाँ रोज़ एक लाख से अधिक लोगों को बिना किसी भेदभाव के पंगत में बिठाकर ताजा भोजन कराया जाता है, और सारा काम स्वयंसेवकों की कार-सेवा से चलता है।',
      spokenEn: 'During the eighteenth century, the shrine survived brutal assaults by Afghan invader Ahmed Shah Abdali, who repeatedly blew up the sanctum and desecrated the pool. Yet with unbroken resolve, Sikh misls reclaimed and rebuilt their holy center time after time. Today, the complex operates as the world’s foremost beacon of selfless service. Its legendary community kitchen, Guru Ka Langar, operates continuously 24 hours a day, preparing and serving over one hundred thousand wholesome meals daily to people of all backgrounds, powered entirely by volunteer devotion.',
      subtitleHi: 'ऐतिहासिक आक्रमणों से उबरकर आज विश्व की सबसे बड़ी निःस्वार्थ सेवा और 24 घंटे लंगर का केंद्र।',
      subtitleEn: 'Rebuilt repeatedly after 18th-century assaults, now operating the world’s largest 24/7 free community kitchen.',
      structuralHighlightHi: 'पवित्र परिक्रमा • विश्व का सबसे बड़ा निःशुल्क लंगर',
      structuralHighlightEn: 'Holy Parikrama Causeway • World’s Largest Community Kitchen',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और पवित्र सरोवर',
      badgeEn: 'Step 4: Submerged Hydraulic Mortar & Water Foundations',
      titleHi: 'चार सौ साल से पानी में भी अडिग जलमग्न जैविक चूने की नींव',
      titleEn: 'Submerged Organic Hydraulic Lime Mortar Undamaged for 400 Years',
      eraHi: 'जलमग्न वास्तुकला एवं प्राकृतिक जल शोधन',
      eraEn: 'Submerged Hydraulic Masonry Engineering',
      imageOffset: 1,
      spokenHi: 'श्री हरिमंदिर साहिब की सबसे बड़ी इंजीनियरिंग विशेषता इसकी जलमग्न नींव है। चारों तरफ से अमृत सरोवर के पानी से घिरे होने के बावजूद, पिछले चार सौ वर्षों में पानी का एक कतरा भी इसकी नींव को नुकसान नहीं पहुँचा सका है। इसे पारंपरिक जैविक चूने, उड़द की दाल, गुड़ और बेल के गूदे के विशेष मिश्रण से तैयार किया गया था, जो पानी में घूलने के बजाय और अधिक अभेद्य हो जाता है। इसके अलावा पवित्र सरोवर का जल प्राकृतिक जल स्रोतों और फिल्टरेशन प्रणाली से निरंतर शुद्ध और स्वच्छ बना रहता है।',
      spokenEn: 'The hidden structural triumph of Harmandir Sahib is its submerged masonry foundation. Standing in the middle of the sacred lake for more than four centuries, its structural pilings have suffered zero water damage. The ancient foundation mortar was compounded using slaked hydraulic lime, black gram pulses, jaggery, and organic bael resin — a traditional formulation that chemically cures and hardens into impermeable rock when submerged underwater. Continuous aeration and filtration keep the sacred pool pristine year-round.',
      subtitleHi: 'विशेष जैविक चूने व दालों की जलमग्न नींव जो 400 वर्षों से पानी में भी अभेद्य और सुरक्षित खड़ी है।',
      subtitleEn: 'Submerged organic hydraulic lime mortar foundation impermeable to water degradation for 400+ years.',
      structuralHighlightHi: 'जलमग्न जैविक चूने की नींव • प्राकृतिक वाष्पीकरण शीतलन',
      structuralHighlightEn: 'Submerged Hydraulic Lime Mortar • Evaporative Cross-Draft Cooling',
      tag: 'SECRET'
    }
  ],

  // =========================================================================
  // 5. KONARK SUN TEMPLE — ODISHA
  // =========================================================================
  'konark-sun-temple': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: शाही इतिहास और कलिंग वास्तुकला',
      badgeEn: 'Step 1: Eastern Ganga History & Kalinga Masonry',
      titleHi: 'सूर्य देव का भव्य पाषाण रथ — कोणार्क',
      titleEn: 'Surya’s Colossal Stone Chariot at Konark',
      eraHi: '1250 ईस्वी (पूर्वी गंग राजवंश काल)',
      eraEn: '1250 AD (Eastern Ganga Dynasty)',
      imageOffset: 0,
      spokenHi: 'ओडिशा के विश्वप्रसिद्ध कोणार्क सूर्य मंदिर का निर्माण 1250 ईस्वी में पूर्वी गंग राजवंश के महान शासक राजा नरसिंहदेव प्रथम ने करवाया था। बंगाल की खाड़ी के तट पर मुख्य वास्तुकार बिशु महाराणा के निर्देशन में बारह सौ कुशल शिल्पकारों ने बारह वर्षों तक अथक परिश्रम करके इस विशाल मंदिर का निर्माण किया था। पूरे मंदिर को भगवान सूर्य के चौबीस पहियों और सात विशाल घोड़ों वाले भव्य पाषाण रथ के रूप में तराशा गया था। खोंडालाइट और क्लोराइट पत्थरों पर इतनी सजीव नक्काशी की गई थी कि ऐसा प्रतीत होता है मानो सूर्य देव का रथ समुद्र से आकाश की ओर उड़ान भर रहा हो।',
      spokenEn: 'The Konark Sun Temple was commissioned in 1250 AD by King Narasimhadeva I of the Eastern Ganga Dynasty. Situated along the Bay of Bengal, chief architect Bishu Maharana and twelve hundred master sculptors laboured for twelve years to erect this colossal sanctuary. The entire complex was carved as the celestial stone chariot of the Sun God Surya, mounted on twenty-four wheels and pulled by seven galloping steeds. Sculpted from khondalite and chlorite stones, the monumental reliefs capture dancers, deities, and celestial beings with lifelike vibrancy.',
      subtitleHi: 'राजा नरसिंहदेव प्रथम द्वारा 1250 ईस्वी में 1200 शिल्पकारों द्वारा 12 वर्षों में निर्मित सूर्य देव का पाषाण रथ।',
      subtitleEn: 'Built in 1250 AD by King Narasimhadeva I as Surya’s celestial chariot with 24 wheels and 7 horses.',
      structuralHighlightHi: 'शैली: कलिंग वास्तुकला • मुख्य पत्थर: खोंडालाइट एवं क्लोराइट',
      structuralHighlightEn: 'Style: Kalinga Architecture • Material: Khondalite & Chlorite Stone',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: खगोलीय धूपघड़ी और नक्काशीदार पहिए',
      badgeEn: 'Step 2: Astronomical Sundial Wheels & Iconography',
      titleHi: 'छाया से मिनट तक का सटीक समय बताने वाले चौबीस पाषाण पहिए',
      titleEn: '24 Astronomical Sundials Calculating Time to the Minute',
      eraHi: 'प्राचीन भारतीय खगोल विज्ञान और समय गणना',
      eraEn: 'Ancient Indian Solar Chronometry & Mathematics',
      imageOffset: 1,
      spokenHi: 'कोणार्क मंदिर के चौबीस पहिए केवल सजावट नहीं, बल्कि प्राचीन भारत की अद्भुत खगोलीय धूपघड़ियां हैं। पहिए का व्यास तीन मीटर है और इसमें आठ प्रमुख तीलियां हैं, जो दिन के आठ पहरों को दर्शाती हैं। पहिए के केंद्र पर अंगुली या छड़ी रखने पर पड़ने वाली छाया से दिन का सटीक घंटा और मिनट तक नापा जा सकता है। इसके अलावा रथ के सात घोड़े सप्ताह के सात दिनों और सूर्य के प्रकाश के सात रंगों का प्रतीक हैं। पत्थरों पर उकेरी गई नर्तकियों की मुद्राओं और संगीत वाद्ययंत्रों की बारीक नक्काशी आज भी दुनिया भर के वास्तुविदों को स्तब्ध कर देती है।',
      spokenEn: 'The twenty-four monumental stone wheels are not merely decorative ornaments; they function as sophisticated astronomical chronometers. Measuring three meters in diameter, each wheel features eight major spokes representing the eight pahars (three-hour divisions) of the day. By observing the exact shadow cast across the carved beads on the spokes, time can be calculated with astonishing precision down to the exact minute. The seven galloping horses symbolize the seven days of the week and the seven colors of the solar spectrum.',
      subtitleHi: 'दिन के पहर और मिनट तक का सटीक समय बताने वाले 24 खगोलीय धूपघड़ी पहिए और सात सूर्य अश्व।',
      subtitleEn: 'High-precision sundial wheels calculating time to the minute using shadows, driven by seven solar horses.',
      structuralHighlightHi: '24 खगोलीय धूपघड़ी पहिए • बारीक खोंडालाइट मूर्तिकला',
      structuralHighlightEn: '24 Astronomical Sundials • Chlorite Iconographic Reliefs',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक संरक्षण',
      badgeEn: 'Step 3: Archival Damage vs Robotic Sand Extraction',
      titleHi: '1903 में रेत भरा जगमोहन मंडप बनाम आज का वैज्ञानिक संरक्षण',
      titleEn: '1903 British Sand Stabilization vs Modern Robotic Clearance',
      eraHi: '1903 का ब्रिटिश दौर ➔ आज का यूनेस्को संरक्षण',
      eraEn: '1903 British Stabilization ➔ Modern ASI Laser Restoration',
      imageOffset: 0,
      spokenHi: 'सदियों के दौरान समुद्री चक्रवातों और हमलों के कारण कोणार्क का मुख्य सत्तर मीटर ऊँचा गर्भगृह शिखर ढह गया था। 1903 में, जब बचा हुआ जगमोहन मंडप भी ढहने की कगार पर था, तब ब्रिटिश सरकार के इंजीनियरों ने इसे गिरने से रोकने के लिए इसके सभी दरवाज़े बंद कर दिए और अंदर की पूरी खाली जगह को रेत और पत्थरों से भर दिया। लगभग एक सौ बीस वर्षों तक यह मंडप रेत से भरा रहा। आज आधुनिक भारत में, भारतीय पुरातत्व सर्वेक्षण और केंद्रीय भवन अनुसंधान संस्थान अत्याधुनिक लेज़र सेंसर और रोबोटिक तकनीक का उपयोग करके इस रेत को सुरक्षित रूप से बाहर निकाल रहे हैं, ताकि दुनिया इसके अंदरूनी भव्य पत्थरों को दोबारा देख सके।',
      spokenEn: 'Over centuries, coastal typhoons, shifting shorelines, and military raids caused the main 70-meter temple sanctuary tower to collapse. By 1903, with the surviving Jagamohana assembly hall threatening to crumble, British colonial engineers sealed all entrances and completely filled the cavernous interior with river sand and stone masonry to prevent roof collapse. For over 120 years, the hall remained packed with sand. Today, the ASI is employing advanced endoscopic robotics and laser sensors to safely extract the century-old sand and restore interior access.',
      subtitleHi: '1903 में छत ढहने से बचाने के लिए रेत से भरा गया जगमोहन मंडप आज रोबोटिक तकनीक से बहाल हो रहा है।',
      subtitleEn: 'Packed with sand in 1903 to avert collapse, now carefully excavated and preserved using robotic sensors.',
      structuralHighlightHi: 'संरक्षित जगमोहन मंडप • यूनेस्को विश्व धरोहर (1984)',
      structuralHighlightEn: 'Preserved Jagamohana Hall • UNESCO World Heritage Site (1984)',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और चुंबकीय संतुलन',
      badgeEn: 'Step 4: Lodestone Magnetism & Multi-Ton Iron Beams',
      titleHi: 'बिना गारे के लोहे के शहतीर और शिखर का चुंबकीय रहस्य',
      titleEn: 'Forged Iron Beams & The Magnetic Lodestone Pinnacle',
      eraHi: 'प्राचीन कलिंग धातुकर्म एवं चुंबकीय विज्ञान',
      eraEn: 'Ancient Kalinga Metallurgy & Magnetic Alignment',
      imageOffset: 1,
      spokenHi: 'कोणार्क मंदिर का सबसे रहस्यमयी पहलू इसका प्राचीन धातुकर्म और चुंबकीय संतुलन था। मंदिर के भारी पत्थरों को जोड़ने के लिए किसी सीमेंट या गारे का उपयोग नहीं किया गया था, बल्कि पत्थरों के बीच कई-कई टन भारी शुद्ध लोहे के शहतीर खांचों में फंसाए गए थे। ऐतिहासिक अभिलेखों के अनुसार, मंदिर के मुख्य शिखर पर एक महाकाय चुंबकीय पत्थर यानी लोडस्टोन स्थापित था, जो गर्भगृह के चुंबकीय क्षेत्र को संतुलित रखता था। नाविकों के अनुसार, इस विशाल चुंबक के खिंचाव के कारण समुद्र में जहाजों के कंपास भटक जाते थे, जिसके चलते बाद में इसे हटा दिया गया।',
      spokenEn: 'The most intriguing engineering secret of Konark lies in its extraordinary metallurgy. No mortar was used to bond the massive sandstone blocks; instead, multi-ton wrought-iron tie-beams were forged and slotted directly into grooves between stones. Historical nautical logs recount that the original pinnacle held a colossal magnetic lodestone whose intense field suspended metallic idols in air and disrupted the magnetic compasses of Portuguese merchant galleons sailing past the coast, leading to its eventual removal.',
      subtitleHi: 'पत्थरों को बांधने वाले कई टन भारी लोहे के शहतीर और शिखर पर लगा प्राचीन चुंबकीय लोडस्टोन।',
      subtitleEn: 'Multi-ton interlocking forged iron tie-beams and historical magnetic lodestone pinnacle.',
      structuralHighlightHi: 'प्राचीन ढलवां लोहे के शहतीर • चुंबकीय शिखर रहस्य',
      structuralHighlightEn: 'Ancient Forged Iron Beams • Pinnacle Lodestone Magnetic Balance',
      tag: 'SECRET'
    }
  ],

  // =========================================================================
  // 6. QUTUB MINAR — DELHI
  // =========================================================================
  'qutub-minar': [
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: सल्तनत इतिहास और विजय मीनार',
      badgeEn: 'Step 1: Sultanate Victory Tower & Commissioning',
      titleHi: 'दिल्ली सल्तनत की बुलंद पहचान — कुतुब मीनार',
      titleEn: 'Apex of the Delhi Sultanate — Qutub Minar',
      eraHi: '1199 – 1368 ईस्वी (दिल्ली सल्तनत काल)',
      eraEn: '1199 – 1368 AD (Delhi Sultanate Era)',
      imageOffset: 0,
      spokenHi: 'कुतुब मीनार का निर्माण 1199 ईस्वी में दिल्ली सल्तनत के पहले मुस्लिम शासक कुतुबुद्दीन ऐबक ने शुरू करवाया था, जिन्होंने केवल इसकी पहली मंजिल बनवाई। उनके दामाद और उत्तराधिकारी शम्सुद्दीन इल्तुतमिश ने इसके ऊपर तीन और लाल बलुआ पत्थर की मंजिलें जोड़ीं। 1368 ईस्वी में आकाशीय बिजली गिरने से इसकी ऊपरी मंजिल क्षतिग्रस्त हो गई, जिसके बाद सुल्तान फिरोज़ शाह तुगलक ने इसका जीर्णोद्धार कराकर सफेद संगमरमर और बलुआ पत्थर की दो नई मंजिलें बनवाईं। लगभग दो शताब्दियों में विभिन्न सुल्तानों के योगदान से यह ऐतिहासिक मीनार पूरी हुई।',
      spokenEn: 'The construction of Qutub Minar was initiated in 1199 AD by Qutb-ud-din Aibak, the first Sultan of Delhi, who completed only the base storey. His successor and son-in-law, Shams-ud-din Iltutmish, added three more storeys of red sandstone. In 1368 AD, lightning struck and destroyed the upper tier, prompting Sultan Firuz Shah Tughlaq to restore the structure by adding two distinct storeys fashioned from white Makrana marble and sandstone. Spanning two centuries, it represents the collective engineering of successive Sultanate dynasties.',
      subtitleHi: '1199 से 1368 ईस्वी के बीच ऐबक, इल्तुतमिश और फिरोज़ शाह तुगलक द्वारा निर्मित विश्व की सबसे ऊँची ईंट मीनार।',
      subtitleEn: 'Built between 1199 and 1368 AD by Aibak, Iltutmish, and Firuz Shah Tughlaq.',
      structuralHighlightHi: 'शैली: इंडो-इस्लामिक अफगान • मुख्य पत्थर: लाल बलुआ पत्थर एवं संगमरमर',
      structuralHighlightEn: 'Style: Indo-Islamic Afghan • Material: Red Sandstone & Makrana Marble',
      tag: 'STRUCTURE'
    },
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: ज्यामितीय बनावट और घुमावदार कंगूरे',
      badgeEn: 'Step 2: Fluted Geometry & Balcony Corbelling',
      titleHi: '72.5 मीटर ऊँचाई, 379 सीढ़ियां और बहुकोणीय ज्यामिति',
      titleEn: '72.5m Tapering Fluted Geometry & 379 Spiral Steps',
      eraHi: 'सल्तनत कालीन ज्यामितीय और गणितीय वास्तुकला',
      eraEn: 'Mathematical Fluting & Cantilevered Balconies',
      imageOffset: 1,
      spokenHi: 'कुतुब मीनार बहत्तर दशमलव पांच मीटर यानी दो सौ अडतीस फीट ऊँची है, जो दुनिया में ईंटों से बनी सबसे ऊँची मीनार है। इसके आधार का व्यास चौदह दशमलव तीन मीटर है, जो ऊपर शीर्ष पर जाते-जाते केवल दो दशमलव सात मीटर रह जाता है। इसकी दीवारों पर बारी-बारी से गोल और नुकीले कंगूरों यानी फ्लूटिंग का ऐसा गणितीय क्रम बनाया गया है जो हवा के तेज़ झोंकों को काटता है। प्रत्येक मंजिल पर बाहर निकले हुए नक्काशीदार छज्जे हैं, जिन्हें स्टैलेक्टाइट ब्रैकेट्स से सहारा दिया गया है, और अंदर शीर्ष तक पहुँचने के लिए तीन सौ उन्यासी घुमावदार सीढ़ियां बनी हैं।',
      spokenEn: 'Rising 72.5 meters (238 feet), Qutub Minar is the tallest brick minaret in the world. Its monumental footprint tapers gracefully from a base diameter of 14.3 meters down to barely 2.7 meters at the summit. The outer surface exhibits alternating semicircular and angular flutings engineered to disperse severe lateral wind forces. Each balcony projects dramatically outward on stalactite corbelling adorned with Quranic calligraphy and geometric friezes, enclosing an internal spiral staircase of 379 stone steps.',
      subtitleHi: 'दुनिया की सबसे ऊँची 72.5 मीटर ईंट मीनार, 379 घुमावदार सीढ़ियाँ और हवा के दबाव को काटने वाली कंगूरेदार बनावट।',
      subtitleEn: 'World’s tallest 72.5m brick minaret tapering from 14.3m base with 379 spiral steps.',
      structuralHighlightHi: '72.5 मीटर ऊँचाई • 379 घुमावदार सीढ़ियाँ • स्टैलेक्टाइट छज्जे',
      structuralHighlightEn: '72.5m Monumental Height • 379 Spiral Steps • Fluted Balconies',
      tag: 'ARCHITECTURE'
    },
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक दौर',
      badgeEn: 'Step 3: 1803 Earthquake Restoration vs UNESCO Surveillance',
      titleHi: '1803 के विनाशकारी भूकंप की बहाली बनाम 24 घंटे लेज़र टिल्ट निगरानी',
      titleEn: '1803 Earthquake Restoration vs Continuous Laser Surveillance',
      eraHi: '1803 ब्रिटिश बहाली ➔ आज का यूनेस्को संरक्षण',
      eraEn: '1803 British Restoration ➔ Modern UNESCO Protection',
      imageOffset: 0,
      spokenHi: '1803 में दिल्ली में आए एक विनाशकारी भूकंप में कुतुब मीनार की शीर्ष छतरी टूटकर नीचे गिर गई थी और इमारत को गहरा नुकसान पहुँचा था। ब्रिटिश सेना के इंजीनियर मेजर रॉबर्ट स्मिथ ने 1828 में इसकी बहाली की और एक नई छतरी बनवाई, जिसे बाद में असंगत मानकर नीचे परिसर में रख दिया गया — जिसे आज भी "स्मिथ्स फॉली" कहा जाता है। आज आधुनिक दौर में, यह यूनेस्को विश्व धरोहर स्थल है। भारतीय पुरातत्व सर्वेक्षण ने मीनार के चारों ओर अत्याधुनिक लेज़र टिल्ट सेंसर और सीस्मिक एक्सेलेरोमीटर लगाए हैं, जो चौबीसों घंटे इसके झुकाव पर डिजिटल निगरानी रखते हैं।',
      spokenEn: 'In 1803, a catastrophic earthquake rocked Delhi, shattering the summit cupola and fracturing the upper storeys of the minaret. British military engineer Major Robert Smith repaired the structure in 1828 and erected an ornate Gothic cupola, which Lord Hardinge later removed as stylistically incongruous; it now sits on the garden lawns nearby, famously known as "Smith’s Folly." Today, protected as a UNESCO World Heritage site, the ASI monitors the tower with electronic tiltmeters and seismic accelerometers measuring microscopic deflections around the clock.',
      subtitleHi: '1803 भूकंप के बाद मेजर स्मिथ द्वारा बहाली, आज 24 घंटे लेज़र सेंसर द्वारा सुरक्षित।',
      subtitleEn: 'Restored after the 1803 earthquake by Major Smith, now monitored with digital laser deflection sensors.',
      structuralHighlightHi: '1803 बहाली इतिहास • 24 घंटे डिजिटल झुकाव निगरानी',
      structuralHighlightEn: '1803 Restoration Legacy • Round-the-Clock Laser Tilt Monitoring',
      tag: 'TIME_TRAVEL'
    },
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और लौह स्तंभ का चमत्कार',
      badgeEn: 'Step 4: Subterranean Base & The 1600-Year Rustless Pillar',
      titleHi: 'सोलह सौ वर्षों से बिना जंग लगा खड़ा प्राचीन गुप्तकालीन लौह स्तंभ',
      titleEn: '1600-Year Rustless Iron Pillar Metallurgical Wonder',
      eraHi: 'चौथी सदी ईस्वी (गुप्तकालीन धातु विज्ञान)',
      eraEn: '4th Century AD (Gupta Metallurgical Mastery)',
      imageOffset: 1,
      spokenHi: 'कुतुब परिसर का सबसे अकल्पनीय वैज्ञानिक रहस्य इसके आंगन में खड़ा सोलह सौ साल पुराना गुप्तकालीन लौह स्तंभ है। चौथी सदी में सम्राट चंद्रगुप्त विक्रमादित्य के काल में ढाला गया यह सात मीटर ऊँचा और छह टन भारी स्तंभ शुद्ध लोहे से बना है। सदियों तक दिल्ली की तेज धूप, आंधी और मानसूनी बारिश के बावजूद आज तक इस पर जंग का एक कतरा भी नहीं लगा है! आधुनिक वैज्ञानिकों ने पाया कि प्राचीन भारतीय धातुकर्मियों ने इसमें उच्च फास्फोरस का प्रयोग करके सतह पर मिसावाइट नामक एक सुरक्षात्मक ऑक्साइड परत बनाई थी, जो आज के वैज्ञानिक युग के लिए भी एक अजूबा है।',
      spokenEn: 'The most extraordinary scientific mystery of the Qutub complex is the 1600-year-old Iron Pillar standing in the courtyard. Forged in the fourth century AD during the golden reign of Gupta Emperor Chandragupta II Vikramaditya, this seven-meter-high, six-ton monument of wrought iron has stood exposed to open rain, desert sun, and humidity for sixteen centuries without a single spot of rust! Modern metallurgists discovered that ancient Indian blacksmiths enriched the iron with high phosphorus, forming a protective catalytic misawite film that shields the metal indefinitely.',
      subtitleHi: '1600 वर्षों से खुली धूप-बारिश में बिना जंग लगे खड़ा प्राचीन गुप्तकालीन 6 टन लौह स्तंभ।',
      subtitleEn: '1600-year-old rustless Iron Pillar standing in open rain without corrosion.',
      structuralHighlightHi: 'गुप्तकालीन जंग-रोधी लौह स्तंभ • 6 टन प्राचीन धातु विज्ञान',
      structuralHighlightEn: 'Gupta Rustless Iron Pillar • 6-Ton Metallurgical Miracle',
      tag: 'SECRET'
    }
  ]
};

/**
 * Universal rich factual generator for all 47 monuments.
 * Generates an immersive, educational, non-repetitive guide narrative.
 */
export function getMonumentBespokeOrGeneratedTour(monument: IndianMonument): BespokeTourStepData[] {
  if (ALL_47_MONUMENTS_DATA[monument.id]?.tour) {
    return ALL_47_MONUMENTS_DATA[monument.id].tour;
  }

  if (BESPOKE_MONUMENT_TOURS[monument.id]) {
    return BESPOKE_MONUMENT_TOURS[monument.id];
  }

  const primaryMaterial = monument.materials.split(',')[0].replace(/\([^)]*\)/g, '').trim();
  const feature = monument.architecturalFeatures[0];
  const featureNameHi = feature ? feature.hindiName : 'विशिष्ट स्थापत्य नक्काशी';
  const featureNameEn = feature ? feature.name : 'Master Architectural Structure';
  const featureDescHi = feature ? feature.significance : 'इसकी बनावट में प्राचीन भारत की अनूठी निर्माण कला झलकती है।';
  const featureDescEn = feature ? feature.description : 'Exhibiting classical structural proportion and masonry craftsmanship.';

  return [
    // Step 1: Real History & Commissioning
    {
      stepNumber: 1,
      badgeHi: 'चरण 1: शाही इतिहास और निर्माण का आरंभ',
      badgeEn: 'Step 1: Royal History & Construction Genesis',
      titleHi: `${monument.hindiName} का इतिहास`,
      titleEn: `History of ${monument.name}`,
      eraHi: `निर्माण काल: ${monument.historicalPeriod}`,
      eraEn: `Constructed: ${monument.historicalPeriod}`,
      imageOffset: 0,
      spokenHi: `${monument.city}, ${monument.state} की ऐतिहासिक धरोहर — ${monument.hindiName} का निर्माण ${monument.historicalPeriod} में ${monument.dynastyOrBuilder} द्वारा करवाया गया था। इस भव्य संरचना को तैयार करने में मुख्य रूप से ${primaryMaterial} का उपयोग किया गया। उस काल के प्रख्यात वास्तुकारों और शिल्पकारों ने वर्षों के परिश्रम से इसे स्थानीय संस्कृति, शक्ति और वास्तुकला के प्रतीक के रूप में स्थापित किया।`,
      spokenEn: `${monument.name}, located in ${monument.city}, ${monument.state}, was commissioned during the ${monument.historicalPeriod} under ${monument.dynastyOrBuilder}. Crafted primarily from native ${primaryMaterial}, master artisans laboured for years to establish this landmark as an enduring symbol of imperial culture and craftsmanship.`,
      subtitleHi: `${monument.hindiName}: ${monument.dynastyOrBuilder} द्वारा ${monument.historicalPeriod} में ${primaryMaterial} से निर्मित।`,
      subtitleEn: `${monument.name}: Built under ${monument.dynastyOrBuilder} during ${monument.historicalPeriod} using ${primaryMaterial}.`,
      structuralHighlightHi: `शैली: ${monument.architecturalStyle.split(' ')[0]} • मुख्य पत्थर: ${primaryMaterial}`,
      structuralHighlightEn: `Style: ${monument.architecturalStyle.split(' ')[0]} • Material: ${primaryMaterial}`,
      tag: 'STRUCTURE'
    },
    // Step 2: Architecture & Craftsmanship
    {
      stepNumber: 2,
      badgeHi: 'चरण 2: बनावट, नक्काशी और वास्तुकला',
      badgeEn: 'Step 2: Architecture & Craftsmanship',
      titleHi: featureNameHi,
      titleEn: featureNameEn,
      eraHi: 'पारंपरिक कारीगरी और स्थापत्य संतुलन',
      eraEn: 'Traditional Engineering Precision',
      imageOffset: 1,
      spokenHi: `इस स्मारक की प्रमुख स्थापत्य पहचान है — ${featureNameHi}। ${featureDescHi} कुशल कारीगरों ने बिना किसी आधुनिक मशीन के केवल पारंपरिक औजारों से पत्थरों को आपस में ऐसे जोड़ा कि सदियों बाद भी इसमें कोई दरार नहीं आई। इसकी ज्यामिति और खंभों का भार-वितरण प्राचीन भारतीय वास्तु-शास्त्र के नियमों पर आधारित है।`,
      spokenEn: `A signature architectural hallmark of this monument is ${featureNameEn}. ${featureDescEn} Master masons interlocked stones with remarkable precision using only traditional hand tools, maintaining structural stability across centuries.`,
      subtitleHi: `${featureNameHi}: ${featureDescHi}`,
      subtitleEn: `${featureNameEn}: ${featureDescEn}`,
      structuralHighlightHi: `वास्तुशिल्प: ${featureNameHi} • तराशे गए पत्थरों का संतुलन`,
      structuralHighlightEn: `Architecture: ${featureNameEn} • Interlocking Stone Precision`,
      tag: 'ARCHITECTURE'
    },
    // Step 3: Historical Era vs Modern Conservation
    {
      stepNumber: 3,
      badgeHi: 'चरण 3: पुराना ज़माना बनाम आधुनिक संरक्षण',
      badgeEn: 'Step 3: Historical Archives vs Modern Conservation',
      titleHi: 'ऐतिहासिक काल बनाम वर्तमान संरक्षण',
      titleEn: 'Historical Heritage vs Modern Conservation',
      eraHi: `शाही काल ➔ आज (${monument.unescoStatus.includes('UNESCO') ? 'यूनेस्को विश्व धरोहर' : 'राष्ट्रीय धरोहर'})`,
      eraEn: `Imperial Era ➔ Modern Preservation`,
      imageOffset: 0,
      spokenHi: `पुराने दौर में यह स्थल शाही दरबारों, धार्मिक उत्सवों और ऐतिहासिक राजनीतिक घटनाओं का जीवंत केंद्र हुआ करता था। समय के साथ लड़ाइयों और प्राकृतिक आपदाओं को सहते हुए, आज यह परिसर ${monument.unescoStatus} के रूप में भारतीय पुरातत्व सर्वेक्षण की वैज्ञानिक देखरेख में सुरक्षित है, ताकि आने वाली पीढ़ियां हमारे इतिहास को साक्षात देख सकें।`,
      spokenEn: `In earlier historical centuries, this complex served as a thriving center of imperial ceremonies, religious devotion, and governance. Having withstood battles and environmental weathering over centuries, it is preserved today under ${monument.unescoStatus} by the Archaeological Survey of India.`,
      subtitleHi: `ऐतिहासिक शाही केंद्र से लेकर आज भारतीय पुरातत्व सर्वेक्षण द्वारा वैज्ञानिक संरक्षण।`,
      subtitleEn: `From historic imperial center to modern scientific ASI conservation.`,
      structuralHighlightHi: `संरक्षण स्थिति: ${monument.unescoStatus}`,
      structuralHighlightEn: `Conservation Status: ${monument.unescoStatus}`,
      tag: 'TIME_TRAVEL'
    },
    // Step 4: Foundations & Structural Secrets
    {
      stepNumber: 4,
      badgeHi: 'चरण 4: नींव का रहस्य और गुप्त संरचना',
      badgeEn: 'Step 4: Subterranean Foundations & Secrets',
      titleHi: 'नींव की मजबूती और भूकंप-रोधी रचना',
      titleEn: 'Subterranean Foundation Engineering',
      eraHi: 'प्राचीन संरचनात्मक संतुलन एवं गुप्त रहस्य',
      eraEn: 'Ancient Structural Engineering Balance',
      imageOffset: 1,
      spokenHi: `इस इमारत की सबसे बड़ी मजबूती इसकी ज़मीन के नीचे की नींव और सटीक भार-संतुलन में छिपी है। प्राचीन वास्तुकारों ने जमीन के स्तर पर ऐसा भार-वितरण किया था कि प्राकृतिक भूकंप और मिट्टी के कटाव के बावजूद इमारत की प्राचीरें और स्तंभ सदियों से अडिग खड़े हैं।`,
      spokenEn: `The structural longevity of this monument lies in its subterranean foundation beds and precision load distribution. Ancient builders designed foundation beds to dissipate seismic shocks and soil moisture, ensuring that the walls remain intact across centuries.`,
      subtitleHi: 'प्राचीन वास्तुकारों द्वारा तैयार गहरी नींव और प्राकृतिक आपदा-रोधी भार-संतुलन।',
      subtitleEn: 'Deep foundation load-distribution engineering safeguarding the structure.',
      structuralHighlightHi: 'प्राचीन भार-संतुलन • प्राकृतिक आपदा रोधी नींव',
      structuralHighlightEn: 'Ancient Load-Distribution • Resilient Foundation Bed',
      tag: 'SECRET'
    }
  ];
}
