// Auth DTOs — what we send to and get back from /api/auth/...

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

// The API answers a successful login with a JWT token and some info about the user
export interface AuthResponseDto {
  token: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER'; // same values as the Role enum in Subapp 1
}
