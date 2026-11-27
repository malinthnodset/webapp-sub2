// authService — all API calls for logging in and registering (Demo 10: AuthService.ts).
// Pages don't call login() here directly: they use login() from AuthContext,
// which calls this service AND saves the token.

import { API_URL, ApiError, handleResponse, mockDelay } from './api';
import type { AuthResponse, LoginDto } from '../types/auth';
import { createMockToken, mockUsers } from '../mocks/authMocks';

const USE_MOCK = true; // TODO: set to false when /api/auth/login and /api/auth/register exist in the API

// POST /api/auth/login → { token, name, email, role } or 401
export async function login(credentials: LoginDto): Promise<AuthResponse> {
  if (USE_MOCK) {
    // Fake login: look for a user with this email and password in mocks/authMocks.ts
    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.password === credentials.password,
    );
    if (!user) throw new ApiError(401, 'Wrong email or password.');
    return mockDelay({ token: createMockToken(user), name: user.name, email: user.email, role: user.role });
  }

  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  // Wrong email or password gives 401. Show a friendly message instead of sending the user to /login.
  if (response.status === 401) {
    throw new ApiError(401, 'Wrong email or password');
  }
  return handleResponse<AuthResponse>(response);
}