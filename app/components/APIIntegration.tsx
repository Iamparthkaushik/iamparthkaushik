'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface APIData {
  quote?: string;
  author?: string;
  temp?: number;
  description?: string;
  city?: string;
  fact?: string;
  number?: number;
  loading: boolean;
  error?: string;
}

export default function APIIntegration() {
  const [quoteData, setQuoteData] = useState<APIData>({ loading: true });
  const [weatherData, setWeatherData] = useState<APIData>({ loading: true });
  const [factData, setFactData] = useState<APIData>({ loading: true });

  useEffect(() => {
    // Fetch random quote
    const fetchQuote = async () => {
      try {
        const response = await axios.get('https://api.quotable.io/random');
        setQuoteData({
          quote: response.data.content,
          author: response.data.author,
          loading: false,
        });
      } catch (error) {
        setQuoteData({
          loading: false,
          error: 'Failed to load quote',
        });
      }
    };

    // Fetch random fact
    const fetchFact = async () => {
      try {
        const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
        setFactData({
          fact: response.data.text,
          loading: false,
        });
      } catch (error) {
        setFactData({
          loading: false,
          error: 'Failed to load fact',
        });
      }
    };

    fetchQuote();
    fetchFact();
  }, []);

  const refreshQuote = async () => {
    setQuoteData({ loading: true });
    try {
      const response = await axios.get('https://api.quotable.io/random');
      setQuoteData({
        quote: response.data.content,
        author: response.data.author,
        loading: false,
      });
    } catch (error) {
      setQuoteData({
        loading: false,
        error: 'Failed to load quote',
      });
    }
  };

  const refreshFact = async () => {
    setFactData({ loading: true });
    try {
      const response = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      setFactData({
        fact: response.data.text,
        loading: false,
      });
    } catch (error) {
      setFactData({
        loading: false,
        error: 'Failed to load fact',
      });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#0a0a0f] py-24 px-4 md:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0f1419] to-[#0a0a0f]" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#bab3ff]/10 text-[#bab3ff] text-sm font-medium mb-4">
            Live Data
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#bab3ff] via-[#bae1ff] to-[#a8e6cf] bg-clip-text text-transparent">
              API Integration
            </span>
          </h2>
          <p className="text-slate-400 text-lg">Real-time data from external services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quote Card */}
          <motion.div
            className="bg-white/[0.02] border border-[#bab3ff]/20 rounded-2xl p-8 backdrop-blur-sm hover:border-[#bab3ff]/40 transition-all duration-300"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#bab3ff]/10 flex items-center justify-center text-xl">💬</div>
              <h3 className="text-xl font-semibold text-white">Daily Quote</h3>
            </div>
            {quoteData.loading ? (
              <div className="animate-pulse h-32 bg-[#bab3ff]/10 rounded-xl"></div>
            ) : quoteData.error ? (
              <p className="text-[#ffb3ba]">{quoteData.error}</p>
            ) : (
              <>
                <p className="text-slate-300 text-lg italic mb-4 leading-relaxed">
                  "{quoteData.quote}"
                </p>
                <p className="text-[#bab3ff] text-right mb-6">— {quoteData.author}</p>
                <button
                  onClick={refreshQuote}
                  className="w-full py-3 bg-gradient-to-r from-[#bab3ff] to-[#bae1ff] text-[#0a0a0f] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#bab3ff]/20 transition-all duration-300"
                >
                  Get New Quote
                </button>
              </>
            )}
          </motion.div>

          {/* Fact Card */}
          <motion.div
            className="bg-white/[0.02] border border-[#bae1ff]/20 rounded-2xl p-8 backdrop-blur-sm hover:border-[#bae1ff]/40 transition-all duration-300"
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#bae1ff]/10 flex items-center justify-center text-xl">💡</div>
              <h3 className="text-xl font-semibold text-white">Random Fact</h3>
            </div>
            {factData.loading ? (
              <div className="animate-pulse h-32 bg-[#bae1ff]/10 rounded-xl"></div>
            ) : factData.error ? (
              <p className="text-[#ffb3ba]">{factData.error}</p>
            ) : (
              <>
                <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                  {factData.fact}
                </p>
                <button
                  onClick={refreshFact}
                  className="w-full py-3 bg-gradient-to-r from-[#bae1ff] to-[#a8e6cf] text-[#0a0a0f] rounded-xl font-semibold hover:shadow-lg hover:shadow-[#bae1ff]/20 transition-all duration-300"
                >
                  Get New Fact
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
