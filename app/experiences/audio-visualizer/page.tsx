'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COLORS = ['#a8e6cf', '#ffb3ba', '#bae1ff', '#ffdfba', '#bab3ff'];

export default function AudioVisualizerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualStyle, setVisualStyle] = useState<'bars' | 'circle' | 'wave' | 'particles'>('circle');
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  const initAudio = useCallback(async () => {
    if (audioContextRef.current) return;
    
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      
      // Create oscillator for demo since we don't have an audio file
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = 0;
      gainNode.gain.value = 0;
      
      oscillator.connect(gainNode);
      gainNode.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      
      oscillator.start();
      
      setHasUserInteracted(true);
    } catch (error) {
      console.error('Audio init error:', error);
    }
  }, []);
  
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
    
    // Demo visualization with simulated audio data
    let phase = 0;
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Generate simulated frequency data
      const bufferLength = 128;
      const dataArray = new Uint8Array(bufferLength);
      
      if (analyserRef.current && hasUserInteracted) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        // Simulated data for demo
        for (let i = 0; i < bufferLength; i++) {
          dataArray[i] = Math.sin(phase + i * 0.1) * 50 + 
                        Math.sin(phase * 2 + i * 0.05) * 30 +
                        Math.sin(phase * 0.5 + i * 0.2) * 40 + 128;
        }
      }
      
      phase += 0.05;
      
      if (visualStyle === 'bars') {
        const barWidth = canvas.width / bufferLength;
        
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.8;
          const colorIndex = Math.floor((i / bufferLength) * COLORS.length);
          
          ctx.save();
          ctx.shadowColor = COLORS[colorIndex % COLORS.length];
          ctx.shadowBlur = 20;
          
          const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
          gradient.addColorStop(0, COLORS[colorIndex % COLORS.length]);
          gradient.addColorStop(1, `${COLORS[colorIndex % COLORS.length]}33`);
          
          ctx.fillStyle = gradient;
          ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth - 2, barHeight);
          ctx.restore();
        }
      } else if (visualStyle === 'circle') {
        const radius = Math.min(canvas.width, canvas.height) * 0.25;
        
        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2 - Math.PI / 2;
          const barHeight = (dataArray[i] / 255) * radius;
          
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;
          const x2 = centerX + Math.cos(angle) * (radius + barHeight);
          const y2 = centerY + Math.sin(angle) * (radius + barHeight);
          
          const colorIndex = Math.floor((i / bufferLength) * COLORS.length);
          
          ctx.save();
          ctx.shadowColor = COLORS[colorIndex % COLORS.length];
          ctx.shadowBlur = 15;
          ctx.strokeStyle = COLORS[colorIndex % COLORS.length];
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          ctx.restore();
        }
        
        // Inner circle
        const avgData = dataArray.reduce((a, b) => a + b, 0) / bufferLength;
        const innerRadius = radius * 0.7 + (avgData / 255) * 20;
        
        ctx.save();
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 30;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else if (visualStyle === 'wave') {
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * canvas.width;
          const y = centerY + ((dataArray[i] - 128) / 128) * canvas.height * 0.4;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        COLORS.forEach((color, i) => {
          gradient.addColorStop(i / (COLORS.length - 1), color);
        });
        
        ctx.save();
        ctx.shadowColor = '#a8e6cf';
        ctx.shadowBlur = 20;
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
        
        // Mirror wave
        ctx.beginPath();
        for (let i = 0; i < bufferLength; i++) {
          const x = (i / bufferLength) * canvas.width;
          const y = centerY - ((dataArray[i] - 128) / 128) * canvas.height * 0.3;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = 'rgba(168, 230, 207, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (visualStyle === 'particles') {
        for (let i = 0; i < bufferLength; i += 2) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const radius = (dataArray[i] / 255) * Math.min(canvas.width, canvas.height) * 0.4;
          
          const x = centerX + Math.cos(angle + phase * 0.5) * radius;
          const y = centerY + Math.sin(angle + phase * 0.5) * radius;
          const size = (dataArray[i] / 255) * 15 + 3;
          
          const colorIndex = Math.floor((i / bufferLength) * COLORS.length);
          
          ctx.save();
          ctx.shadowColor = COLORS[colorIndex % COLORS.length];
          ctx.shadowBlur = 25;
          ctx.fillStyle = COLORS[colorIndex % COLORS.length];
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          
          // Connect to center
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = `${COLORS[colorIndex % COLORS.length]}33`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [visualStyle, hasUserInteracted]);
  
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
          onClick={() => setVisualStyle('bars')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            visualStyle === 'bars' ? 'bg-[#a8e6cf] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          📊 Bars
        </button>
        <button
          onClick={() => setVisualStyle('circle')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            visualStyle === 'circle' ? 'bg-[#ffb3ba] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ⭕ Circle
        </button>
        <button
          onClick={() => setVisualStyle('wave')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            visualStyle === 'wave' ? 'bg-[#bae1ff] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          🌊 Wave
        </button>
        <button
          onClick={() => setVisualStyle('particles')}
          className={`px-4 py-2 rounded-xl font-medium transition-all ${
            visualStyle === 'particles' ? 'bg-[#bab3ff] text-[#0a0a0f]' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          ✨ Particles
        </button>
      </motion.div>
      
      {/* Title */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <h1 className="text-4xl font-bold text-white mb-4">Audio Visualizer</h1>
        <p className="text-gray-400">A mesmerizing dance of light and sound</p>
      </motion.div>
    </div>
  );
}
