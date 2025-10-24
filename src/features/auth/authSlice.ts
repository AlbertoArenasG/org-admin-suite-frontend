import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { login } from './authThunks';
import type { AuthUser } from './types';
import { persistAuthToken } from './persistence';

export interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  token: string | null;
  successMessage: string | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  token: null,
  successMessage: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      persistAuthToken(null);
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
      state.hydrated = true;
    },
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
      state.successMessage = null;
    },
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
      persistAuthToken(action.payload);
    },
    markHydrated(state, action: PayloadAction<boolean | undefined>) {
      state.hydrated = action.payload ?? true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
        persistAuthToken(action.payload.token);
        state.error = null;
        state.successMessage = action.payload.message ?? 'La sesión se inició correctamente';
        state.hydrated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible iniciar sesión';
        state.user = null;
        state.token = null;
        state.successMessage = null;
        state.hydrated = true;
      });
  },
});

export const { logout, resetStatus, setAuthToken, markHydrated } = authSlice.actions;
export default authSlice.reducer;
export type { AuthUser } from './types';
