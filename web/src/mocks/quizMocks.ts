//Mockdata used before connecting to API

import type { QuizForTakingDto } from "../types/quiz";

//What the student receives, questions WITHOUT the answer
export const mockQuiz: QuizForTakingDto = {
  id: 1,
  title: 'MVC basics',
  description: 'A short warm-up quiz about ASP.NET MVC',
  courseName: 'Web applications',
  questions: [
    { id: 1, prompt: 'What does the C in MVC stand for?', points: 1, order: 1 },
    { id: 2, prompt: 'Which keyword waits for a Task to finish?', points: 1, order: 2 },
    { id: 3, prompt: 'Which HTTP method is used to delete data?', points: 2, order: 3 },
    { id: 4, prompt: 'What does DTO stand for?', points: 2, order: 4 },
  ],
};

//The correct answer in it's own object, kept seperate from the quiz itself
//(Record<number, string> = questionId) = correctAnswer. Finds the correct answer based on questionId
export const mockCorrectAnswers: Record<number, string> = {
  1: 'controller',
  2: 'await',
  3: 'delete',
  4: 'data transfer object',
};