// courseService — all HTTP requests for courses (Demo 8: ItemService.tsx).
// Pages import it as   import * as courseService from '../services/courseService';
// and only call functions like courseService.deleteCourse(id). They never use fetch() themselves.
// Delete/create/update send the JWT token (getAuthHeaders), because the API only lets teachers do that.

import { API_URL, ApiError, getAuthHeaders, handleResponse, mockDelay } from './api';
import type { CourseDto, CreateCourseDto } from '../types/course';
import { mockCourses } from '../mocks/courseMocks';

const USE_MOCK = false; // TODO: set to false when the /api/courses endpoints exist in the API

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
// Course codes must be unique. The API should check this too and answer 400 with this message.
function checkUniqueCode(code: string, ignoreId?: number) {
  const taken = mockCourses.some((c) => c.code === code && c.id !== ignoreId);
  if (taken) throw new ApiError(400, `A course with code ${code} already exists.`);
}

// POST /api/courses → the new course (with the id the database gave it)
export async function createCourse(course: CreateCourseDto): Promise<CourseDto> {
  if (USE_MOCK) {
    checkUniqueCode(course.code);
    const newCourse: CourseDto = { id: Math.max(0, ...mockCourses.map((c) => c.id)) + 1, ...course };
    mockCourses.push(newCourse);
    return mockDelay(newCourse);
  }

  const response = await fetch(`${API_URL}/api/courses`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(course),
  });
  return handleResponse<CourseDto>(response);
}
// GET /api/courses/{id} → one course. courseId is a string because it comes from the URL (useParams).
export async function fetchCourseById(courseId: string): Promise<CourseDto> {
  if (USE_MOCK) {
    const course = mockCourses.find((c) => c.id === Number(courseId));
    if (!course) throw new ApiError(404, 'Course not found.');
    return mockDelay({ ...course });
  }

  const response = await fetch(`${API_URL}/api/courses/${courseId}`, { headers: getAuthHeaders() });
  return handleResponse<CourseDto>(response);
}

// PUT /api/courses/{id} → 204 No Content
export async function updateCourse(courseId: number, course: CreateCourseDto): Promise<void> {
  if (USE_MOCK) {
    const existing = mockCourses.find((c) => c.id === courseId);
    if (!existing) throw new ApiError(404, 'Course not found.');
    checkUniqueCode(course.code, courseId); // its own code doesn't count as taken
    existing.code = course.code;
    existing.name = course.name;
    return mockDelay(undefined);
  }

  const response = await fetch(`${API_URL}/api/courses/${courseId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(course),
  });
  return handleResponse<void>(response);
}