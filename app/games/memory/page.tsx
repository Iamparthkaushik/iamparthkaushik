'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎰', '🎲', '🎳', '🏆', '⭐', '🌟', '💎'];

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatchPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [highScore, setHighScore] = useState<number | null>(null);
  const { user, submitScore } = useAuth();
  
  const gridSize = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 18;
  
  const initGame = useCallback(() => {
    const pairsNeeded = gridSize / 2;
    const selectedEmojis = EMOJIS.slice(0, pairsNeeded);
    const cardPairs = [...selectedEmojis, ...selectedEmojis];
    
    // Shuffle cards
    const shuffled = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setGameStarted(true);
    setGameComplete(false);
    setTimer(0);
    
    // Load high score
    const saved = localStorage.getItem(`memory-highscore-${difficulty}`);
    if (saved) setHighScore(parseInt(saved));
  }, [gridSize, difficulty]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameComplete]);
  
  useEffect(() => {
    if (matchedPairs === gridSize / 2 && gameStarted) {
      setGameComplete(true);
      
      const score = Math.max(0, 10000 - (moves * 100) - (timer * 10));
      if (!highScore || score > highScore) {
        setHighScore(score);
        localStorage.setItem(`memory-highscore-${difficulty}`, score.toString());
      }
      if (user && score > 0) {
        submitScore('memory', score);
      }
    }
  }, [matchedPairs, gridSize, gameStarted, moves, timer, highScore, difficulty, user, submitScore]);
  
  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstId, secondId] = newFlipped;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);
      
      if (firstCard?.emoji === secondCard?.emoji) {
        setCards(prev => prev.map(c => 
          c.id === firstId || c.id === secondId
            ? { ...c, isMatched: true }
            : c
        ));
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getGridCols = () => {
    if (difficulty === 'easy') return 'grid-cols-4';
    if (difficulty === 'medium') return 'grid-cols-4 sm:grid-cols-6';
    return 'grid-cols-6';
  };
  
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#bab3ff] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
      </div>
      
      {/* Back Button */}
      <Link
        href="/games"
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>
      
      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {!gameStarted ? (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bab3ff] via-[#ffb3ba] to-[#a8e6cf]">
                Memory Match
              </span>
            </h1>
            <p className="text-gray-400 mb-8">Find all matching pairs!</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {(['easy', 'medium', 'hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    difficulty === d
                      ? 'bg-[#bab3ff] text-[#0a0a0f]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {d} ({d === 'easy' ? 8 : d === 'medium' ? 12 : 18} cards)
                </button>
              ))}
            </div>
            
            <button
              onClick={initGame}
              className="px-8 py-4 bg-gradient-to-r from-[#bab3ff] to-[#ffb3ba] text-[#0a0a0f] font-bold rounded-2xl text-lg hover:opacity-90 transition-opacity"
            >
              Start Game
            </button>
            
            {highScore && (
              <p className="mt-4 text-gray-400">
                High Score ({difficulty}): <span className="text-[#a8e6cf] font-bold">{highScore.toLocaleString()}</span>
              </p>
            )}
          </motion.div>
        ) : (
          <>
            {/* Stats Bar */}
            <motion.div
              className="flex gap-6 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <span className="text-gray-400 text-sm">Moves:</span>
                <span className="ml-2 text-white font-bold">{moves}</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <span className="text-gray-400 text-sm">Time:</span>
                <span className="ml-2 text-white font-bold">{formatTime(timer)}</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
                <span className="text-gray-400 text-sm">Pairs:</span>
                <span className="ml-2 text-white font-bold">{matchedPairs}/{gridSize / 2}</span>
              </div>
            </motion.div>
            
            {/* Card Grid */}
            <motion.div
              className={`grid ${getGridCols()} gap-3 max-w-lg`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {cards.map((card, index) => (
                <motion.button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
                    card.isFlipped || card.isMatched
                      ? card.isMatched
                        ? 'bg-[#a8e6cf]/30 border-2 border-[#a8e6cf]'
                        : 'bg-white/20'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                  style={{
                    transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                  }}
                  disabled={card.isMatched || card.isFlipped}
                >
                  {card.isFlipped || card.isMatched ? (
                    <span>{card.emoji}</span>
                  ) : (
                    <span className="text-gray-600">?</span>
                  )}
                </motion.button>
              ))}
            </motion.div>
            
            <button
              onClick={initGame}
              className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
            >
              Restart
            </button>
          </>
        )}
        
        {/* Win Modal */}
        <AnimatePresence>
          {gameComplete && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-8 rounded-3xl border border-white/10 text-center max-w-sm mx-4"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-white mb-2">You Win!</h2>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-400">
                    Moves: <span className="text-white font-bold">{moves}</span>
                  </p>
                  <p className="text-gray-400">
                    Time: <span className="text-white font-bold">{formatTime(timer)}</span>
                  </p>
                  <p className="text-gray-400">
                    Score: <span className="text-[#a8e6cf] font-bold">{Math.max(0, 10000 - (moves * 100) - (timer * 10)).toLocaleString()}</span>
                  </p>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={initGame}
                    className="px-6 py-2 bg-[#bab3ff] text-[#0a0a0f] font-bold rounded-xl hover:opacity-90"
                  >
                    Play Again
                  </button>
                  <Link
                    href="/games"
                    className="px-6 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20"
                  >
                    Exit
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
