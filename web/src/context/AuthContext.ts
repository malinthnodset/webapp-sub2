// AuthContext — the shared "box" with login information (Demo 10: "Understanding the Context design pattern").
// AuthProvider.tsx fills the box, and every component reads it with useAuth().
// This solves "prop drilling": no need to pass the user down through every component.

import { createContext } from 'react';
import type { User } from '../types/user';
import type { LoginDto } from '../types/auth';

// Define the shape of the auth context: what other components can read
export interface AuthContextType {
  user: User | null;     // the decoded token, or null when logged out
  token: string | null;
  isTeacher: boolean;    // shortcut for user?.role === 'TEACHER', used for teacher-only buttons
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);