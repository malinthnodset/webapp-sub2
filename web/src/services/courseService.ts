// courseService — all HTTP calls for courses.
// Components call these functions and never use fetch() or URLs directly
// (this is the "client-side API service layer" from the requirements).

import { api } from './api';
import type { CourseDto, CreateCourseDto } from '../types/course';

export const courseService = {
  getAll: () => api.get<CourseDto[]>('/courses'),

  getById: (id: number) => api.get<CourseDto>(`/courses/${id}`),

  create: (course: CreateCourseDto) => api.post<CourseDto>('/courses', course),

  update: (id: number, course: CreateCourseDto) => api.put<void>(`/courses/${id}`, course),

  remove: (id: number) => api.delete(`/courses/${id}`),
};
