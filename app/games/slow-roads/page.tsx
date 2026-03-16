'use client';

import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import FloatingNav from '../../components/FloatingNav';
import CursorFollower from '../../components/CursorFollower';
import SlowRoads from '../../components/SlowRoads/SlowRoads';
import HUD from '../../components/SlowRoads/HUD';

export default function SlowRoadsPage() {
  const [isDay, setIsDay] = useState(true);
  const [vehicleType, setVehicleType] = useState<'car' | 'bike'>('car');
  const [season, setSeason] = useState<'summer' | 'winter' | 'autumn' | 'rainy'>('summer');
  const [gameStarted, setGameStarted] = useState(false);

  // Auto-season cycle (optional, but let's make it manual for now via HUD or slow transition)
  useEffect(() => {
    const seasons: ('summer' | 'winter' | 'autumn' | 'rainy')[] = ['summer', 'autumn', 'winter', 'rainy'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % seasons.length;
      setSeason(seasons[currentIndex]);
    }, 60000); // Change season every minute for demo purposes

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      {/* HUD UI Layer */}
      <HUD 
        isDay={isDay} 
        setIsDay={setIsDay} 
        vehicleType={vehicleType} 
        setVehicleType={setVehicleType} 
        season={season}
        setSeason={setSeason}
      />

      {/* Start Screen Overlay */}
      <AnimatePresence>
        {!gameStarted && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center p-8 max-w-md">
              <motion.h1 
                className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#bab3ff] to-[#ffdfba]"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
              >
                Slow Roads
              </motion.h1>
              <p className="text-gray-300 mb-8 leading-relaxed">
                A relaxing driving experience. Relax, explore, and enjoy the scenery.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm">
                  <span className="block font-bold text-[#a8e6cf] mb-1">WASD / Arrows</span>
                  Drive & Steer
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-sm">
                  <span className="block font-bold text-[#ffb3ba] mb-1">Space</span>
                  Handbrake
                </div>
              </div>
              <button 
                onClick={() => setGameStarted(true)}
                className="w-full py-4 bg-gradient-to-r from-[#bab3ff] to-[#7c6aff] text-white rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-[#7c6aff]/20"
              >
                Start Driving
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
          <Suspense fallback={null}>
            {/* Environment Sky/Stars */}
            {isDay ? (
              <Sky 
                distance={450000} 
                sunPosition={[100, 20, 100]} 
                inclination={0} 
                azimuth={0.25} 
              />
            ) : (
              <>
                <color attach="background" args={['#050510']} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              </>
            )}
            
            <ambientLight intensity={isDay ? 0.5 : 0.1} />
            <directionalLight 
              position={isDay ? [10, 20, 10] : [-10, -20, -10]} 
              intensity={isDay ? 1.5 : 0.05} 
              castShadow 
              shadow-mapSize={[2048, 2048]}
            />
            
            {/* Game World and Player */}
            <SlowRoads 
              isDay={isDay} 
              vehicleType={vehicleType} 
              season={season} 
              gameStarted={gameStarted}
            />
            
            {gameStarted && <PointerLockControls />}
          </Suspense>
        </Canvas>
      </div>

      {/* Back Button */}
      <Link
        href="/games"
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all flex items-center gap-2 border border-white/10"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Arcade
      </Link>
    </main>
  );
}
