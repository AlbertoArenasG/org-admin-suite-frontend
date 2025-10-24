import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers } from './usersThunks';

export interface User {
  id: string;
  email: string;
  name: string;
  lastname: string;
  fullName: string;
  role: string;
  roleName: string;
  status: string;
  statusName: string;
  cellPhone?: {
    countryCode: string;
    number: string;
  } | null;
  createdAt: string;
}

export interface UsersState {
  entities: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  } | null;
}

const initialState: UsersState = {
  entities: [],
  status: 'idle',
  error: null,
  pagination: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.entities.push(action.payload);
    },
    resetUsersState(state) {
      state.entities = [];
      state.status = 'idle';
      state.error = null;
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (action.payload) {
          state.entities = action.payload.users;
          state.pagination = action.payload.pagination;
          state.error = null;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la lista de usuarios';
      });
  },
});

export const { addUser, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;
