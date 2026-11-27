// api.ts — the ONE place in the app that calls fetch().
// All other services (courseService, authService, ...) use these helpers,
// so base URL, JSON, the login token and error handling are written only once.

// "/api" is forwarded to the ASP.NET API by the proxy in vite.config.ts.
// VITE_API_URL can override it (e.g. "https://my-api.azurewebsites.net/api") without code changes.
const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const TOKEN_KEY = 'token';

// Our own error type, so components can show a message and check the status code.
export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// --- Token helpers (used by authService after login/logout) ---
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// --- The fetch wrapper ---
// <T> = the type we expect back, e.g. request<CourseDto[]>('/courses')
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};

  // Send JSON only when there is a body
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  // If the user is logged in, send the token so [Authorize] endpoints accept us
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(BASE_URL + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch only throws when the server can't be reached at all (API not running, no network)
    throw new ApiError(0, 'Could not reach the server. Is the API running?');
  }

  // 401 = not logged in / token expired → remove token and send the user to login
  if (response.status === 401) {
    clearToken();
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new ApiError(401, 'You need to log in.');
  }

  // Any other error (400, 403, 404, 500 ...)
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  // 204 No Content (typical for PUT/DELETE) has no body to parse
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

// Tries to get a useful message out of an error response from ASP.NET.
// ASP.NET validation errors look like: { title: "...", errors: { Name: ["Name is required"] } }
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data.errors) {
      // Join all validation messages into one string
      return Object.values(data.errors).flat().join(' ');
    }
    return data.message ?? data.title ?? `Request failed (${response.status})`;
  } catch {
    // Body was not JSON
    return `Request failed (${response.status})`;
  }
}

// Short, readable helpers the other services use
export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T = void>(path: string) => request<T>('DELETE', path),
};
