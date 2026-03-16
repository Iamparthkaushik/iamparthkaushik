'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import World from './World';
import Player from './Player';

interface SlowRoadsProps {
  isDay: boolean;
  vehicleType: 'car' | 'bike';
  season: 'summer' | 'winter' | 'autumn' | 'rainy';
  gameStarted: boolean;
}

export default function SlowRoads({ isDay, vehicleType, season, gameStarted }: SlowRoadsProps) {
  const playerRef = useRef<THREE.Group>(null);
  
  // Shared state/references for world and player
  // For a "Slow Roads" feel, we might want an infinite road generator
  // The World component will handle terrain chunks based on player position
  
  return (
    <>
      <World 
        playerPosition={playerRef.current?.position || new THREE.Vector3(0, 0, 0)} 
        season={season}
        isDay={isDay}
      />
      
      <Player 
        ref={playerRef}
        vehicleType={vehicleType}
        gameStarted={gameStarted}
      />
      
      {/* Scene Fog for atmosphere */}
      <fog attach="fog" args={[isDay ? '#a8e6cf' : '#050510', 0, 100]} />
    </>
  );
}
