// Dashboard DTOs — same shape as DashboardViewModel, CourseSummaryViewModel and
// QuizSummaryViewModel in Subapp 1 (api/ViewModels/DashboardViewModels.cs).

// One quiz inside a course, with the logged-in student's progress
export interface DashboardQuizDto {
  id: number;
  title: string;
  questionCount: number;
  bestPercentage: number; // 0–100, the best attempt
  attemptCount: number;   // 0 = never taken
}

// One course on the dashboard, with its quizzes
export interface DashboardCourseDto {
  id: number;
  code: string;
  name: string;
  quizzes: DashboardQuizDto[];
}

// Same rule as QuizSummaryViewModel.IsCompleted in Subapp 1: completed = best score 60% or more
export const PASS_PERCENTAGE = 60;

export function isQuizCompleted(quiz: DashboardQuizDto): boolean {
  return quiz.bestPercentage >= PASS_PERCENTAGE;
}