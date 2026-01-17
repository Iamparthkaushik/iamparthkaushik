'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const SAMPLE_TEXTS = [
  "The quick brown fox jumps over the lazy dog.",
  "Pack my box with five dozen liquor jugs.",
  "How vexingly quick daft zebras jump!",
  "The five boxing wizards jump quickly.",
  "Sphinx of black quartz, judge my vow.",
  "Two driven jocks help fax my big quiz.",
  "The job requires extra pluck and zeal from every young wage earner.",
  "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent.",
  "Jackdaws love my big sphinx of quartz.",
  "We promptly judged antique ivory buckles for the next prize.",
  "Programming is the art of telling computers what to do.",
  "The best way to predict the future is to invent it.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Experience is the name everyone gives to their mistakes."
];

export default function TypingRacePage() {
  const [gameState, setGameState] = useState<'waiting' | 'countdown' | 'playing' | 'finished'>('waiting');
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [countdown, setCountdown] = useState(3);
  const [bestWpm, setBestWpm] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, submitScore } = useAuth();
  
  useEffect(() => {
    const saved = localStorage.getItem('typing-best-wpm');
    if (saved) setBestWpm(parseInt(saved));
  }, []);
  
  const startGame = useCallback(() => {
    setGameState('countdown');
    setCountdown(3);
    setUserInput('');
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
    
    // Pick random text
    const randomText = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setCurrentText(randomText);
    
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(countdownInterval);
        setGameState('playing');
        setStartTime(Date.now());
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 1000);
  }, []);
  
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    
    const value = e.target.value;
    setUserInput(value);
    
    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== currentText[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    
    // Calculate accuracy
    const acc = value.length > 0 
      ? Math.round(((value.length - errorCount) / value.length) * 100)
      : 100;
    setAccuracy(acc);
    
    // Calculate WPM in real-time
    const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
    const words = value.trim().split(/\s+/).length;
    const currentWpm = elapsed > 0 ? Math.round(words / elapsed) : 0;
    setWpm(currentWpm);
    
    // Check if finished
    if (value === currentText) {
      setEndTime(Date.now());
      setGameState('finished');
      
      const finalElapsed = (Date.now() - startTime) / 1000 / 60;
      const finalWords = currentText.split(/\s+/).length;
      const finalWpm = Math.round(finalWords / finalElapsed);
      setWpm(finalWpm);
      
      if (!bestWpm || finalWpm > bestWpm) {
        setBestWpm(finalWpm);
        localStorage.setItem('typing-best-wpm', finalWpm.toString());
      }
      if (user && finalWpm > 0) {
        submitScore('typing', finalWpm);
      }
    }
  }, [gameState, currentText, startTime, bestWpm, user, submitScore]);
  
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className = 'text-gray-500'; // Not typed yet
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          className = 'text-[#a8e6cf]'; // Correct
        } else {
          className = 'text-[#ff6b6b] bg-[#ff6b6b]/20'; // Wrong
        }
      } else if (index === userInput.length) {
        className = 'text-white bg-white/20'; // Current position
      }
      
      return (
        <span key={index} className={`${className} transition-colors`}>
          {char}
        </span>
      );
    });
  };
  
  const getWpmRating = (wpm: number) => {
    if (wpm >= 100) return { text: '⚡ LEGENDARY', color: '#a8e6cf' };
    if (wpm >= 80) return { text: '🚀 Pro Typist', color: '#a8e6cf' };
    if (wpm >= 60) return { text: '🔥 Fast', color: '#bae1ff' };
    if (wpm >= 40) return { text: '👍 Average', color: '#ffdfba' };
    if (wpm >= 20) return { text: '🐢 Keep Practicing', color: '#ffb3ba' };
    return { text: '🌱 Beginner', color: '#ffb3ba' };
  };
  
  const getTimeTaken = () => {
    if (!startTime || !endTime) return '-';
    const seconds = Math.round((endTime - startTime) / 1000);
    return `${seconds}s`;
  };
  
  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
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
      
      {/* Stats */}
      {gameState === 'playing' && (
        <div className="absolute top-6 right-6 z-10 flex gap-4">
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <span className="text-gray-400 text-sm">WPM:</span>
            <span className="ml-2 text-white font-bold">{wpm}</span>
          </div>
          <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl">
            <span className="text-gray-400 text-sm">Accuracy:</span>
            <span className={`ml-2 font-bold ${accuracy >= 90 ? 'text-[#a8e6cf]' : accuracy >= 70 ? 'text-[#ffdfba]' : 'text-[#ffb3ba]'}`}>
              {accuracy}%
            </span>
          </div>
        </div>
      )}
      
      {/* Game Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <AnimatePresence mode="wait">
          {gameState === 'waiting' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-8xl mb-6">⌨️</div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bae1ff] via-[#a8e6cf] to-[#ffdfba]">
                  Typing Race
                </span>
              </h1>
              <p className="text-gray-400 mb-8">Test your typing speed!</p>
              
              {bestWpm && (
                <p className="text-gray-400 mb-6">
                  Best: <span className="text-[#a8e6cf] font-bold">{bestWpm} WPM</span>
                </p>
              )}
              
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-[#bae1ff] to-[#a8e6cf] text-[#0a0a0f] font-bold rounded-2xl text-lg hover:opacity-90 transition-opacity"
              >
                Start Race
              </button>
            </motion.div>
          )}
          
          {gameState === 'countdown' && (
            <motion.div
              className="text-center"
              key="countdown"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-8xl font-bold text-white"
                key={countdown}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                {countdown}
              </motion.div>
              <p className="text-gray-400 mt-4">Get ready...</p>
            </motion.div>
          )}
          
          {gameState === 'playing' && (
            <motion.div
              className="w-full max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Text Display */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-mono leading-relaxed tracking-wide">
                  {renderText()}
                </p>
              </div>
              
              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white text-lg font-mono focus:outline-none focus:border-[#a8e6cf] transition-colors"
                placeholder="Start typing..."
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
              />
              
              {/* Progress */}
              <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#bae1ff] to-[#a8e6cf]"
                  initial={{ width: 0 }}
                  animate={{ width: `${(userInput.length / currentText.length) * 100}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </motion.div>
          )}
          
          {gameState === 'finished' && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-6xl mb-4">🏁</div>
              <h2 className="text-4xl font-bold text-white mb-2">Race Complete!</h2>
              
              <div className="my-8 space-y-4">
                <div className="text-6xl font-bold text-[#a8e6cf]">{wpm} WPM</div>
                <span
                  className="inline-block px-6 py-2 rounded-full text-lg font-bold"
                  style={{
                    backgroundColor: `${getWpmRating(wpm).color}33`,
                    color: getWpmRating(wpm).color,
                  }}
                >
                  {getWpmRating(wpm).text}
                </span>
              </div>
              
              <div className="flex justify-center gap-8 mb-8 text-gray-400">
                <div>
                  <div className="text-white font-bold text-2xl">{accuracy}%</div>
                  <div className="text-sm">Accuracy</div>
                </div>
                <div>
                  <div className="text-white font-bold text-2xl">{getTimeTaken()}</div>
                  <div className="text-sm">Time</div>
                </div>
                <div>
                  <div className="text-white font-bold text-2xl">{errors}</div>
                  <div className="text-sm">Errors</div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startGame}
                  className="px-6 py-3 bg-[#bae1ff] text-[#0a0a0f] font-bold rounded-xl hover:opacity-90"
                >
                  Race Again
                </button>
                <Link
                  href="/games"
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20"
                >
                  Exit
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
