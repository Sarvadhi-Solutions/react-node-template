import { apiService } from '@/services/configs/apiService';
import baseService from '@/services/configs/baseService';
import { API_ENDPOINTS } from '@/utils/constants/api.constant';
import type { LoginPayload, LoginResponse } from '@/types/auth';

export const authApi = {
  login: (data: LoginPayload) =>
    baseService
      .post<{ data: LoginResponse }>(API_ENDPOINTS.LOGIN, data)
      .then((res) => res.data.data),

  logout: () => apiService.get<void>(API_ENDPOINTS.LOGOUT),

  me: () => apiService.get<LoginResponse['user']>(API_ENDPOINTS.ME),
};
