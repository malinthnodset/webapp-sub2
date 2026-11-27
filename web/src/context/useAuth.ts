// useAuth — the custom hook every component uses to read the login state (Demo 10: "The Consumer").
// Example:  const { user, isTeacher, logout } = useAuth();

import { useContext } from 'react';
import { AuthContext, type AuthContextType } from './AuthContext';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}