'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PhysicsObject {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export default function PhysicsSimulator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const objectsRef = useRef<PhysicsObject[]>([]);
  const animationRef = useRef<number | null>(null);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize objects with pastel colors
    objectsRef.current = Array.from({ length: 8 }, (_, i) => ({
      id: `obj-${i}`,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 4,
      radius: Math.random() * 8 + 5,
      color: ['#a8e6cf', '#ffb3ba', '#bae1ff', '#ffdfba'][i % 4],
    }));

    const gravity = 0.3;
    const damping = 0.99;
    const bounce = 0.7;

    const animate = () => {
      if (!isRunning) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      objectsRef.current.forEach((obj, i) => {
        // Apply gravity
        obj.vy += gravity;

        // Apply damping
        obj.vx *= damping;
        obj.vy *= damping;

        // Update position
        obj.x += obj.vx;
        obj.y += obj.vy;

        // Wall collisions
        if (obj.x - obj.radius < 0) {
          obj.x = obj.radius;
          obj.vx = -obj.vx * bounce;
        }
        if (obj.x + obj.radius > canvas.width) {
          obj.x = canvas.width - obj.radius;
          obj.vx = -obj.vx * bounce;
        }
        if (obj.y - obj.radius < 0) {
          obj.y = obj.radius;
          obj.vy = -obj.vy * bounce;
        }
        if (obj.y + obj.radius > canvas.height) {
          obj.y = canvas.height - obj.radius;
          obj.vy = -obj.vy * bounce;
        }

        // Object-to-object collision
        for (let j = i + 1; j < objectsRef.current.length; j++) {
          const other = objectsRef.current[j];
          const dx = other.x - obj.x;
          const dy = other.y - obj.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = obj.radius + other.radius;

          if (distance < minDistance) {
            // Collision response
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities
            const vx1 = obj.vx * cos + obj.vy * sin;
            const vy1 = obj.vy * cos - obj.vx * sin;
            const vx2 = other.vx * cos + other.vy * sin;
            const vy2 = other.vy * cos - other.vx * sin;

            // Swap velocities
            obj.vx = vx2 * cos - vy1 * sin;
            obj.vy = vy1 * cos + vx2 * sin;
            other.vx = vx1 * cos - vy2 * sin;
            other.vy = vy2 * cos + vx1 * sin;

            // Separate objects
            const overlap = (minDistance - distance) / 2;
            obj.x -= overlap * cos;
            obj.y -= overlap * sin;
            other.x += overlap * cos;
            other.y += overlap * sin;
          }
        }

        // Draw object with glow
        const gradient = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.radius);
        gradient.addColorStop(0, obj.color + '80');
        gradient.addColorStop(1, obj.color + '00');

        // Glow
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Main circle
        ctx.fillStyle = obj.color;
        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isRunning]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newObj: PhysicsObject = {
      id: `obj-${Date.now()}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      radius: Math.random() * 8 + 5,
      color: ['#a8e6cf', '#ffb3ba', '#bae1ff', '#ffdfba'][
        Math.floor(Math.random() * 4)
      ],
    };

    objectsRef.current.push(newObj);
  };

  const reset = () => {
    objectsRef.current = [];
  };

  return (
    <section className="relative w-full h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]" />
      
      <div className="absolute top-8 left-8 z-10 px-4">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#bae1ff]/10 text-[#bae1ff] text-sm font-medium mb-4">
          Interactive
        </span>
        <h2 className="text-3xl md:text-5xl font-bold mb-2">
          <span className="bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba] bg-clip-text text-transparent">
            Physics Simulator
          </span>
        </h2>
        <p className="text-slate-400">Click to add objects • Watch gravity in action!</p>
      </div>

      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair"
        style={{ maxHeight: '100vh' }}
      />

      <motion.div
        className="absolute bottom-8 right-8 flex gap-3 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-6 py-3 bg-gradient-to-r from-[#a8e6cf] to-[#bae1ff] text-[#0a0a0f] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#a8e6cf]/30 transition-all duration-300"
        >
          {isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={reset}
          className="px-6 py-3 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/5 hover:border-[#ffb3ba]/50 transition-all duration-300"
        >
          Clear
        </button>
      </motion.div>
    </section>
  );
}
