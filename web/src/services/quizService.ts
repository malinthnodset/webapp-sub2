//All the HTTP calls for quizzes and quiz attempts
//All the HTTP calls for quizzes and quiz attempts

import { api, ApiError } from './api';
import type { QuizDto, QuizForTakingDto, CreateQuizDto } from '../types/quiz';
import type { SubmitQuizDto, QuizResultDto, QuizAnswerResultDto, QuizAttemptHistoryDto } from '../types/attempt';
import { mockQuiz, mockCorrectAnswers, mockCourseTitle } from '../mocks/quizMocks';

const USE_MOCK = true; //TODO: set to false when the quiz endpoints exist in the API!!

//Remembers the last mock result, so the result page can be reloaded in mock mode
//Since it is outside quizService, the last result is saved as long as the app is alive
let lastMockResult: QuizResultDto | null = null;

//Every mock attempt, so the result page can show an attempt history
//(the real API stores attempts in the QuizAttempts table)
const mockAttempts: QuizAttemptHistoryDto[] = [];

//Simulating an API call -> returns value after 300ms wrapped in a Promise
//Lets us see and test loading state on pages
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

//Same rounding as the backend: percentage with 2 decimals, 0 if the quiz has no points
function toPercentage(earned: number, max: number): number {
  return max === 0 ? 0 : Math.round((earned / max) * 10000) / 100;
}

//Fake grading, trim + ignore case, full points if correct, 0 if wrong
function mockGrade(data: SubmitQuizDto): QuizResultDto {
  const answers: QuizAnswerResultDto[] = mockQuiz.questions.map((question) => {
    const submitted = data.answers.find((a) => a.questionId === question.id)?.submittedAnswer ?? null;
    const correctAnswer = mockCorrectAnswers[question.id];
    const isCorrect = submitted?.trim().toLowerCase() === correctAnswer.toLowerCase();

    return {
      questionId: question.id,
      prompt: question.prompt,
      submittedAnswer: submitted,
      correctAnswer,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
    };
  });

  const pointsEarned = answers.reduce((sum, a) => sum + a.pointsAwarded, 0);
  const maximumPoints = mockQuiz.questions.reduce((sum, q) => sum + q.points, 0);
  const percentage = toPercentage(pointsEarned, maximumPoints);
  const completedAt = new Date().toISOString();

  //Save this attempt in the mock history
  mockAttempts.push({
    attemptNumber: mockAttempts.length + 1,
    completedAt,
    pointsEarned,
    maximumPoints,
    percentage,
  });

  return {
    quizId: data.quizId,
    title: mockQuiz.title,
    courseCode: mockQuiz.courseCode,
    courseTitle: mockCourseTitle,
    attemptNumber: mockAttempts.length,
    completedAt,
    attemptHistory: [...mockAttempts].reverse(), // newest first, like the backend
    pointsEarned,
    maximumPoints,
    correctAnswers: answers.filter((a) => a.isCorrect).length,
    totalQuestions: answers.length,
    percentage,
    catJustFreed: mockAttempts.length === 1, // the cat only escapes on the very first attempt
    newFurnitureName: null,
    newFurnitureSlug: null,
    answers,
  };
}

export const quizService = {
  //taking a quiz as a Student
  // GET /api/quizzes/{id}/take: the quiz with questions, without correct answers
  getForTaking: (id: number): Promise<QuizForTakingDto> =>
    USE_MOCK ? delay(mockQuiz) : api.get<QuizForTakingDto>(`/quizzes/${id}/take`),

  // POST /api/quizzes/{id}/attempts: creates a new attempt, the server grades it and returns the result
  submit: (data: SubmitQuizDto): Promise<QuizResultDto> => {  //saves the result before it returns
    if (!USE_MOCK) return api.post<QuizResultDto>(`/quizzes/${data.quizId}/attempts`, data);
    lastMockResult = mockGrade(data);
    return delay(lastMockResult);
  },

  // GET /api/quizzes/{id}/results/latest: the student's latest result (used if the result page is reloaded)
  getLatestResult: (quizId: number): Promise<QuizResultDto> => {
    if (!USE_MOCK) return api.get<QuizResultDto>(`/quizzes/${quizId}/results/latest`);
    if (lastMockResult) return delay(lastMockResult);
    return Promise.reject(new ApiError(404, 'You have not taken this quiz yet.'));
  },

  // --- Managing quizzes (teacher) — used in step 6 and 7 ---

  getAll: () => api.get<QuizDto[]>('/quizzes'),

  getForEdit: (id: number) => api.get<CreateQuizDto>(`/quizzes/${id}/edit`),

  create: (quiz: CreateQuizDto) => api.post<QuizDto>('/quizzes', quiz),

  update: (id: number, quiz: CreateQuizDto) => api.put<void>(`/quizzes/${id}`, quiz),

  remove: (id: number) => api.delete(`/quizzes/${id}`),
};
