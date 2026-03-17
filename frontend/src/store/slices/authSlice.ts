import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LoginResponse } from '@/types/auth';
import type { UserRole } from '@/types/user';

interface AuthState {
  token: string | null;
  user: { id: string; email: string; role: UserRole; name: string } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<LoginResponse>) {
      const { id, email, role, name } = action.payload.user;
      state.token = action.payload.token;
      state.user = { id, email, role, name };
      state.isAuthenticated = true;
      localStorage.setItem('accessToken', action.payload.token);
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
