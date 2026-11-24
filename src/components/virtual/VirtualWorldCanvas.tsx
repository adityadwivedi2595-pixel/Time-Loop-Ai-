'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  RotateCcw, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  Compass, 
  Layers, 
  Sparkles, 
  Camera, 
  Check, 
  Eye, 
  Globe, 
  Maximize2, 
  Info,
  Waves,
  TreePine,
  ShieldAlert,
  Boxes,
  Volume2
} from 'lucide-react';

export type WorldEra = 
  | 'taj-mahal'
  | 'delhi-fort'
  | 'agra-fort'
  | 'sun-temple'
  | 'ancient-india' 
  | 'cyberpunk-future' 
  | 'space-civilization' 
  | 'medieval-kingdom' 
  | 'ancient-egypt'
  | 'roman-empire'
  | 'feudal-japan';

export type GraphicsQuality = 'low' | 'medium' | 'high' | 'ultra';
export type CameraViewMode = 'orbit' | 'walk' | 'top' | 'first' | 'third' | 'cinematic';

export interface VirtualWorldCanvasProps {
  era: WorldEra;
  quality?: GraphicsQuality;
  cameraMode?: CameraViewMode;
  onCameraModeChange?: (mode: CameraViewMode) => void;
  onInteractObject?: (objectName: string, lore: string) => void;
  isAudioSpeaking?: boolean;
  focusTarget?: { x: number; y: number; z: number; label: string } | null;
  photosphereUrl?: string;
  initialRenderMode?: 'street-view' | '3d-orbit' | 'asli-360' | '3d-cad';
}

export const DEFAULT_REAL_PHOTOS: Record<WorldEra, string> = {
  'taj-mahal': '/images/taj-mahal-360.jpg',
  'delhi-fort': 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1600&q=85',
  'agra-fort': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85',
  'sun-temple': 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1600&q=85',
  'ancient-india': 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=1600&q=85',
  'ancient-egypt': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1600&q=85',
  'roman-empire': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=85',
  'medieval-kingdom': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
  'feudal-japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85',
  'cyberpunk-future': 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1600&q=85',
  'space-civilization': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85',
};

