// LoginPage — the login form (Demo 10: LoginPage.tsx).
// It calls login() from AuthContext, which calls authService and saves the token.

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
// Set by ProtectedRoute (step 6: the page the user wanted) or by RegisterPage (a success message)
  const state = location.state as { from?: string; message?: string } | null;

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the browser from reloading the page
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      // Go back to the page the user wanted, or to the dashboard
      navigate(state?.from ?? '/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '500px' }}>
      <h1>Log in</h1>
      {state?.message && <Alert variant="success">{state.message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formLoginEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formLoginPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Logging in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
      </Form>

      <p className="mt-3">
        No account yet? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}