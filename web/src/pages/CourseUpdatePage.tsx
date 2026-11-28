// CourseUpdatePage — Update (Demo 7 and 8: ItemUpdatePage.tsx).
// First loads the course (useQuery), then shows CourseForm filled in, then saves (useMutation).

import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Alert, Spinner } from 'react-bootstrap';
import CourseForm from '../components/CourseForm';
import type { CourseDto, CreateCourseDto } from '../types/course';
import * as courseService from '../services/courseService';

export default function CourseUpdatePage() {
  const { courseId } = useParams<{ courseId: string }>(); // from the URL: /courseupdate/:courseId
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const courseQuery = useQuery<CourseDto, Error>({
    queryKey: ['courses', courseId], // this one course, separate from the full list ['courses']
    queryFn: () => courseService.fetchCourseById(courseId!),
    enabled: !!courseId, // don't fetch before the id is known
  });

  const mutation = useMutation({
    mutationFn: (course: CreateCourseDto) => courseService.updateCourse(Number(courseId), course),
    onSuccess: () => {
      // ['courses'] also matches ['courses', courseId], because query keys are hierarchical
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/courses');
    },
  });

  if (courseQuery.isLoading) return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  if (courseQuery.isError) return <Alert variant="danger">Failed to load the course: {courseQuery.error.message}</Alert>;
  if (!courseQuery.data) return <p>No course found.</p>;

  return (
    <div className="mx-auto" style={{ maxWidth: '600px' }}>
      <h1>Edit {courseQuery.data.code}</h1>
      <CourseForm
        onCourseChanged={(course) => mutation.mutate(course)}
        courseId={courseQuery.data.id}
        initialValues={courseQuery.data}
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}
      />
    </div>
  );
}