// authService — all API calls for logging in and registering (Demo 10: AuthService.ts).
// Pages don't call login() here directly: they use login() from AuthContext,
// which calls this service AND saves the token. RegisterPage calls register() directly.


import { API_URL, ApiError, handleResponse, mockDelay } from './api';
import type { AuthResponse, LoginDto, RegisterDto } from '../types/auth';
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

// POST /api/auth/register → 200, or 400 with a list of errors from ASP.NET Identity
// (handleResponse joins them into one message, like errorData.map(...).join(', ') in Demo 10)
export async function register(userData: RegisterDto): Promise<void> {
  if (USE_MOCK) {
    // Fake register: refuse an email that is taken, otherwise add the user to mocks/authMocks.ts
    if (mockUsers.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new ApiError(400, `Email '${userData.email}' is already taken.`);
    }
    mockUsers.push({
      id: mockUsers.length + 1,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
    });
    return mockDelay(undefined);
  }

  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse<void>(response);
}