'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FloatingNav from '../components/FloatingNav';
import CursorFollower from '../components/CursorFollower';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  game: string;
  date: string;
}

const GAMES = [
  { id: 'all', name: 'All Games', color: '#fff' },
  { id: 'flappy-bird', name: 'Flappy Bird', color: '#ffdfba' },
  { id: 'snake', name: 'Double Snake', color: '#a8e6cf' },
  { id: 'memory', name: 'Memory Match', color: '#bab3ff' },
  { id: 'reaction', name: 'Reaction Test', color: '#ffb3ba' },
  { id: 'typing', name: 'Typing Race', color: '#bae1ff' },
];

export default function LeaderboardPage() {
  const [selectedGame, setSelectedGame] = useState('all');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const url = selectedGame === 'all' 
          ? '/api/leaderboard' 
          : `/api/leaderboard?game=${selectedGame}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard || []);
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [selectedGame]);

  const getGameColor = (gameId: string) => {
    return GAMES.find(g => g.id === gameId)?.color || '#fff';
  };

  const getGameName = (gameId: string) => {
    return GAMES.find(g => g.id === gameId)?.name || gameId;
  };

  const formatScore = (score: number, gameId: string) => {
    if (gameId === 'reaction') {
      return `${score}ms`;
    }
    if (gameId === 'typing') {
      return `${score} WPM`;
    }
    return score.toLocaleString();
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#bab3ff] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
      </div>
      
      {/* Header */}
      <section className="relative pt-32 pb-8 px-4">
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ffdfba]/10 text-[#ffdfba] text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Hall of Fame
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdfba] via-[#ffb3ba] to-[#bab3ff]">
              Leaderboard
            </span>
          </h1>
          <p className="text-lg text-gray-400">
            Compete with players worldwide and climb to the top!
          </p>
          {!user && (
            <button
              onClick={() => setShowAuthModal(true)}
              className="mt-4 px-6 py-2 rounded-xl bg-gradient-to-r from-[#ffdfba] to-[#ffb3ba] text-black font-medium hover:opacity-90 transition-opacity"
            >
              Login to Submit Scores
            </button>
          )}
          {user && (
            <p className="mt-4 text-sm text-[#a8e6cf]">
              Playing as <span className="font-semibold">{user.username}</span>
            </p>
          )}
        </motion.div>
      </section>
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      {/* Game Filter */}
      <section className="relative px-4 mb-8">
        <motion.div
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setSelectedGame(game.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedGame === game.id
                  ? 'text-[#0a0a0f]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedGame === game.id ? game.color : undefined,
              }}
            >
              {game.name}
            </button>
          ))}
        </motion.div>
      </section>
      
      {/* Leaderboard Table */}
      <section className="relative px-4 pb-20">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/10 text-sm text-gray-500 font-medium">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Player</div>
              <div className="col-span-3">Game</div>
              <div className="col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right">Date</div>
            </div>
            
            {/* Entries */}
            {loading ? (
              <div className="py-20 text-center text-gray-500">
                <div className="w-8 h-8 border-2 border-[#a8e6cf]/30 border-t-[#a8e6cf] rounded-full animate-spin mx-auto mb-4" />
                Loading...
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                No entries yet. Be the first!
              </div>
            ) : (
              leaderboard.map((entry, index) => (
                <motion.div
                  key={`${entry.username}-${entry.game}-${entry.rank}`}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="col-span-1">
                    {index === 0 ? (
                      <span className="text-2xl">🥇</span>
                    ) : index === 1 ? (
                      <span className="text-2xl">🥈</span>
                    ) : index === 2 ? (
                      <span className="text-2xl">🥉</span>
                    ) : (
                      <span className="text-gray-500 font-mono">{index + 1}</span>
                    )}
                  </div>
                  <div className="col-span-4">
                    <span className={`font-semibold ${user && entry.username === user.username ? 'text-[#a8e6cf]' : 'text-white'}`}>
                      {entry.username}
                      {user && entry.username === user.username && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-[#a8e6cf]/20">
                          You
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="col-span-3">
                    <span
                      className="px-2 py-1 rounded-lg text-sm font-medium"
                      style={{
                        backgroundColor: `${getGameColor(entry.game)}20`,
                        color: getGameColor(entry.game),
                      }}
                    >
                      {getGameName(entry.game)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="font-mono font-bold text-white">
                      {formatScore(entry.score, entry.game)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right text-gray-500 text-sm">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
