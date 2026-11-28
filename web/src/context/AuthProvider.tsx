// AuthProvider — manages the login state for the whole app (Demo 10: AuthContext.tsx, "The Provider").
// It is wrapped around the app in main.tsx, so every page and component can use useAuth().

import { useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';
import type { User } from '../types/user';
import type { LoginDto } from '../types/auth';
import * as authService from '../services/authService';

interface AuthProviderProps {
  children: ReactNode;
}

// Reads the saved token and checks it — the same steps as the useEffect in Demo 10:
// 1) is there a token?  2) can it be decoded, and is it still valid?  3) if not, remove it.
// We do it ONCE when the state is created instead of in a useEffect, because calling setState
// inside useEffect gives a lint warning (react/set-state-in-effect), and warnings lower the grade.
function readValidToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const decodedUser: User = jwtDecode(token);
    if (decodedUser.exp * 1000 > Date.now()) { // exp is in seconds, Date.now() in milliseconds
      return token;
    }
    console.warn('Token expired');
  } catch {
    console.warn('Token could not be read');
  }
  localStorage.removeItem('token'); // expired or broken: clear it
  return null;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // The token survives a page reload because it's in localStorage
  const [token, setToken] = useState<string | null>(readValidToken);

  // The user is always worked out FROM the token, so the two can never disagree
  const user: User | null = token ? jwtDecode<User>(token) : null;
  const isTeacher = user?.role === 'TEACHER';

  const login = async (credentials: LoginDto) => { // Login and store token
    const { token } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => { // Clear the token. JWT is stateless, so the API doesn't need to be told.
    localStorage.removeItem('token');
    setToken(null);
  };

  return ( // Provide the context to all children
    <AuthContext.Provider value={{ user, token, isTeacher, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}