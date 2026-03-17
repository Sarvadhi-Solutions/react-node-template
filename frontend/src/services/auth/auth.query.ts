import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from './auth.api';
import { toast } from '@/components/ui/toast';
import { getApiErrorMessage } from '@/utils/common-functions';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials, logout } from '@/store/slices/authSlice';
import type { LoginPayload } from '@/types/auth';

export function useLogin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: LoginPayload) => authApi.login(data),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      toast.success('Login successful');
      navigate('/dashboard');
    },
    onError: (err) => {
      toast.error(getApiErrorMessage(err, 'Login failed. Please check your credentials.'));
    },
  });
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      dispatch(logout());
      navigate('/login');
    },
    onError: () => {
      // Force logout even on API error
      dispatch(logout());
      navigate('/login');
    },
  });
}
