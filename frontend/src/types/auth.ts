import type { UserRole } from '@/types/user';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
    status: string;
  };
}
