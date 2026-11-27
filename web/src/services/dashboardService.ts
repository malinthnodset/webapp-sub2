// dashboardService — the dashboard data: every course with its quizzes and the student's progress.
// Same data as DashboardService.GetDashboardAsync in Subapp 1.

import { API_URL, getAuthHeaders, handleResponse, mockDelay } from './api';
import type { DashboardCourseDto } from '../types/dashboard';
import { mockCourses, mockQuizzesByCourse } from '../mocks/courseMocks';

const USE_MOCK = true; // TODO: set to false when GET /api/dashboard exists in the API

// GET /api/dashboard → courses with quizzes and the logged-in student's progress
export async function fetchDashboard(): Promise<DashboardCourseDto[]> {
  if (USE_MOCK) {
    // Built from the mock course list, so courses you create or delete show up here too
    return mockDelay(mockCourses.map((course) => ({ ...course, quizzes: mockQuizzesByCourse[course.id] ?? [] })));
  }

  const response = await fetch(`${API_URL}/api/dashboard`, { headers: getAuthHeaders() });
  return handleResponse<DashboardCourseDto[]>(response);
}