// Types for taking a quiz, getting feedback and tracking progress (the gamification part).
// Based on QuizAttempt, QuizAnswer and QuizResult in Subapp 1.

// What the student sends when submitting a quiz
export interface SubmitAnswerDto {
  quizQuestionId: number;
  submittedAnswer: string;
}

export interface SubmitQuizDto {
  quizId: number;
  answers: SubmitAnswerDto[];
}

// Immediate feedback per question (CorrectAnswer is only sent AFTER submitting)
export interface AnswerFeedbackDto {
  quizQuestionId: number;
  prompt: string;
  submittedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

// The result page after a quiz — also used in the submission history list
export interface QuizResultDto {
  attemptId: number;
  quizId: number;
  quizTitle: string;
  completedAt: string; // C# DateTime arrives as an ISO string, e.g. "2026-11-26T19:00:00Z"
  pointsEarned: number;
  maximumPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  feedback: AnswerFeedbackDto[];

  // Gamification (from the furniture unlock system in Subapp 1)
  catJustFreed: boolean;           // true after the student's first completed quiz
  newFurnitureName: string | null; // e.g. "Cat tree" — null if nothing was unlocked
  newFurnitureSlug: string | null; // e.g. "cat-tree" → /images/furniture/cat-tree.png
}

// One row in the leaderboard
export interface LeaderboardEntryDto {
  rank: number;
  studentName: string;
  totalPoints: number;
  completedQuizzes: number;
}
