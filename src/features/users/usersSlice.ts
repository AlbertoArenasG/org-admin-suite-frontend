import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUsers,
  fetchUserRoles,
  fetchUserById,
  updateUser,
  inviteUser,
  deleteUser,
} from './usersThunks';
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
  detail: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentId: string | null;
  };
  update: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    currentId: string | null;
    message: string | null;
  };
  roles: {
    items: UserRoleInfo[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  delete: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    targetId: string | null;
    message: string | null;
  };
}

export interface UserRoleInfo {
  id: string;
  normalizedId: UserRole;
  name: string;
  description: string | null;
  rank: number | null;
}

const initialState: UsersState = {
  entities: [],
  status: 'idle',
  error: null,
  pagination: null,
  detail: {
    status: 'idle',
    error: null,
    currentId: null,
  },
  update: {
    status: 'idle',
    error: null,
    currentId: null,
    message: null,
  },
  roles: {
    items: [],
    status: 'idle',
    error: null,
  },
  delete: {
    status: 'idle',
    error: null,
    targetId: null,
    message: null,
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
      state.detail = {
        status: 'idle',
        error: null,
        currentId: null,
      };
      state.update = {
        status: 'idle',
        error: null,
        currentId: null,
        message: null,
      };
      state.delete = {
        status: 'idle',
        error: null,
        targetId: null,
        message: null,
      };
    },
    resetUserUpdateState(state) {
      state.update = {
        status: 'idle',
        error: null,
        currentId: null,
        message: null,
      };
    },
    resetDeleteState(state) {
      state.delete = {
        status: 'idle',
        error: null,
        targetId: null,
        message: null,
      };
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
      })
      .addCase(fetchUserById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentId = action.meta.arg.id;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.error = null;
        const fetchedUser = action.payload.user;
        state.detail.currentId = fetchedUser.id;
        const existingIndex = state.entities.findIndex((user) => user.id === fetchedUser.id);
        if (existingIndex >= 0) {
          state.entities[existingIndex] = fetchedUser;
        } else {
          state.entities.push(fetchedUser);
        }
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el usuario';
        state.detail.currentId = action.meta.arg.id;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.update.status = 'loading';
        state.update.error = null;
        state.update.currentId = action.meta.arg.id;
        state.update.message = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.update.status = 'succeeded';
        state.update.error = null;
        const updatedUser = action.payload.user;
        state.update.currentId = updatedUser.id;
        state.update.message = action.payload.message ?? null;
        const existingIndex = state.entities.findIndex((user) => user.id === updatedUser.id);
        if (existingIndex >= 0) {
          state.entities[existingIndex] = updatedUser;
        } else {
          state.entities.push(updatedUser);
        }
        if (state.detail.currentId === updatedUser.id) {
          state.detail.status = 'succeeded';
          state.detail.error = null;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.update.status = 'failed';
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el usuario';
        state.update.currentId = action.meta.arg.id;
        state.update.message = null;
      })
      .addCase(inviteUser.pending, (state) => {
        state.update.status = 'loading';
        state.update.error = null;
        state.update.message = null;
      })
      .addCase(inviteUser.fulfilled, (state) => {
        state.update.status = 'succeeded';
        state.update.error = null;
        state.update.message = null;
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.update.status = 'failed';
        state.update.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible enviar la invitación';
        state.update.message = null;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.delete.status = 'loading';
        state.delete.error = null;
        state.delete.targetId = action.meta.arg.id;
        state.delete.message = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.delete.status = 'succeeded';
        state.delete.error = null;
        state.delete.targetId = action.payload.userId;
        state.delete.message = action.payload.message;
        state.entities = state.entities.filter((user) => user.id !== action.payload.userId);
        if (state.detail.currentId === action.payload.userId) {
          state.detail = {
            status: 'idle',
            error: null,
            currentId: null,
          };
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.delete.status = 'failed';
        state.delete.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar al usuario';
        state.delete.message = null;
      });
  },
});

export const { addUser, resetUsersState, resetUserUpdateState, resetDeleteState } =
  usersSlice.actions;
export default usersSlice.reducer;
