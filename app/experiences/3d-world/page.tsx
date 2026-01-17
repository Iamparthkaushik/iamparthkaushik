'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Float, MeshDistortMaterial, Sparkles, Stars, Text3D, Center } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as THREE from 'three';
import FloatingNav from '../../components/FloatingNav';

function AnimatedSphere({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.3}
          radius={1}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
}

function AnimatedTorus({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1, 0.4, 32, 64]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}

function AnimatedOctahedron({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <octahedronGeometry args={[0.8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.1}
          wireframe
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    </Float>
  );
}

function AnimatedIcosahedron({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.6;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[0.7, 0]} />
      <MeshDistortMaterial
        color={color}
        speed={3}
        distort={0.4}
        radius={1}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={60} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#a8e6cf" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#bae1ff" />
      <pointLight position={[0, 10, -10]} intensity={0.5} color="#ffb3ba" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Sparkles */}
      <Sparkles count={100} scale={15} size={2} speed={0.3} color="#a8e6cf" />
      
      {/* 3D Objects */}
      <AnimatedSphere position={[-3, 0, 0]} color="#a8e6cf" speed={1.2} />
      <AnimatedSphere position={[3, 1, -2]} color="#bae1ff" speed={0.8} />
      <AnimatedSphere position={[0, -2, 1]} color="#ffb3ba" speed={1} />
      
      <AnimatedTorus position={[0, 0, 0]} color="#bab3ff" />
      
      <AnimatedOctahedron position={[-2, 2, -1]} color="#ffdfba" />
      <AnimatedOctahedron position={[2.5, -1.5, 1]} color="#a8e6cf" />
      
      <AnimatedIcosahedron position={[-3, -2, -2]} color="#bae1ff" />
      <AnimatedIcosahedron position={[3.5, 2, -1]} color="#ffb3ba" />
    </>
  );
}

function LoadingScreen() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#a8e6cf]/30 border-t-[#a8e6cf] rounded-full animate-spin mx-auto mb-4" />
        <span className="text-[#a8e6cf] text-lg">Loading 3D World...</span>
      </div>
    </div>
  );
}

export default function World3DPage() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      <FloatingNav />
      
      {/* 3D Canvas */}
      <Suspense fallback={<LoadingScreen />}>
        <Canvas className="absolute inset-0">
          <Scene />
        </Canvas>
      </Suspense>
      
      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Back button */}
        <motion.div
          className="absolute top-24 left-6 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Link 
            href="/experiences" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
        </motion.div>
        
        {/* Title overlay */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba]">
              3D Universe
            </span>
          </h1>
          <p className="text-gray-400 text-sm">
            Drag to explore • Auto-rotating
          </p>
        </motion.div>
        
        {/* Info cards */}
        <motion.div
          className="absolute top-24 right-6 max-w-xs pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
            <h3 className="text-white font-semibold mb-2">Interactive 3D</h3>
            <p className="text-gray-400 text-sm">
              This scene features distorted spheres, spinning torus, wireframe octahedrons, and 5000+ stars.
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
