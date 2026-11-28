// CourseCreatePage — Create (Demo 6 and 8: ItemCreatePage.tsx).
// CourseForm collects the input; this page sends it with useMutation and decides what happens next.

import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import CourseForm from '../components/CourseForm';
import * as courseService from '../services/courseService';

export default function CourseCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // gets the SAME instance as in main.tsx, not a new one

  const mutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/courses'); // go to the CourseListPage
    },
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '600px' }}>
      <h1>New course</h1>
      <CourseForm
        onCourseChanged={(course) => mutation.mutate(course)}
        error={mutation.error instanceof Error ? mutation.error.message : null}
        submitting={mutation.isPending}
      />
    </div>
  );
}