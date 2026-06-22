import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question } from '../types';
import { useApp } from '../store/AppContext';
import { Mascot } from './Mascot';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, AlertOctagon, Skull, Timer, Flag, Pause, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../lib/utils';

interface QuestionViewProps {
  questions: (Question & { mistake_count?: number })[];
  onComplete: () => void;
  isReviewMode?: boolean;
}

const getSlowQuestions = (): number[] => {
  try {
    return JSON.parse(localStorage.getItem('slow_questions') || '[]');
  } catch {
    return [];
  }
};

const saveSlowQuestion = (id: number) => {
  const current = getSlowQuestions();
  if (!current.includes(id)) {
    localStorage.setItem('slow_questions', JSON.stringify([...current, id]));
  }
};

export function QuestionView({ questions, onComplete, isReviewMode }: QuestionViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isAppealing, setIsAppealing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { answerQuestion, spendHeart, stats, appealAnswer, appealedAnswers, progress, toggleStar } = useApp();

  const isPausedRef = useRef(isPaused);
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  const question = questions[currentIndex];
  const isStarred = question ? progress[question.id]?.isStarred : false;
  
  const actualCorrectIndex = question ? (appealedAnswers[question.id] !== undefined ? appealedAnswers[question.id] : question.correctAnswerIndex) : 0;
  
  const qProgress = question ? progress[question.id] : null;
  const timesAnswered = qProgress?.timesAnswered || 0;
  const timesCorrect = qProgress?.timesCorrect || 0;
  const timesIncorrect = qProgress?.timesIncorrect || 0;
  const totalTimeSpent = qProgress?.totalTimeSpent || 0;
  const avgTime = timesAnswered > 0 ? (totalTimeSpent / timesAnswered).toFixed(1) : 0;

  const maxTime = 60; 
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(questions.length * 60);

  const nextTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!question) return;
    setTimeLeft(maxTime);
    setIsAnswered(false);
    setSelectedOption(null);
    setIsAppealing(false);
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
  }, [question?.id]);

  const handleNext = () => {
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };
  const handleNextRef = useRef(handleNext);
  useEffect(() => { handleNextRef.current = handleNext; });

  const handleAnswer = (idx: number | null) => {
    if (isAnswered || !question) return;
    setIsAnswered(true);
    setSelectedOption(idx);
    
    // We already evaluated the answer based on the (possibly modified) actualCorrectIndex
    const isCorrect = idx === actualCorrectIndex;
    const timeSpent = Math.max(0, maxTime - timeLeft);
    
    if (idx === null || !isCorrect) {
      saveSlowQuestion(question.id);
      if (!isReviewMode) {
        spendHeart();
      }
      answerQuestion(question.id, false, question.isFatal || false, timeSpent);

      nextTimeoutRef.current = setTimeout(() => {
        handleNextRef.current();
      }, 2500); 
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      answerQuestion(question.id, true, question.isFatal || false, timeSpent);
    }
  };

  const handleAppealComplete = (idx: number) => {
    if (!question) return;
    appealAnswer(question.id, idx);
    setIsAppealing(false);
    // Restart timeout since it was cleared
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
    nextTimeoutRef.current = setTimeout(() => {
      handleNextRef.current();
    }, 2000);
  };

  const startAppeal = () => {
    setIsAppealing(true);
    if (nextTimeoutRef.current) clearTimeout(nextTimeoutRef.current);
  };

  const handleAnswerRef = useRef(handleAnswer);
  useEffect(() => { handleAnswerRef.current = handleAnswer; });

  // Timers tick
  useEffect(() => {
    let lastTime = performance.now();
    let animationFrameId: number;

    const tick = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      if (!isPausedRef.current) {
        setSessionTimeLeft(prev => Math.max(0, prev - deltaTime));

        if (!isAnswered && question) {
          setTimeLeft(prev => {
            const next = Math.max(0, prev - deltaTime);
            if (next <= 0) {
              handleAnswerRef.current(null); 
              return 0;
            }
            return next;
          });
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };
    
    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isAnswered, question?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      // If we are currently appealing or paused, intercept keys appropriately
      if (isPaused) {
        if (key === 'enter' || key === 'escape') {
          setIsPaused(false);
        }
        return;
      }
      if (isAppealing && isAnswered && question) {
        let appealIdx = -1;
        if (key === '1' || key === 'a') appealIdx = 0;
        if (key === '2' || key === 'b') appealIdx = 1;
        if (key === '3' || key === 'c') appealIdx = 2;
        if (key === '4' || key === 'd') appealIdx = 3;
        
        if (appealIdx >= 0 && appealIdx < question.options.length) {
          handleAppealComplete(appealIdx);
          return;
        }
      }

      if (key === 'enter' && isAnswered) {
        handleNextRef.current();
        return;
      }
      if (isAnswered || !question) return;
      
      let selectedIdx = -1;
      if (key === '1' || key === 'a') selectedIdx = 0;
      if (key === '2' || key === 'b') selectedIdx = 1;
      if (key === '3' || key === 'c') selectedIdx = 2;
      if (key === '4' || key === 'd') selectedIdx = 3;
      
      if (selectedIdx >= 0 && selectedIdx < question.options.length) {
        handleAnswerRef.current(selectedIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, question, isAppealing]);

  if (!question) return null;

  const isCorrect = selectedOption === actualCorrectIndex;
  const isTimeout = selectedOption === null && isAnswered;
  const showFatalWarning = question.isFatal && !isAnswered;
  const showMistakeWarning = question.mistake_count && typeof question.mistake_count === 'number' && question.mistake_count > 0;
  
  // Thanh chạy ngược
  const progressPercent = Math.max(0, (timeLeft / maxTime) * 100);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto w-full px-4 py-8 relative">
      {isPaused && (
        <div className="absolute inset-x-0 -top-12 bottom-0 z-50 bg-[#0f172a]/95 backdrop-blur-md flex flex-col items-center justify-center text-white">
          <Mascot state="happy" message="Nghỉ giải lao một chút nhé! Bạn đã làm rất tốt." className="mb-12 scale-125" />
          <button 
            onClick={() => setIsPaused(false)}
            className="bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-2xl font-bold text-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            Tiếp Tục Học (Nhấn Enter)
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between opacity-80">
         <div className="flex gap-2 sm:gap-4 items-center">
           <button 
             onClick={() => setCurrentIndex(prev => prev > 0 ? prev - 1 : 0)}
             disabled={currentIndex === 0}
             className="px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs sm:text-sm font-semibold tracking-wider text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700/50 transition-colors"
           >
             Quay lại câu trước
           </button>
           <button 
             onClick={() => setIsPaused(true)}
             disabled={isAnswered}
             className="flex items-center gap-1 px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg text-xs sm:text-sm font-semibold tracking-wider text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
           >
             <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
             <span className="hidden sm:inline">Giải lao</span>
           </button>
         </div>
         <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-lg text-sm font-semibold tracking-wider text-slate-300 hidden sm:flex ml-auto mr-4">
           <Timer className="w-4 h-4 text-emerald-400" />
           TỔNG THỜI GIAN THEO CHƯƠNG:
         </div>
         <div className="text-xl font-mono font-bold text-emerald-400">
           {formatTime(sessionTimeLeft)}
         </div>
      </div>
      
      <div className="mb-8 flex justify-center min-h-[160px] relative">
        <div className="absolute left-0 top-0 hidden md:block">
          <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5 text-xs text-slate-400 space-y-1">
            <h4 className="font-bold text-slate-300 mb-1 border-b border-white/10 pb-1">Thống Kê Câu Này</h4>
            <p>Đã trả lời: <span className="text-white font-mono">{timesAnswered}</span> lần</p>
            <p>Đúng: <span className="text-green-400 font-mono">{timesCorrect}</span> lần</p>
            <p>Sai: <span className="text-red-400 font-mono">{timesIncorrect}</span> lần</p>
            <p>Trung bình: <span className="text-yellow-400 font-mono">{avgTime}s</span> / câu</p>
          </div>
        </div>
        {!isAnswered ? (
          <Mascot 
            state={showFatalWarning ? 'thinking' : 'default'} 
            message={showFatalWarning ? "Cẩn thận! Đây là CÂU ĐIỂM LIỆT. Sai là rớt luôn đó!" : 
                     showMistakeWarning ? `Cố lên! Bạn từng sai câu này ${question.mistake_count} lần rồi!` :
                     "Đọc kỹ đề nhé tân binh!"}
          />
        ) : (
          <Mascot 
            state={isCorrect ? 'happy' : 'sad'}
            message={isCorrect ? "Chính xác! Cố lên nào!" : isTimeout ? "Hết giờ! Bạn cần nhanh tay hơn." : "Sai mất rồi! Xem giải thích bên dưới nhé."}
          />
        )}
      </div>

      <div className="bg-white/10 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/10 overflow-hidden mb-6 flex-1 flex flex-col relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5 overflow-hidden z-10">
          <div 
            className="h-full bg-orange-500 transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(249,115,22,0.5)]" 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>

        <div className="p-6 pt-8 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-indigo-500/30 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">CÂU {currentIndex + 1} / {questions.length}</span>
            <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-3 py-1 rounded-full border border-orange-500/20 flex items-center gap-1">
              <Timer className="w-3 h-3" />
              {Math.ceil(timeLeft)}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => toggleStar(question.id)}
              className={cn(
                "p-1.5 rounded-full transition-colors shrink-0",
                isStarred ? "text-yellow-400 bg-yellow-400/10 hover:bg-yellow-400/20" : "text-slate-400 hover:text-yellow-400 hover:bg-white/10"
              )}
              title={isStarred ? "Bỏ đánh dấu sao" : "Đánh dấu câu hỏi khó"}
            >
              <Star className="w-4 h-4" fill={isStarred ? "currentColor" : "none"} />
            </button>
            {(question.isFatal || showMistakeWarning) && (
              <>
                {question.isFatal && <span className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertOctagon className="w-3 h-3" /> ĐIỂM LIỆT</span>}
                {showMistakeWarning && <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Skull className="w-3 h-3" /> MISTAKE x{question.mistake_count}</span>}
              </>
            )}
            
            {isAnswered && !isCorrect && !isAppealing && (
              <button 
                onClick={startAppeal}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors"
                title="Báo lỗi đáp án sai"
              >
                <Flag className="w-3 h-3" /> KHIẾU NẠI ĐÁP ÁN
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6 sm:p-10 flex-1 flex flex-col">
          <h2 className="text-xl md:text-2xl font-bold text-slate-100 mb-8 leading-snug">
            {question.question}
          </h2>

          {question.imageUrl && (
            <div className="mb-8 rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex justify-center">
              <img src={question.imageUrl} alt="Question figure" className="max-w-full object-contain max-h-[400px]" />
            </div>
          )}

          <div className="flex flex-col gap-4 mt-auto">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isActualCorrect = idx === actualCorrectIndex;
              
              let btnClass = "bg-white/5 border border-white/10 text-slate-300 hover:border-indigo-500/50 hover:bg-indigo-500/20";
              let indexClass = "border border-white/20 text-slate-300 group-hover:bg-indigo-500 group-hover:border-transparent group-hover:text-white";
              
              if (isAnswered) {
                if (isActualCorrect) {
                  btnClass = "bg-green-500/20 border border-green-500/50 text-green-300";
                  indexClass = "bg-green-500/50 border-transparent text-green-100";
                } else if (isSelected && !isActualCorrect) {
                  btnClass = "bg-red-500/20 border border-red-500/50 text-red-300";
                  indexClass = "bg-red-500/50 border-transparent text-red-100";
                } else {
                  btnClass = "bg-white/5 border border-white/10 text-slate-500 opacity-50";
                  indexClass = "border border-white/10 text-slate-500";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                  className={cn(
                    "group w-full text-left p-5 rounded-3xl transition-all duration-200 text-lg relative overflow-hidden flex items-center",
                    btnClass
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold mr-4 transition-colors",
                    indexClass
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="flex-1 font-medium">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="min-h-[160px] relative">
        <AnimatePresence mode="wait">
          {isAppealing && (
            <motion.div 
               key="appealing"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-yellow-500/10 border border-yellow-500/30 p-5 rounded-3xl"
            >
               <h4 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                 <Flag className="w-5 h-5" /> CHỌN ĐÁP ÁN BẠN CHO LÀ ĐÚNG
               </h4>
               <div className="flex gap-2">
                 {question.options.map((_, idx) => (
                   <button 
                     key={idx}
                     onClick={() => handleAppealComplete(idx)}
                     className="flex-1 py-3 font-bold text-lg rounded-xl bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/40 transition-colors border border-yellow-500/20"
                   >
                     {String.fromCharCode(65 + idx)}
                   </button>
                 ))}
               </div>
            </motion.div>
          )}

          {!isAppealing && isAnswered && (
            <motion.div 
              key="next"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-4"
            >
              <div className={cn(
                "p-5 rounded-3xl flex items-start gap-4 backdrop-blur-xl border border-white/10",
                isCorrect ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                <span className="text-2xl mt-0.5">{isCorrect ? '✅' : '💡'}</span>
                <div>
                   <h4 className="font-bold text-sm mb-1 uppercase tracking-wide">
                     {isCorrect ? 'Chính xác' : isTimeout ? 'Hết giờ' : 'Giải thích'}
                   </h4>
                   <p className="text-sm text-slate-300 leading-relaxed">{question.explanation}</p>
                </div>
              </div>
              
              <button
                onClick={handleNext}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                  "bg-green-500/20 border border-green-500/50 text-green-300 hover:bg-green-500/30"
                )}
              >
                {currentIndex < questions.length - 1 ? "Câu Tiếp Theo (ấn Enter)" : "Hoàn Thành (ấn Enter)"}
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

