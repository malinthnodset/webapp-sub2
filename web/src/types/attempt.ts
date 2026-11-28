// Types for taking a quiz, getting feedback and tracking progress (the gamification part).
// Based on QuizAttempt, QuizAnswer and QuizResult in Subapp 1.

// What the student sends when submitting a quiz
export interface SubmitAnswerDto {
  questionId: number;
  submittedAnswer: string | null;
}

export interface SubmitQuizDto {
  quizId: number;
  answers: SubmitAnswerDto[];
}

// Immediate feedback per question (CorrectAnswer is only sent AFTER submitting)
export interface QuizAnswerResultDto {
  questionId: number;
  prompt: string;
  submittedAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

// One earlier attempt in the history list
export interface QuizAttemptHistoryDto {
  attemptNumber: number;
  completedAt: string; // C# DateTimeOffset arrives as an ISO string, e.g. "2026-11-27T18:00:00+00:00"
  pointsEarned: number;
  maximumPoints: number;
  percentage: number;
}

// The result page after a quiz — also used in the submission history list
export interface QuizResultDto {
  quizId: number;
  title: string;  //quiz title
  courseCode: string;
  courseTitle: string;
  attemptNumber: number;
  completedAt: string; // C# DateTime arrives as an ISO string, e.g. "2026-11-26T19:00:00Z"
  attemptHistory: QuizAttemptHistoryDto[];   //All attempts at this quiz, newest first
  pointsEarned: number;
  maximumPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  

  // Gamification (from the furniture unlock system in Subapp 1)
  catJustFreed: boolean;           // true after the student's first completed quiz
  newFurnitureName: string | null; // e.g. "Cat tree" — null if nothing was unlocked
  newFurnitureSlug: string | null; // e.g. "cat-tree" → /images/furniture/cat-tree.png

  answers: QuizAnswerResultDto[];
}

// TODO hva er dette til?? Finnes ingen DTO for dette
// One row in the leaderboard
export interface LeaderboardEntryDto {
  rank: number;
  studentName: string;
  totalPoints: number;
  completedQuizzes: number;
}
