'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Bird {
  y: number;
  velocity: number;
}

interface Pipe {
  x: number;
  gapY: number;
  hasScored?: boolean;
}

export default function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const birdRef = useRef<Bird>({ y: 150, velocity: 0 });
  const pipsRef = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);

  const GAME_WIDTH = 400;
  const GAME_HEIGHT = 600;
  const PIPE_WIDTH = 50;
  const PIPE_GAP = 120;
  const BIRD_SIZE = 20;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle flap
    const handleFlap = () => {
      if (!gameStarted) setGameStarted(true);
      if (gameOver) return;
      birdRef.current.velocity = JUMP_STRENGTH;
    };

    window.addEventListener('click', handleFlap);
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlap();
      }
    });

    if (!gameStarted || gameOver) {
      return () => {
        window.removeEventListener('click', handleFlap);
      };
    }

    // Game loop
    const gameInterval = setInterval(() => {
      const bird = birdRef.current;

      // Update bird physics
      bird.velocity += GRAVITY;
      bird.y += bird.velocity;

      // Check boundaries
      if (bird.y + BIRD_SIZE > GAME_HEIGHT || bird.y < 0) {
        setGameOver(true);
        clearInterval(gameInterval);
        return;
      }

      // Add pipes
      if (pipsRef.current.length === 0 || pipsRef.current[pipsRef.current.length - 1].x < GAME_WIDTH - 150) {
        pipsRef.current.push({
          x: GAME_WIDTH,
          gapY: Math.random() * (GAME_HEIGHT - PIPE_GAP - 60) + 30,
        });
      }

      // Move pipes
      pipsRef.current = pipsRef.current
        .map((pipe) => ({ ...pipe, x: pipe.x - 4 }))
        .filter((pipe) => pipe.x + PIPE_WIDTH > 0);

      // Check collision with pipes
      pipsRef.current.forEach((pipe) => {
        if (
          bird.y < pipe.gapY + PIPE_GAP &&
          bird.y + BIRD_SIZE > pipe.gapY &&
          bird.y < pipe.gapY + PIPE_GAP &&
          bird.y + BIRD_SIZE > pipe.gapY &&
          Math.abs(150 - pipe.x) < BIRD_SIZE + PIPE_WIDTH
        ) {
          setGameOver(true);
          clearInterval(gameInterval);
          return;
        }

        // Score point when passing pipe
        if (pipe.x === 130 && !pipe.hasScored) {
          setScore((s) => s + 1);
          scoreRef.current += 1;
          (pipe as any).hasScored = true;
        }
      });
    }, 30);

    return () => {
      clearInterval(gameInterval);
      window.removeEventListener('click', handleFlap);
    };
  }, [gameStarted, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw game
    const draw = () => {
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw pipes
      pipsRef.current.forEach((pipe) => {
        // Top pipe
        ctx.fillStyle = '#a8e6cf';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.gapY);
        ctx.shadowColor = '#a8e6cf';
        ctx.shadowBlur = 20;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.gapY + PIPE_GAP, PIPE_WIDTH, GAME_HEIGHT - pipe.gapY - PIPE_GAP);
      });

      ctx.shadowColor = 'transparent';

      // Draw bird
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(150, birdRef.current.y, BIRD_SIZE, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = '#ffdfba';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(150, birdRef.current.y, BIRD_SIZE, 0, Math.PI * 2);
      ctx.stroke();

      ctx.shadowColor = 'transparent';

      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Score: ${scoreRef.current}`, 20, 40);

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const reset = () => {
    birdRef.current = { y: 150, velocity: 0 };
    pipsRef.current = [];
    scoreRef.current = 0;
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-8 py-16 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]" />
      
      <div className="relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffdfba]/10 text-[#ffdfba] text-sm font-medium mb-4">
          Game
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#ffdfba] via-[#ffb3ba] to-[#bab3ff] bg-clip-text text-transparent">
            Flappy Bird
          </span>
        </h2>
        <p className="text-slate-400 text-lg">Click or press Space to flap!</p>
      </div>

      <div className="relative z-10 border border-[#ffdfba]/30 rounded-2xl shadow-2xl shadow-[#ffdfba]/10 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className="block bg-black"
        />
      </div>

      <div className="relative z-10 text-center">
        <p className="text-2xl text-[#ffdfba] font-bold mb-4">Score: {score}</p>
        {gameOver && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-2xl text-[#ffb3ba] font-bold mb-4"
          >
            GAME OVER!
          </motion.div>
        )}
      </div>

      <motion.div
        className="relative z-10 flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => setGameStarted(!gameStarted)}
          className="px-8 py-3 bg-gradient-to-r from-[#ffdfba] to-[#ffb3ba] text-[#0a0a0f] rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#ffdfba]/30 transition-all duration-300"
        >
          {gameStarted ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-8 py-3 border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/5 hover:border-[#ffb3ba]/50 transition-all duration-300"
        >
          Reset
        </button>
      </motion.div>
    </section>
  );
}
