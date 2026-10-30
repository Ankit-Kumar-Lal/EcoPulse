"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { createProceduralEarthTexture } from "./earthTexture";
import {
  RotateCcw,
  Compass,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Info,
  X,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

interface CityImpact {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  monthlySavingsKg: string;
  keyInitiative: string;
  activeHouseholds: string;
  cleanTransitShare: string;
}

const INDIA_CITIES: CityImpact[] = [
  {
    id: "delhi",
    name: "Delhi NCR",
    state: "National Capital Region",
    lat: 28.6139,
    lon: 77.209,
    monthlySavingsKg: "1.8M kg CO₂e",
    keyInitiative: "Delhi Metro Solar Power Integration & Electric Bus Fleet",
    activeHouseholds: "42,000+",
    cleanTransitShare: "68%",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    lat: 19.076,
    lon: 72.8777,
    monthlySavingsKg: "2.4M kg CO₂e",
    keyInitiative: "Suburban Railway Energy Efficiency & Coastal Rooftop Solar",
    activeHouseholds: "55,000+",
    cleanTransitShare: "74%",
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    lat: 12.9716,
    lon: 77.5946,
    monthlySavingsKg: "2.1M kg CO₂e",
    keyInitiative: "Tech Campus Net-Zero Standards & Namma Metro Extension",
    activeHouseholds: "48,000+",
    cleanTransitShare: "62%",
  },
  {
    id: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    lat: 17.385,
    lon: 78.4867,
    monthlySavingsKg: "1.6M kg CO₂e",
    keyInitiative: "HITEC City Green Building Codes & Solar Rooftop Mandates",
    activeHouseholds: "36,000+",
    cleanTransitShare: "58%",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    lat: 22.5726,
    lon: 88.3639,
    monthlySavingsKg: "1.2M kg CO₂e",
    keyInitiative: "Electric Ferry Transit & Municipal Composting Networks",
    activeHouseholds: "29,000+",
    cleanTransitShare: "65%",
  },
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    lat: 13.0827,
    lon: 80.2707,
    monthlySavingsKg: "1.5M kg CO₂e",
    keyInitiative: "Renewable Wind/Solar Wheeling & Industrial Efficiency",
    activeHouseholds: "34,000+",
    cleanTransitShare: "59%",
  },
];

