'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

function RotatingModel() {
  const meshRef = useRef<any>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <>
      <PerspectiveCamera position={[0, 0, 5]} fov={75} />
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Main rotating cube */}
      <mesh ref={meshRef}>
        <boxGeometry args={[2, 2, 2]} />
        <meshPhongMaterial
          color="#a8e6cf"
          shininess={100}
          emissive="#88d8b0"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Orbiting spheres */}
      <group>
        {[0, 1, 2].map((i) => {
          const angle = (Date.now() * 0.0005 + (i * Math.PI * 2) / 3);
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * 5,
                Math.sin(angle) * 5,
                0,
              ]}
            >
              <sphereGeometry args={[0.3, 32, 32]} />
              <meshPhongMaterial
                color={['#ffb3ba', '#bae1ff', '#ffdfba'][i]}
                emissive={['#ffb3ba', '#bae1ff', '#ffdfba'][i]}
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Background */}
      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </>
  );
}

export default function Scene3D() {
  return (
    <section className="relative w-full h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]" />
      
      <Canvas style={{ width: '100%', height: '100%' }}>
        <RotatingModel />
      </Canvas>
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-6">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#a8e6cf]/10 text-[#a8e6cf] text-sm font-medium mb-4">
            Interactive
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba] bg-clip-text text-transparent">
              3D Experience
            </span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl">Drag to explore • Scroll to zoom</p>
        </div>
      </div>
    </section>
  );
}
