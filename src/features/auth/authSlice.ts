import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchCurrentUser, login } from './authThunks';
import { updateMyProfile } from '@/features/myProfile/myProfileThunks';
import type { AuthUser } from './types';
import { persistAuthSession } from './persistence';

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
      persistAuthSession(null, null);
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
      persistAuthSession(action.payload, state.user);
    },
    setAuthSnapshot(state, action: PayloadAction<{ token: string | null; user: AuthUser | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.status = action.payload.token ? 'succeeded' : 'idle';
      state.error = null;
      state.successMessage = null;
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
        persistAuthSession(action.payload.token, action.payload.user);
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
        persistAuthSession(null, null);
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.error = null;
        state.hydrated = true;
        persistAuthSession(state.token, action.payload);
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible recuperar la sesión';
        state.hydrated = true;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            name: action.payload.name,
            lastname: action.payload.lastname,
            cellPhone: action.payload.cellPhone,
          };
          persistAuthSession(state.token, state.user);
        }
      });
  },
});

export const { logout, resetStatus, setAuthToken, setAuthSnapshot, markHydrated } =
  authSlice.actions;
export default authSlice.reducer;
export type { AuthUser } from './types';
