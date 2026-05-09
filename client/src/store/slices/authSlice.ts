import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

export interface AuthState {
  token: string | null;
  user: User | null;
}

const TOKEN_KEY = 'ajt_token';

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  token: readStoredToken(),
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      try {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
      } catch {
        /* ignore */
      }
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
