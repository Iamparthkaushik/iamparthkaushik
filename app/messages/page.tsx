'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingNav from '../components/FloatingNav';
import CursorFollower from '../components/CursorFollower';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

interface Message {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, token } = useAuth();

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    // Refresh messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !token) return;
    
    setPosting(true);
    setError('');
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [data.message, ...prev]);
        setNewMessage('');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to post message');
      }
    } catch (err) {
      setError('Failed to post message');
    } finally {
      setPosting(false);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <main className="relative w-full min-h-screen overflow-x-hidden bg-[#0a0a0f]">
      <CursorFollower />
      <FloatingNav />
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-[#bae1ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
        <div className="absolute bottom-1/4 right-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#bab3ff] rounded-full mix-blend-multiply filter blur-[100px] md:blur-[150px] opacity-10" />
      </div>
      
      {/* Header */}
      <section className="relative pt-24 md:pt-32 pb-6 md:pb-8 px-4">
        <motion.div
          className="relative z-10 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#bae1ff]/10 text-[#bae1ff] text-sm font-medium mb-4 md:mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Community
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bae1ff] via-[#bab3ff] to-[#ffb3ba]">
              Message Board
            </span>
          </h1>
          <p className="text-base md:text-lg text-gray-400">
            Leave a message for visitors to see!
          </p>
        </motion.div>
      </section>
      
      {/* Post Form */}
      <section className="relative px-4 mb-6 md:mb-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {user ? (
            <form onSubmit={handleSubmit} className="relative">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#bae1ff] to-[#bab3ff] flex items-center justify-center text-black font-bold text-sm md:text-base">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-white font-medium text-sm md:text-base">{user.username}</span>
                </div>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write something nice..."
                  maxLength={500}
                  className="w-full bg-transparent text-white placeholder-gray-500 resize-none outline-none min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                  rows={3}
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-white/10">
                  <span className="text-xs md:text-sm text-gray-500">
                    {newMessage.length}/500 characters
                  </span>
                  <button
                    type="submit"
                    disabled={posting || !newMessage.trim()}
                    className="w-full sm:w-auto px-5 md:px-6 py-2.5 md:py-2 rounded-xl bg-gradient-to-r from-[#bae1ff] to-[#bab3ff] text-black font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity text-sm md:text-base"
                  >
                    {posting ? 'Posting...' : 'Post Message'}
                  </button>
                </div>
                {error && (
                  <p className="text-[#ffb3ba] text-sm mt-3">{error}</p>
                )}
              </div>
            </form>
          ) : (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-8 text-center">
              <p className="text-gray-400 mb-4 text-sm md:text-base">Login to leave a message!</p>
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2.5 md:py-2 rounded-xl bg-gradient-to-r from-[#bae1ff] to-[#bab3ff] text-black font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
              >
                Login / Register
              </button>
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Messages List */}
      <section className="relative px-4 pb-16 md:pb-20">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {loading ? (
            <div className="py-12 md:py-20 text-center text-gray-500">
              <div className="w-8 h-8 border-2 border-[#bae1ff]/30 border-t-[#bae1ff] rounded-full animate-spin mx-auto mb-4" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 md:py-20 text-center">
              <div className="text-4xl md:text-6xl mb-4">💬</div>
              <p className="text-gray-500 text-sm md:text-base">No messages yet. Be the first to leave one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#bae1ff] to-[#bab3ff] flex items-center justify-center text-black font-bold flex-shrink-0 text-sm md:text-base">
                        {message.username?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`font-medium text-sm md:text-base ${user && message.username === user.username ? 'text-[#bae1ff]' : 'text-white'}`}>
                            {message.username}
                          </span>
                          {user && message.username === user.username && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#bae1ff]/20 text-[#bae1ff]">
                              You
                            </span>
                          )}
                          <span className="text-xs md:text-sm text-gray-500">
                            {formatTimeAgo(message.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </section>
      
      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </main>
  );
}
