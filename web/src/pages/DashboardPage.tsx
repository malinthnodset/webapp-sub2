// DashboardPage — every course with its quizzes and the student's progress.
// React version of Views/Dashboard/Index.cshtml in Subapp 1, with search and filtering on
// THREE parameters at once (Demo 4: "Filtering content", extended from one search box to three filters).

import { useState } from 'react';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { Form, Button, Alert, Badge, Spinner, Row, Col } from 'react-bootstrap';
import * as dashboardService from '../services/dashboardService';
import { useAuth } from '../context/useAuth';
import { isQuizCompleted, type DashboardCourseDto, type DashboardQuizDto } from '../types/dashboard';
import './DashboardPage.css';

type StatusFilter = 'all' | 'completed' | 'in-progress' | 'not-started';

export default function DashboardPage() {
  const { isTeacher } = useAuth();

  // The three filters: plain useState, because they are only UI state (Demo 5: "searchQuery state")
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courseFilter, setCourseFilter] = useState<string>('all');   // 'all' or a course id
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Server data: TanStack Query fetches it, caches it under ['dashboard'], and gives us isLoading/error
  const { data: courses = [], isLoading, error, refetch } = useQuery<DashboardCourseDto[], Error>({
    queryKey: ['dashboard'],
    queryFn: dashboardService.fetchDashboard,
  });

  // Does a quiz match the chosen status?
  const matchesStatus = (quiz: DashboardQuizDto) => {
    if (statusFilter === 'completed') return isQuizCompleted(quiz);
    if (statusFilter === 'in-progress') return quiz.attemptCount > 0 && !isQuizCompleted(quiz);
    if (statusFilter === 'not-started') return quiz.attemptCount === 0;
    return true; // 'all'
  };

  // ---------- The filtering: all three filters work together ----------
  const query = searchQuery.trim().toLowerCase();
  const filteredCourses = courses
    // 1) Course dropdown: keep one course, or all of them
    .filter((course) => courseFilter === 'all' || course.id === Number(courseFilter))
    // 2) Search text and status: keep only the quizzes that match both
    .map((course) => {
      // If the course code or name matches the search, all its quizzes count as matching the text
      const courseMatches =
        course.code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query);
      const quizzes = course.quizzes.filter(
        (quiz) => (courseMatches || quiz.title.toLowerCase().includes(query)) && matchesStatus(quiz),
      );
      return { ...course, quizzes, courseMatches };
    })
    // 3) Hide courses with nothing left to show
    .filter((course) => course.quizzes.length > 0 || (course.courseMatches && statusFilter === 'all'));

  const filtersUsed = query !== '' || courseFilter !== 'all' || statusFilter !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setCourseFilter('all');
    setStatusFilter('all');
  };

  if (isLoading) {
    return <Spinner animation="border" role="status" className="d-block mx-auto" />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">My courses</h1>
        {/* Only teachers can create courses and quizzes (conditional rendering with &&) */}
        {isTeacher && (
          <div className="d-flex gap-2">
            <Link to="/quizzes/new" className="btn btn-outline-primary">+ New quiz</Link>
            <Link to="/coursescreate" className="btn btn-primary">+ New course</Link>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="danger">
          Could not load your courses: {error.message}{' '}
          <Button variant="link" className="p-0 align-baseline" onClick={() => refetch()}>Try again</Button>
        </Alert>
      )}

      {/* ---------- Search and filters ---------- */}
      <Form className="dashboard-filters" role="search" onSubmit={(e) => e.preventDefault()}>
        <Row className="g-3 align-items-end">
          <Col md={4}>
            <Form.Group controlId="searchQuery">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                placeholder="Course code, course name or quiz"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="courseFilter">
              <Form.Label>Course</Form.Label>
              <Form.Select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)}>
                <option value="all">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.code}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group controlId="statusFilter">
              <Form.Label>Status</Form.Label>
              <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}>
                <option value="all">All quizzes</option>
                <option value="completed">Completed (60%+)</option>
                <option value="in-progress">In progress (under 60%)</option>
                <option value="not-started">Not started</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            {/* The Reset button only appears when a filter is in use */}
            {filtersUsed && <Button variant="outline-dark" className="w-100" onClick={resetFilters}>Reset</Button>}
          </Col>
        </Row>
      </Form>

      {/* ---------- The courses ---------- */}
      {filteredCourses.length === 0 && !error ? (
        <p className="text-muted">
          {filtersUsed ? 'No courses or quizzes match your search.' : 'There are no courses yet.'}
        </p>
      ) : (
        filteredCourses.map((course) => {
          const allCompleted = course.quizzes.length > 0 && course.quizzes.every(isQuizCompleted);
          return (
            // <details> = a built-in open/close box (no JavaScript needed), like the course modules in Subapp 1.
            // It opens automatically while filtering, so you see what matched.
            <details key={course.id} className="dashboard-course" open={filtersUsed}>
              <summary className="dashboard-course__title">
                <span className="flex-grow-1"><strong>{course.code}</strong> {course.name}</span>
                <Badge bg="secondary">{course.quizzes.length} {course.quizzes.length === 1 ? 'quiz' : 'quizzes'}</Badge>
                {allCompleted ? (
                  <Badge bg="success" title="All quizzes completed">✓</Badge>
                ) : (
                  <Badge bg="danger" title="Not all quizzes completed">✗</Badge>
                )}
              </summary>

              {isTeacher && (
                <div className="p-2">
                  <Link to={`/coursesupdate/${course.id}`} className="btn btn-sm btn-outline-dark">Edit course</Link>
                </div>
              )}

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

                    {/* Students take quizzes. The button text depends on whether they tried before. */}
                    {!isTeacher && (
                      <Link to={`/quizzes/${quiz.id}/take`} className="btn btn-sm btn-primary">
                        {quiz.attemptCount > 0 ? 'Try again' : 'Start'}
                      </Link>
                    )}
                  </li>
                ))}

                {course.quizzes.length === 0 && <li className="list-group-item text-muted">No quizzes yet</li>}
              </ul>
            </details>
          );
        })
      )}
    </div>
  );
}