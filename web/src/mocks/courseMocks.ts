// Mock courses and dashboard data, used until /api/courses and /api/dashboard exist.
// Works like a tiny database: courseService adds, changes and removes courses in this list,
// so new courses also show up on the dashboard. Everything resets when the page reloads.

import type { CourseDto } from '../types/course';
import type { DashboardQuizDto } from '../types/dashboard';

export const mockCourses: CourseDto[] = [
  { id: 1, code: 'ITPE3200', name: 'Web applications' },
  { id: 2, code: 'DATA1700', name: 'Web programming' },
  { id: 3, code: 'DAVE3600', name: 'App development' },
];

// Quizzes per course id, with made-up progress for the logged-in student
export const mockQuizzesByCourse: Record<number, DashboardQuizDto[]> = {
  1: [
    { id: 1, title: 'MVC basics', questionCount: 4, bestPercentage: 75, attemptCount: 2 },
    { id: 2, title: 'Entity Framework', questionCount: 5, bestPercentage: 40, attemptCount: 1 },
    { id: 3, title: 'React and SPA', questionCount: 6, bestPercentage: 0, attemptCount: 0 },
  ],
  2: [
    { id: 4, title: 'HTML and CSS', questionCount: 5, bestPercentage: 100, attemptCount: 1 },
    { id: 5, title: 'JavaScript', questionCount: 4, bestPercentage: 80, attemptCount: 3 },
  ],
  3: [],
};