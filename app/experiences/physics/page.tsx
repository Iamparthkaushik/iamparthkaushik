'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingNav from '../../components/FloatingNav';
import CursorFollower from '../../components/CursorFollower';

interface PhysicsObject {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

const COLORS = ['#a8e6cf', '#ffb3ba', '#bae1ff', '#ffdfba', '#bab3ff', '#ffc8c8'];
const GRAVITY = 0.3;
const FRICTION = 0.99;
const BOUNCE = 0.8;

export default function PhysicsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [objects, setObjects] = useState<PhysicsObject[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gravity, setGravity] = useState(true);
  const objectsRef = useRef<PhysicsObject[]>([]);
  const nextIdRef = useRef(0);
  const animationFrame = useRef<number>(0);
  const isPausedRef = useRef(false);
  const gravityRef = useRef(true);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    gravityRef.current = gravity;
  }, [gravity]);

  const addObject = useCallback((x: number, y: number) => {
    const radius = 15 + Math.random() * 25;
    const newObj: PhysicsObject = {
      id: nextIdRef.current++,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 5,
      radius,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      mass: radius * radius,
    };
    objectsRef.current.push(newObj);
    setObjects([...objectsRef.current]);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      addObject(x, y);
    };

    canvas.addEventListener('click', handleClick);

    const checkCollision = (a: PhysicsObject, b: PhysicsObject) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < a.radius + b.radius;
    };

    const resolveCollision = (a: PhysicsObject, b: PhysicsObject) => {
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance === 0) return;
      
      const nx = dx / distance;
      const ny = dy / distance;
      
      const overlap = (a.radius + b.radius - distance) / 2;
      a.x -= overlap * nx;
      a.y -= overlap * ny;
      b.x += overlap * nx;
      b.y += overlap * ny;
      
      const dvx = a.vx - b.vx;
      const dvy = a.vy - b.vy;
      const dvn = dvx * nx + dvy * ny;
      
      if (dvn > 0) return;
      
      const restitution = 0.9;
      const impulse = -(1 + restitution) * dvn / (1 / a.mass + 1 / b.mass);
      
      a.vx += impulse * nx / a.mass;
      a.vy += impulse * ny / a.mass;
      b.vx -= impulse * nx / b.mass;
      b.vy -= impulse * ny / b.mass;
    };

    const gameLoop = () => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (!isPausedRef.current) {
        // Update physics
        objectsRef.current.forEach(obj => {
          // Apply gravity
          if (gravityRef.current) {
            obj.vy += GRAVITY;
          }

          // Apply friction
          obj.vx *= FRICTION;
          obj.vy *= FRICTION;

          // Update position
          obj.x += obj.vx;
          obj.y += obj.vy;

          // Wall collisions
          if (obj.x - obj.radius < 0) {
            obj.x = obj.radius;
            obj.vx *= -BOUNCE;
          }
          if (obj.x + obj.radius > canvas.width) {
            obj.x = canvas.width - obj.radius;
            obj.vx *= -BOUNCE;
          }
          if (obj.y - obj.radius < 0) {
            obj.y = obj.radius;
            obj.vy *= -BOUNCE;
          }
          if (obj.y + obj.radius > canvas.height) {
            obj.y = canvas.height - obj.radius;
            obj.vy *= -BOUNCE;
          }
        });

        // Check object collisions
        for (let i = 0; i < objectsRef.current.length; i++) {
          for (let j = i + 1; j < objectsRef.current.length; j++) {
            if (checkCollision(objectsRef.current[i], objectsRef.current[j])) {
              resolveCollision(objectsRef.current[i], objectsRef.current[j]);
            }
          }
        }
      }

      // Draw objects
      objectsRef.current.forEach(obj => {
        // Glow effect
        ctx.shadowColor = obj.color;
        ctx.shadowBlur = 20;
        
        // Gradient fill
        const gradient = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.radius);
        gradient.addColorStop(0, obj.color);
        gradient.addColorStop(1, shadeColor(obj.color, -30));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(obj.x - obj.radius * 0.3, obj.y - obj.radius * 0.3, obj.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw instructions if empty
      if (objectsRef.current.length === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Click anywhere to spawn objects', canvas.width / 2, canvas.height / 2);
      }

      animationFrame.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [addObject]);

  const shadeColor = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  const clearAll = () => {
    objectsRef.current = [];
    setObjects([]);
  };

  const spawnRandom = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * (canvas.width - 100) + 50;
      const y = Math.random() * (canvas.height / 2);
      addObject(x, y);
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      <FloatingNav />
      
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
      />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Back button */}
        <motion.div
          className="absolute top-24 left-6 pointer-events-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/experiences" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </Link>
        </motion.div>
        
        {/* Title */}
        <motion.div
          className="absolute top-24 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bae1ff] to-[#a8e6cf]">
              Physics Sandbox
            </span>
          </h1>
        </motion.div>
        
        {/* Controls */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              isPaused
                ? 'bg-[#a8e6cf] text-[#0a0a0f]'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button
            onClick={() => setGravity(!gravity)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              gravity
                ? 'bg-[#bae1ff] text-[#0a0a0f]'
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
            }`}
          >
            Gravity: {gravity ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={spawnRandom}
            className="px-6 py-3 rounded-xl font-semibold bg-[#ffdfba] text-[#0a0a0f] hover:shadow-lg hover:shadow-[#ffdfba]/30 transition-all"
          >
            Spawn 10
          </button>
          
          <button
            onClick={clearAll}
            className="px-6 py-3 rounded-xl font-semibold bg-white/10 text-white border border-white/20 hover:bg-[#ffb3ba] hover:text-[#0a0a0f] hover:border-transparent transition-all"
          >
            Clear
          </button>
        </motion.div>
        
        {/* Object count */}
        <motion.div
          className="absolute bottom-8 right-6 text-white/50 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Objects: {objects.length}
        </motion.div>
      </div>
    </main>
  );
}
