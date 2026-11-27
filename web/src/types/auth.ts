// Auth DTOs — what we send to and get back from /api/auth/... (Demo 10: "Adding types").
// They match LoginRequestDto, RegisterUserRequestDto and AuthSafeResponseDto in api/DTO/.

// Same values as the Role enum in api/Models/User.cs
export type Role = 'STUDENT' | 'TEACHER';

// C#: LoginRequestDto { Email, Password }
export interface LoginDto {
  email: string;
  password: string;
}

// C#: RegisterUserRequestDto { Name, Email, Password, ConfirmPassword, Role }
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

// C#: AuthSafeResponseDto — the login answer. The token is what matters;
// everything else about the user is read FROM the token with jwtDecode (see types/user.ts).
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
  role: Role;
}