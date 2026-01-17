'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';

function Galaxy() {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = 10000;

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
      new THREE.Color('#a8e6cf'),
      new THREE.Color('#ffb3ba'),
      new THREE.Color('#bae1ff'),
      new THREE.Color('#ffdfba'),
      new THREE.Color('#bab3ff'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Galaxy spiral arm distribution
      const radius = Math.random() * 12 + 0.5;
      const spinAngle = radius * 1.5;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      const randomX = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 2;
      const randomY = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 0.5;
      const randomZ = (Math.random() - 0.5) * Math.pow(Math.random(), 3) * 2;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      const mixedColor = color.clone().lerp(new THREE.Color('#ffffff'), Math.random() * 0.3);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = Math.random() * 0.1 + 0.02;
    }

    return { positions, colors, sizes };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Planet({ position, color, size, name }: { position: [number, number, number]; color: string; size: number; name: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.7}
            metalness={0.3}
            emissive={color}
            emissiveIntensity={0.2}
          />
        </mesh>
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      </group>
    </Float>
  );
}

function Nebula() {
  const nebulaRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <mesh ref={nebulaRef} position={[0, 0, -5]} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[8, 15, 64]} />
      <meshBasicMaterial
        color="#a8e6cf"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const SOLAR_SYSTEM_DATA = [
  { name: 'Mercury', color: '#A5A5A5', size: 0.08, distance: 1.5, speed: 1.5 },
  { name: 'Venus', color: '#E3BB76', size: 0.15, distance: 2.2, speed: 1.2 },
  { name: 'Earth', color: '#4B9CD3', size: 0.16, distance: 3.2, speed: 1.0 },
  { name: 'Mars', color: '#E27B58', size: 0.12, distance: 4.2, speed: 0.8 },
  { name: 'Jupiter', color: '#C88B3A', size: 0.4, distance: 6.5, speed: 0.4 },
  { name: 'Saturn', color: '#C5AB6E', size: 0.35, distance: 8.5, speed: 0.3, rings: true },
  { name: 'Uranus', color: '#4FD0E7', size: 0.25, distance: 10.5, speed: 0.2 },
  { name: 'Neptune', color: '#4B70DD', size: 0.24, distance: 12.5, speed: 0.15 },
];

function SolarSystem({ visible }: { visible: boolean }) {
  return (
    <group visible={visible}>
      {/* Sun */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color="#FFD700" distance={25} />

      {/* Planets */}
      {SOLAR_SYSTEM_DATA.map((planet, index) => (
        <PlanetOrbit key={planet.name} planet={planet} index={index} />
      ))}
    </group>
  );
}

function PlanetOrbit({ planet, index }: { planet: typeof SOLAR_SYSTEM_DATA[0]; index: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * planet.speed * 0.5 + (index * 100);
    }
  });

  return (
    <group ref={ref}>
      <group position={[planet.distance, 0, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
          <mesh>
            <sphereGeometry args={[planet.size, 32, 32]} />
            <meshStandardMaterial
              color={planet.color}
              roughness={0.7}
              emissive={planet.color}
              emissiveIntensity={0.1}
            />
          </mesh>
          {planet.rings && (
            <mesh rotation={[-Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 32]} />
              <meshStandardMaterial color={planet.color} side={THREE.DoubleSide} transparent opacity={0.6} />
            </mesh>
          )}
          <Text
            position={[0, planet.size + 0.3, 0]}
            fontSize={0.25}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {planet.name}
          </Text>
        </Float>
      </group>
      {/* Orbit Line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.02, planet.distance + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.05} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene() {
  const [zoomLevel, setZoomLevel] = useMemo(() => {
    // We'll use a ref-like pattern or state but standard functional component re-render is fine here
    // But actully we need access to camera to set this. 
    // We can use useFrame to check camera distance.
    return [0, 0]; // dummy
  }, []);

  const [showSolarSystem, setShowSolarSystem] = useState(false);

  useFrame((state) => {
    const distance = state.camera.position.length();
    // Show solar system when closer than 8 units
    setShowSolarSystem(distance < 8);
  });

  return (
    <>
      <ambientLight intensity={0.3} />

      <Stars
        radius={100}
        depth={50}
        count={8000}
        factor={4}
        saturation={0.5}
        fade
        speed={1}
      />

      <group visible={!showSolarSystem}>
        <Galaxy />
        <Nebula />
        {/* Previous dummy planets, we hide them when solar system appears or keep them as 'distant' systems? 
            Original prompt says "add our solar system". The previous ones were "Verdant", "Rosea", etc. 
            Maybe we keep them as part of the Galaxy view, but hide them when zooming in to the center (Solar System).
        */}
        <Planet position={[5, 1, 3]} color="#a8e6cf" size={0.6} name="Verdant" />
        <Planet position={[-4, -1, 4]} color="#ffb3ba" size={0.8} name="Rosea" />
        <Planet position={[3, -2, -3]} color="#bae1ff" size={0.5} name="Aquis" />
        <Planet position={[-6, 2, -2]} color="#ffdfba" size={0.7} name="Aurum" />
        <Planet position={[0, 3, 5]} color="#bab3ff" size={0.4} name="Nebula Prime" />
      </group>

      <SolarSystem visible={showSolarSystem} />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={!showSolarSystem} // Stop rotation when observing solar system
        autoRotateSpeed={0.2}
        maxDistance={30}
        minDistance={2}
      />
    </>
  );
}

export default function GalaxyPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#050510]">
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Back Button */}
      <Link
        href="/experiences"
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      {/* Title */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 1, scale: 1 }}
        animate={{ opacity: 0, scale: 0.9 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <h1 className="text-5xl font-bold text-white mb-4">Galaxy Explorer</h1>
        <p className="text-gray-400">Drag to explore the cosmos</p>
      </motion.div>

      {/* Info Panel */}
      <motion.div
        className="absolute bottom-6 left-6 z-10 p-4 bg-black/50 backdrop-blur-sm rounded-2xl max-w-xs"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-white font-semibold mb-2">🌌 Your Galaxy</h3>
        <ul className="text-gray-400 text-sm space-y-1">
          <li>• 10,000 stars in spiral formation</li>
          <li>• 5 unique planets to discover</li>
          <li>• Drag to rotate view</li>
          <li>• Scroll to zoom in/out</li>
        </ul>
      </motion.div>
    </div>
  );
}
