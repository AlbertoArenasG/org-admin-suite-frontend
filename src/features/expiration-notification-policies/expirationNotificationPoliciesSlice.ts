import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  createExpirationNotificationPolicy,
  deleteExpirationNotificationPolicy,
  fetchExpirationNotificationPolicies,
  fetchExpirationNotificationPolicyById,
  fetchExpirationNotificationPolicyCatalog,
  fetchExpirationNotificationPolicyOptions,
  updateExpirationNotificationPolicy,
} from './expirationNotificationPoliciesThunks';
import type {
  ExpirationNotificationPoliciesState,
  ExpirationNotificationPolicyDetail,
  ExpirationNotificationPolicyListFilters,
  ExpirationNotificationPolicyListItem,
  ExpirationNotificationPolicyListSort,
} from './types';

const initialFilters: ExpirationNotificationPolicyListFilters = {
  status: null,
};

const initialSorts: ExpirationNotificationPolicyListSort[] = [
  { field: 'created_at', direction: 'desc' },
];

const initialState: ExpirationNotificationPoliciesState = {
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
    currentExpirationNotificationPolicyId: null,
  },
  catalogs: {
    statuses: [],
    anchors: [],
    triggerModes: [],
    repeatUntilValues: [],
    options: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    lastCreatedExpirationNotificationPolicyId: null,
    currentExpirationNotificationPolicyId: null,
    message: null,
  },
};

function upsertListItem(
  items: ExpirationNotificationPolicyListItem[],
  item: ExpirationNotificationPolicyListItem
) {
  const index = items.findIndex(
    (entry) => entry.expirationNotificationPolicyId === item.expirationNotificationPolicyId
  );

  if (index >= 0) {
    items[index] = item;
    return;
  }

  items.unshift(item);
}

function toListItem(
  detail: ExpirationNotificationPolicyDetail
): ExpirationNotificationPolicyListItem {
  return {
    expirationNotificationPolicyId: detail.expirationNotificationPolicyId,
    name: detail.name,
    code: detail.code,
    statusId: detail.statusId,
    statusName: detail.statusName,
    rulesCount: detail.rules.length,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

const expirationNotificationPoliciesSlice = createSlice({
  name: 'expirationNotificationPolicies',
  initialState,
  reducers: {
    resetExpirationNotificationPolicyMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: null,
        lastCreatedExpirationNotificationPolicyId: null,
        currentExpirationNotificationPolicyId: null,
        message: null,
      };
    },
    setExpirationNotificationPolicyDetail(
      state,
      action: PayloadAction<ExpirationNotificationPolicyDetail | null>
    ) {
      state.detail.item = action.payload;
      state.detail.currentExpirationNotificationPolicyId =
        action.payload?.expirationNotificationPolicyId ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpirationNotificationPolicyCatalog.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchExpirationNotificationPolicyCatalog.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.statuses = action.payload.statuses;
        state.catalogs.anchors = action.payload.anchors;
        state.catalogs.triggerModes = action.payload.triggerModes;
        state.catalogs.repeatUntilValues = action.payload.repeatUntilValues;
      })
      .addCase(fetchExpirationNotificationPolicyCatalog.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el catálogo de políticas de notificación por vencimiento';
      })
      .addCase(fetchExpirationNotificationPolicyOptions.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchExpirationNotificationPolicyOptions.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.options = action.payload;
      })
      .addCase(fetchExpirationNotificationPolicyOptions.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las opciones de políticas de notificación por vencimiento';
      })
      .addCase(fetchExpirationNotificationPolicies.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchExpirationNotificationPolicies.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchExpirationNotificationPolicies.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las políticas de notificación por vencimiento';
      })
      .addCase(fetchExpirationNotificationPolicyById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentExpirationNotificationPolicyId =
          action.meta.arg.expirationNotificationPolicyId;
      })
      .addCase(fetchExpirationNotificationPolicyById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.item = action.payload.expirationNotificationPolicy;
        state.detail.currentExpirationNotificationPolicyId =
          action.payload.expirationNotificationPolicy.expirationNotificationPolicyId;
        upsertListItem(state.list.items, toListItem(action.payload.expirationNotificationPolicy));
      })
      .addCase(fetchExpirationNotificationPolicyById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener la política de notificación por vencimiento';
      })
      .addCase(createExpirationNotificationPolicy.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationNotificationPolicyId = null;
      })
      .addCase(createExpirationNotificationPolicy.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedExpirationNotificationPolicyId =
          action.payload.expirationNotificationPolicy.expirationNotificationPolicyId;
        state.mutations.currentExpirationNotificationPolicyId =
          action.payload.expirationNotificationPolicy.expirationNotificationPolicyId;
        upsertListItem(state.list.items, toListItem(action.payload.expirationNotificationPolicy));
      })
      .addCase(createExpirationNotificationPolicy.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear la política de notificación por vencimiento';
      })
      .addCase(updateExpirationNotificationPolicy.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationNotificationPolicyId =
          action.meta.arg.expirationNotificationPolicyId;
      })
      .addCase(updateExpirationNotificationPolicy.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentExpirationNotificationPolicyId =
          action.payload.expirationNotificationPolicy.expirationNotificationPolicyId;
        if (
          state.detail.currentExpirationNotificationPolicyId ===
          action.payload.expirationNotificationPolicy.expirationNotificationPolicyId
        ) {
          state.detail.item = action.payload.expirationNotificationPolicy;
        }
        upsertListItem(state.list.items, toListItem(action.payload.expirationNotificationPolicy));
      })
      .addCase(updateExpirationNotificationPolicy.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar la política de notificación por vencimiento';
      })
      .addCase(deleteExpirationNotificationPolicy.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentExpirationNotificationPolicyId =
          action.meta.arg.expirationNotificationPolicyId;
      })
      .addCase(deleteExpirationNotificationPolicy.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentExpirationNotificationPolicyId =
          action.payload.expirationNotificationPolicyId;
        state.list.items = state.list.items.filter(
          (item) =>
            item.expirationNotificationPolicyId !== action.payload.expirationNotificationPolicyId
        );
        if (
          state.detail.currentExpirationNotificationPolicyId ===
          action.payload.expirationNotificationPolicyId
        ) {
          state.detail.item = null;
        }
      })
      .addCase(deleteExpirationNotificationPolicy.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar la política de notificación por vencimiento';
      });
  },
});

export const { resetExpirationNotificationPolicyMutations, setExpirationNotificationPolicyDetail } =
  expirationNotificationPoliciesSlice.actions;

export default expirationNotificationPoliciesSlice.reducer;
