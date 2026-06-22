import { mockQuestions } from '../data/questions';
import { UserProgress, Question } from '../types';

export function getChapterQuestions(chapterId: number, progress: Record<number, UserProgress>): Question[] {
  const qs = mockQuestions.filter(q => q.chapter === chapterId);
  
  return qs.sort((a, b) => {
    const pA = progress[a.id];
    const pB = progress[b.id];

    // 0. Câu hỏi khó (có sao) lên trước tuyệt đối
    const aStarred = pA?.isStarred ? 1 : 0;
    const bStarred = pB?.isStarred ? 1 : 0;
    if (aStarred !== bStarred) {
      return bStarred - aStarred;
    }

    // Câu đã thuộc (mastered) xuống cuối cùng nếu không phải câu khó
    const aTimesAnswered = pA?.timesAnswered || 0;
    const bTimesAnswered = pB?.timesAnswered || 0;
    
    const aCorrectRate = aTimesAnswered > 0 ? (pA?.timesCorrect || 0) / aTimesAnswered : 0;
    const bCorrectRate = bTimesAnswered > 0 ? (pB?.timesCorrect || 0) / bTimesAnswered : 0;
    
    const aMastered = aCorrectRate >= 0.9 && aTimesAnswered >= 1 ? 1 : 0;
    const bMastered = bCorrectRate >= 0.9 && bTimesAnswered >= 1 ? 1 : 0;
    
    if (aMastered !== bMastered) {
      return aMastered - bMastered; // Mastered goes to bottom
    }

    // 1. Chưa học lên trước
    if (aTimesAnswered === 0 && bTimesAnswered > 0) return -1;
    if (bTimesAnswered === 0 && aTimesAnswered > 0) return 1;

    // 2. Câu ít học lên trước
    if (aTimesAnswered !== bTimesAnswered) {
      return aTimesAnswered - bTimesAnswered;
    }

    // 3. Câu trả lời sai nhiều lên trước
    const aIncorrect = pA?.timesIncorrect || 0;
    const bIncorrect = pB?.timesIncorrect || 0;
    if (aIncorrect !== bIncorrect) {
      return bIncorrect - aIncorrect;
    }

    return 0;
  });
}

// Spaced repetition logic matching the intent of "sai bao nhiêu học bấy nhiêu"
export function generateReviewQuiz(progress: Record<number, UserProgress>): (Question & { mistake_count: number })[] {
  const allQs = mockQuestions;
  
  // Find questions with mistakes
  const wrongQs = Object.values(progress)
    .filter(p => p.mistakeCount > 0)
    .sort((a, b) => b.mistakeCount - a.mistakeCount);

  const reviewQuestions = wrongQs.map(wq => {
    const q = allQs.find(q => q.id === wq.questionId)!;
    return { ...q, mistake_count: wq.mistakeCount };
  });

  return reviewQuestions.slice(0, 10); // return up to 10 worst mistakes
}

export function getStarredQuestions(progress: Record<number, UserProgress>): Question[] {
  const allQs = mockQuestions;
  const starred = Object.values(progress).filter(p => p.isStarred).map(p => p.questionId);
  return allQs.filter(q => starred.includes(q.id));
}
