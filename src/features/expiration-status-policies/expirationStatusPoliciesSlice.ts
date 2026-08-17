import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createExpirationStatusPolicy,
  deleteExpirationStatusPolicy,
  fetchExpirationStatusPolicyById,
  fetchExpirationStatusPolicyCatalog,
  fetchExpirationStatusPolicies,
  fetchExpirationStatusPolicyOptions,
  updateExpirationStatusPolicy,
} from './expirationStatusPoliciesThunks';
import type {
  ExpirationStatusPoliciesState,
  ExpirationStatusPolicyDetail,
  ExpirationStatusPolicyListFilters,
  ExpirationStatusPolicyListItem,
  ExpirationStatusPolicyListSort,
} from './types';

const initialFilters: ExpirationStatusPolicyListFilters = {
  status: null,
};

const initialSorts: ExpirationStatusPolicyListSort[] = [{ field: 'created_at', direction: 'desc' }];

const initialState: ExpirationStatusPoliciesState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    search: '',
    filters: initialFilters,
    sorts: initialSorts,
  },
  detail: {
    item: null,
    status: 'idle',
    error: null,
    currentExpirationStatusPolicyId: null,
  },
  catalogs: {
    statuses: [],
    options: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    lastCreatedExpirationStatusPolicyId: null,
    currentExpirationStatusPolicyId: null,
    message: null,
  },
};

function upsertListItem(
  items: ExpirationStatusPolicyListItem[],
  item: ExpirationStatusPolicyListItem
) {
  const index = items.findIndex(
    (entry) => entry.expirationStatusPolicyId === item.expirationStatusPolicyId
  );

  if (index >= 0) {
    items[index] = item;
    return;
  }

  items.unshift(item);
}

function toListItem(detail: ExpirationStatusPolicyDetail): ExpirationStatusPolicyListItem {
  return {
    expirationStatusPolicyId: detail.expirationStatusPolicyId,
    name: detail.name,
    code: detail.code,
    description: detail.description,
    statusId: detail.statusId,
    statusName: detail.statusName,
    rulesCount: detail.rules.length,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

const expirationStatusPoliciesSlice = createSlice({
  name: 'expirationStatusPolicies',
  initialState,
  reducers: {
    resetExpirationStatusPolicyMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: null,
        lastCreatedExpirationStatusPolicyId: null,
        currentExpirationStatusPolicyId: null,
        message: null,
      };
    },
    setExpirationStatusPolicyDetail(
      state,
      action: PayloadAction<ExpirationStatusPolicyDetail | null>
    ) {
      state.detail.item = action.payload;
      state.detail.currentExpirationStatusPolicyId =
        action.payload?.expirationStatusPolicyId ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpirationStatusPolicyCatalog.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchExpirationStatusPolicyCatalog.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.statuses = action.payload.statuses;
      })
      .addCase(fetchExpirationStatusPolicyCatalog.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el catálogo de políticas de estatus por vencimiento';
      })
      .addCase(fetchExpirationStatusPolicyOptions.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchExpirationStatusPolicyOptions.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.options = action.payload;
      })
      .addCase(fetchExpirationStatusPolicyOptions.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las opciones de políticas de estatus por vencimiento';
      })
      .addCase(fetchExpirationStatusPolicies.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchExpirationStatusPolicies.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchExpirationStatusPolicies.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las políticas de estatus por vencimiento';
      })
      .addCase(fetchExpirationStatusPolicyById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentExpirationStatusPolicyId = action.meta.arg.expirationStatusPolicyId;
      })
      .addCase(fetchExpirationStatusPolicyById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.item = action.payload.expirationStatusPolicy;
        state.detail.currentExpirationStatusPolicyId =
          action.payload.expirationStatusPolicy.expirationStatusPolicyId;
        upsertListItem(state.list.items, toListItem(action.payload.expirationStatusPolicy));
      })
      .addCase(fetchExpirationStatusPolicyById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la política de estatus por vencimiento';
      })
      .addCase(createExpirationStatusPolicy.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationStatusPolicyId = null;
      })
      .addCase(createExpirationStatusPolicy.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedExpirationStatusPolicyId =
          action.payload.expirationStatusPolicy.expirationStatusPolicyId;
        state.mutations.currentExpirationStatusPolicyId =
          action.payload.expirationStatusPolicy.expirationStatusPolicyId;
        upsertListItem(state.list.items, toListItem(action.payload.expirationStatusPolicy));
      })
      .addCase(createExpirationStatusPolicy.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear la política de estatus por vencimiento';
      })
      .addCase(updateExpirationStatusPolicy.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationStatusPolicyId = action.meta.arg.expirationStatusPolicyId;
      })
      .addCase(updateExpirationStatusPolicy.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentExpirationStatusPolicyId =
          action.payload.expirationStatusPolicy.expirationStatusPolicyId;
        if (
          state.detail.currentExpirationStatusPolicyId ===
          action.payload.expirationStatusPolicy.expirationStatusPolicyId
        ) {
          state.detail.item = action.payload.expirationStatusPolicy;
        }
        upsertListItem(state.list.items, toListItem(action.payload.expirationStatusPolicy));
      })
      .addCase(updateExpirationStatusPolicy.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar la política de estatus por vencimiento';
      })
      .addCase(deleteExpirationStatusPolicy.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationStatusPolicyId = action.meta.arg.expirationStatusPolicyId;
      })
      .addCase(deleteExpirationStatusPolicy.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentExpirationStatusPolicyId = action.payload.expirationStatusPolicyId;
        state.list.items = state.list.items.filter(
          (item) => item.expirationStatusPolicyId !== action.payload.expirationStatusPolicyId
        );
        if (
          state.detail.currentExpirationStatusPolicyId === action.payload.expirationStatusPolicyId
        ) {
          state.detail.item = null;
        }
      })
      .addCase(deleteExpirationStatusPolicy.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar la política de estatus por vencimiento';
      });
  },
});

export const { resetExpirationStatusPolicyMutations, setExpirationStatusPolicyDetail } =
  expirationStatusPoliciesSlice.actions;

export default expirationStatusPoliciesSlice.reducer;
