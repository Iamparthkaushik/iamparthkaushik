'use client';

import { useMemo, useRef } from 'react';
import { Plane, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface WorldProps {
  playerPosition: THREE.Vector3;
  season: 'summer' | 'winter' | 'autumn' | 'rainy';
  isDay: boolean;
}

export default function World({ playerPosition, season, isDay }: WorldProps) {
  // Color palette based on seasons
  const seasonColors = useMemo(() => ({
    summer: { ground: '#4ade80', grass: '#22c55e', trees: '#15803d' },
    autumn: { ground: '#d97706', grass: '#b45309', trees: '#78350f' },
    winter: { ground: '#f8fafc', grass: '#e2e8f0', trees: '#64748b' },
    rainy: { ground: '#475569', grass: '#334155', trees: '#1e293b' },
  }), []);

  const currentColors = seasonColors[season];

  // For a simple demonstration, let's create a long road and some terrain
  // In a full version, this would be procedurally generated chunks
  return (
    <group>
      {/* Ground / Terrain */}
      <Plane args={[1000, 10000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, -4500]} receiveShadow>
        <meshStandardMaterial 
          color={currentColors.ground} 
          roughness={1}
        />
      </Plane>

      {/* Road */}
      <Plane args={[10, 10000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -4500]} receiveShadow>
        <meshStandardMaterial 
          color="#334155" 
          roughness={0.8}
        />
      </Plane>
      
      {/* Road Lines */}
      <Plane args={[0.2, 10000]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -4500]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
      </Plane>

      {/* Decorative environment elements (Trees/Rocks) */}
      <EnvironmentAssets color={currentColors.trees} season={season} />
      
      {/* Mountain in the distance */}
      <mesh position={[0, 50, -2000]}>
        <coneGeometry args={[500, 400, 4]} />
        <meshStandardMaterial color={season === 'winter' ? '#ffffff' : '#4b5563'} />
      </mesh>
    </group>
  );
}

function EnvironmentAssets({ color, season }: { color: string; season: string }) {
  const assets = useMemo(() => {
    const items = [];
    for (let i = 0; i < 200; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = (Math.random() * 50 + 15) * side;
      const z = -Math.random() * 5000;
      items.push({ x, z, scale: Math.random() * 2 + 1 });
    }
    return items;
  }, []);

  return (
    <group>
      {assets.map((asset, i) => (
        <group key={i} position={[asset.x, 0, asset.z]} scale={[asset.scale, asset.scale, asset.scale]}>
          {/* Simple Tree */}
          <mesh position={[0, 1, 0]} castShadow>
             <cylinderGeometry args={[0.2, 0.2, 2]} />
             <meshStandardMaterial color="#78350f" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
             <coneGeometry args={[1.5, 3, 8]} />
             <meshStandardMaterial color={color} />
          </mesh>
          {season === 'winter' && (
             <mesh position={[0, 3.5, 0]}>
                <coneGeometry args={[1.6, 1, 8]} />
                <meshStandardMaterial color="#ffffff" />
             </mesh>
          )}
        </group>
      ))}
    </group>
  );
}
