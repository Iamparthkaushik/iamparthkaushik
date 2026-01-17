'use client';

import { motion } from 'framer-motion';
import FloatingNav from '../components/FloatingNav';
import CursorFollower from '../components/CursorFollower';
import BentoExperiencesGrid from '../components/BentoExperiencesGrid';

export default function ExperiencesPage() {
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      {/* Header */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-16 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
          <div className="absolute top-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
        </div>
        
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#a8e6cf]/10 text-[#a8e6cf] text-sm font-medium mb-4 md:mb-6">
            Interactive Playground
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#bab3ff]">
              Experiences
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
            Dive into a collection of interactive 3D worlds, physics simulations, and creative experiments.
          </p>
        </motion.div>
      </section>
      
      {/* Experiences Grid */}
      <BentoExperiencesGrid />
      
      {/* Bottom spacing */}
      <div className="h-10 md:h-20" />
    </main>
  );
}
