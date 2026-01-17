'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#a8e6cf] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffb3ba] rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[150px] opacity-15" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-12 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#a8e6cf] font-medium backdrop-blur-sm">
            <span className="w-2 h-2 bg-[#a8e6cf] rounded-full animate-pulse" />
            Available for opportunities
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="bg-gradient-to-r from-[#a8e6cf] via-[#bae1ff] to-[#ffb3ba] bg-clip-text text-transparent">
            Parth Kaushik
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Creative developer crafting{' '}
          <span className="text-[#a8e6cf]">stunning experiences</span> with
          modern web technologies
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <motion.a
            href="#experiences"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-[#a8e6cf] to-[#bae1ff] text-[#0a0a0f] font-semibold rounded-xl hover:shadow-lg hover:shadow-[#a8e6cf]/20 transition-all duration-300"
          >
            Explore My Work
          </motion.a>
          <motion.a
            href="https://github.com/iamparthkaushik"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 hover:border-[#a8e6cf]/50 transition-all duration-300 backdrop-blur-sm"
          >
            View GitHub
          </motion.a>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-6 text-slate-500 text-sm"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            India
          </span>
          <span className="w-1 h-1 bg-slate-600 rounded-full" />
          <span>Full Stack Developer</span>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-slate-500"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
