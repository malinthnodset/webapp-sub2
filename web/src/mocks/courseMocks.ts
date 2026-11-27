//Mock courses used before CourseAPIController exists.

import type { CourseDto } from '../types/course';

export const mockCourses: CourseDto[] = [
  { id: 1, code: 'TEST1001', name: 'Test course' },
  { id: 2, code: 'ITPE3200', name: 'Web applications' },
];