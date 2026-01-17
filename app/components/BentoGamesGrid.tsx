'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  href: string;
  gridClass: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
}

const games: GameCard[] = [
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'The legendary game! Tap to fly, dodge the pipes.',
    icon: '🐦',
    gradient: 'from-[#ffdfba] via-[#ffb347] to-[#ff9500]',
    href: '/games/flappy-bird',
    gridClass: 'col-span-2 row-span-2',
    difficulty: 'Legendary',
  },
  {
    id: 'double-snake',
    title: 'Double Snake',
    description: 'Head becomes tail when you eat!',
    icon: '🐍',
    gradient: 'from-[#a8e6cf] via-[#88d8b0] to-[#56ab91]',
    href: '/games/snake',
    gridClass: 'col-span-2 row-span-1',
    difficulty: 'Medium',
  },
  {
    id: 'memory-match',
    title: 'Memory',
    description: 'Match all the pairs!',
    icon: '🧠',
    gradient: 'from-[#bab3ff] via-[#9b8cff] to-[#7c6aff]',
    href: '/games/memory',
    gridClass: 'col-span-1 row-span-1',
    difficulty: 'Easy',
  },
  {
    id: 'reaction-time',
    title: 'Reaction',
    description: 'How fast are you?',
    icon: '⚡',
    gradient: 'from-[#ffb3ba] via-[#ff8a9b] to-[#ff6b7a]',
    href: '/games/reaction',
    gridClass: 'col-span-1 row-span-1',
    difficulty: 'Easy',
  },
  {
    id: 'typing-race',
    title: 'Typing Race',
    description: 'Test your typing speed!',
    icon: '⌨️',
    gradient: 'from-[#bae1ff] via-[#8ac4ff] to-[#5aa7ff]',
    href: '/games/typing',
    gridClass: 'col-span-2 row-span-1',
    difficulty: 'Medium',
  },
];

const difficultyColors: Record<string, string> = {
  Easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Legendary: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function BentoGamesGrid() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] md:auto-rows-[140px]">
        {games.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={`${game.gridClass}`}
          >
            <Link href={game.href} className="block h-full">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative h-full p-4 md:p-5 rounded-2xl md:rounded-3xl bg-gradient-to-br ${game.gradient} overflow-hidden cursor-pointer group`}
              >
                {/* Glowing orb effect */}
                <div className="absolute -right-8 -top-8 w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="text-2xl md:text-3xl">{game.icon}</span>
                    {game.difficulty && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] md:text-xs font-medium border ${difficultyColors[game.difficulty]}`}>
                        {game.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-lg mb-0.5 md:mb-1 drop-shadow-lg">
                      {game.title}
                    </h3>
                    <p className="text-white/80 text-[10px] md:text-xs line-clamp-2">
                      {game.description}
                    </p>
                  </div>
                </div>

                {/* Play indicator */}
                <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
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
