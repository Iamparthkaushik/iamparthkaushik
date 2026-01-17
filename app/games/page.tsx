'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import FloatingNav from '../components/FloatingNav';
import CursorFollower from '../components/CursorFollower';
import BentoGamesGrid from '../components/BentoGamesGrid';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export default function GamesPage() {
  const { user, logout, isLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      
      {/* Header */}
      <section className="relative pt-24 md:pt-32 pb-8 md:pb-16 px-4">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#ffb3ba] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
          <div className="absolute top-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#ffdfba] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
        </div>
        
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Auth Status */}
          {!isLoading && (
            <motion.div
              className="flex justify-center mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {user ? (
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#a8e6cf]/10 border border-[#a8e6cf]/30">
                  <span className="text-sm text-gray-400">Playing as</span>
                  <span className="font-bold text-[#a8e6cf]">{user.username}</span>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffdfba]/10 border border-[#ffdfba]/30 text-[#ffdfba] hover:bg-[#ffdfba]/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">Sign in to save scores</span>
                </button>
              )}
            </motion.div>
          )}
          
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#ffb3ba]/10 text-[#ffb3ba] text-sm font-medium mb-4 md:mb-6">
            Game Arcade
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffdfba] via-[#ffb3ba] to-[#bab3ff]">
              Games
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto px-2">
            Challenge yourself with our collection of addictive games. 
            {user ? ' Your scores are saved to the leaderboard!' : ' Sign in to save your scores!'}
          </p>
        </motion.div>
      </section>
      
      {/* Games Grid */}
      <BentoGamesGrid />
      
      {/* Bottom spacing */}
      <div className="h-10 md:h-20" />
    </main>
  );
}
