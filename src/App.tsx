/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Home } from './views/Home';
import { Header } from './components/Header';
import { QuestionView } from './components/QuestionView';
import { getChapterQuestions, generateReviewQuiz, getStarredQuestions } from './lib/quiz';
import { useApp } from './store/AppContext';
import { Question } from './types';
import { XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

function AppContent() {
  const [currentView, setCurrentView] = useState<'home' | 'learn' | 'review' | 'starred'>('home');
  const [activeQuestions, setActiveQuestions] = useState<(Question & { mistake_count?: number })[]>([]);
  const { progress } = useApp();

  const handleStartLearn = (chapterId?: number, shuffle?: boolean) => {
    let questions = getChapterQuestions(chapterId || 1, progress);
    if (questions.length === 0) {
      alert("Chương này chưa có dữ liệu mock!");
      return;
    }
    if (shuffle) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }
    setActiveQuestions(questions);
    setCurrentView('learn');
  };

  const handleStartReview = () => {
    const questions = generateReviewQuiz(progress);
    if (questions.length === 0) {
      alert("Bạn chưa có câu nào làm sai nhiều để ôn tập!");
      return;
    }
    setActiveQuestions(questions);
    setCurrentView('review');
  };

  const handleStartStarred = () => {
    const questions = getStarredQuestions(progress);
    if (questions.length === 0) {
      alert("Bạn chưa đánh dấu sao câu hỏi khó nào!");
      return;
    }
    setActiveQuestions(questions);
    setCurrentView('starred');
  };

  const handleComplete = () => {
    setCurrentView('home');
    setActiveQuestions([]);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-sans text-slate-100 relative overflow-hidden">
      {/* Ambient Backgrounds */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px] opacity-30"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
      </div>

      <Header />
      
      <main className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {currentView !== 'home' && (
          <div className="absolute top-4 left-4 z-50 hidden sm:block">
             <button 
                onClick={() => setCurrentView('home')}
                className="bg-white/10 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white/20 transition-colors border border-white/10 text-slate-300"
              >
               <ArrowLeft className="w-6 h-6" />
             </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {currentView === 'home' && (
             <motion.div key="home" initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 20}} className="flex-1 h-full max-h-full overflow-y-auto">
                <Home onStartLearn={handleStartLearn} onStartReview={handleStartReview} onStartStarred={handleStartStarred} />
             </motion.div>
          )}

          {currentView === 'learn' && (
             <motion.div key="learn" initial={{opacity: 0, x: -20}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 20}} className="flex-1 h-full max-h-full overflow-y-auto w-full">
               <div className="sm:hidden p-4 pb-0 flex justify-end">
                 <button onClick={() => setCurrentView('home')} className="bg-white/10 backdrop-blur-md p-2 rounded-full shadow-lg border border-white/10 text-slate-300"><XCircle className="w-6 h-6" /></button>
               </div>
               <QuestionView questions={activeQuestions} onComplete={handleComplete} isReviewMode={false} />
             </motion.div>
          )}

          {(currentView === 'review' || currentView === 'starred') && (
             <motion.div key={currentView} initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0, scale: 1.05}} className={cn("flex-1 h-full max-h-full overflow-y-auto w-full", currentView === 'starred' ? "bg-yellow-500/10" : "bg-orange-500/10")}>
               <div className="sm:hidden p-4 pb-0 flex justify-end">
                 <button onClick={() => setCurrentView('home')} className={cn("bg-white/10 backdrop-blur-md p-2 rounded-full shadow-lg border text-orange-400", currentView === 'starred' ? "border-yellow-500/20 text-yellow-400" : "border-white/10")}><XCircle className="w-6 h-6" /></button>
               </div>
               <QuestionView questions={activeQuestions} onComplete={handleComplete} isReviewMode={true} />
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AppContent;

