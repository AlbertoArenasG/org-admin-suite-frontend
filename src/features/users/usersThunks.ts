import { createAsyncThunk } from '@reduxjs/toolkit';
import type { User } from './usersSlice';

export const fetchUsers = createAsyncThunk<User[]>('users/fetchAll', async () => {
  // TODO: replace with API call
  throw new Error('fetchUsers thunk not implemented yet');
});

export const inviteUser = createAsyncThunk<User, { email: string }>('users/invite', async () => {
  // TODO: replace with API call
  throw new Error('inviteUser thunk not implemented yet');
});
