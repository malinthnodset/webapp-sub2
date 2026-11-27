//All the HTTP calls for quizzes and quiz attempts

import { api } from './api';
import type { QuizDto, QuizForTakingDto, CreateQuizDto } from '../types/quiz';
import type { SubmitQuizDto, QuizResultDto, AnswerFeedbackDto } from '../types/attempt';
import { mockQuiz, mockCorrectAnswers } from '../mocks/quizMocks';

const USE_MOCK = true; //TODO: set to false whenthe quiz endpoints exist in the API!!


//Simulating an API call -> returns value after 300ms wrapped in a Promise
//Let's us see and test loading state on pages
function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

//Fake grading, trim+ignore case, full point is correct, 0 if wrong
function mockGrade(data: SubmitQuizDto): QuizResultDto {
  const feedback: AnswerFeedbackDto[] = mockQuiz.questions.map((question) => {
    const submitted = data.answers.find((a) => a.quizQuestionId === question.id)?.submittedAnswer ?? null;
    const correctAnswer = mockCorrectAnswers[question.id];
    const isCorrect = submitted?.trim().toLowerCase() === correctAnswer.toLowerCase();

    return {
      quizQuestionId: question.id,
      prompt: question.prompt,
      submittedAnswer: submitted,
      correctAnswer,
      isCorrect,
      pointsAwarded: isCorrect ? question.points : 0,
    };
  });
  const pointsEarned = feedback.reduce((sum, f) => sum + f.pointsAwarded, 0);
  const maximumPoints = mockQuiz.questions.reduce((sum, q) => sum + q.points, 0);

  return {
    attemptId: 1,
    quizId: data.quizId,
    quizTitle: mockQuiz.title,
    completedAt: new Date().toISOString(),
    pointsEarned,
    maximumPoints,
    correctAnswers: feedback.filter((f) => f.isCorrect).length,
    totalQuestions: feedback.length,
    percentage: Math.round((pointsEarned / maximumPoints) * 100),
    feedback,
    catJustFreed: true,         // pretend this was the student's first quiz
    newFurnitureName: null,
    newFurnitureSlug: null,
  };
}

export const quizService = {
  //taking a quiz as a Student
  // GET /api/quizzes/{id}/take → the quiz with questions, without correct answers
  getForTaking: (id: number): Promise<QuizForTakingDto> =>
    USE_MOCK ? delay(mockQuiz) : api.get<QuizForTakingDto>(`/quizzes/${id}/take`),

  // POST /api/quizzes/{id}/attempts → creates a new attempt, the server grades it and returns the result
  submit: (data: SubmitQuizDto): Promise<QuizResultDto> =>
    USE_MOCK ? delay(mockGrade(data)) : api.post<QuizResultDto>(`/quizzes/${data.quizId}/attempts`, data),

  // GET /api/quizzes/{id}/results/latest → the student's latest result (used if the result page is reloaded)
  getLatestResult: (quizId: number): Promise<QuizResultDto> =>
    api.get<QuizResultDto>(`/quizzes/${quizId}/results/latest`),

  // --- Managing quizzes (teacher) — used in step 6 and 7 ---

  getAll: () => api.get<QuizDto[]>('/quizzes'),

  getForEdit: (id: number) => api.get<CreateQuizDto>(`/quizzes/${id}/edit`),

  create: (quiz: CreateQuizDto) => api.post<QuizDto>('/quizzes', quiz),

  update: (id: number, quiz: CreateQuizDto) => api.put<void>(`/quizzes/${id}`, quiz),

  remove: (id: number) => api.delete(`/quizzes/${id}`),
};
