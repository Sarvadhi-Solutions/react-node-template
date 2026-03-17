export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  role_id: number;
  role_name: string;
  status_id: number;
  status_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserListParams {
  search?: string;
  role_id?: number;
  status_id?: number;
  page?: number;
  page_size?: number;
}

export interface UserListResponse {
  data: User[];
  pagination: { total: number };
}
