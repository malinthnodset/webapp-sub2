// Quiz DTOs — based on the Quiz model from Subapp 1.
// Notice: CorrectAnswer is NOT in QuizQuestionDto, so students can't read the answers in the browser.

export interface QuizDto {
  id: number;
  title: string;
  description: string | null; // "string?" in C# becomes "string | null"
  courseId: number;
  courseName: string;
  questionCount: number;
}

export interface QuizQuestionDto {
  id: number;
  prompt: string;
  points: number;
  order: number;
}
