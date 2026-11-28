// RegisterPage — the registration form (Demo 10: RegisterPage.tsx).
// Registering does NOT log you in: the API only saves the user, and you log in afterwards.

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import * as authService from '../services/authService';
import type { RegisterDto } from '../types/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterDto>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  // One function for every field: the input's "name" decides which value in formData changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => { // After success: wait 2 seconds, then go to the login page
    let timerId: ReturnType<typeof setTimeout>;
    if (success) {
      timerId = setTimeout(() => {
        navigate('/login', { state: { message: 'Account created! You can log in now.' } });
      }, 2000);
    }
    return () => clearTimeout(timerId); // clean up if the user leaves the page before the timer ends
  }, [success, navigate]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation the browser can't do on its own: the two passwords must be the same
    if (formData.password !== formData.confirmPassword) {
      setError('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register(formData);
      setSuccess('Registration successful! Redirecting to login...');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const locked = isSubmitting || !!success; // lock the form while sending, and after success

  return (
    <div className="mx-auto" style={{ maxWidth: '500px' }}>
      <h1>Register</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formRegisterName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}
            disabled={locked} required minLength={2} maxLength={100}
            title="Your name must be at least 2 characters." />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}
            disabled={locked} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" value={formData.password} onChange={handleChange}
            disabled={locked} required minLength={6}
            title="The password must be at least 6 characters." />
          <Form.Text>At least 6 characters.</Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterConfirmPassword">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control type="password" name="confirmPassword" value={formData.confirmPassword}
            onChange={handleChange} disabled={locked} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formRegisterRole">
          <Form.Label>I am a</Form.Label>
          <Form.Select name="role" value={formData.role} onChange={handleChange} disabled={locked}>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={locked}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Registering...
            </>
          ) : (
            'Register'
          )}
        </Button>
      </Form>

      <p className="mt-3">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}