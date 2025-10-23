import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthUser } from './authSlice';

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = createAsyncThunk<AuthUser, LoginPayload>('auth/login', async (_payload) => {
  // TODO: replace with real API integration
  throw new Error('Login thunk not implemented yet');
});

export const fetchCurrentUser = createAsyncThunk<AuthUser>('auth/fetchCurrentUser', async () => {
  // TODO: replace with real API integration
  throw new Error('fetchCurrentUser thunk not implemented yet');
});
