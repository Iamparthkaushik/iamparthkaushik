'use client';

import { motion } from 'framer-motion';

interface HUDProps {
  isDay: boolean;
  setIsDay: (val: boolean) => void;
  vehicleType: 'car' | 'bike';
  setVehicleType: (val: 'car' | 'bike') => void;
  season: 'summer' | 'winter' | 'autumn' | 'rainy';
  setSeason: (val: 'summer' | 'winter' | 'autumn' | 'rainy') => void;
}

const seasons: { id: 'summer' | 'winter' | 'autumn' | 'rainy'; icon: string; label: string }[] = [
  { id: 'summer', icon: '☀️', label: 'Summer' },
  { id: 'autumn', icon: '🍂', label: 'Autumn' },
  { id: 'winter', icon: '❄️', label: 'Winter' },
  { id: 'rainy', icon: '🌧️', label: 'Rainy' },
];

export default function HUD({ isDay, setIsDay, vehicleType, setVehicleType, season, setSeason }: HUDProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6 md:p-10">
      {/* Top Section: Season and Time */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md p-2 rounded-2xl border border-white/10 flex gap-2">
            {seasons.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeason(s.id)}
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                  season === s.id ? 'bg-[#bab3ff] text-[#0a0a0f]' : 'bg-white/5 text-white hover:bg-white/10'
                }`}
                title={s.label}
              >
                <span className="text-xl">{s.icon}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsDay(!isDay)}
            className="pointer-events-auto flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10 text-white hover:bg-black/60 transition-all font-medium"
          >
            <span className="text-xl">{isDay ? '🌙' : '☀️'}</span>
            <span>Switch to {isDay ? 'Night' : 'Day'}</span>
          </button>
        </div>
        
        <div className="text-right">
          <motion.div 
            className="bg-black/40 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="block text-xs uppercase tracking-widest text-[#bab3ff] font-bold mb-1">Time of Day</span>
            <span className="text-2xl font-mono text-white">
              {isDay ? '12:00 PM' : '12:00 AM'}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section: Controls & Vehicle Switch */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => setVehicleType('car')}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all font-bold ${
              vehicleType === 'car' 
                ? 'bg-[#a8e6cf] text-[#0a0a0f] border-[#a8e6cf]/50 shadow-[0_0_20px_rgba(168,230,207,0.3)]' 
                : 'bg-black/40 text-white border-white/10 backdrop-blur-md hover:bg-black/60'
            }`}
          >
            <span className="text-2xl">🚗</span>
            <span>CAR</span>
          </button>
          
          <button
            onClick={() => setVehicleType('bike')}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all font-bold ${
              vehicleType === 'bike' 
                ? 'bg-[#ffb3ba] text-[#0a0a0f] border-[#ffb3ba]/50 shadow-[0_0_20px_rgba(255,179,186,0.3)]' 
                : 'bg-black/40 text-white border-white/10 backdrop-blur-md hover:bg-black/60'
            }`}
          >
            <span className="text-2xl">🏍️</span>
            <span>BIKE</span>
          </button>
        </div>

        <div className="pointer-events-auto">
           <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10 flex flex-col gap-2 min-w-[200px]">
              <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-wider">
                <span>Speed</span>
                <span className="text-[#a8e6cf]">km/h</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-mono text-white">0</span>
                <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#a8e6cf] to-[#bab3ff]"
                    initial={{ width: '0%' }}
                    animate={{ width: '0%' }} // This should be dynamic later
                  />
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
