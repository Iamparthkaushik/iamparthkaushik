'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<[number, number][]>([[10, 10]]);
  const [food, setFood] = useState<[number, number]>([15, 15]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [nextDirection, setNextDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const GRID_SIZE = 20;

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[0];
        let newHead: [number, number];

        // Use nextDirection for smooth transitions
        const currentDirection = nextDirection;

        switch (currentDirection) {
          case 'UP':
            newHead = [head[0], head[1] - 1];
            break;
          case 'DOWN':
            newHead = [head[0], head[1] + 1];
            break;
          case 'LEFT':
            newHead = [head[0] - 1, head[1]];
            break;
          case 'RIGHT':
            newHead = [head[0] + 1, head[1]];
            break;
        }

        setDirection(currentDirection);

        // Check wall collision
        if (
          newHead[0] < 0 ||
          newHead[0] >= GRID_SIZE ||
          newHead[1] < 0 ||
          newHead[1] >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (newSnake.some((segment) => segment[0] === newHead[0] && segment[1] === newHead[1])) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(newHead);

        // Check food collision
        if (newHead[0] === food[0] && newHead[1] === food[1]) {
          setScore((s) => s + 10);
          setFood([
            Math.floor(Math.random() * GRID_SIZE),
            Math.floor(Math.random() * GRID_SIZE),
          ]);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, food, nextDirection]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key.toUpperCase()) {
        case 'ARROWUP':
        case 'W':
          e.preventDefault();
          if (direction !== 'DOWN') setNextDirection('UP');
          break;
        case 'ARROWDOWN':
        case 'S':
          e.preventDefault();
          if (direction !== 'UP') setNextDirection('DOWN');
          break;
        case 'ARROWLEFT':
        case 'A':
          e.preventDefault();
          if (direction !== 'RIGHT') setNextDirection('LEFT');
          break;
        case 'ARROWRIGHT':
        case 'D':
          e.preventDefault();
          if (direction !== 'LEFT') setNextDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  const reset = () => {
    setSnake([[10, 10]]);
    setFood([15, 15]);
    setDirection('RIGHT');
    setNextDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center gap-8 py-16 px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]" />
      
      <div className="relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#a8e6cf]/10 text-[#a8e6cf] text-sm font-medium mb-4">
          Game
        </span>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba] bg-clip-text text-transparent">
            Snake Game
          </span>
        </h2>
        <p className="text-slate-400 text-lg">Use arrow keys or WASD to move</p>
      </div>

      <div className="relative z-10 bg-[#0f1419] border border-[#a8e6cf]/30 rounded-2xl p-2 shadow-2xl shadow-[#a8e6cf]/10">
        <div className="grid gap-0" style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
          gridAutoRows: '20px',
        }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s[0] === x && s[1] === y);
            const isFood = food[0] === x && food[1] === y;
            const isHead = snake[0][0] === x && snake[0][1] === y;

            return (
              <div
                key={i}
                className={`border border-white/[0.03] rounded-sm ${
                  isSnake
                    ? isHead
                      ? 'bg-[#a8e6cf] shadow-lg shadow-[#a8e6cf]/50'
                      : 'bg-[#88d8b0]'
                    : isFood
                      ? 'bg-[#ffb3ba] shadow-lg shadow-[#ffb3ba]/50'
                      : 'bg-[#0a0a0f]'
                }`}
                style={{
                  transition: isSnake || isFood ? 'none' : undefined,
                }}
              />
            );
          })}
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-3xl font-bold text-[#a8e6cf] mb-4">Score: {score}</p>
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
          className="px-8 py-3 bg-gradient-to-r from-[#a8e6cf] to-[#bae1ff] text-[#0a0a0f] rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-[#a8e6cf]/30 transition-all duration-300"
        >
          {gameStarted ? 'Pause' : 'Start Game'}
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
