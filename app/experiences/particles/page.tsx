'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const COLORS = ['#a8e6cf', '#ffb3ba', '#bae1ff', '#ffdfba', '#bab3ff', '#ff6b6b', '#4ecdc4', '#45b7d1'];

export default function ParticlesPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false });
  
  const [mode, setMode] = useState<'attract' | 'repel' | 'explode' | 'trail'>('attract');
  const [particleCount, setParticleCount] = useState(0);
  const [gravity, setGravity] = useState(false);
  
  const createParticle = useCallback((x: number, y: number, burst = false) => {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const angle = Math.random() * Math.PI * 2;
    const speed = burst ? Math.random() * 8 + 4 : Math.random() * 2 + 0.5;
    const maxLife = Math.random() * 150 + 100;
    
    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 4 + 2,
      color,
      alpha: 1,
      life: maxLife,
      maxLife,
    };
  }, []);
  
  const spawnBurst = useCallback((x: number, y: number, count: number) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(createParticle(x, y, true));
    }
  }, [createParticle]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize particles
    for (let i = 0; i < 200; i++) {
      particlesRef.current.push(createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ));
    }
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      
      if (mouseRef.current.isPressed && mode === 'trail') {
        for (let i = 0; i < 3; i++) {
          particlesRef.current.push(createParticle(e.clientX, e.clientY));
        }
      }
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      if (mode === 'explode') {
        spawnBurst(e.clientX, e.clientY, 50);
      }
    };
    
    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Apply forces based on mode
        if (mode === 'attract' || mode === 'repel') {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 200 && dist > 5) {
            const force = (200 - dist) / 200 * 0.5;
            const angle = Math.atan2(dy, dx);
            
            if (mode === 'attract') {
              p.vx += Math.cos(angle) * force;
              p.vy += Math.sin(angle) * force;
            } else {
              p.vx -= Math.cos(angle) * force * 2;
              p.vy -= Math.sin(angle) * force * 2;
            }
          }
        }
        
        // Apply gravity
        if (gravity) {
          p.vy += 0.1;
        }
        
        // Apply friction
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -0.8;
          p.x = Math.max(0, Math.min(canvas.width, p.x));
        }
        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -0.8;
          p.y = Math.max(0, Math.min(canvas.height, p.y));
        }
        
        // Update life
        p.life--;
        p.alpha = p.life / p.maxLife;
        
        // Remove dead particles
        if (p.life <= 0) {
          // Respawn at random position
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.vx = (Math.random() - 0.5) * 2;
          p.vy = (Math.random() - 0.5) * 2;
          p.life = p.maxLife;
          p.alpha = 1;
        }
        
        // Draw particle with glow
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
        
        // Draw connections to nearby particles
        for (let j = i - 1; j >= 0 && j > i - 20; j--) {
          const p2 = particles[j];
          const dx = p2.x - p.x;
          const dy = p2.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - dist / 80) * 0.2 * p.alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      // Draw mouse indicator
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = mode === 'attract' ? '#a8e6cf' : mode === 'repel' ? '#ffb3ba' : mode === 'explode' ? '#ffdfba' : '#bab3ff';
      ctx.fill();
      
      setParticleCount(particles.length);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticle, spawnBurst, mode, gravity]);
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0f]">
      <canvas ref={canvasRef} className="absolute inset-0" />
      
      {/* Back Button */}
      <Link
        href="/experiences"
        className="absolute top-6 left-6 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>
      
      {/* Controls */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2 p-4 bg-black/50 backdrop-blur-sm rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => setMode('attract')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            mode === 'attract' ? 'bg-[#a8e6cf] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🧲 Attract
        </button>
        <button
          onClick={() => setMode('repel')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            mode === 'repel' ? 'bg-[#ffb3ba] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          💨 Repel
        </button>
        <button
          onClick={() => setMode('explode')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            mode === 'explode' ? 'bg-[#ffdfba] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          💥 Explode
        </button>
        <button
          onClick={() => setMode('trail')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            mode === 'trail' ? 'bg-[#bab3ff] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ✨ Trail
        </button>
        <button
          onClick={() => setGravity(!gravity)}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            gravity ? 'bg-[#bae1ff] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {gravity ? '🌍 Gravity ON' : '🌌 Gravity OFF'}
        </button>
      </motion.div>
      
      {/* Stats */}
      <div className="absolute top-6 right-6 z-10 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-xl text-white font-mono text-sm">
        Particles: {particleCount}
      </div>
      
      {/* Instructions */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">Particle Storm</h1>
        <p className="text-gray-400">Move your mouse to interact • Click for effects</p>
      </motion.div>
    </div>
  );
}
