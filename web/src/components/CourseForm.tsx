// CourseForm — ONE form used by both CourseCreatePage and CourseUpdatePage (Demo 6 and 7: ItemForm.tsx).
// The form only collects and checks the input. The page decides what happens with it
// (create or update), and passes down the error and "submitting" status from its useMutation.

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Form, Button, Alert } from 'react-bootstrap';
import type { CreateCourseDto } from '../types/course';

interface CourseFormProps {
  onCourseChanged: (course: CreateCourseDto) => void;
  courseId?: number;                         // set when editing, undefined when creating
  initialValues?: Partial<CreateCourseDto>;  // the current values when editing
  error?: string | null;                     // error from the server, shown in an Alert
  submitting?: boolean;                      // true while the request is in progress
}

export default function CourseForm({
  onCourseChanged,
  courseId,
  initialValues,
  error = null,
  submitting = false,
}: CourseFormProps) {
  const [code, setCode] = useState<string>(initialValues?.code ?? '');
  const [name, setName] = useState<string>(initialValues?.name ?? '');
  const navigate = useNavigate();

  const onCancel = () => {
    navigate(-1); // go back one step in the browser history
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault(); // stop the browser from reloading the page
    // Course codes are saved in capitals without spaces: " itpe3200 " → "ITPE3200"
    const course: CreateCourseDto = { code: code.trim().toUpperCase(), name: name.trim() };
    onCourseChanged(course);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formCourseCode" className="mb-3">
        <Form.Label>Course code</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. ITPE3200"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          // Client-side input validation: the browser checks these before submitting.
          // Same rules as [Required] and [StringLength(10)] in CreateCourseDto.cs
          required
          pattern="\s*[A-Za-z0-9]{2,10}\s*"
          title="The course code must be 2 to 10 letters or numbers, without spaces."
          disabled={submitting}
        />
      </Form.Group>

      <Form.Group controlId="formCourseName" className="mb-3">
        <Form.Label>Course name</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g. Web applications"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={200}
          title="The course name must be between 2 and 200 characters."
          disabled={submitting}
        />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : courseId ? 'Update course' : 'Create course'}
      </Button>
      <Button variant="secondary" onClick={onCancel} className="ms-2" disabled={submitting}>
        Cancel
      </Button>
    </Form>
  );
}