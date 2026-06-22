import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProgress, UserStats, LEVELS } from '../types';

interface AppContextType {
  progress: Record<number, UserProgress>;
  stats: UserStats;
  appealedAnswers: Record<number, number>;
  answerQuestion: (questionId: number, isCorrect: boolean, isFatal: boolean, timeSpent?: number) => void;
  appealAnswer: (questionId: number, correctedIndex: number) => void;
  toggleStar: (questionId: number) => void;
  resetProgress: () => void;
  spendHeart: () => boolean;
  gainHeart: () => void;
}

const defaultStats: UserStats = {
  level: LEVELS[0].name,
  exp: 0,
  hearts: 5,
  lastPlayed: Date.now()
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Record<number, UserProgress>>(() => {
    const saved = localStorage.getItem('app_progress');
    return saved ? JSON.parse(saved) : {};
  });

  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('app_stats');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset hearts daily
      const now = new Date();
      const lastPlayed = new Date(parsed.lastPlayed || Date.now());
      if (now.toDateString() !== lastPlayed.toDateString()) {
        parsed.hearts = 5;
        parsed.lastPlayed = Date.now();
      }
      return parsed;
    }
    return defaultStats;
  });

  const [appealedAnswers, setAppealedAnswers] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('app_appealed_answers');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('app_progress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('app_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('app_appealed_answers', JSON.stringify(appealedAnswers));
  }, [appealedAnswers]);

  const updateLevel = (currentExp: number) => {
    let newLevel = LEVELS[0].name;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (currentExp >= LEVELS[i].expRequired) {
        newLevel = LEVELS[i].name;
        break;
      }
    }
    return newLevel;
  };

  const spendHeart = () => {
    if (stats.hearts > 0) {
      setStats(prev => ({ ...prev, hearts: prev.hearts - 1 }));
      return true;
    }
    return false;
  };

  const gainHeart = () => {
    setStats(prev => ({ ...prev, hearts: Math.min(prev.hearts + 1, 5) }));
  };

  const appealAnswer = (questionId: number, correctedIndex: number) => {
    setAppealedAnswers(prev => ({ ...prev, [questionId]: correctedIndex }));
    // Automatically correct the progress for this question
    setProgress(prev => {
      const current = prev[questionId] || { questionId, status: 'new', mistakeCount: 0 };
      return {
        ...prev,
        [questionId]: {
          ...current,
          mistakeCount: 0,
          status: 'mastered',
          lastReviewed: Date.now()
        }
      };
    });
  };

  const toggleStar = (questionId: number) => {
    setProgress(prev => {
      const current = prev[questionId] || { questionId, status: 'new', mistakeCount: 0 };
      return {
        ...prev,
        [questionId]: {
          ...current,
          isStarred: !current.isStarred
        }
      };
    });
  };

  const answerQuestion = (questionId: number, isCorrect: boolean, isFatal: boolean, timeSpent: number = 0) => {
    setProgress(prev => {
      const current = prev[questionId] || { 
        questionId, 
        status: 'new', 
        mistakeCount: 0,
        timesAnswered: 0,
        timesCorrect: 0,
        timesIncorrect: 0,
        totalTimeSpent: 0
      };
      let newMistakeCount = current.mistakeCount;
      let newStatus = current.status;
      
      const timesAnswered = (current.timesAnswered || 0) + 1;
      const timesCorrect = (current.timesCorrect || 0) + (isCorrect ? 1 : 0);
      const timesIncorrect = (current.timesIncorrect || 0) + (!isCorrect ? 1 : 0);
      const totalTimeSpent = (current.totalTimeSpent || 0) + timeSpent;

      if (!isCorrect) {
        newMistakeCount += 1;
        newStatus = 'learning';
      } else {
        if (newMistakeCount > 0) {
          newMistakeCount -= 1;
        }
        const correctRate = timesCorrect / timesAnswered;
        if (correctRate >= 0.9 && timesAnswered >= 1) {
          newStatus = 'mastered';
        } else if (newMistakeCount === 0) {
          newStatus = 'learning'; // they might not be 90% yet but wiped out mistakes
        }
      }

      return {
        ...prev,
        [questionId]: {
          ...current,
          mistakeCount: newMistakeCount,
          status: newStatus,
          lastReviewed: Date.now(),
          timesAnswered,
          timesCorrect,
          timesIncorrect,
          totalTimeSpent
        }
      };
    });

    if (isCorrect) {
      setStats(prev => {
        const newExp = prev.exp + 10;
        return {
          ...prev,
          exp: newExp,
          level: updateLevel(newExp)
        };
      });
    }
  };

  const resetProgress = () => {
    setProgress({});
    setStats({ ...defaultStats, lastPlayed: Date.now() });
    setAppealedAnswers({});
  };

  return (
    <AppContext.Provider value={{ progress, stats, appealedAnswers, answerQuestion, appealAnswer, toggleStar, resetProgress, spendHeart, gainHeart }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
