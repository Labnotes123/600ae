import { mockQuestions } from '../data/questions';
import { UserProgress, Question } from '../types';

export function getChapterQuestions(chapterId: number, progress: Record<number, UserProgress>): Question[] {
  const qs = mockQuestions.filter(q => q.chapter === chapterId);
  
  return qs.sort((a, b) => {
    const pA = progress[a.id];
    const pB = progress[b.id];

    const aTimesAnswered = pA?.timesAnswered || 0;
    const bTimesAnswered = pB?.timesAnswered || 0;

    // 1. Chưa trả lời bao giờ lên trước
    if (aTimesAnswered === 0 && bTimesAnswered > 0) return -1;
    if (bTimesAnswered === 0 && aTimesAnswered > 0) return 1;

    if (aTimesAnswered > 0 && bTimesAnswered > 0) {
      const aCorrectRate = (pA?.timesCorrect || 0) / aTimesAnswered;
      const bCorrectRate = (pB?.timesCorrect || 0) / bTimesAnswered;

      // 4. Nếu số lần trả lời đúng là 90% thì được coi là đã thuộc làu (bỏ xuống cuối cùng)
      const aMastered = aCorrectRate >= 0.9 && aTimesAnswered >= 1;
      const bMastered = bCorrectRate >= 0.9 && bTimesAnswered >= 1;

      if (!aMastered && bMastered) return -1;
      if (aMastered && !bMastered) return 1;

      // 3. Trả lời sai lên trước (sort by incorrect count descending)
      const aIncorrect = pA?.timesIncorrect || 0;
      const bIncorrect = pB?.timesIncorrect || 0;
      
      if (aIncorrect !== bIncorrect) {
        return bIncorrect - aIncorrect;
      }

      // 2. Trả lời ít lên trước
      if (aTimesAnswered !== bTimesAnswered) {
        return aTimesAnswered - bTimesAnswered;
      }
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
