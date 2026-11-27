// CourseTable — shows courses in a table (Demo 4: ItemTable.tsx).
// The action buttons are only shown if the page passes onCourseDeleted (Demo 10: "Hiding UI Elements").

import { Table, Button } from 'react-bootstrap';
import type { CourseDto } from '../types/course';

interface CourseTableProps {
  courses: CourseDto[];
  onCourseDeleted?: (courseId: number) => void; // optional (?): no delete function = no action buttons
}

export default function CourseTable({ courses, onCourseDeleted }: CourseTableProps) {
  return (
    <Table striped bordered hover responsive className="bg-white">
      <thead>
        <tr>
          <th>Code</th>
          <th>Name</th>
          {onCourseDeleted && <th className="text-center">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td><strong>{course.code}</strong></td>
            <td>{course.name}</td>
            {onCourseDeleted && (
              <td className="text-center text-nowrap">
                <Button size="sm" variant="danger" onClick={() => onCourseDeleted(course.id)}>
                  Delete
                </Button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </Table>
  );
}