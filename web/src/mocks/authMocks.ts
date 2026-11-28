// Mock users and a fake JWT, used until the API's /api/auth endpoints exist.
// Write the test users in the documentation too, so the examiner can log in.

import type { Role } from '../types/auth';

interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

// New users from the register page are added to this list (it resets when the page reloads)
export const mockUsers: MockUser[] = [
  { id: 1, name: 'Tina Teacher', email: 'teacher@test.no', password: 'Test123!', role: 'TEACHER' },
  { id: 2, name: 'Sam Student', email: 'student@test.no', password: 'Test123!', role: 'STUDENT' },
];

// Base64url = the encoding a JWT uses for its parts
function toBase64Url(value: object): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Builds a token with the SAME claims the real API will send (see types/user.ts).
// It is NOT signed — jwtDecode only reads a token, it never checks the signature.
// That's also why the API must always check the token itself: anyone can make one like this.
export function createMockToken(user: MockUser): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    sub: user.email,
    email: user.email,
    nameid: String(user.id),
    name: user.name,
    role: user.role,
    jti: crypto.randomUUID(),
    iat: now,
    exp: now + 60 * 60, // valid for 1 hour
    iss: 'StudyBuddyApi',
    aud: 'StudyBuddyClient',
  };
  return `${toBase64Url(header)}.${toBase64Url(payload)}.mock-signature`;
}