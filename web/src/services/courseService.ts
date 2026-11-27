// courseService — all HTTP requests for courses (Demo 8: ItemService.tsx).
// Pages import it as   import * as courseService from '../services/courseService';
// and only call functions like courseService.deleteCourse(id). They never use fetch() themselves.
// Delete/create/update send the JWT token (getAuthHeaders), because the API only lets teachers do that.

import { API_URL, ApiError, getAuthHeaders, handleResponse, mockDelay } from './api';
import type { CourseDto } from '../types/course';
import { mockCourses } from '../mocks/courseMocks';

const USE_MOCK = true; // TODO: set to false when the /api/courses endpoints exist in the API

// GET /api/courses → all courses
export async function fetchCourses(): Promise<CourseDto[]> {
  if (USE_MOCK) return mockDelay([...mockCourses]); // a copy, so the page can't change the "database"

  const response = await fetch(`${API_URL}/api/courses`, { headers: getAuthHeaders() });
  return handleResponse<CourseDto[]>(response);
}

// DELETE /api/courses/{id} → 204 No Content
export async function deleteCourse(courseId: number): Promise<void> {
  if (USE_MOCK) {
    const index = mockCourses.findIndex((c) => c.id === courseId);
    if (index === -1) throw new ApiError(404, 'Course not found.');
    mockCourses.splice(index, 1); // remove it from the mock "database"
    return mockDelay(undefined);
  }

  const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse<void>(response);
}