'use client';

import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface ExperienceCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
  size: 'small' | 'medium' | 'large';
}

const experiences: ExperienceCard[] = [
  {
    id: '3d-world',
    title: '3D Universe',
    description: 'Explore an interactive 3D space with stunning models and animations. Drag to rotate, immerse yourself in the scene.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
    gradient: 'from-[#a8e6cf] to-[#88d8b0]',
    href: '/experiences/3d-world',
    size: 'large',
  },
  {
    id: 'physics',
    title: 'Physics Sandbox',
    description: 'Click to spawn objects and watch gravity, collisions, and physics unfold in real-time.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-[#bae1ff] to-[#a8d8ea]',
    href: '/experiences/physics',
    size: 'medium',
  },
  {
    id: 'particles',
    title: 'Particle Storm',
    description: 'Interactive particle system that reacts to your mouse movements.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    gradient: 'from-[#ffb3ba] to-[#ffc8c8]',
    href: '/experiences/particles',
    size: 'small',
  },
  {
    id: 'audio-viz',
    title: 'Audio Visualizer',
    description: 'Watch music come alive with reactive visualizations that dance to the beat.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
    gradient: 'from-[#bab3ff] to-[#d4d0ff]',
    href: '/experiences/audio-visualizer',
    size: 'medium',
  },
  {
    id: 'galaxy',
    title: 'Galaxy Explorer',
    description: 'Navigate through a procedurally generated galaxy with thousands of stars.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    gradient: 'from-[#ffdfba] to-[#ffe4c4]',
    href: '/experiences/galaxy',
    size: 'large',
  },
];

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

export default function ExperiencesGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`mb-6 ${
              exp.size === 'large' ? 'min-h-[350px]' : exp.size === 'medium' ? 'min-h-[280px]' : 'min-h-[200px]'
            }`}
          >
            <Link href={exp.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-6 rounded-3xl bg-gradient-to-br ${exp.gradient} overflow-hidden cursor-pointer group`}
              >
                {/* Glowing orb effect */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                    {exp.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                  <p className="text-white/80 text-sm flex-grow">{exp.description}</p>
                  
                  <div className="mt-4 flex items-center gap-2 text-white font-medium">
                    <span>Explore</span>
                    <motion.svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </motion.svg>
                  </div>
                </div>
                
                {/* Hover shine effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
}
