import baseService from './baseService';
import type { AxiosRequestConfig } from 'axios';

interface ApiResponse<T> {
  data: T;
}

const unwrap = <T>(res: { data: ApiResponse<T> }): T => res.data.data;

export const apiService = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    baseService.get<ApiResponse<T>>(url, config).then(unwrap),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    baseService.post<ApiResponse<T>>(url, data, config).then(unwrap),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    baseService.put<ApiResponse<T>>(url, data, config).then(unwrap),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    baseService.patch<ApiResponse<T>>(url, data, config).then(unwrap),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    baseService.delete<ApiResponse<T>>(url, config).then(unwrap),
};

export default apiService;
