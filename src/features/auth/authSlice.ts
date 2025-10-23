import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

export interface AuthState {
  user: AuthUser | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.status = 'idle';
      state.error = null;
    },
    resetStatus(state) {
      state.status = 'idle';
      state.error = null;
    },
    setAuthToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload;
    },
  },
  extraReducers: () => {
    // register async thunk handlers in future iterations
  },
});

export const { logout, resetStatus, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
