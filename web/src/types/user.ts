// User — the information INSIDE the JWT token, read with jwtDecode (Demo 10: types/user.ts).
// The API puts these "claims" in the token when the user logs in.

import type { Role } from './auth';

export interface User {
  sub: string;    // Subject: who the token is about (here: the email)
  email: string;
  nameid: string; // User ID from the database
  name: string;   // Display name, e.g. "Sam Student" (extra claim we added)
  role: Role;     // "STUDENT" or "TEACHER" (ClaimTypes.Role in C# becomes "role" in the token)
  jti: string;    // Unique id for this token
  iat: number;    // Issued at (seconds since 1970)
  exp: number;    // Expires at (seconds since 1970)
  iss: string;    // Issuer: who made the token (the API)
  aud: string;    // Audience: who the token is for (this app)
}