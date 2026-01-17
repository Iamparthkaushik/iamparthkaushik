'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingNav from '../../components/FloatingNav';
import CursorFollower from '../../components/CursorFollower';
import { useAuth } from '../../context/AuthContext';

interface Pipe {
  x: number;
  topHeight: number;
  scored: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_X = 80;
const BIRD_RADIUS = 15;
const GRAVITY = 0.5;
const JUMP_FORCE = -9;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;
const PIPE_SPAWN_INTERVAL = 1800;

export default function FlappyBirdPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const { user, submitScore } = useAuth();
  
  // Game state refs for animation frame
  const birdY = useRef(GAME_HEIGHT / 2);
  const birdVelocity = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  const lastPipeTime = useRef(0);
  const animationFrame = useRef<number>(0);
  const birdRotation = useRef(0);
  const flapAnimation = useRef(0);

  useEffect(() => {
    const saved = localStorage.getItem('flappyHighScore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const jump = useCallback(() => {
    if (gameStateRef.current === 'idle') {
      gameStateRef.current = 'playing';
      setGameState('playing');
      birdY.current = GAME_HEIGHT / 2;
      birdVelocity.current = JUMP_FORCE;
      pipes.current = [];
      scoreRef.current = 0;
      setScore(0);
      lastPipeTime.current = Date.now();
    } else if (gameStateRef.current === 'playing') {
      birdVelocity.current = JUMP_FORCE;
      flapAnimation.current = 1;
    } else if (gameStateRef.current === 'gameover') {
      // Reset game
      gameStateRef.current = 'idle';
      setGameState('idle');
      birdY.current = GAME_HEIGHT / 2;
      birdVelocity.current = 0;
      pipes.current = [];
      scoreRef.current = 0;
      setScore(0);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    const handleClick = () => jump();
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouch);

    const gameLoop = () => {
      // Clear
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      gradient.addColorStop(0, '#0f0f1a');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#0a0a15');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      
      // Draw stars
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 50; i++) {
        const x = (i * 37) % GAME_WIDTH;
        const y = (i * 73) % GAME_HEIGHT;
        ctx.beginPath();
        ctx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (gameStateRef.current === 'playing') {
        // Update bird physics
        birdVelocity.current += GRAVITY;
        birdY.current += birdVelocity.current;
        birdRotation.current = Math.min(Math.max(birdVelocity.current * 3, -30), 90);
        flapAnimation.current = Math.max(0, flapAnimation.current - 0.1);

        // Spawn pipes
        if (Date.now() - lastPipeTime.current > PIPE_SPAWN_INTERVAL) {
          const minHeight = 80;
          const maxHeight = GAME_HEIGHT - PIPE_GAP - 80;
          const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
          pipes.current.push({ x: GAME_WIDTH, topHeight, scored: false });
          lastPipeTime.current = Date.now();
        }

        // Update pipes
        pipes.current = pipes.current.filter(pipe => {
          pipe.x -= PIPE_SPEED;

          // Check scoring
          if (!pipe.scored && pipe.x + PIPE_WIDTH < BIRD_X) {
            pipe.scored = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
          }

          // Check collision
          const birdLeft = BIRD_X - BIRD_RADIUS;
          const birdRight = BIRD_X + BIRD_RADIUS;
          const birdTop = birdY.current - BIRD_RADIUS;
          const birdBottom = birdY.current + BIRD_RADIUS;

          if (birdRight > pipe.x && birdLeft < pipe.x + PIPE_WIDTH) {
            if (birdTop < pipe.topHeight || birdBottom > pipe.topHeight + PIPE_GAP) {
              gameStateRef.current = 'gameover';
              setGameState('gameover');
              if (scoreRef.current > highScore) {
                setHighScore(scoreRef.current);
                localStorage.setItem('flappyHighScore', scoreRef.current.toString());
              }
              if (user && scoreRef.current > 0) {
                submitScore('flappy-bird', scoreRef.current);
              }
            }
          }

          return pipe.x > -PIPE_WIDTH;
        });

        // Check floor/ceiling collision
        if (birdY.current + BIRD_RADIUS > GAME_HEIGHT || birdY.current - BIRD_RADIUS < 0) {
          gameStateRef.current = 'gameover';
          setGameState('gameover');
          if (scoreRef.current > highScore) {
            setHighScore(scoreRef.current);
            localStorage.setItem('flappyHighScore', scoreRef.current.toString());
          }
          if (user && scoreRef.current > 0) {
            submitScore('flappy-bird', scoreRef.current);
          }
        }
      }

      // Draw pipes with glow
      pipes.current.forEach(pipe => {
        // Pipe glow
        ctx.shadowColor = '#a8e6cf';
        ctx.shadowBlur = 15;
        
        // Top pipe
        const topGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + PIPE_WIDTH, 0);
        topGradient.addColorStop(0, '#56ab91');
        topGradient.addColorStop(0.5, '#88d8b0');
        topGradient.addColorStop(1, '#56ab91');
        ctx.fillStyle = topGradient;
        
        // Pipe body
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        // Pipe cap
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 25, PIPE_WIDTH + 10, 25);
        
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, GAME_HEIGHT - pipe.topHeight - PIPE_GAP);
        // Pipe cap
        ctx.fillRect(pipe.x - 5, pipe.topHeight + PIPE_GAP, PIPE_WIDTH + 10, 25);
        
        ctx.shadowBlur = 0;
      });

      // Draw bird
      ctx.save();
      ctx.translate(BIRD_X, birdY.current);
      ctx.rotate((birdRotation.current * Math.PI) / 180);
      
      // Bird glow
      ctx.shadowColor = '#ffdfba';
      ctx.shadowBlur = 20;
      
      // Bird body (gradient)
      const birdGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, BIRD_RADIUS);
      birdGradient.addColorStop(0, '#ffe4b3');
      birdGradient.addColorStop(1, '#ffb347');
      ctx.fillStyle = birdGradient;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird eye
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(6, -3, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(7, -3, 2.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Bird beak
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.moveTo(BIRD_RADIUS, 0);
      ctx.lineTo(BIRD_RADIUS + 10, 3);
      ctx.lineTo(BIRD_RADIUS, 6);
      ctx.closePath();
      ctx.fill();
      
      // Wing
      const wingOffset = Math.sin(flapAnimation.current * Math.PI * 4) * 5;
      ctx.fillStyle = '#ffa94d';
      ctx.beginPath();
      ctx.ellipse(-3, 3 + wingOffset, 8, 5, -0.3, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 2;
      ctx.fillText(scoreRef.current.toString(), GAME_WIDTH / 2, 70);
      ctx.shadowBlur = 0;

      // Draw idle/gameover messages
      if (gameStateRef.current === 'idle') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Flappy Bird', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#a8e6cf';
        ctx.fillText('Click or Press Space to Start', GAME_WIDTH / 2, GAME_HEIGHT / 2);
        
        ctx.font = '16px Arial';
        ctx.fillStyle = '#888';
        ctx.fillText(`High Score: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
      }

      if (gameStateRef.current === 'gameover') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        ctx.fillStyle = '#ff6b6b';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 60px Arial';
        ctx.fillText(scoreRef.current.toString(), GAME_WIDTH / 2, GAME_HEIGHT / 2);
        
        ctx.font = '20px Arial';
        ctx.fillStyle = '#888';
        ctx.fillText(`High Score: ${highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
        
        ctx.fillStyle = '#a8e6cf';
        ctx.font = '18px Arial';
        ctx.fillText('Click to Play Again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100);
      }

      animationFrame.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouch);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [jump, highScore, user, submitScore]);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      <section className="relative min-h-screen flex flex-col items-center justify-center gap-6 py-20 px-4">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#ffdfba] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[150px] opacity-10" />
        </div>
        
        {/* Header */}
        <motion.div
          className="relative z-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/games" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Games</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdfba] to-[#ffa94d]">
              Flappy Bird
            </span>
          </h1>
          {user && <p className="text-gray-400">Playing as <span className="text-[#ffdfba] font-semibold">{user.username}</span></p>}
        </motion.div>
        
        {/* Game Canvas */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative rounded-3xl overflow-hidden border-4 border-[#ffdfba]/30 shadow-2xl shadow-[#ffdfba]/20">
            <canvas
              ref={canvasRef}
              width={GAME_WIDTH}
              height={GAME_HEIGHT}
              className="block"
              style={{ touchAction: 'none' }}
            />
          </div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          className="relative z-10 flex gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{score}</div>
            <div className="text-sm text-gray-500">Score</div>
          </div>
          <div className="w-px bg-white/10" />
          <div className="text-center">
            <div className="text-3xl font-bold text-[#ffdfba]">{highScore}</div>
            <div className="text-sm text-gray-500">Best</div>
          </div>
        </motion.div>
        
        {/* Instructions */}
        <motion.p
          className="relative z-10 text-gray-500 text-sm text-center max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Tap, click, or press Space/Up Arrow to flap. Avoid the pipes!
        </motion.p>
      </section>
    </main>
  );
}
