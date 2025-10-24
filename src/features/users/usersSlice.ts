import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { fetchUsers, fetchUserRoles } from './usersThunks';
import type { UserRole } from '@/features/users/roles';

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
  roles: {
    items: UserRoleInfo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

export interface UserRoleInfo {
  id: UserRole;
  rawId: string;
  name: string;
  description: string | null;
  rank: number | null;
}

const initialState: UsersState = {
  entities: [],
  status: 'idle',
  error: null,
  pagination: null,
  roles: {
    items: [],
    status: 'idle',
    error: null,
  },
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
      })
      .addCase(fetchUserRoles.pending, (state) => {
        state.roles.status = 'loading';
        state.roles.error = null;
      })
      .addCase(fetchUserRoles.fulfilled, (state, action) => {
        state.roles.status = 'succeeded';
        state.roles.items = action.payload;
      })
      .addCase(fetchUserRoles.rejected, (state, action) => {
        state.roles.status = 'failed';
        state.roles.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los roles disponibles';
      });
  },
});

export const { addUser, resetUsersState } = usersSlice.actions;
export default usersSlice.reducer;
