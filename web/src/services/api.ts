// api.ts — shared helpers for ALL services (the API service layer from Demo 8).
// Every service (authService, courseService, quizService ...) builds on these,
// so the base URL, the JSON headers, the JWT token and error handling are written only once.

// From .env.development (Demo 5). Falls back to '' so "/api/..." goes through the Vite proxy.
export const API_URL = import.meta.env.VITE_API_URL ?? '';

// Our own error type, so pages can show the message and check the status code (e.g. 404).
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Helper function to get headers, including the auth token if it exists (Demo 10: "Modifying ItemService").
// The token is saved in localStorage by AuthProvider when the user logs in.
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Checks the response and parses JSON (Demo 8: handleResponse<T>).
// <T> = the type we expect back, e.g. handleResponse<CourseDto[]>(response)
export async function handleResponse<T>(response: Response): Promise<T> {
  // 401 = not logged in or the token has expired → remove the token and go to the login page
  if (response.status === 401) {
    localStorage.removeItem('token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'You need to log in again.');
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  // 204 No Content (typical for PUT/DELETE) has no JSON body. Calling .json() would throw.
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// Gets a readable message out of an ASP.NET error response.
// - ASP.NET Identity errors:  [{ description: "..." }, ...]           (Demo 10: AuthService.register)
// - Validation errors:        { title: "...", errors: { Code: ["..."] } }
// - Our own messages:          "A course with code X already exists"  (e.g. BadRequest("..."))
async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed (status ${response.status})`;
  const text = await response.text();
  if (!text) return fallback;

  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      return data.map((err) => err.description).join(', ') || fallback;
    }
    if (data.errors) {
      return Object.values(data.errors).flat().join(' ');
    }
    return data.message ?? data.title ?? fallback;
  } catch {
    return text; // plain text, e.g. NotFound("Course not found")
  }
}

// Wraps fetch so a stopped API gives a clear message instead of "Failed to fetch"
async function send(path: string, options: RequestInit = {}): Promise<Response> {
  try {
    return await fetch(`${API_URL}/api${path}`, { ...options, headers: getAuthHeaders() });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Is the API running?');
  }
}

// Short helpers used by quizService (and anyone who prefers one-line calls)
export const api = {
  get: async <T>(path: string) => handleResponse<T>(await send(path)),
  post: async <T>(path: string, body: unknown) =>
    handleResponse<T>(await send(path, { method: 'POST', body: JSON.stringify(body) })),
  put: async <T>(path: string, body: unknown) =>
    handleResponse<T>(await send(path, { method: 'PUT', body: JSON.stringify(body) })),
  delete: async <T = void>(path: string) => handleResponse<T>(await send(path, { method: 'DELETE' })),
};

// Simulates the network for mock data: returns the value after 300 ms,
// so loading states ("Loading...", disabled buttons) can be seen and tested.
export function mockDelay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300));
}

// ---------- Old token helpers ----------
// The old authService.ts still uses these three. We delete them in step 3,
// when the new login (AuthProvider) takes over saving and removing the token.
export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function clearToken(): void {
  localStorage.removeItem('token');
}