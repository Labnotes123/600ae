export interface Question {
  id: number;
  chapter: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  imageUrl?: string;
  isFatal?: boolean; // Câu điểm liệt
}

export interface UserProgress {
  questionId: number;
  status: 'new' | 'learning' | 'mastered';
  mistakeCount: number;
  lastReviewed?: number; // timestamp
  timesAnswered?: number;
  timesCorrect?: number;
  timesIncorrect?: number;
  totalTimeSpent?: number; // seconds
  isStarred?: boolean; // Câu hỏi khó (đánh dấu sao)
}

export interface UserStats {
  level: string;
  exp: number;
  hearts: number;
  lastPlayed?: number; // timestamp for daily hearts reset
}

export const LEVELS = [
  { name: 'Tân Binh Xe Đạp', expRequired: 0 },
  { name: 'Lái Mới Xe Máy', expRequired: 100 },
  { name: 'Tay Lái Lụa Ô Tô', expRequired: 500 },
  { name: 'Chiến Thần Xa Lộ', expRequired: 1500 },
];
