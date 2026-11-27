// courseService — all HTTP calls for courses.
// Components call these functions and never use fetch() or URLs directly
// (this is the "client-side API service layer" from the requirements).

import { api } from './api';
import type { CourseDto, CreateCourseDto } from '../types/course';
import { mockCourses } from '../mocks/courseMocks';

const USE_MOCK = true; // TODO: set to false when CourseAPIController exists

export const courseService = {
  // GET /api/courses: all courses (mock data until the API endpoint exists)
  getAll: (): Promise<CourseDto[]> =>
    USE_MOCK ? Promise.resolve(mockCourses) : api.get<CourseDto[]>('/courses'),

  getById: (id: number) => api.get<CourseDto>(`/courses/${id}`),

  create: (course: CreateCourseDto) => api.post<CourseDto>('/courses', course),

  update: (id: number, course: CreateCourseDto) => api.put<void>(`/courses/${id}`, course),

  remove: (id: number) => api.delete(`/courses/${id}`),
};
