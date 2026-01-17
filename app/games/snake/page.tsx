'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingNav from '../../components/FloatingNav';
import CursorFollower from '../../components/CursorFollower';
import { useAuth } from '../../context/AuthContext';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 20;
const CELL_SIZE = 18;
const INITIAL_SPEED = 120;
const MIN_SPEED = 60;

export default function SnakePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [headAtFront, setHeadAtFront] = useState(true);
  const { user, submitScore } = useAuth();
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Game state refs
  const snake = useRef<Position[]>([{ x: 10, y: 10 }]);
  const food = useRef<Position>({ x: 15, y: 10 });
  const direction = useRef<Direction>('RIGHT');
  const nextDirection = useRef<Direction>('RIGHT');
  const isHeadAtFront = useRef(true);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const lastUpdate = useRef(0);
  const animationFrame = useRef<number>(0);
  const currentSpeed = useRef(INITIAL_SPEED);

  useEffect(() => {
    const saved = localStorage.getItem('snakeHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const spawnFood = useCallback(() => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.current.some(seg => seg.x === newFood.x && seg.y === newFood.y));
    food.current = newFood;
  }, []);

  const startGame = useCallback(() => {
    snake.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    direction.current = 'RIGHT';
    nextDirection.current = 'RIGHT';
    isHeadAtFront.current = true;
    setHeadAtFront(true);
    scoreRef.current = 0;
    setScore(0);
    currentSpeed.current = INITIAL_SPEED;
    spawnFood();
    gameStateRef.current = 'playing';
    setGameState('playing');
  }, [spawnFood]);

  const getOppositeDirection = (dir: Direction): Direction => {
    switch (dir) {
      case 'UP': return 'DOWN';
      case 'DOWN': return 'UP';
      case 'LEFT': return 'RIGHT';
      case 'RIGHT': return 'LEFT';
    }
  };

  const handleDirectionChange = useCallback((newDir: Direction) => {
    if (gameStateRef.current === 'idle') {
      startGame();
      return;
    }
    if (gameStateRef.current === 'gameover') {
      gameStateRef.current = 'idle';
      setGameState('idle');
      return;
    }

    const currentDir = direction.current;
    const headFirst = isHeadAtFront.current;
    
    if (newDir === 'UP' && ((headFirst && currentDir !== 'DOWN') || (!headFirst && currentDir !== 'UP'))) {
      nextDirection.current = 'UP';
    } else if (newDir === 'DOWN' && ((headFirst && currentDir !== 'UP') || (!headFirst && currentDir !== 'DOWN'))) {
      nextDirection.current = 'DOWN';
    } else if (newDir === 'LEFT' && ((headFirst && currentDir !== 'RIGHT') || (!headFirst && currentDir !== 'LEFT'))) {
      nextDirection.current = 'LEFT';
    } else if (newDir === 'RIGHT' && ((headFirst && currentDir !== 'LEFT') || (!headFirst && currentDir !== 'RIGHT'))) {
      nextDirection.current = 'RIGHT';
    }
  }, [startGame]);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    
    const minSwipe = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipe) {
        handleDirectionChange(deltaX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(deltaY) > minSwipe) {
        handleDirectionChange(deltaY > 0 ? 'DOWN' : 'UP');
      }
    }
    
    touchStart.current = null;
  }, [handleDirectionChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          e.preventDefault();
          handleDirectionChange('UP');
          break;
        case 'arrowdown':
        case 's':
          e.preventDefault();
          handleDirectionChange('DOWN');
          break;
        case 'arrowleft':
        case 'a':
          e.preventDefault();
          handleDirectionChange('LEFT');
          break;
        case 'arrowright':
        case 'd':
          e.preventDefault();
          handleDirectionChange('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKey);

    const gameLoop = (timestamp: number) => {
      ctx.fillStyle = '#0f0f1a';
      ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
        ctx.stroke();
      }

      if (gameStateRef.current === 'playing') {
        if (timestamp - lastUpdate.current >= currentSpeed.current) {
          lastUpdate.current = timestamp;
          direction.current = nextDirection.current;

          const snakeArr = snake.current;
          const headIndex = isHeadAtFront.current ? 0 : snakeArr.length - 1;
          const head = snakeArr[headIndex];
          let newHead: Position;

          switch (direction.current) {
            case 'UP':
              newHead = { x: head.x, y: head.y - 1 };
              break;
            case 'DOWN':
              newHead = { x: head.x, y: head.y + 1 };
              break;
            case 'LEFT':
              newHead = { x: head.x - 1, y: head.y };
              break;
            case 'RIGHT':
              newHead = { x: head.x + 1, y: head.y };
              break;
          }

          if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
            gameStateRef.current = 'gameover';
            setGameState('gameover');
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              localStorage.setItem('snakeHighScore', scoreRef.current.toString());
            }
            if (user && scoreRef.current > 0) {
              submitScore('snake', scoreRef.current);
            }
          } else if (snakeArr.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
            gameStateRef.current = 'gameover';
            setGameState('gameover');
            if (scoreRef.current > highScore) {
              setHighScore(scoreRef.current);
              localStorage.setItem('snakeHighScore', scoreRef.current.toString());
            }
            if (user && scoreRef.current > 0) {
              submitScore('snake', scoreRef.current);
            }
          } else {
            if (isHeadAtFront.current) {
              snakeArr.unshift(newHead);
            } else {
              snakeArr.push(newHead);
            }

            if (newHead.x === food.current.x && newHead.y === food.current.y) {
              scoreRef.current += 10;
              setScore(scoreRef.current);
              spawnFood();
              currentSpeed.current = Math.max(MIN_SPEED, currentSpeed.current - 2);
              isHeadAtFront.current = !isHeadAtFront.current;
              setHeadAtFront(isHeadAtFront.current);
              direction.current = getOppositeDirection(direction.current);
              nextDirection.current = direction.current;
            } else {
              if (isHeadAtFront.current) {
                snakeArr.pop();
              } else {
                snakeArr.shift();
              }
            }
          }
        }
      }

      // Draw food
      ctx.shadowColor = '#ffb3ba';
      ctx.shadowBlur = 15;
      const foodGradient = ctx.createRadialGradient(
        food.current.x * CELL_SIZE + CELL_SIZE / 2,
        food.current.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        food.current.x * CELL_SIZE + CELL_SIZE / 2,
        food.current.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2
      );
      foodGradient.addColorStop(0, '#ffcdd2');
      foodGradient.addColorStop(1, '#ff6b6b');
      ctx.fillStyle = foodGradient;
      ctx.beginPath();
      ctx.arc(
        food.current.x * CELL_SIZE + CELL_SIZE / 2,
        food.current.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw snake
      const snakeArr = snake.current;
      const headIndex = isHeadAtFront.current ? 0 : snakeArr.length - 1;
      const tailIndex = isHeadAtFront.current ? snakeArr.length - 1 : 0;

      snakeArr.forEach((segment, i) => {
        const isHead = i === headIndex;
        const isTail = i === tailIndex;
        const progress = isHeadAtFront.current
          ? i / (snakeArr.length - 1)
          : 1 - i / (snakeArr.length - 1);

        const headColor = { r: 168, g: 230, b: 207 };
        const tailColor = { r: 186, g: 225, b: 255 };
        
        const r = Math.round(headColor.r + (tailColor.r - headColor.r) * progress);
        const g = Math.round(headColor.g + (tailColor.g - headColor.g) * progress);
        const b = Math.round(headColor.b + (tailColor.b - headColor.b) * progress);

        if (isHead || isTail) {
          ctx.shadowColor = isHead ? '#a8e6cf' : '#bae1ff';
          ctx.shadowBlur = 15;
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.roundRect(
          segment.x * CELL_SIZE + 1,
          segment.y * CELL_SIZE + 1,
          CELL_SIZE - 2,
          CELL_SIZE - 2,
          isHead || isTail ? 6 : 4
        );
        ctx.fill();

        if (isHead || isTail) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#000';
          const eyeOffset = CELL_SIZE / 4;
          const eyeSize = 2;
          
          let dir = direction.current;
          if (isTail) {
            dir = getOppositeDirection(direction.current);
          }
          
          let eye1: Position, eye2: Position;
          switch (dir) {
            case 'UP':
              eye1 = { x: segment.x * CELL_SIZE + eyeOffset, y: segment.y * CELL_SIZE + eyeOffset };
              eye2 = { x: segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: segment.y * CELL_SIZE + eyeOffset };
              break;
            case 'DOWN':
              eye1 = { x: segment.x * CELL_SIZE + eyeOffset, y: segment.y * CELL_SIZE + CELL_SIZE - eyeOffset };
              eye2 = { x: segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: segment.y * CELL_SIZE + CELL_SIZE - eyeOffset };
              break;
            case 'LEFT':
              eye1 = { x: segment.x * CELL_SIZE + eyeOffset, y: segment.y * CELL_SIZE + eyeOffset };
              eye2 = { x: segment.x * CELL_SIZE + eyeOffset, y: segment.y * CELL_SIZE + CELL_SIZE - eyeOffset };
              break;
            case 'RIGHT':
              eye1 = { x: segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: segment.y * CELL_SIZE + eyeOffset };
              eye2 = { x: segment.x * CELL_SIZE + CELL_SIZE - eyeOffset, y: segment.y * CELL_SIZE + CELL_SIZE - eyeOffset };
              break;
          }
          
          ctx.beginPath();
          ctx.arc(eye1.x, eye1.y, eyeSize, 0, Math.PI * 2);
          ctx.arc(eye2.x, eye2.y, eyeSize, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.shadowBlur = 0;
      });

      // UI overlays
      if (gameStateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Double-Headed Snake', (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2 - 30);
        
        ctx.font = '12px Arial';
        ctx.fillStyle = '#a8e6cf';
        ctx.fillText('When you eat, heads swap!', (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2);
        
        ctx.fillStyle = '#888';
        ctx.fillText('Tap or press any key', (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2 + 25);
      }

      if (gameStateRef.current === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2 - 30);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(scoreRef.current.toString(), (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2 + 15);
        
        ctx.fillStyle = '#888';
        ctx.font = '12px Arial';
        ctx.fillText('Tap to continue', (GRID_SIZE * CELL_SIZE) / 2, (GRID_SIZE * CELL_SIZE) / 2 + 45);
      }

      animationFrame.current = requestAnimationFrame(gameLoop);
    };

    animationFrame.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKey);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [handleDirectionChange, spawnFood, highScore, user, submitScore]);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-4 md:gap-6 py-16 md:py-20 px-4">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
        </div>
        
        {/* Header */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-2 md:mb-4 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Games</span>
          </Link>
          <h1 className="text-2xl md:text-4xl font-bold mb-1">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8e6cf] to-[#bae1ff]">
              Double-Headed Snake
            </span>
          </h1>
          {user && <p className="text-gray-400 text-sm">Playing as <span className="text-[#a8e6cf] font-semibold">{user.username}</span></p>}
        </motion.div>
        
        {/* Active Head Indicator */}
        <motion.div
          className={`relative z-10 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
            headAtFront 
              ? 'bg-[#a8e6cf]/20 text-[#a8e6cf] border border-[#a8e6cf]/30' 
              : 'bg-[#bae1ff]/20 text-[#bae1ff] border border-[#bae1ff]/30'
          }`}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.3 }}
          key={headAtFront.toString()}
        >
          Active: {headAtFront ? 'Front (Green)' : 'Back (Blue)'}
        </motion.div>
        
        {/* Game Canvas */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border-2 md:border-4 border-[#a8e6cf]/30 shadow-2xl shadow-[#a8e6cf]/20">
            <canvas
              ref={canvasRef}
              width={GRID_SIZE * CELL_SIZE}
              height={GRID_SIZE * CELL_SIZE}
              className="block touch-none"
            />
          </div>
        </motion.div>
        
        {/* Mobile Controls */}
        <motion.div
          className="relative z-10 grid grid-cols-3 gap-2 md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div />
          <button
            onClick={() => handleDirectionChange('UP')}
            title="Move Up"
            aria-label="Move Up"
            className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center active:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <div />
          <button
            onClick={() => handleDirectionChange('LEFT')}
            title="Move Left"
            aria-label="Move Left"
            className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center active:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleDirectionChange('DOWN')}
            title="Move Down"
            aria-label="Move Down"
            className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center active:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleDirectionChange('RIGHT')}
            title="Move Right"
            aria-label="Move Right"
            className="w-14 h-14 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center active:bg-white/20"
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          className="relative z-10 flex gap-6 md:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">{score}</div>
            <div className="text-xs md:text-sm text-gray-500">Score</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-[#a8e6cf]">{highScore}</div>
            <div className="text-xs md:text-sm text-gray-500">Best</div>
          </div>
        </motion.div>
        
        {/* Instructions */}
        <motion.div
          className="relative z-10 text-center max-w-md px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-gray-500 text-xs md:text-sm hidden md:block">
            Use Arrow Keys or WASD to move. When you eat, the head swaps!
          </p>
          <p className="text-gray-500 text-xs md:hidden">
            Swipe or use buttons to move. When you eat, heads swap!
          </p>
        </motion.div>
      </section>
    </main>
  );
}
