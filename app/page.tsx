'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingNav from './components/FloatingNav';
import CursorFollower from './components/CursorFollower';
import Footer from './components/Footer';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      {/* Hero Section - Full Page */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[128px] opacity-15 animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[128px] opacity-15 animate-blob animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-[#ffb3ba] rounded-full mix-blend-multiply filter blur-[128px] opacity-15 animate-blob animation-delay-4000" />
        </div>
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        {/* Floating particles - using seeded positions to avoid hydration mismatch */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => {
            // Use deterministic values based on index to avoid hydration mismatch
            const left = ((i * 17 + 23) % 100);
            const top = ((i * 31 + 47) % 100);
            const duration = 3 + (i % 5) * 0.4;
            const delay = (i % 8) * 0.25;
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/10 rounded-full"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.5, 0.1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Availability badge */}
          <motion.div variants={itemVariants} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#a8e6cf]/10 border border-[#a8e6cf]/30 text-[#a8e6cf]">
              <span className="w-2 h-2 bg-[#a8e6cf] rounded-full animate-pulse" />
              <span className="text-sm font-medium">Available for Work</span>
            </span>
          </motion.div>
          
          {/* Name with gradient */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          >
            <span className="text-white">Hi, I&apos;m </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba]">
              Parth
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl md:text-3xl text-gray-400 mb-8 font-light"
          >
            Creative Developer & Experience Builder
          </motion.p>
          
          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg text-gray-500 max-w-2xl mx-auto mb-12"
          >
            I create interactive web experiences that blend art, technology, and playfulness.
            Explore my world of 3D experiences, physics simulations, and addictive games.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/experiences">
              <motion.button
                className="group px-8 py-4 bg-gradient-to-r from-[#a8e6cf] to-[#bae1ff] text-[#0a0a0f] rounded-2xl font-semibold text-lg flex items-center gap-3 mx-auto sm:mx-0"
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(168, 230, 207, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Experiences</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
            </Link>
            
            <Link href="/games">
              <motion.button
                className="group px-8 py-4 border border-white/20 text-white rounded-2xl font-semibold text-lg flex items-center gap-3 mx-auto sm:mx-0 hover:bg-white/5 hover:border-[#ffb3ba]/50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Play Games</span>
              </motion.button>
            </Link>
          </motion.div>
          
          {/* Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '5+', label: 'Experiences' },
              { value: '∞', label: 'Creativity' },
              { value: '24/7', label: 'Passion' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <motion.div className="w-1.5 h-1.5 bg-[#a8e6cf] rounded-full" />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
