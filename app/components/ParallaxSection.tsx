'use client';

import { motion } from 'framer-motion';

export default function ParallaxSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const features = [
    {
      title: 'Interactive 3D',
      description: 'Explore stunning 3D models with smooth controls and animations',
      icon: '🎮',
      gradient: 'from-[#a8e6cf] to-[#88d8b0]',
      border: 'hover:border-[#a8e6cf]/50',
    },
    {
      title: 'Physics Engine',
      description: 'Real-time physics simulation with gravity and collisions',
      icon: '⚛️',
      gradient: 'from-[#bae1ff] to-[#a8d8ff]',
      border: 'hover:border-[#bae1ff]/50',
    },
    {
      title: 'Mini Games',
      description: 'Classic games reimagined with modern visuals',
      icon: '🎯',
      gradient: 'from-[#ffb3ba] to-[#ff9aa2]',
      border: 'hover:border-[#ffb3ba]/50',
    },
    {
      title: 'Live APIs',
      description: 'Real-time data from external APIs and services',
      icon: '🔗',
      gradient: 'from-[#ffdfba] to-[#ffd3a5]',
      border: 'hover:border-[#ffdfba]/50',
    },
    {
      title: 'Cursor Magic',
      description: 'Particle effects that follow your cursor movement',
      icon: '✨',
      gradient: 'from-[#bab3ff] to-[#a5a0ff]',
      border: 'hover:border-[#bab3ff]/50',
    },
    {
      title: 'Responsive',
      description: 'Perfectly optimized for every screen size',
      icon: '📱',
      gradient: 'from-[#c1e1c1] to-[#a8d8a8]',
      border: 'hover:border-[#c1e1c1]/50',
    },
  ];

  return (
    <section id="experiences" className="relative py-24 md:py-32 bg-[#0a0a0f]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#a8e6cf]/5 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#a8e6cf]/10 text-[#a8e6cf] text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                Experiences & Tools
              </span>
            </h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
              A collection of interactive experiments and creative showcases
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] ${feature.border} backdrop-blur-sm transition-all duration-300`}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-tr-2xl rounded-bl-[100px] transition-opacity duration-300`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
