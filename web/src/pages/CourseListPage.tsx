// CourseListPage — example page showing the pattern every page can follow:
// 1) state for data, loading and error
// 2) load data from a service in useEffect
// 3) show loading / error / empty / list with conditional rendering

import { useEffect, useState } from 'react';
import { courseService } from '../services/courseService';
import type { CourseDto } from '../types/course';
import './CourseListPage.css';

function CourseListPage() {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Runs once when the page opens ([] = no dependencies)
  useEffect(() => {
    courseService
      .getAll()
      .then((data) => setCourses(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this course?')) return;
    try {
      await courseService.remove(id);
      // Remove it from the list without reloading everything
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (loading) return <p>Loading courses...</p>;

  return (
    <div>
      <h1>Courses</h1>

      {/* && = only show the alert if there is an error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {courses.length === 0 && !error ? (
        <p>No courses yet.</p>
      ) : (
        <ul className="course-list">
          {courses.map((course) => (
            <li key={course.id} className="course-list__item">
              <span>
                <strong>{course.code}</strong> {course.name}
              </span>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(course.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseListPage;
