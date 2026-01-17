'use client';

import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  href: string;
  size: 'small' | 'medium' | 'large';
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
}

const games: GameCard[] = [
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'The legendary game that broke the internet. Tap to fly, dodge the pipes, and try to beat Parth\'s world record!',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    gradient: 'from-[#ffdfba] via-[#ffb347] to-[#ff9500]',
    href: '/games/flappy-bird',
    size: 'large',
    difficulty: 'Legendary',
  },
  {
    id: 'double-snake',
    title: 'Double-Headed Snake',
    description: 'A unique twist on the classic! When you eat, the head becomes the tail and vice versa. Mind-bending gameplay!',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    gradient: 'from-[#a8e6cf] via-[#88d8b0] to-[#56ab91]',
    href: '/games/snake',
    size: 'large',
    difficulty: 'Medium',
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Test your memory with beautiful card designs. How fast can you match them all?',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
      </svg>
    ),
    gradient: 'from-[#bab3ff] via-[#9b8cff] to-[#7c6aff]',
    href: '/games/memory',
    size: 'medium',
    difficulty: 'Easy',
  },
  {
    id: 'reaction-time',
    title: 'Reaction Test',
    description: 'How fast are your reflexes? Click as soon as you see green!',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-[#ffb3ba] via-[#ff8a9b] to-[#ff6b7a]',
    href: '/games/reaction',
    size: 'small',
    difficulty: 'Easy',
  },
  {
    id: 'typing-race',
    title: 'Typing Race',
    description: 'Race against the clock! Type the words as fast as you can.',
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-[#bae1ff] via-[#8ac4ff] to-[#5aa7ff]',
    href: '/games/typing',
    size: 'medium',
    difficulty: 'Medium',
  },
];

const breakpointColumns = {
  default: 3,
  1100: 2,
  700: 1,
};

const difficultyColors = {
  Easy: 'bg-green-500/20 text-green-400',
  Medium: 'bg-yellow-500/20 text-yellow-400',
  Hard: 'bg-orange-500/20 text-orange-400',
  Legendary: 'bg-red-500/20 text-red-400',
};

export default function GamesGrid() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`mb-6 ${
              game.size === 'large' ? 'min-h-[350px]' : game.size === 'medium' ? 'min-h-[280px]' : 'min-h-[200px]'
            }`}
          >
            <Link href={game.href}>
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-6 rounded-3xl bg-gradient-to-br ${game.gradient} overflow-hidden cursor-pointer group`}
              >
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-32 h-32 border-4 border-white/30 rounded-full" />
                  <div className="absolute bottom-4 left-4 w-24 h-24 border-4 border-white/20 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 border-4 border-white/10 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                
                {/* Difficulty badge */}
                {game.difficulty && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold ${difficultyColors[game.difficulty]}`}>
                    {game.difficulty}
                  </div>
                )}
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                    {game.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
                  <p className="text-white/80 text-sm flex-grow">{game.description}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <motion.button
                      className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white font-semibold hover:bg-white/30 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Play Now
                    </motion.button>
                  </div>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </Masonry>
    </div>
  );
}
