// WelcomePage — the first page logged-out users see. React version of Views/Welcome/Index.cshtml in Subapp 1.

import { Link, Navigate } from 'react-router';
import { useAuth } from '../context/useAuth';
import './WelcomePage.css';

export default function WelcomePage() {
  const { user } = useAuth();

  // Already logged in → go straight to the dashboard (like WelcomeController in Subapp 1)
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <section className="welcome">
      <h1>Welcome to Study Buddy</h1>

      <p className="welcome__intro">
        Collect cute items for your cat while you practise the course material!
      </p>

      <ul className="welcome__features">
        <li>Take quizzes! Can you get 100%? Σ(ﾟДﾟ)</li>
        <li>Decorate your pet's room while you learn! (･∀･)つ</li>
      </ul>

      <div className="welcome__actions">
        <Link to="/register" className="btn btn-primary">Register</Link>
        <Link to="/login" className="btn btn-outline-dark">Log in</Link>
      </div>
    </section>
  );
}