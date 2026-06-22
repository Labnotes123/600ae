import React from 'react';
import { ShieldCheck, HeartCrack, Lightbulb, Smile, Frown, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface MascotProps {
  state: 'default' | 'happy' | 'sad' | 'thinking' | 'victory';
  message?: string;
  className?: string;
}

export function Mascot({ state, message, className }: MascotProps) {
  const getIconAndColor = () => {
    switch (state) {
      case 'happy':
        return { Icon: Smile, color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/30' };
      case 'sad':
        return { Icon: Frown, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
      case 'thinking':
        return { Icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      case 'victory':
        return { Icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30' };
      default:
        return { Icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/20', border: 'border-indigo-500/30' };
    }
  };

  const { Icon, color, bg, border } = getIconAndColor();

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: state === 'happy' ? [0, -10, 10, 0] : 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("p-6 rounded-full border-4 shadow-lg", bg, border)}
        >
          <Icon className={cn("w-16 h-16", color)} />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "p-4 rounded-2xl max-w-sm text-center font-medium shadow-md border relative backdrop-blur-md",
              "bg-white/10 border-white/20 text-slate-100"
            )}
          >
            {/* Bubble tail */}
            <div className={cn("absolute -top-3 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-b-8 border-transparent", `border-b-white/20`)} />
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
