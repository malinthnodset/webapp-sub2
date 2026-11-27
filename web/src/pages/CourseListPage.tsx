// CourseListPage — the teacher's list of all courses: Read + Delete (Demo 7 and 8: ItemListPage.tsx).
// Create (step 8) and Update (step 9) get their own pages; this page will link to them.

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import CourseTable from '../components/CourseTable';
import type { CourseDto } from '../types/course';
import * as courseService from '../services/courseService';

export default function CourseListPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const queryClient = useQueryClient();

  // Read: TanStack Query fetches the courses and caches them under ['courses']
  const { data: courses = [], isLoading, error, refetch } = useQuery<CourseDto[], Error>({
    queryKey: ['courses'],
    queryFn: courseService.fetchCourses,
  });

  // Delete: a mutation, because it changes data on the server
  const deleteMutation = useMutation({
    mutationFn: courseService.deleteCourse,
    onSuccess: () => {
      // These cached lists are now out of date → TanStack Query fetches them again
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleCourseDeleted = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    const confirmDelete = window.confirm(`Are you sure you want to delete the course ${course?.code}?`);
    if (confirmDelete) {
      deleteMutation.mutate(courseId);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div>
      <h1>Manage courses</h1>

      <div className="d-flex gap-2 mb-3">
        <Button onClick={() => refetch()} variant="secondary" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Refresh courses'}
        </Button>
      </div>

      <Form.Group className="mb-3" controlId="courseSearch">
        <Form.Control
          type="search"
          placeholder="Search by code or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Form.Group>

      {error && <Alert variant="danger">Could not load the courses: {error.message}</Alert>}
      {deleteMutation.error && <Alert variant="danger">Could not delete: {deleteMutation.error.message}</Alert>}

      {isLoading ? (
        <Spinner animation="border" role="status" className="d-block mx-auto" />
      ) : filteredCourses.length === 0 ? (
        <p className="text-muted">{searchQuery ? 'No courses match your search.' : 'There are no courses yet.'}</p>
      ) : (
        <CourseTable courses={filteredCourses} onCourseDeleted={handleCourseDeleted} />
      )}
    </div>
  );
}