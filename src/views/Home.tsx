import React from 'react';
import { useApp } from '../store/AppContext';
import { CHAPTERS } from '../data/questions';
import { BookOpen, Skull, PlayCircle, Library, Star, ListOrdered, Shuffle } from 'lucide-react';
import { Mascot } from '../components/Mascot';

interface HomeProps {
  onStartLearn: (chapterId?: number, shuffle?: boolean) => void;
  onStartReview: () => void;
  onStartStarred: () => void;
}

export function Home({ onStartLearn, onStartReview, onStartStarred }: HomeProps) {
  const { progress, stats } = useApp();

  const totalQuestions = Object.keys(progress).length;
  const masteredCount = Object.values(progress).filter((p: any) => p.status === 'mastered').length;
  const mistakeCount = Object.values(progress).filter((p: any) => p.mistakeCount > 0).length;
  const starredCount = Object.values(progress).filter((p: any) => p.isStarred).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
      <div className="flex flex-col items-center mb-12">
        <Mascot state="happy" message="Chào mừng Tân Binh! Hôm nay chúng ta sẽ chinh phục đạo luật nào đây?" className="scale-125" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/10 flex flex-col items-center">
          <BookOpen className="w-8 h-8 text-indigo-400 mb-2" />
          <span className="text-xl font-bold text-slate-100">{totalQuestions}</span>
          <span className="text-xs text-slate-400 font-medium uppercase">Đã xem</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/10 flex flex-col items-center">
          <Library className="w-8 h-8 text-green-400 mb-2" />
          <span className="text-xl font-bold text-slate-100">{masteredCount}</span>
          <span className="text-xs text-slate-400 font-medium uppercase">Thuộc làu</span>
        </div>
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/10 flex flex-col items-center col-span-2">
          <Skull className="w-8 h-8 text-red-500 mb-2" />
          <span className="text-xl font-bold text-slate-100">{mistakeCount}</span>
          <span className="text-xs text-slate-400 font-medium uppercase text-center mt-1">Câu sai đang chờ cải tạo</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 flex-1 pb-8">
        {/* Main Learning Mode */}
        <div className="bg-indigo-500/20 backdrop-blur-xl p-8 rounded-[40px] text-white flex flex-col relative overflow-hidden border border-indigo-500/30">
          <div className="absolute top-0 right-0 p-8 opacity-20">
            <BookOpen className="w-32 h-32" />
          </div>
          <h2 className="text-3xl font-bold mb-2 z-10 text-indigo-100">Tu Luyện Lục Các</h2>
          <p className="text-indigo-200/80 mb-8 z-10">Vượt qua 6 hòn đảo kiến thức để trở thành Chiến Thần Xa Lộ.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto z-10">
            {CHAPTERS.map(chap => (
              <div 
                key={chap.id}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left flex flex-col group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <div className="flex justify-between items-center w-full relative z-10">
                  <span className="font-bold text-sm text-indigo-100">Chương {chap.id}</span>
                  <span className="text-[10px] font-mono bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-500/20">{chap.total} câu</span>
                </div>
                <span className="text-xs text-indigo-300 line-clamp-1 mt-1 mb-3 relative z-10">{chap.name}</span>
                <div className="flex gap-2 mt-auto relative z-10 w-full">
                  <button 
                    onClick={() => onStartLearn(chap.id, false)}
                    title="Học tuần tự"
                    className="flex-1 bg-indigo-500/30 hover:bg-indigo-500/60 transition-colors py-2 rounded text-indigo-100 border border-indigo-500/30 flex items-center justify-center group"
                  >
                    <ListOrdered className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                    onClick={() => onStartLearn(chap.id, true)}
                    title="Học ngẫu nhiên"
                    className="flex-1 bg-purple-500/30 hover:bg-purple-500/60 transition-colors py-2 rounded text-purple-100 border border-purple-500/30 flex items-center justify-center group"
                  >
                    <Shuffle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Review Mode (Spaced Repetition) */}
          <div className="bg-orange-500/10 backdrop-blur-xl p-8 rounded-[40px] text-white flex flex-col relative overflow-hidden border border-orange-500/20 flex-1">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Skull className="w-32 h-32 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2 z-10 text-orange-400">Trại Cải Tạo</h2>
            <p className="text-orange-200/60 mb-6 z-10 flex-1">
              Thuật toán sẽ nhắc lại những câu bạn hay sai. Xóa nợ ngay!
            </p>
            
            <button 
              onClick={onStartReview}
              disabled={mistakeCount === 0}
              className="z-10 bg-orange-500 text-white w-full py-4 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 active:translate-y-1"
            >
              <PlayCircle className="w-6 h-6" />
              {mistakeCount === 0 ? "Không có nợ xấu" : "Vào Trại Ngay"}
            </button>
          </div>

          {/* Starred Mode */}
          <div className="bg-yellow-500/10 backdrop-blur-xl p-8 rounded-[40px] text-white flex flex-col relative overflow-hidden border border-yellow-500/20 flex-1">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <Star className="w-32 h-32 text-yellow-500" />
            </div>
            <h2 className="text-3xl font-bold mb-2 z-10 text-yellow-400">Câu Hỏi Khó</h2>
            <p className="text-yellow-200/60 mb-6 z-10 flex-1">
              Ôn lại phần câu hỏi do chính bạn đánh dấu sao.
            </p>
            
            <button 
              onClick={onStartStarred}
              disabled={starredCount === 0}
              className="z-10 bg-yellow-500 text-slate-900 w-full py-4 rounded-2xl font-bold text-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20 active:translate-y-1"
            >
              <Star className="w-6 h-6" />
              {starredCount === 0 ? "Chưa có sao" : "Luyện Sao Ngay"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