// ==========================================
// HIGH-RES PROCEDURAL TEXTURE GENERATORS
// ==========================================
function createMarbleTexture(isNight: boolean): THREE.Texture {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = isNight ? '#e2e8f0' : '#fcfbfa';
  ctx.fillRect(0, 0, 512, 512);

  // Soft translucent grey/amber veins of Makrana marble
  ctx.lineWidth = 1.8;
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = isNight ? 'rgba(148, 163, 184, 0.22)' : 'rgba(203, 213, 225, 0.35)';
    ctx.beginPath();
    let x = Math.random() * 512;
    let y = 0;
    ctx.moveTo(x, y);
    while (y < 512) {
      x += (Math.random() - 0.5) * 35;
      y += Math.random() * 45;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Delicate crystalline noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 8;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createRedSandstoneTexture(isNight: boolean): THREE.Texture {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  ctx.fillStyle = isNight ? '#451a14' : '#8b3a2b';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 28;
    data[i] = Math.max(0, Math.min(255, data[i] + n * 1.2));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n * 0.7));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n * 0.5));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createWaterTexture(isNight: boolean): THREE.Texture {
  if (typeof document === 'undefined') return new THREE.Texture();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.Texture();

  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  if (isNight) {
    grad.addColorStop(0, '#0c4a6e');
    grad.addColorStop(1, '#082f49');
  } else {
    grad.addColorStop(0, '#0284c7');
    grad.addColorStop(0.5, '#0ea5e9');
    grad.addColorStop(1, '#0369a1');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Concentric wave ripple reflections
  ctx.strokeStyle = isNight ? 'rgba(56, 189, 248, 0.25)' : 'rgba(224, 242, 254, 0.45)';
  ctx.lineWidth = 2.0;
  for (let i = 0; i < 22; i++) {
    const y = i * 24 + Math.sin(i) * 6;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(128, y + 10, 384, y - 10, 512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 6);
  return texture;
}

export function VirtualWorldCanvas({
  era,
  quality = 'high',
  cameraMode = 'orbit',
  onCameraModeChange,
  onInteractObject,
  isAudioSpeaking = false,
  focusTarget = null,
  photosphereUrl,
  initialRenderMode = 'street-view'
}: VirtualWorldCanvasProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(60);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [activeAnglePreset, setActiveAnglePreset] = useState<string>('front');
  
  // Normalized view mode: 'street-view' (100% Real Photo VR) vs '3d-orbit' (3D Digital Twin)
  const normalizedInitial = (initialRenderMode === '3d-cad' || initialRenderMode === '3d-orbit') 
    ? '3d-orbit' 
    : 'street-view';
  const [renderMode, setRenderMode] = useState<'street-view' | '3d-orbit'>(normalizedInitial);
  const [zoomFov, setZoomFov] = useState<number>(65);

  const realPhotoUrl = photosphereUrl || DEFAULT_REAL_PHOTOS[era] || DEFAULT_REAL_PHOTOS['taj-mahal'];

  // Spherical Coordinates for Street View Mode
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const cameraFovRef = useRef<number>(65);

  // Camera Spherical Orbit References for 3D Orbit Mode
  const targetThetaRef = useRef<number>(0.0);
  const currentThetaRef = useRef<number>(0.0);
  const targetPhiRef = useRef<number>(0.24);
  const currentPhiRef = useRef<number>(0.24);
  const targetRadiusRef = useRef<number>(62.0);
  const currentRadiusRef = useRef<number>(62.0);
  const targetCenterRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 10, -5));

  const isDraggingRef = useRef<boolean>(false);
  const prevMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoRotateRef = useRef<boolean>(true);
  autoRotateRef.current = autoRotate;

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGlSupported(false);
    } catch {
      setWebGlSupported(false);
    }
  }, []);

  // Preset angle switcher for 3D Orbit Mode
  const setCameraView = (view: 'front' | 'river' | 'mosque' | 'jawab' | 'drone') => {
    setActiveAnglePreset(view);
    if (view === 'front') {
      targetThetaRef.current = 0.0;
      targetPhiRef.current = 0.22;
      targetRadiusRef.current = 58.0;
      targetCenterRef.current.set(0, 11, -8);
    } else if (view === 'river') {
      targetThetaRef.current = Math.PI; // 180° back view of Yamuna riverfront
      targetPhiRef.current = 0.28;
      targetRadiusRef.current = 65.0;
      targetCenterRef.current.set(0, 11, -12);
    } else if (view === 'mosque') {
      targetThetaRef.current = -Math.PI / 2; // West mosque view
      targetPhiRef.current = 0.32;
      targetRadiusRef.current = 70.0;
      targetCenterRef.current.set(-20, 11, -12);
    } else if (view === 'jawab') {
      targetThetaRef.current = Math.PI / 2; // East jawab view
      targetPhiRef.current = 0.32;
      targetRadiusRef.current = 70.0;
      targetCenterRef.current.set(20, 11, -12);
    } else if (view === 'drone') {
      targetPhiRef.current = 1.08; // High bird's eye aerial
      targetRadiusRef.current = 110.0;
      targetCenterRef.current.set(0, 6, 10);
    }
  };

  const handleZoom = (inOut: 'in' | 'out') => {
    if (renderMode === 'street-view') {
      cameraFovRef.current = Math.max(30, Math.min(85, cameraFovRef.current + (inOut === 'in' ? -8 : 8)));
      setZoomFov(Math.round(cameraFovRef.current));
    } else {
      const delta = inOut === 'in' ? -12 : 12;
      targetRadiusRef.current = Math.max(22, Math.min(135, targetRadiusRef.current + delta));
    }
  };

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webGlSupported) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    let animationFrameId: number;

    const renderer = new THREE.WebGLRenderer({
      antialias: quality !== 'low',
      powerPreference: 'high-performance',
      stencil: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isNightMode ? 0.75 : 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';

    const hotspotsGroup = new THREE.Group();

    // Hotspot Creator Helper
    const addHotspot = (x: number, y: number, z: number, name: string, lore: string) => {
      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(1.6, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x06b6d4 })
      );
      pin.position.set(x, y, z);
      pin.userData = { name, lore };

      const ring = new THREE.Mesh(
        new THREE.RingGeometry(2.0, 2.7, 24),
        new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide })
      );
      ring.position.set(x, y, z);
      ring.lookAt(0, 10, 50);

      hotspotsGroup.add(pin);
      hotspotsGroup.add(ring);
    };

    // ==========================================
    // MODE 1: ASLI 360° STREET VIEW VR (REAL PHOTOSPHERE)
    // ==========================================
    if (renderMode === 'street-view') {
      const camera = new THREE.PerspectiveCamera(cameraFovRef.current, width / height, 0.1, 1200);
      camera.position.set(0, 0, 0);

      const sphereGeo = new THREE.SphereGeometry(500, 60, 40);
      sphereGeo.scale(-1, 1, 1);

      const sphereMat = new THREE.MeshBasicMaterial({
        color: isNightMode ? 0xa5b4fc : 0xffffff,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      scene.add(sphereMesh);

      textureLoader.load(
        realPhotoUrl,
        (loadedTex) => {
          loadedTex.minFilter = THREE.LinearFilter;
          sphereMat.map = loadedTex;
          sphereMat.needsUpdate = true;
        },
        undefined,
        (err) => console.warn('Photosphere load fallback:', err)
      );

      // Spatial Hotspots on the Real Photo
      if (era === 'taj-mahal') {
        addHotspot(0, 120, -450, 'Main Makrana Marble Dome (Amrud)', '35m pure translucent white Makrana marble onion dome crowned by an inverted lotus finial and golden crescent.');
        addHotspot(-220, 95, -390, 'Outward-Leaning Minaret', 'Constructed with a 3-degree outward lean to ensure it collapses away from the central tomb during earthquakes.');
        addHotspot(0, -85, -420, 'Al Hawd al-Kawthar (Sacred Reflection Canal)', 'Mirror water channel reflecting the perfect bilateral symmetry of the Mughal facade.');
        addHotspot(180, -25, -380, 'Charbagh Cypress Avenue', 'Four-fold Mughal garden symbolizing the Quranic rivers of paradise with Italian cypress trees.');
        addHotspot(0, 10, -480, 'Colossal Pishtaq Archway (Iwan)', 'Sacred portal inscribed with Quranic calligraphy and semi-precious pietra dura floral inlays.');
      } else if (era === 'delhi-fort') {
        addHotspot(0, 80, -450, 'Lahore Gate of Red Fort', 'The monumental red sandstone entrance facing the historic market street of Chandni Chowk.');
        addHotspot(-180, 50, -400, 'Diwan-i-Khas Marble Hall', 'The private imperial audience chamber that once housed the Peacock Throne (Takht-i-Taus).');
      } else if (era === 'agra-fort') {
        addHotspot(0, 90, -450, 'Jahangiri Mahal Ramparts', 'Massive red sandstone fortress palace overlooking the bend of the Yamuna River.');
        addHotspot(160, 40, -400, 'Musamman Burj Octagonal Tower', 'Where Shah Jahan spent his final years gazing out at the Taj Mahal.');
      } else if (era === 'sun-temple') {
        addHotspot(-120, -20, -420, 'Konark 24-Spoked Sun Wheel', 'Carved stone sundial that calculates exact time to the minute using the shadow of the central axle.');
        addHotspot(0, 120, -450, 'Vimana Sun Sanctuary', '13th-century colossal chariot of Surya drawn by seven galloping stone horses.');
      }

      scene.add(hotspotsGroup);

      // Drag Controls for Street View
      const onMouseDownSV = (e: MouseEvent) => {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      const onMouseMoveSV = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;

        lonRef.current += deltaX * 0.16;
        latRef.current = Math.max(-85, Math.min(85, latRef.current - deltaY * 0.16));

        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      const onMouseUpSV = () => {
        isDraggingRef.current = false;
      };

      const onWheelSV = (e: WheelEvent) => {
        e.preventDefault();
        cameraFovRef.current = Math.max(30, Math.min(85, cameraFovRef.current + e.deltaY * 0.05));
        camera.fov = cameraFovRef.current;
        camera.updateProjectionMatrix();
        setZoomFov(Math.round(cameraFovRef.current));
      };

      const dom = renderer.domElement;
      dom.addEventListener('mousedown', onMouseDownSV);
      window.addEventListener('mousemove', onMouseMoveSV);
      window.addEventListener('mouseup', onMouseUpSV);
      dom.addEventListener('wheel', onWheelSV, { passive: false });

      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2();

      const onClickSV = (e: MouseEvent) => {
        const rect = dom.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVec, camera);
        const intersects = raycaster.intersectObjects(hotspotsGroup.children);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.name) {
            onInteractObject?.(hit.userData.name, hit.userData.lore);
          }
        }
      };
      dom.addEventListener('click', onClickSV);

      let lastTime = performance.now();
      let frameCount = 0;
      let fpsTimer = 0;

      const animateSV = (currentTime: number) => {
        animationFrameId = requestAnimationFrame(animateSV);

        const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
        lastTime = currentTime;

        frameCount++;
        fpsTimer += delta;
        if (fpsTimer >= 1.0) {
          setFps(frameCount);
          frameCount = 0;
          fpsTimer = 0;
        }

        if (autoRotateRef.current && !isDraggingRef.current) {
          lonRef.current += delta * 4.5;
        }

        const phi = THREE.MathUtils.degToRad(90 - latRef.current);
        const theta = THREE.MathUtils.degToRad(lonRef.current);

        const targetX = 500 * Math.sin(phi) * Math.cos(theta);
        const targetY = 500 * Math.cos(phi);
        const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

        camera.lookAt(targetX, targetY, targetZ);
        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animateSV);

      return () => {
        cancelAnimationFrame(animationFrameId);
        dom.removeEventListener('mousedown', onMouseDownSV);
        window.removeEventListener('mousemove', onMouseMoveSV);
        window.removeEventListener('mouseup', onMouseUpSV);
        dom.removeEventListener('wheel', onWheelSV);
        dom.removeEventListener('click', onClickSV);
        renderer.dispose();
      };

    // ==========================================
    // MODE 2: 3D DIGITAL TWIN ORBIT (SCREEN ROUND & ENVIRONMENT)
    // ==========================================
    } else {
      scene.background = new THREE.Color(isNightMode ? 0x030712 : 0x7dd3fc);
      scene.fog = new THREE.FogExp2(isNightMode ? 0x050a18 : 0xbbe3f7, 0.007);

      const camera = new THREE.PerspectiveCamera(54, width / height, 0.5, 900);

      // Environment Sky Dome with Real Photo
      const skyDomeGeo = new THREE.SphereGeometry(450, 40, 30);
      skyDomeGeo.scale(-1, 1, 1);
      const skyDomeMat = new THREE.MeshBasicMaterial({ color: isNightMode ? 0x475569 : 0xffffff });
      const skyDomeMesh = new THREE.Mesh(skyDomeGeo, skyDomeMat);
      scene.add(skyDomeMesh);

      textureLoader.load(realPhotoUrl, (tex) => {
        skyDomeMat.map = tex;
        skyDomeMat.needsUpdate = true;
      });

      // Procedural PBR Textures
      const marbleTex = createMarbleTexture(isNightMode);
      const sandstoneTex = createRedSandstoneTexture(isNightMode);
      const waterTex = createWaterTexture(isNightMode);

      const marbleMat = new THREE.MeshStandardMaterial({
        map: marbleTex,
        color: isNightMode ? 0xdbeafe : 0xffffff,
        roughness: 0.22,
        metalness: 0.08,
      });

      const sandstoneMat = new THREE.MeshStandardMaterial({
        map: sandstoneTex,
        color: isNightMode ? 0x991b1b : 0xa84332,
        roughness: 0.82,
        metalness: 0.02,
      });

      const goldMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.12,
      });

      const waterMat = new THREE.MeshStandardMaterial({
        map: waterTex,
        color: isNightMode ? 0x0284c7 : 0x06b6d4,
        roughness: 0.08,
        metalness: 0.7,
        transparent: true,
        opacity: 0.92,
      });

      const grassMat = new THREE.MeshStandardMaterial({
        color: isNightMode ? 0x064e3b : 0x15803d,
        roughness: 0.85,
      });

      const cypressFoliageMat = new THREE.MeshStandardMaterial({
        color: isNightMode ? 0x022c22 : 0x0f5132,
        roughness: 0.9,
      });

      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        roughness: 0.95,
      });

      // Lights
      const hemiLight = new THREE.HemisphereLight(
        isNightMode ? 0x1e1b4b : 0xffffff,
        isNightMode ? 0x020617 : 0xa16207,
        isNightMode ? 0.6 : 0.9
      );
      scene.add(hemiLight);

      const sunLight = new THREE.DirectionalLight(
        isNightMode ? 0xc7d2fe : 0xfffaed,
        isNightMode ? 1.0 : 2.2
      );
      sunLight.position.set(45, 80, 55);
      scene.add(sunLight);

      const backRimLight = new THREE.DirectionalLight(
        isNightMode ? 0x38bdf8 : 0xfde047,
        isNightMode ? 0.5 : 0.9
      );
      backRimLight.position.set(-40, 50, -60);
      scene.add(backRimLight);

      const worldGroup = new THREE.Group();

      if (era === 'taj-mahal') {
        // 1. Yamuna River behind the north terrace
        const river = new THREE.Mesh(new THREE.PlaneGeometry(280, 95, 32, 16), waterMat);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -0.6, -75);
        worldGroup.add(river);

        // Sandy riverbank
        const sandbank = new THREE.Mesh(
          new THREE.BoxGeometry(280, 1.4, 16),
          new THREE.MeshStandardMaterial({ color: isNightMode ? 0x78716c : 0xd6c4a5, roughness: 0.95 })
        );
        sandbank.position.set(0, -0.1, -29);
        worldGroup.add(sandbank);

        // 2. Red Sandstone Riverfront Terrace
        const redTerrace = new THREE.Mesh(new THREE.BoxGeometry(160, 3.2, 44), sandstoneMat);
        redTerrace.position.set(0, 1.6, -12);
        worldGroup.add(redTerrace);

        // 3. Western Mosque
        const mosqueGroup = new THREE.Group();
        mosqueGroup.position.set(-58, 3.2, -12);
        const mosqueMain = new THREE.Mesh(new THREE.BoxGeometry(24, 13, 16), sandstoneMat);
        mosqueMain.position.y = 6.5;
        mosqueGroup.add(mosqueMain);

        const mosqueArch = new THREE.Mesh(
          new THREE.BoxGeometry(8, 10, 3),
          new THREE.MeshStandardMaterial({ color: 0x26120e, roughness: 0.9 })
        );
        mosqueArch.position.set(0, 5.0, 7.5);
        mosqueGroup.add(mosqueArch);

        const domeCenter = new THREE.Mesh(new THREE.SphereGeometry(3.6, 24, 18), marbleMat);
        domeCenter.scale.set(1.0, 1.25, 1.0);
        domeCenter.position.set(0, 15, 0);
        mosqueGroup.add(domeCenter);

        [-6.5, 6.5].forEach((dx) => {
          const sideDome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 16), marbleMat);
          sideDome.scale.set(1.0, 1.2, 1.0);
          sideDome.position.set(dx, 14.2, 0);
          mosqueGroup.add(sideDome);
        });
        worldGroup.add(mosqueGroup);

        // 4. Eastern Jawab Assembly Hall
        const jawabGroup = new THREE.Group();
        jawabGroup.position.set(58, 3.2, -12);
        const jawabMain = new THREE.Mesh(new THREE.BoxGeometry(24, 13, 16), sandstoneMat);
        jawabMain.position.y = 6.5;
        jawabGroup.add(jawabMain);

        const jawabArch = new THREE.Mesh(
          new THREE.BoxGeometry(8, 10, 3),
          new THREE.MeshStandardMaterial({ color: 0x26120e, roughness: 0.9 })
        );
        jawabArch.position.set(0, 5.0, 7.5);
        jawabGroup.add(jawabArch);

        const jawabDomeCenter = new THREE.Mesh(new THREE.SphereGeometry(3.6, 24, 18), marbleMat);
        jawabDomeCenter.scale.set(1.0, 1.25, 1.0);
        jawabDomeCenter.position.set(0, 15, 0);
        jawabGroup.add(jawabDomeCenter);

        [-6.5, 6.5].forEach((dx) => {
          const sideDome = new THREE.Mesh(new THREE.SphereGeometry(2.6, 20, 16), marbleMat);
          sideDome.scale.set(1.0, 1.2, 1.0);
          sideDome.position.set(dx, 14.2, 0);
          jawabGroup.add(sideDome);
        });
        worldGroup.add(jawabGroup);

        // 5. White Makrana Marble Plinth (Chabutra)
        const marblePlinth = new THREE.Mesh(new THREE.BoxGeometry(44, 3.8, 44), marbleMat);
        marblePlinth.position.set(0, 4.8, -12);
        worldGroup.add(marblePlinth);

        // 6. Central Tomb Structure & Arches
        const tombMain = new THREE.Mesh(new THREE.BoxGeometry(26, 17, 26), marbleMat);
        tombMain.position.set(0, 15.2, -12);
        worldGroup.add(tombMain);

        const pishtaqMat = new THREE.MeshStandardMaterial({
          color: isNightMode ? 0x0f172a : 0x1e293b,
          roughness: 0.7,
        });

        // 4 Pishtaq Arches
        const frontArch = new THREE.Mesh(new THREE.BoxGeometry(11, 13, 2.2), pishtaqMat);
        frontArch.position.set(0, 14.2, 1.2);
        worldGroup.add(frontArch);

        const backArch = new THREE.Mesh(new THREE.BoxGeometry(11, 13, 2.2), pishtaqMat);
        backArch.position.set(0, 14.2, -25.2);
        worldGroup.add(backArch);

        const westArch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 13, 11), pishtaqMat);
        westArch.position.set(-13.2, 14.2, -12);
        worldGroup.add(westArch);

        const eastArch = new THREE.Mesh(new THREE.BoxGeometry(2.2, 13, 11), pishtaqMat);
        eastArch.position.set(13.2, 14.2, -12);
        worldGroup.add(eastArch);

        // 7. Drum & Bulbous Onion Dome (Amrud)
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 7.8, 6.2, 24), marbleMat);
        drum.position.set(0, 26.8, -12);
        worldGroup.add(drum);

        const dome = new THREE.Mesh(new THREE.SphereGeometry(8.2, 32, 24), marbleMat);
        dome.scale.set(1.0, 1.34, 1.0);
        dome.position.set(0, 32.8, -12);
        worldGroup.add(dome);

        const finialRod = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 4.5, 12), goldMat);
        finialRod.position.set(0, 44.5, -12);
        worldGroup.add(finialRod);

        const finialOrb = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), goldMat);
        finialOrb.position.set(0, 43.5, -12);
        worldGroup.add(finialOrb);

        // 8. 4 Flanking Chattris
        [
          { x: -9.5, z: -21.5 },
          { x: 9.5, z: -21.5 },
          { x: -9.5, z: -2.5 },
          { x: 9.5, z: -2.5 },
        ].forEach((c) => {
          const pillarGroup = new THREE.Group();
          pillarGroup.position.set(c.x, 23.8, c.z);
          const chattriRoof = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 14), marbleMat);
          chattriRoof.scale.set(1.0, 1.15, 1.0);
          chattriRoof.position.y = 4.0;
          pillarGroup.add(chattriRoof);
          const chFinial = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 1.4, 8), goldMat);
          chFinial.position.y = 6.8;
          pillarGroup.add(chFinial);
          worldGroup.add(pillarGroup);
        });

        // 9. 4 Outward-Leaning Minarets
        [
          { x: -19.5, z: -31.5, rx: -0.026, rz: -0.026 },
          { x: 19.5, z: -31.5, rx: -0.026, rz: 0.026 },
          { x: -19.5, z: 7.5, rx: 0.026, rz: -0.026 },
          { x: 19.5, z: 7.5, rx: 0.026, rz: 0.026 },
        ].forEach((m) => {
          const minGroup = new THREE.Group();
          minGroup.position.set(m.x, 6.7, m.z);
          minGroup.rotation.x = m.rx;
          minGroup.rotation.z = m.rz;

          const base = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.7, 4.0, 12), marbleMat);
          base.position.y = 2.0;
          minGroup.add(base);

          const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.9, 31, 16), marbleMat);
          shaft.position.y = 17.5;
          minGroup.add(shaft);

          [10.5, 20.0, 28.5].forEach((by) => {
            const balc = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.6, 1.2, 16), marbleMat);
            balc.position.y = by;
            minGroup.add(balc);
          });

          const cupola = new THREE.Mesh(new THREE.SphereGeometry(1.6, 16, 14), marbleMat);
          cupola.scale.set(1.0, 1.2, 1.0);
          cupola.position.y = 33.5;
          minGroup.add(cupola);

          const mFinial = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.2, 1.8, 8), goldMat);
          mFinial.position.y = 35.8;
          minGroup.add(mFinial);

          worldGroup.add(minGroup);
        });

        // 10. Charbagh Gardens & Al Hawd al-Kawthar Reflecting Pool
        const gardenBase = new THREE.Mesh(new THREE.PlaneGeometry(160, 110), grassMat);
        gardenBase.rotation.x = -Math.PI / 2;
        gardenBase.position.set(0, 0.02, 55);
        worldGroup.add(gardenBase);

        const mainWalkway = new THREE.Mesh(new THREE.PlaneGeometry(18, 105), sandstoneMat);
        mainWalkway.rotation.x = -Math.PI / 2;
        mainWalkway.position.set(0, 0.04, 55);
        worldGroup.add(mainWalkway);

        const canal = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 80), waterMat);
        canal.rotation.x = -Math.PI / 2;
        canal.position.set(0, 0.12, 52);
        worldGroup.add(canal);

        const curbWest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 80), marbleMat);
        curbWest.position.set(-4.2, 0.2, 52);
        worldGroup.add(curbWest);

        const curbEast = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.4, 80), marbleMat);
        curbEast.position.set(4.2, 0.2, 52);
        worldGroup.add(curbEast);

        const centralTank = new THREE.Mesh(new THREE.BoxGeometry(11, 0.8, 11), marbleMat);
        centralTank.position.set(0, 0.4, 52);
        worldGroup.add(centralTank);

        // 11. Rows of Slender Italian Cypress Trees (As seen in User's Photo!)
        [-6.2, 6.2].forEach((tx) => {
          for (let tz = 18; tz <= 86; tz += 8.5) {
            const treeGroup = new THREE.Group();
            treeGroup.position.set(tx, 0.1, tz);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 2.5, 8), trunkMat);
            trunk.position.y = 1.25;
            treeGroup.add(trunk);

            // 3-tiered lush foliage cone
            [
              { r: 1.2, h: 5.0, y: 4.2 },
              { r: 1.0, h: 4.5, y: 7.0 },
              { r: 0.7, h: 3.5, y: 9.5 },
            ].forEach((tier) => {
              const fol = new THREE.Mesh(new THREE.ConeGeometry(tier.r, tier.h, 10), cypressFoliageMat);
              fol.position.y = tier.y;
              treeGroup.add(fol);
            });

            worldGroup.add(treeGroup);
          }
        });

        // 12. Great Southern Gateway (Darwaza-i-Rauza)
        const gateGroup = new THREE.Group();
        gateGroup.position.set(0, 0, 102);
        const gateWall = new THREE.Mesh(new THREE.BoxGeometry(32, 18, 12), sandstoneMat);
        gateWall.position.y = 9.0;
        gateGroup.add(gateWall);

        const gatePortal = new THREE.Mesh(
          new THREE.BoxGeometry(10, 13, 14),
          new THREE.MeshStandardMaterial({ color: 0x180b08, roughness: 0.95 })
        );
        gatePortal.position.y = 6.5;
        gateGroup.add(gatePortal);

        for (let i = -5; i <= 5; i++) {
          const guldasta = new THREE.Mesh(new THREE.SphereGeometry(0.65, 12, 10), marbleMat);
          guldasta.position.set(i * 2.8, 18.6, 5.5);
          gateGroup.add(guldasta);
        }
        worldGroup.add(gateGroup);

        addHotspot(0, 36, -12, 'Makrana White Marble Dome (Amrud)', '35-meter bulbous onion dome built of pure translucent Makrana marble, flanked by inverted lotus and gilded bronze crescent finial.');
        addHotspot(-19.5, 26, 7.5, 'Outward-Leaning Minaret (3° Lean)', 'Engineered with a 3-degree outward lean so that in an earthquake, it collapses outward away from the sacred tomb.');
        addHotspot(0, 1.8, 52, 'Al Hawd al-Kawthar (Reflecting Pool)', 'Sacred pool representing the Celestial River of Abundance, reflecting the bilateral symmetry of the tomb facade.');
        addHotspot(0, 3.0, -32, 'River Yamuna Terrace', 'North riverside terrace where the Yamuna River curves, cooling the white marble and framing the distant Mehtab Bagh.');
        addHotspot(-58, 10, -12, 'Western Red Sandstone Mosque', 'Mecca-facing red Sikri sandstone mosque with three white marble domes and acoustic prayer vaults.');
        addHotspot(6.2, 5, 36, 'Charbagh Italian Cypress Avenue', 'Lined along the reflection canal, symbolizing eternal life and spiritual elevation in Mughal garden design.');

      } else if (era === 'delhi-fort') {
        const fortWall = new THREE.Mesh(new THREE.BoxGeometry(90, 18, 14), sandstoneMat);
        fortWall.position.set(0, 9, 0);
        worldGroup.add(fortWall);

        const moat = new THREE.Mesh(
          new THREE.BoxGeometry(120, 2.5, 30),
          new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.95 })
        );
        moat.position.set(0, -1.25, 22);
        worldGroup.add(moat);

        [-14, 14].forEach((tx) => {
          const tower = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.0, 24, 8), sandstoneMat);
          tower.position.set(tx, 12, 10);
          worldGroup.add(tower);

          const cupola = new THREE.Mesh(new THREE.SphereGeometry(2.8, 16, 12), marbleMat);
          cupola.position.set(tx, 25.5, 10);
          worldGroup.add(cupola);
        });

        const gateArch = new THREE.Mesh(
          new THREE.BoxGeometry(12, 14, 4),
          new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.9 })
        );
        gateArch.position.set(0, 7.0, 10);
        worldGroup.add(gateArch);

        const diwan = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 22), sandstoneMat);
        diwan.position.set(0, 5, -28);
        worldGroup.add(diwan);

        addHotspot(0, 20, 10, 'Lahore Gate of Red Fort', 'The monumental red sandstone gateway facing Chandni Chowk where the Prime Minister addresses the nation on Independence Day.');
        addHotspot(0, 6, -28, 'Diwan-i-Aam (Hall of Public Audience)', 'Imperial hall with cusped sandstone arches where Emperor Shah Jahan held daily court before thousands.');

      } else if (era === 'agra-fort') {
        const rampart = new THREE.Mesh(new THREE.BoxGeometry(100, 22, 18), sandstoneMat);
        rampart.position.set(0, 11, 0);
        worldGroup.add(rampart);

        const river = new THREE.Mesh(new THREE.PlaneGeometry(180, 70), waterMat);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -0.5, -45);
        worldGroup.add(river);

        const burj = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 6.0, 18, 8), marbleMat);
        burj.position.set(28, 14, -12);
        worldGroup.add(burj);

        const burjDome = new THREE.Mesh(new THREE.SphereGeometry(4.2, 20, 16), marbleMat);
        burjDome.position.set(28, 25, -12);
        worldGroup.add(burjDome);

        addHotspot(28, 20, -12, 'Musamman Burj (Shah Jahan\'s Tower)', 'Exquisite octagonal white marble pavilion where the deposed Emperor Shah Jahan spent his final years gazing across the Yamuna at the Taj Mahal.');
        addHotspot(0, 14, 0, 'Jahangiri Mahal Red Sandstone Palace', 'Formidable double-curtain red sandstone fortress wall engineered by Emperor Akbar.');

      } else if (era === 'sun-temple') {
        const beach = new THREE.Mesh(
          new THREE.PlaneGeometry(240, 240),
          new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.95 })
        );
        beach.rotation.x = -Math.PI / 2;
        worldGroup.add(beach);

        const plinth = new THREE.Mesh(new THREE.BoxGeometry(65, 4.5, 42), sandstoneMat);
        plinth.position.set(0, 2.25, 0);
        worldGroup.add(plinth);

        const jagamohana = new THREE.Mesh(
          new THREE.ConeGeometry(18, 28, 4),
          new THREE.MeshStandardMaterial({ color: 0x57534e, roughness: 0.85 })
        );
        jagamohana.rotation.y = Math.PI / 4;
        jagamohana.position.set(0, 18.5, 0);
        worldGroup.add(jagamohana);

        [-22, 22].forEach((wx) => {
          for (let wz = -16; wz <= 16; wz += 6.4) {
            const wheel = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.7, 16), sandstoneMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(wx, 2.4, wz);
            worldGroup.add(wheel);
          }
        });

        for (let i = -3; i <= 3; i++) {
          const horse = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.8, 4.2), sandstoneMat);
          horse.position.set(i * 3.4, 2.5, 26);
          worldGroup.add(horse);
        }

        addHotspot(22, 4.0, 0, 'Konark 24-Spoked Astronomical Sundial Wheel', 'Monolithic stone wheel that accurately calculates solar time to the exact minute using the shadow cast by the central axle.');
        addHotspot(0, 22, 0, 'Jagamohana (Sanctuary of the Sun God)', 'Massive 13th-century stone chariot envisioned by King Narasimhadeva I, pulled by seven dynamic stone horses.');

      } else if (era === 'ancient-egypt') {
        const desert = new THREE.Mesh(
          new THREE.PlaneGeometry(240, 240),
          new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.95 })
        );
        desert.rotation.x = -Math.PI / 2;
        worldGroup.add(desert);

        const pyramid = new THREE.Mesh(
          new THREE.ConeGeometry(38, 45, 4),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 })
        );
        pyramid.rotation.y = Math.PI / 4;
        pyramid.position.set(0, 22.5, -20);
        worldGroup.add(pyramid);

        const sphinx = new THREE.Mesh(
          new THREE.BoxGeometry(8, 7, 20),
          new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 })
        );
        sphinx.position.set(0, 3.5, 35);
        worldGroup.add(sphinx);

        addHotspot(0, 32, -20, 'Great Pyramid of Giza (Khufu)', 'Constructed with 2.3 million megalithic limestone blocks aligned to true north within 3/60ths of a degree.');
        addHotspot(0, 6, 35, 'The Great Sphinx of Giza', 'Monolithic limestone sculpture with the body of a lion and head of Pharaoh Khafre guarding the plateau.');

      } else if (era === 'roman-empire') {
        const ground = new THREE.Mesh(
          new THREE.PlaneGeometry(240, 240),
          new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.9 })
        );
        ground.rotation.x = -Math.PI / 2;
        worldGroup.add(ground);

        const colosseumRing = new THREE.Mesh(
          new THREE.CylinderGeometry(28, 28, 20, 28, 1, true),
          new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.75, side: THREE.DoubleSide })
        );
        colosseumRing.scale.set(1.2, 1.0, 1.0);
        colosseumRing.position.set(0, 10, 0);
        worldGroup.add(colosseumRing);

        addHotspot(0, 16, 0, 'Flavian Amphitheater (Colosseum)', 'Capable of holding 65,000 spectators across four tiered architectural orders with complex subterranean hypogeum.');

      } else {
        const defaultFloor = new THREE.Mesh(
          new THREE.PlaneGeometry(220, 220),
          new THREE.MeshStandardMaterial({ color: isNightMode ? 0x090d16 : 0x1e293b, roughness: 0.75 })
        );
        defaultFloor.rotation.x = -Math.PI / 2;
        worldGroup.add(defaultFloor);

        const centerPillar = new THREE.Mesh(
          new THREE.BoxGeometry(14, 28, 14),
          new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.8, roughness: 0.2 })
        );
        centerPillar.position.set(0, 14, 0);
        worldGroup.add(centerPillar);

        addHotspot(0, 18, 0, 'Central Chronal Nexus Spire', 'Primary timeline anchor regulating tachyon particle containment.');
      }

      scene.add(worldGroup);
      scene.add(hotspotsGroup);

      // Drag Orbit Controls
      const onMouseDown3D = (e: MouseEvent) => {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      const onMouseMove3D = (e: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const dx = e.clientX - prevMousePosRef.current.x;
        const dy = e.clientY - prevMousePosRef.current.y;

        targetThetaRef.current -= dx * 0.0075;
        targetPhiRef.current = Math.max(0.08, Math.min(1.35, targetPhiRef.current + dy * 0.006));

        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      };

      const onMouseUp3D = () => {
        isDraggingRef.current = false;
      };

      const onWheel3D = (e: WheelEvent) => {
        e.preventDefault();
        targetRadiusRef.current = Math.max(22, Math.min(135, targetRadiusRef.current + e.deltaY * 0.065));
      };

      const dom = renderer.domElement;
      dom.addEventListener('mousedown', onMouseDown3D);
      window.addEventListener('mousemove', onMouseMove3D);
      window.addEventListener('mouseup', onMouseUp3D);
      dom.addEventListener('wheel', onWheel3D, { passive: false });

      const raycaster = new THREE.Raycaster();
      const mouseVec = new THREE.Vector2();

      const onClick3D = (e: MouseEvent) => {
        const rect = dom.getBoundingClientRect();
        mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouseVec, camera);
        const intersects = raycaster.intersectObjects(hotspotsGroup.children);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit.userData && hit.userData.name) {
            onInteractObject?.(hit.userData.name, hit.userData.lore);
          }
        }
      };
      dom.addEventListener('click', onClick3D);

      let lastTime = performance.now();
      let frameCount = 0;
      let fpsTimer = 0;

      const animate3D = (time: number) => {
        animationFrameId = requestAnimationFrame(animate3D);

        const delta = Math.min((time - lastTime) / 1000, 0.1);
        lastTime = time;

        frameCount++;
        fpsTimer += delta;
        if (fpsTimer >= 1.0) {
          setFps(frameCount);
          frameCount = 0;
          fpsTimer = 0;
        }

        if (autoRotateRef.current && !isDraggingRef.current) {
          targetThetaRef.current += delta * 0.12;
        }

        currentThetaRef.current += (targetThetaRef.current - currentThetaRef.current) * 0.08;
        currentPhiRef.current += (targetPhiRef.current - currentPhiRef.current) * 0.08;
        currentRadiusRef.current += (targetRadiusRef.current - currentRadiusRef.current) * 0.08;

        const theta = currentThetaRef.current;
        const phi = currentPhiRef.current;
        const radius = currentRadiusRef.current;
        const center = targetCenterRef.current;

        camera.position.x = center.x + Math.sin(theta) * Math.cos(phi) * radius;
        camera.position.y = center.y + Math.sin(phi) * radius;
        camera.position.z = center.z + Math.cos(theta) * Math.cos(phi) * radius;

        camera.lookAt(center);

        if (waterTex && waterTex.offset) {
          waterTex.offset.y += delta * 0.035;
        }

        renderer.render(scene, camera);
      };

      animationFrameId = requestAnimationFrame(animate3D);

      return () => {
        cancelAnimationFrame(animationFrameId);
        dom.removeEventListener('mousedown', onMouseDown3D);
        window.removeEventListener('mousemove', onMouseMove3D);
        window.removeEventListener('mouseup', onMouseUp3D);
        dom.removeEventListener('wheel', onWheel3D);
        dom.removeEventListener('click', onClick3D);
        renderer.dispose();
      };
    }
  }, [era, quality, webGlSupported, isNightMode, renderMode, realPhotoUrl]);

  return (
    <div className="relative w-full h-full min-h-[520px] select-none overflow-hidden bg-black group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* TOP-LEFT HUD TELEMETRY */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 rounded-xl bg-black/85 px-3 py-1.5 border border-white/10 backdrop-blur-md">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse shadow-glow-cyan" />
          <span className="text-[11px] font-mono text-cyan-300 font-bold tracking-wider">
            {renderMode === 'street-view' ? '📸 ASLI 360° STREET VIEW VR (REAL PHOTO)' : '🏛️ 3D 360° DIGITAL TWIN & GEOGRAPHY'}
          </span>
          <span className="text-[10px] font-mono text-gray-400 ml-1">
            {fps} FPS
          </span>
        </div>

        <div className="rounded-lg bg-black/70 px-2.5 py-1 text-[10px] font-mono text-gray-300 border border-white/10 backdrop-blur-sm">
          {renderMode === 'street-view' 
            ? 'Drag to look around in 360° real photo • Mouse wheel to zoom in on marble carvings'
            : 'Drag horizontally to orbit 360° around monument • Click angle buttons below'}
        </div>
      </div>

      {/* TOP-RIGHT CONTROLS: Switch Between Asli Street View & 3D Twin, Day/Night, Auto-Rotate */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/85 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl">
        {/* Toggle Real Photo Street View vs 3D Orbit */}
        <button
          onClick={() => setRenderMode(renderMode === 'street-view' ? '3d-orbit' : 'street-view')}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
            renderMode === 'street-view'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black shadow-glow-cyan font-black'
              : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-glow-purple font-bold'
          }`}
          title="Toggle 100% Real Camera Street View vs 3D Orbital World"
        >
          {renderMode === 'street-view' ? <Camera className="h-3.5 w-3.5" /> : <Boxes className="h-3.5 w-3.5" />}
          <span>{renderMode === 'street-view' ? '📸 Asli Photo VR (Active)' : '🏛️ 3D Orbit Twin'}</span>
        </button>

        <div className="h-4 w-px bg-white/20 mx-0.5" />

        {/* Day / Full Moon Toggle */}
        <button
          onClick={() => setIsNightMode(!isNightMode)}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
            isNightMode
              ? 'bg-indigo-600 text-white shadow-glow-purple'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Toggle Day vs Full Moon Moonlight"
        >
          {isNightMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          <span className="hidden sm:inline">{isNightMode ? 'Full Moon' : 'Sunlit'}</span>
        </button>

        {/* 360 Auto-Rotate Toggle */}
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold transition cursor-pointer ${
            autoRotate
              ? 'bg-cyan-500 text-black shadow-glow-cyan font-bold'
              : 'text-gray-400 hover:text-white hover:bg-white/10'
          }`}
          title="Auto 360° Turntable Orbit (Round and Round)"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">360° Orbit</span>
        </button>
      </div>

      {/* QUICK CAMERA VIEW PRESET BUTTONS (Screen Round Angles for 3D Orbit Mode) */}
      {renderMode === '3d-orbit' && (
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-black/85 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl animate-in fade-in">
          <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 hidden md:inline">
            360° VIEW ANGLES:
          </span>

          <button
            onClick={() => setCameraView('front')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeAnglePreset === 'front'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Front View: Al Hawd al-Kawthar Reflecting Pool & Cypress Avenue"
          >
            <span>🌅 Front Pool</span>
          </button>

          <button
            onClick={() => setCameraView('river')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeAnglePreset === 'river'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="Back View: River Yamuna Terrace & Mehtab Bagh"
          >
            <Waves className="h-3 w-3" />
            <span>🌊 River Yamuna (Back)</span>
          </button>

          <button
            onClick={() => setCameraView('mosque')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeAnglePreset === 'mosque'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="West View: Red Sandstone Mosque"
          >
            <span>🕌 West Mosque</span>
          </button>

          <button
            onClick={() => setCameraView('jawab')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeAnglePreset === 'jawab'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="East View: Red Sandstone Jawab Assembly Hall"
          >
            <span>🏛️ East Jawab</span>
          </button>

          <button
            onClick={() => setCameraView('drone')}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              activeAnglePreset === 'drone'
                ? 'bg-cyan-500 text-black shadow-glow-cyan'
                : 'text-gray-300 hover:text-white hover:bg-white/10'
            }`}
            title="High Aerial Drone 360° Bird's Eye View"
          >
            <span>🦅 360° Aerial Drone</span>
          </button>
        </div>
      )}

      {/* BOTTOM-LEFT: Helper Pill for Street View Mode */}
      {renderMode === 'street-view' && (
        <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 rounded-xl bg-black/75 px-3 py-1.5 border border-white/10 backdrop-blur-md text-[11px] font-mono text-gray-300 pointer-events-none">
          <Move className="h-3.5 w-3.5 text-cyan-400" />
          <span>Hold Click & Drag to Look Around in 360° • Mouse Wheel to Zoom In • Click Cyan Pins for Secrets</span>
        </div>
      )}

      {/* BOTTOM-RIGHT: Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-black/85 p-1.5 rounded-2xl border border-white/15 backdrop-blur-md shadow-2xl">
        <button
          onClick={() => handleZoom('in')}
          className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/15 transition cursor-pointer"
          title="Zoom In (or use Mouse Wheel)"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={() => handleZoom('out')}
          className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/15 transition cursor-pointer"
          title="Zoom Out (or use Mouse Wheel)"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
