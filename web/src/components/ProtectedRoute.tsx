// ProtectedRoute — the gatekeeper for pages that need login (Demo 10: ProtectedRoute.tsx).
// It is the React version of [Authorize] and [Authorize(Roles = "TEACHER")] in Subapp 1.
// NOTE: this only hides pages in the browser. The API must ALSO check the token and the role.

import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../context/useAuth';
import type { Role } from '../types/auth';

interface ProtectedRouteProps {
  role?: Role; // optional: only this role may see the pages, e.g. role="TEACHER"
}

export default function ProtectedRoute({ role }: ProtectedRouteProps) {
  const { token, user } = useAuth();
  const location = useLocation();

  if (!token) {
    // Redirect them to the /login page, but save the page they were trying to go to.
    // LoginPage sends them back there after they log in (like ReturnUrl in Subapp 1).
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Logged in, but the wrong role (e.g. a student on a teacher page)
  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />; // the actual page they asked for
}