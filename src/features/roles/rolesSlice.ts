'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  changeRoleStatus,
  createRole,
  deleteRole,
  fetchRoleById,
  fetchRoleModules,
  fetchRoleOperations,
  fetchRoles,
  updateRole,
} from './rolesThunks';
import type { RoleDetail, RoleListFilters, RoleListItem, RoleListSort, RolesState } from './types';

const initialState: RolesState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    search: '',
    filters: {
      scope: null,
      status: null,
      isSystem: null,
    },
    sorts: [{ field: 'created_at', direction: 'desc' }],
  },
  detail: {
    item: null,
    status: 'idle',
    error: null,
    currentRoleId: null,
  },
  catalogs: {
    modules: [],
    operations: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    changeStatusStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    lastCreatedRoleId: null,
    currentRoleId: null,
    message: null,
  },
};

function upsertRole(items: RoleListItem[], role: RoleDetail) {
  const index = items.findIndex((item) => item.roleId === role.roleId);

  if (index >= 0) {
    items[index] = role;
    return;
  }

  items.unshift(role);
}

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    resetRolesState() {
      return initialState;
    },
    resetRoleDetail(state) {
      state.detail = {
        item: null,
        status: 'idle',
        error: null,
        currentRoleId: null,
      };
    },
    resetRoleMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        changeStatusStatus: 'idle',
        deleteStatus: 'idle',
        error: null,
        lastCreatedRoleId: null,
        currentRoleId: null,
        message: null,
      };
    },
    setRolesSearch(state, action: PayloadAction<string>) {
      state.list.search = action.payload;
    },
    setRolesFilters(state, action: PayloadAction<Partial<RoleListFilters>>) {
      state.list.filters = {
        ...state.list.filters,
        ...action.payload,
      };
    },
    setRolesSorts(state, action: PayloadAction<RoleListSort[]>) {
      state.list.sorts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.error = null;
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los roles';
      })
      .addCase(fetchRoleById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentRoleId = action.meta.arg.roleId;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.error = null;
        state.detail.item = action.payload;
        state.detail.currentRoleId = action.payload.roleId;
        upsertRole(state.list.items, action.payload);
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el rol';
      })
      .addCase(fetchRoleModules.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchRoleModules.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.error = null;
        state.catalogs.modules = action.payload;
      })
      .addCase(fetchRoleModules.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los módulos del rol';
      })
      .addCase(fetchRoleOperations.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchRoleOperations.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.error = null;
        state.catalogs.operations = action.payload;
      })
      .addCase(fetchRoleOperations.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las operaciones del rol';
      })
      .addCase(createRole.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.lastCreatedRoleId = null;
        state.mutations.currentRoleId = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.error = null;
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedRoleId = action.payload.role.roleId;
        upsertRole(state.list.items, action.payload.role);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el rol';
      })
      .addCase(updateRole.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRoleId = action.meta.arg.roleId;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.error = null;
        state.mutations.message = action.payload.message;
        state.mutations.currentRoleId = action.payload.role.roleId;
        upsertRole(state.list.items, action.payload.role);
        if (state.detail.currentRoleId === action.payload.role.roleId) {
          state.detail.item = action.payload.role;
          state.detail.status = 'succeeded';
          state.detail.error = null;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el rol';
      })
      .addCase(changeRoleStatus.pending, (state, action) => {
        state.mutations.changeStatusStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRoleId = action.meta.arg.roleId;
      })
      .addCase(changeRoleStatus.fulfilled, (state, action) => {
        state.mutations.changeStatusStatus = 'succeeded';
        state.mutations.error = null;
        state.mutations.message = action.payload.message;
        state.mutations.currentRoleId = action.payload.role.roleId;
        upsertRole(state.list.items, action.payload.role);
        if (state.detail.currentRoleId === action.payload.role.roleId) {
          state.detail.item = action.payload.role;
          state.detail.status = 'succeeded';
          state.detail.error = null;
        }
      })
      .addCase(changeRoleStatus.rejected, (state, action) => {
        state.mutations.changeStatusStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el estado del rol';
      })
      .addCase(deleteRole.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRoleId = action.meta.arg.roleId;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.error = null;
        state.mutations.message = action.payload.message;
        state.mutations.currentRoleId = action.payload.roleId;
        state.list.items = state.list.items.filter((item) => item.roleId !== action.payload.roleId);
        if (state.detail.currentRoleId === action.payload.roleId) {
          state.detail.item = null;
        }
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el rol';
      });
  },
});

export const {
  resetRolesState,
  resetRoleDetail,
  resetRoleMutations,
  setRolesFilters,
  setRolesSearch,
  setRolesSorts,
} = rolesSlice.actions;

export default rolesSlice.reducer;
