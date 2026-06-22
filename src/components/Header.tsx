import React from 'react';
import { Heart, Trophy, Zap, AlertTriangle } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { LEVELS } from '../types';
import { motion } from 'motion/react';

export function Header() {
  const { stats } = useApp();

  const currentLevelIndex = LEVELS.findIndex(l => l.name === stats.level);
  const nextLevel = LEVELS[currentLevelIndex + 1];
  const currentLevelExp = LEVELS[currentLevelIndex].expRequired;
  
  const progressPercent = nextLevel 
    ? ((stats.exp - currentLevelExp) / (nextLevel.expRequired - currentLevelExp)) * 100
    : 100;

  return (
    <header className="relative z-50 h-20 flex items-center justify-between px-4 sm:px-8 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 w-full">
        
        {/* Title & Mascot Icon (Optional) or just Level */}
        <div className="flex items-center gap-4 flex-1">
          <div className="hidden sm:flex w-12 h-12 bg-indigo-500 rounded-2xl items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-2xl">🏎️</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white m-0 leading-tight">CHIẾN THẦN XA LỘ</h1>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest m-0 leading-tight">Hành trình 600 câu</p>
          </div>
        </div>

        {/* Level & Hearts */}
        <div className="flex items-center gap-2 sm:gap-6">
          <div className="flex items-center gap-2 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
            <span className="text-orange-400 font-bold text-xs sm:text-sm truncate max-w-[80px] sm:max-w-none">{stats.level}</span>
            <div className="hidden sm:block w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <span className="text-[10px] sm:text-xs font-mono text-slate-300 ml-1">
              {stats.exp} {nextLevel ? `/ ${nextLevel.expRequired}` : ''}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-red-500/20 text-red-400 px-2 sm:px-3 py-1.5 rounded-xl border border-red-500/30 font-bold text-sm">
              <Heart className="w-4 h-4 fill-red-500" />
              <span>{stats.hearts}/5</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
}
