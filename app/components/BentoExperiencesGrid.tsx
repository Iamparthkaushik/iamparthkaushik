'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  gridClass: string;
}

const experiences: ExperienceCard[] = [
  {
    id: '3d-world',
    title: '3D Universe',
    description: 'Explore an interactive 3D space with stunning models',
    icon: '🌐',
    gradient: 'from-[#a8e6cf] to-[#88d8b0]',
    href: '/experiences/3d-world',
    gridClass: 'col-span-2 row-span-2',
  },
  {
    id: 'physics',
    title: 'Physics',
    description: 'Click to spawn objects!',
    icon: '⚛️',
    gradient: 'from-[#bae1ff] to-[#a8d8ea]',
    href: '/experiences/physics',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    id: 'particles',
    title: 'Particles',
    description: 'Interactive storm',
    icon: '✨',
    gradient: 'from-[#ffb3ba] to-[#ffc8c8]',
    href: '/experiences/particles',
    gridClass: 'col-span-1 row-span-1',
  },
  {
    id: 'audio-viz',
    title: 'Audio Visualizer',
    description: 'Music comes alive with reactive visuals',
    icon: '🎵',
    gradient: 'from-[#bab3ff] to-[#d4d0ff]',
    href: '/experiences/audio-visualizer',
    gridClass: 'col-span-2 row-span-1',
  },
  {
    id: 'galaxy',
    title: 'Galaxy Explorer',
    description: 'Navigate through a procedurally generated galaxy',
    icon: '🌌',
    gradient: 'from-[#ffdfba] to-[#ffe4c4]',
    href: '/experiences/galaxy',
    gridClass: 'col-span-2 row-span-1',
  },
];

export default function BentoExperiencesGrid() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`${exp.gridClass}`}
          >
            <Link href={exp.href} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br ${exp.gradient} overflow-hidden cursor-pointer group`}
              >
                {/* Glowing orb effect */}
                <div className="absolute -right-8 -top-8 w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <span className="text-2xl md:text-3xl">{exp.icon}</span>
                  
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-lg mb-0.5 md:mb-1 drop-shadow-lg">
                      {exp.title}
                    </h3>
                    <p className="text-white/80 text-[10px] md:text-xs line-clamp-2">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Explore indicator */}
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