// Coordinate conversion utility
function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function InteractiveEarthGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [selectedCity, setSelectedCity] = useState<CityImpact | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [cityScreenCoords, setCityScreenCoords] = useState<
    Array<{ id: string; name: string; x: number; y: number; visible: boolean }>
  >([]);

  // State refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveredRef = useRef(false);
  const isReducedMotionRef = useRef(false);
  const isPausedStateRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      isReducedMotionRef.current = mediaQuery.matches;
      if (mediaQuery.matches) {
        setIsPaused(true);
        isPausedStateRef.current = true;
      }
      const listener = (e: MediaQueryListEvent) => {
        isReducedMotionRef.current = e.matches;
        if (e.matches) {
          setIsPaused(true);
          isPausedStateRef.current = true;
        }
      };
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    }
  }, []);

  // Update paused state ref
  useEffect(() => {
    isPausedStateRef.current = isPaused;
  }, [isPaused]);

  // Main WebGL Initializer
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Test WebGL context
    let gl: any;
    try {
      gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    } catch {
      setWebglSupported(false);
      return;
    }
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    rendererRef.current = renderer;

    // 2. Globe Group (Rotates Earth, borders, cities together)
    const globeGroup = new THREE.Group();
    // Initial angle oriented toward India (Lat 20 N, Lon 78 E)
    // Three.js sphere coords: Y rotation centers longitude, X rotation tilts latitude
    globeGroup.rotation.y = -Math.PI * 0.43; // Facing Indian Ocean / India
    globeGroup.rotation.x = 0.28; // Tilted slightly down to view Northern Hemisphere
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    // 3. Earth Sphere
    const sphereRadius = 1.85;
    const { mapTexture, bumpTexture } = createProceduralEarthTexture();

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: mapTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.04,
      specular: new THREE.Color("#059669"),
      shininess: 15,
    });
    const earthGeometry = new THREE.SphereGeometry(sphereRadius, 64, 64);
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 4. Atmosphere Rim Glow (Outer transparent halo)
    const atmosphereGeometry = new THREE.SphereGeometry(sphereRadius * 1.025, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#10B981"),
      transparent: true,
      opacity: 0.14,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    globeGroup.add(atmosphereMesh);

    // Secondary soft emerald outer atmosphere
    const outerHaloGeometry = new THREE.SphereGeometry(sphereRadius * 1.1, 48, 48);
    const outerHaloMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#065F46"),
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    const outerHaloMesh = new THREE.Mesh(outerHaloGeometry, outerHaloMaterial);
    scene.add(outerHaloMesh);

    // 5. India Geographic Boundary Highlight Line
    const indiaBorderCoords: Array<[number, number]> = [
      [37.0, 74.0], [35.5, 77.0], [32.5, 79.0], [30.5, 81.0], [27.5, 88.5],
      [28.0, 92.5], [28.0, 96.0], [26.0, 95.0], [24.0, 92.0], [22.0, 89.0],
      [20.0, 86.5], [18.0, 83.0], [13.0, 80.0], [10.0, 79.8], [8.1, 77.5],
      [10.0, 76.0], [15.0, 74.0], [19.0, 72.8], [22.5, 69.0], [24.5, 69.5],
      [27.0, 71.0], [31.0, 74.5], [37.0, 74.0],
    ];

    const borderPoints = indiaBorderCoords.map(([lat, lon]) =>
      latLongToVector3(lat, lon, sphereRadius * 1.004)
    );
    const borderGeometry = new THREE.BufferGeometry().setFromPoints(borderPoints);
    const borderMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#34D399"),
      linewidth: 2,
      transparent: true,
      opacity: 0.85,
    });
    const borderLine = new THREE.LineLoop(borderGeometry, borderMaterial);
    globeGroup.add(borderLine);

    // 6. City Markers with Pulsing Halos
    const cityPins: THREE.Mesh[] = [];
    INDIA_CITIES.forEach((city) => {
      const pos = latLongToVector3(city.lat, city.lon, sphereRadius * 1.008);

      // Core luminous city dot
      const dotGeo = new THREE.SphereGeometry(0.024, 16, 16);
      const dotMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#6EE7B7") });
      const dotMesh = new THREE.Mesh(dotGeo, dotMat);
      dotMesh.position.copy(pos);
      dotMesh.userData = { cityId: city.id, cityName: city.name };
      globeGroup.add(dotMesh);
      cityPins.push(dotMesh);

      // Halo ring around city
      const ringGeo = new THREE.RingGeometry(0.035, 0.05, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color("#34D399"),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);
    });

    // 7. Concentric Orbital Rings (Luminous climate data paths)
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = Math.PI * 0.28; // 28 deg inclination
    orbitGroup.rotation.y = -Math.PI * 0.15;
    scene.add(orbitGroup);
    orbitGroupRef.current = orbitGroup;

    // Inner orbital progress path
    const orbitRadius = sphereRadius * 1.45;
    const orbitCurve = new THREE.EllipseCurve(0, 0, orbitRadius, orbitRadius * 0.94, 0, 2 * Math.PI, false, 0);
    const orbitPoints = orbitCurve.getPoints(120);
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(
      orbitPoints.map((p) => new THREE.Vector3(p.x, p.y, 0))
    );
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#34D399"),
      transparent: true,
      opacity: 0.35,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitGroup.add(orbitLine);

    // Orbit Satellite / Beacon Node
    const beaconGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color("#10B981") });
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconMesh.position.set(orbitRadius, 0, 0);
    orbitGroup.add(beaconMesh);

    // 8. Lighting
    // Directional Sun lighting from upper front
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(5, 4, 6);
    scene.add(sunLight);

    // Emerald ambient rim light for climate mission control mood
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.1);
    scene.add(ambientLight);

    // Subtle blue-green back light for edge definition
    const backLight = new THREE.DirectionalLight(0x10b981, 0.6);
    backLight.position.set(-6, -2, -4);
    scene.add(backLight);

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let clock = new THREE.Clock();
    let beaconAngle = 0;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Smooth auto-rotation
      if (globeGroup && !isDraggingRef.current && !isPausedStateRef.current && !targetRotationRef.current) {
        // Rotates full 360 deg in ~36 seconds
        const baseSpeed = (2 * Math.PI) / 38;
        // Slow down to 25% if hovered
        const speedMultiplier = isHoveredRef.current ? 0.25 : 1.0;
        globeGroup.rotation.y += baseSpeed * speedMultiplier * delta;
      }

      // Smooth inertia damping when user releases drag
      if (!isDraggingRef.current) {
        if (Math.abs(velocityRef.current.x) > 0.0001 || Math.abs(velocityRef.current.y) > 0.0001) {
          if (globeGroup) {
            globeGroup.rotation.y += velocityRef.current.x;
            globeGroup.rotation.x = Math.max(-0.8, Math.min(0.8, globeGroup.rotation.x + velocityRef.current.y));
          }
          velocityRef.current.x *= 0.92; // decay
          velocityRef.current.y *= 0.92;
        }
      }

      // Smooth animated transition when Focus India or Reset View is clicked
      if (targetRotationRef.current && globeGroup) {
        const dx = targetRotationRef.current.x - globeGroup.rotation.x;
        const dy = targetRotationRef.current.y - globeGroup.rotation.y;
        globeGroup.rotation.x += dx * 0.08;
        globeGroup.rotation.y += dy * 0.08;
        if (Math.abs(dx) < 0.002 && Math.abs(dy) < 0.002) {
          globeGroup.rotation.x = targetRotationRef.current.x;
          globeGroup.rotation.y = targetRotationRef.current.y;
          targetRotationRef.current = null;
        }
      }

      // Orbit beacon continuous motion
      beaconAngle += delta * 0.45;
      beaconMesh.position.x = Math.cos(beaconAngle) * orbitRadius;
      beaconMesh.position.y = Math.sin(beaconAngle) * (orbitRadius * 0.94);

      // Project 2D coordinates for India city markers to show floating labels
      if (camera && globeGroup) {
        const coords: Array<{ id: string; name: string; x: number; y: number; visible: boolean }> = [];
        const canvasRect = canvas.getBoundingClientRect();

        INDIA_CITIES.forEach((city) => {
          const localPos = latLongToVector3(city.lat, city.lon, sphereRadius * 1.01);
          // Apply globe rotation matrix
          const worldPos = localPos.clone().applyEuler(globeGroup.rotation);

          // Only visible if facing front (Z > -0.2)
          const isFacingFront = worldPos.z > -0.2;

          // Project to normalized device coords [-1, 1]
          const projected = worldPos.clone().project(camera);
          const screenX = ((projected.x + 1) * canvasRect.width) / 2;
          const screenY = ((-projected.y + 1) * canvasRect.height) / 2;

          coords.push({
            id: city.id,
            name: city.name,
            x: screenX,
            y: screenY,
            visible: isFacingFront,
          });
        });

        setCityScreenCoords(coords);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Pause rendering when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      } else {
        clock = new THREE.Clock();
        animate();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Teardown
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
    };
  }, []);

  // Pointer & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    targetRotationRef.current = null;
    velocityRef.current = { x: 0, y: 0 };
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !globeGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    const rotSpeed = 0.005;
    globeGroupRef.current.rotation.y += deltaX * rotSpeed;
    globeGroupRef.current.rotation.x = Math.max(
      -0.85,
      Math.min(0.85, globeGroupRef.current.rotation.x + deltaY * rotSpeed)
    );

    velocityRef.current = {
      x: deltaX * rotSpeed,
      y: deltaY * rotSpeed,
    };

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current) return;
    const currentZ = cameraRef.current.position.z;
    if (direction === "in" && currentZ > 3.8) {
      cameraRef.current.position.z -= 0.4;
    } else if (direction === "out" && currentZ < 6.8) {
      cameraRef.current.position.z += 0.4;
    }
  };

  // Focus India button handler
  const handleFocusIndia = useCallback(() => {
    targetRotationRef.current = {
      x: 0.28,
      y: -Math.PI * 0.43,
    };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5.2);
    }
  }, []);

  // Reset View button handler
  const handleResetView = useCallback(() => {
    targetRotationRef.current = {
      x: 0.15,
      y: 0,
    };
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 5.2);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] flex items-center justify-center overflow-hidden rounded-3xl bg-[#06140F]/80 border border-emerald-950/60 backdrop-blur-md shadow-2xl"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      tabIndex={0}
      role="region"
      aria-label="Interactive 3D Earth Globe highlighting India's collective climate impact"
      onKeyDown={(e) => {
        if (!globeGroupRef.current) return;
        if (e.key === "ArrowLeft") globeGroupRef.current.rotation.y -= 0.1;
        if (e.key === "ArrowRight") globeGroupRef.current.rotation.y += 0.1;
        if (e.key === "ArrowUp") globeGroupRef.current.rotation.x -= 0.08;
        if (e.key === "ArrowDown") globeGroupRef.current.rotation.x += 0.08;
        if (e.key === "+" || e.key === "=") handleZoom("in");
        if (e.key === "-") handleZoom("out");
        if (e.key === "f" || e.key === "F") handleFocusIndia();
        if (e.key === "r" || e.key === "R") handleResetView();
        if (e.key === " ") {
          e.preventDefault();
          setIsPaused((prev) => !prev);
        }
      }}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,rgba(6,20,15,0)_70%)]" />

      {/* Real WebGL Canvas */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing outline-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      ) : (
        /* Graceful WebGL Fallback */
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-3 z-10">
          <div className="h-44 w-44 rounded-full bg-emerald-950/60 border-2 border-emerald-500/40 flex items-center justify-center relative shadow-[0_0_50px_rgba(16,185,129,0.3)]">
            <Compass className="h-16 w-16 text-emerald-400 animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping opacity-40" />
          </div>
          <p className="text-sm font-semibold text-emerald-200">
            India Climate Mission Control
          </p>
          <p className="text-xs text-emerald-400/80 max-w-xs">
            WebGL is not active in this browser mode. Showing standard climate telemetry for Indian urban hubs.
          </p>
        </div>
      )}

      {/* Floating 2D leader labels for primary Indian cities */}
      {cityScreenCoords.map((c) => {
        if (!c.visible || (c.x < 30 || c.x > (containerRef.current?.clientWidth || 600) - 40)) {
          return null;
        }
        // Only show main hubs directly labeled on dashboard to avoid visual clutter
        if (!["Delhi NCR", "Mumbai", "Bengaluru", "Hyderabad"].includes(c.name)) {
          return null;
        }

        return (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              const found = INDIA_CITIES.find((x) => x.id === c.id);
              if (found) setSelectedCity(found);
            }}
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
            }}
            className="absolute -translate-x-1/2 -translate-y-8 z-20 group flex items-center space-x-1.5 focus:outline-none"
            aria-label={`View climate impact for ${c.name}`}
          >
            <div className="flex items-center space-x-1 rounded-full bg-[#0A241B]/90 px-2 py-0.5 border border-emerald-500/40 shadow-lg backdrop-blur-md transition-all group-hover:scale-105 group-hover:border-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-semibold text-emerald-200">
                {c.name.replace(" NCR", "")}
              </span>
            </div>
            {/* Fine leader dot */}
            <div className="h-1 w-1 rounded-full bg-emerald-400 opacity-80" />
          </button>
        );
      })}

      {/* Floating Control Toolbar */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-1.5 rounded-2xl bg-[#091F18]/90 p-1.5 border border-emerald-800/40 backdrop-blur-md shadow-xl text-emerald-300">
        <button
          type="button"
          onClick={handleFocusIndia}
          title="Focus on India (F)"
          className="rounded-xl px-2.5 py-1 text-xs font-medium text-emerald-200 hover:bg-emerald-800/40 flex items-center space-x-1 transition"
        >
          <span>🇮🇳</span>
          <span className="hidden sm:inline">Focus India</span>
        </button>

        <div className="h-4 w-px bg-emerald-800/50" />

        <button
          type="button"
          onClick={handleResetView}
          title="Reset View (R)"
          className="rounded-xl p-1.5 hover:bg-emerald-800/40 transition"
          aria-label="Reset globe view"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          title={isPaused ? "Resume Rotation (Space)" : "Pause Rotation (Space)"}
          className="rounded-xl p-1.5 hover:bg-emerald-800/40 transition"
          aria-label={isPaused ? "Resume globe rotation" : "Pause globe rotation"}
        >
          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>

        <div className="h-4 w-px bg-emerald-800/50" />

        <button
          type="button"
          onClick={() => handleZoom("in")}
          title="Zoom in (+)"
          className="rounded-xl p-1.5 hover:bg-emerald-800/40 transition"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-3.5 w-3.5" />
        </button>

        <button
          type="button"
          onClick={() => handleZoom("out")}
          title="Zoom out (-)"
          className="rounded-xl p-1.5 hover:bg-emerald-800/40 transition"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Accessible Tooltip Modal for Selected City */}
      {selectedCity && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm rounded-2xl bg-[#09221A] p-5 border border-emerald-500/30 shadow-2xl space-y-4 text-emerald-100">
            <div className="flex items-start justify-between pb-3 border-b border-emerald-800/40">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    {selectedCity.name}
                  </h4>
                  <p className="text-[11px] text-emerald-400">
                    {selectedCity.state} • Aggregated Regional Impact
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCity(null)}
                className="rounded-lg p-1 text-emerald-400 hover:bg-emerald-800/40 hover:text-white"
                aria-label="Close details"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-[#061711] p-3 border border-emerald-900/60 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                    Monthly Avoided Emissions
                  </p>
                  <p className="text-lg font-extrabold text-emerald-300">
                    {selectedCity.monthlySavingsKg}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-semibold text-emerald-400 tracking-wider">
                    Clean Transit Share
                  </p>
                  <p className="text-sm font-bold text-white">
                    {selectedCity.cleanTransitShare}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-emerald-200">
                  Primary Community Driver:
                </p>
                <p className="mt-0.5 text-xs text-emerald-300/90 leading-relaxed">
                  {selectedCity.keyInitiative}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-[11px] text-emerald-400/80 pt-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>
                  Active community participants:{" "}
                  <strong className="text-white">{selectedCity.activeHouseholds}</strong>
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-800/40 flex justify-between items-center text-[10px] text-emerald-400/60">
              <span>Aggregated CEA & Municipal data</span>
              <button
                type="button"
                onClick={() => setSelectedCity(null)}
                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
