// LoginPage — a controlled form: React state holds what is typed in the inputs.

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault(); // stop the browser from reloading the page

    // Client-side validation (the API must validate too!)
    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }

    try {
      await authService.login({ email, password });
      navigate('/courses');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div>
      <h1>Log in</h1>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input id="email" type="email" className="form-control"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input id="password" type="password" className="form-control"
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-dark">Log in</button>
      </form>
    </div>
  );
}

export default LoginPage;
