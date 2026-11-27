// DashboardPage — every course with its quizzes and the student's progress.
// React version of Views/Dashboard/Index.cshtml in Subapp 1.
// First version: only shows the data. Step 10 adds search, filters and teacher/student buttons.

import { useQuery } from '@tanstack/react-query';
import { Alert, Badge, Spinner } from 'react-bootstrap';
import * as dashboardService from '../services/dashboardService';
import { isQuizCompleted, type DashboardCourseDto } from '../types/dashboard';
import './DashboardPage.css';

export default function DashboardPage() {
  // Server data: TanStack Query fetches it, caches it under ['dashboard'], and gives us isLoading/error
  const { data: courses = [], isLoading, error } = useQuery<DashboardCourseDto[], Error>({
    queryKey: ['dashboard'],
    queryFn: dashboardService.fetchDashboard,
  });

  if (isLoading) {
    return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  }

  return (
    <div>
      <h1 className="mb-3">My courses</h1>

      {error && <Alert variant="danger">Could not load your courses: {error.message}</Alert>}

      {courses.map((course) => {
        const allCompleted = course.quizzes.length > 0 && course.quizzes.every(isQuizCompleted);
        return (
          // <details> = a built-in open/close box (no JavaScript needed), like the course modules in Subapp 1
          <details key={course.id} className="dashboard-course">
            <summary className="dashboard-course__title">
              <span className="flex-grow-1"><strong>{course.code}</strong> {course.name}</span>
              <Badge bg="secondary">{course.quizzes.length} {course.quizzes.length === 1 ? 'quiz' : 'quizzes'}</Badge>
              {allCompleted ? (
                <Badge bg="success" title="All quizzes completed">✓</Badge>
              ) : (
                <Badge bg="danger" title="Not all quizzes completed">✗</Badge>
              )}
            </summary>

            <ul className="list-group list-group-flush">
              {course.quizzes.map((quiz) => (
                <li key={quiz.id} className="list-group-item d-flex align-items-center gap-3">
                  <span className="flex-grow-1">{quiz.title}</span>
                  <Badge bg="light" text="dark" className="border">{quiz.questionCount} questions</Badge>

                  {quiz.attemptCount > 0 ? (
                    <span className="small text-muted">
                      Best {quiz.bestPercentage}% · {quiz.attemptCount} attempt{quiz.attemptCount === 1 ? '' : 's'}
                    </span>
                  ) : (
                    <span className="small text-muted">Not started</span>
                  )}
                </li>
              ))}

              {course.quizzes.length === 0 && <li className="list-group-item text-muted">No quizzes yet</li>}
            </ul>
          </details>
        );
      })}
    </div>
  );
}