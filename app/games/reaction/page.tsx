'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

type GameState = 'waiting' | 'countdown' | 'ready' | 'clicked' | 'tooEarly';

export default function ReactionTestPage() {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user, submitScore } = useAuth();
  
  useEffect(() => {
    const saved = localStorage.getItem('reaction-best');
    if (saved) setBestTime(parseInt(saved));
  }, []);
  
  const startGame = useCallback(() => {
    setGameState('countdown');
    setReactionTime(null);
    setCountdown(3);
    
    // Countdown
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        
        // Random delay before showing green (1.5-4 seconds)
        const delay = Math.random() * 2500 + 1500;
        timeoutRef.current = setTimeout(() => {
          setGameState('ready');
          startTimeRef.current = performance.now();
        }, delay);
        
        setGameState('countdown');
      }
    }, 1000);
    
    return () => clearInterval(countdownInterval);
  }, []);
  
  const handleClick = useCallback(() => {
    if (gameState === 'waiting') {
      startGame();
    } else if (gameState === 'countdown') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState('tooEarly');
    } else if (gameState === 'ready') {
      const endTime = performance.now();
      const time = Math.round(endTime - startTimeRef.current);
      setReactionTime(time);
      setGameState('clicked');
      
      const newAttempts = [...attempts, time];
      setAttempts(newAttempts);
      
      if (!bestTime || time < bestTime) {
        setBestTime(time);
        localStorage.setItem('reaction-best', time.toString());
        if (user) {
          submitScore('reaction', time);
        }
      }
    } else if (gameState === 'clicked' || gameState === 'tooEarly') {
      startGame();
    }
  }, [gameState, startGame, attempts, bestTime]);
  
  const getAverageTime = () => {
    if (attempts.length === 0) return null;
    return Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length);
  };
  
  const getBackgroundColor = () => {
    switch (gameState) {
      case 'waiting':
        return 'bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f]';
      case 'countdown':
        return 'bg-gradient-to-br from-[#cc3333] to-[#991111]';
      case 'ready':
        return 'bg-gradient-to-br from-[#33cc33] to-[#119911]';
      case 'clicked':
        return 'bg-gradient-to-br from-[#bae1ff] to-[#5599cc]';
      case 'tooEarly':
        return 'bg-gradient-to-br from-[#ffb3ba] to-[#cc5555]';
      default:
        return 'bg-[#0a0a0f]';
    }
  };
  
  const getMessage = () => {
    switch (gameState) {
      case 'waiting':
        return { title: 'Reaction Test', subtitle: 'Click anywhere to begin' };
      case 'countdown':
        return { title: 'Wait...', subtitle: 'Click when the screen turns GREEN' };
      case 'ready':
        return { title: 'CLICK!', subtitle: 'Now!' };
      case 'clicked':
        return { title: `${reactionTime}ms`, subtitle: 'Click to try again' };
      case 'tooEarly':
        return { title: 'Too Early!', subtitle: 'Wait for green. Click to retry' };
      default:
        return { title: '', subtitle: '' };
    }
  };
  
  const getSpeedRating = (time: number) => {
    if (time < 150) return { text: '⚡ INHUMAN', color: '#a8e6cf' };
    if (time < 200) return { text: '🚀 Lightning Fast', color: '#a8e6cf' };
    if (time < 250) return { text: '🔥 Fast', color: '#bae1ff' };
    if (time < 300) return { text: '👍 Average', color: '#ffdfba' };
    if (time < 400) return { text: '🐢 Slow', color: '#ffb3ba' };
    return { text: '😴 Sleepy?', color: '#ffb3ba' };
  };
  
  const { title, subtitle } = getMessage();
  
  return (
    <main
      className={`relative w-full min-h-screen transition-colors duration-300 cursor-pointer ${getBackgroundColor()}`}
      onClick={handleClick}
    >
      {/* Back Button */}
      <Link
        href="/games"
        className="absolute top-6 left-6 z-20 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-xl text-white font-medium transition-all flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>
      
      {/* Stats Panel */}
      <div
        className="absolute top-6 right-6 z-20 p-4 bg-black/30 backdrop-blur-sm rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-white/60">Best:</span>
            <span className="text-white font-bold">{bestTime ? `${bestTime}ms` : '-'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/60">Average:</span>
            <span className="text-white font-bold">{getAverageTime() ? `${getAverageTime()}ms` : '-'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/60">Attempts:</span>
            <span className="text-white font-bold">{attempts.length}</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState}
            className="text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {gameState === 'waiting' && (
              <div className="text-8xl mb-8">⚡</div>
            )}
            
            {gameState === 'countdown' && countdown > 0 && (
              <motion.div
                className="text-8xl font-bold text-white mb-4"
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                {countdown}
              </motion.div>
            )}
            
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-4">
              {title}
            </h1>
            
            <p className="text-xl text-white/80 mb-8">
              {subtitle}
            </p>
            
            {gameState === 'clicked' && reactionTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span
                  className="inline-block px-6 py-2 rounded-full text-lg font-bold"
                  style={{
                    backgroundColor: `${getSpeedRating(reactionTime).color}33`,
                    color: getSpeedRating(reactionTime).color,
                  }}
                >
                  {getSpeedRating(reactionTime).text}
                </span>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Attempts History */}
        {attempts.length > 0 && gameState === 'clicked' && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {attempts.slice(-5).map((time, i) => (
              <div
                key={i}
                className="px-3 py-1 bg-black/30 rounded-lg text-white text-sm font-mono"
              >
                {time}ms
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  );
}
