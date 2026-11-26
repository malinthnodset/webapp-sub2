// authService — login, register and logout.
// Saves the token through the helpers in api.ts, so every later request is sent logged in.

import { api, setToken, clearToken, getToken } from './api';
import type { AuthResponseDto, LoginDto, RegisterDto } from '../types/auth';

export const authService = {
  async login(data: LoginDto): Promise<AuthResponseDto> {
    const result = await api.post<AuthResponseDto>('/auth/login', data);
    setToken(result.token);
    return result;
  },

  register: (data: RegisterDto) => api.post<void>('/auth/register', data),

  logout(): void {
    clearToken();
  },

  isLoggedIn: (): boolean => getToken() !== null,
};
