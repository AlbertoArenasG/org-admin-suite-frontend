import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createInternalAssetMaintenanceRecord,
  deleteInternalAssetMaintenanceRecord,
  fetchInternalAssetMaintenanceCatalog,
  fetchInternalAssetMaintenanceRecordById,
  fetchInternalAssetMaintenanceRecords,
  sendInternalAssetMaintenanceProviderFollowUp,
  updateInternalAssetMaintenanceRecord,
} from './internalAssetControlThunks';
import type {
  InternalAssetControlState,
  InternalAssetMaintenanceRecordDetail,
  InternalAssetMaintenanceRecordListItem,
  InternalAssetMaintenanceRecordsListFilters,
  InternalAssetMaintenanceRecordsListSort,
} from './types';

const initialFilters: InternalAssetMaintenanceRecordsListFilters = {
  assetMaintenanceType: null,
  status: null,
  expirationStatusPolicyId: null,
  expirationNotificationPolicyId: null,
  sentToProvider: null,
};

const initialSorts: InternalAssetMaintenanceRecordsListSort[] = [
  { field: 'created_at', direction: 'desc' },
];

const initialState: InternalAssetControlState = {
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
    currentRecordId: null,
  },
  catalogs: {
    item: null,
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    providerFollowUpStatus: 'idle',
    error: null,
    message: null,
    currentRecordId: null,
    lastCreatedRecordId: null,
  },
};

function upsertListItem(
  items: InternalAssetMaintenanceRecordListItem[],
  item: InternalAssetMaintenanceRecordListItem
) {
  const index = items.findIndex(
    (entry) => entry.internalAssetMaintenanceRecordId === item.internalAssetMaintenanceRecordId
  );

  if (index >= 0) {
    items[index] = item;
    return;
  }

  items.unshift(item);
}

function toListItem(
  detail: InternalAssetMaintenanceRecordDetail
): InternalAssetMaintenanceRecordListItem {
  return {
    internalAssetMaintenanceRecordId: detail.internalAssetMaintenanceRecordId,
    assetName: detail.assetName,
    assetIdentifier: detail.assetIdentifier,
    assetMaintenanceType: detail.assetMaintenanceType,
    lastMaintenanceAt: detail.lastMaintenanceAt,
    expirationDate: detail.expirationDate,
    statusId: detail.statusId,
    statusName: detail.statusName,
    derivedStatus: detail.derivedStatus,
    expirationStatusPolicy: detail.expirationStatusPolicy,
    expirationNotificationPolicy: detail.expirationNotificationPolicy,
    sentToProvider: detail.sentToProvider,
    providerName: detail.providerName,
    providerLeadTime: detail.providerLeadTime,
    providerFollowUpEnabled: detail.providerFollowUpEnabled,
    providerFollowUpRulesCount: detail.providerFollowUpRulesCount,
    providerFollowUpLastSentAt: detail.providerFollowUpLastSentAt,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

const internalAssetControlSlice = createSlice({
  name: 'internalAssetControl',
  initialState,
  reducers: {
    resetInternalAssetControlMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        providerFollowUpStatus: 'idle',
        error: null,
        message: null,
        currentRecordId: null,
        lastCreatedRecordId: null,
      };
    },
    setInternalAssetControlDetail(
      state,
      action: PayloadAction<InternalAssetMaintenanceRecordDetail | null>
    ) {
      state.detail.item = action.payload;
      state.detail.currentRecordId = action.payload?.internalAssetMaintenanceRecordId ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInternalAssetMaintenanceCatalog.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchInternalAssetMaintenanceCatalog.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.item = action.payload;
      })
      .addCase(fetchInternalAssetMaintenanceCatalog.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el catálogo de control de activos internos';
      })
      .addCase(fetchInternalAssetMaintenanceRecords.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchInternalAssetMaintenanceRecords.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchInternalAssetMaintenanceRecords.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los registros de control de activos internos';
      })
      .addCase(fetchInternalAssetMaintenanceRecordById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentRecordId = action.meta.arg.internalAssetMaintenanceRecordId;
      })
      .addCase(fetchInternalAssetMaintenanceRecordById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.item = action.payload.record;
        state.detail.currentRecordId = action.payload.record.internalAssetMaintenanceRecordId;
        upsertListItem(state.list.items, toListItem(action.payload.record));
      })
      .addCase(fetchInternalAssetMaintenanceRecordById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el registro de control de activos internos';
      })
      .addCase(createInternalAssetMaintenanceRecord.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecordId = null;
      })
      .addCase(createInternalAssetMaintenanceRecord.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecordId = action.payload.record.internalAssetMaintenanceRecordId;
        state.mutations.lastCreatedRecordId =
          action.payload.record.internalAssetMaintenanceRecordId;
        upsertListItem(state.list.items, toListItem(action.payload.record));
      })
      .addCase(createInternalAssetMaintenanceRecord.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el registro de control de activos internos';
      })
      .addCase(updateInternalAssetMaintenanceRecord.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecordId = action.meta.arg.internalAssetMaintenanceRecordId;
      })
      .addCase(updateInternalAssetMaintenanceRecord.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecordId = action.payload.record.internalAssetMaintenanceRecordId;
        if (
          state.detail.currentRecordId === action.payload.record.internalAssetMaintenanceRecordId
        ) {
          state.detail.item = action.payload.record;
        }
        upsertListItem(state.list.items, toListItem(action.payload.record));
      })
      .addCase(updateInternalAssetMaintenanceRecord.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el registro de control de activos internos';
      })
      .addCase(deleteInternalAssetMaintenanceRecord.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecordId = action.meta.arg.internalAssetMaintenanceRecordId;
      })
      .addCase(deleteInternalAssetMaintenanceRecord.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecordId = action.payload.internalAssetMaintenanceRecordId;
        state.list.items = state.list.items.filter(
          (item) =>
            item.internalAssetMaintenanceRecordId !==
            action.payload.internalAssetMaintenanceRecordId
        );
        if (state.detail.currentRecordId === action.payload.internalAssetMaintenanceRecordId) {
          state.detail.item = null;
        }
      })
      .addCase(deleteInternalAssetMaintenanceRecord.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el registro de control de activos internos';
      })
      .addCase(sendInternalAssetMaintenanceProviderFollowUp.pending, (state, action) => {
        state.mutations.providerFollowUpStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecordId = action.meta.arg.internalAssetMaintenanceRecordId;
      })
      .addCase(sendInternalAssetMaintenanceProviderFollowUp.fulfilled, (state, action) => {
        state.mutations.providerFollowUpStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecordId = action.payload.record.internalAssetMaintenanceRecordId;
        if (
          state.detail.currentRecordId === action.payload.record.internalAssetMaintenanceRecordId
        ) {
          state.detail.item = action.payload.record;
        }
        upsertListItem(state.list.items, toListItem(action.payload.record));
      })
      .addCase(sendInternalAssetMaintenanceProviderFollowUp.rejected, (state, action) => {
        state.mutations.providerFollowUpStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible enviar el seguimiento manual al proveedor';
      });
  },
});

export const { resetInternalAssetControlMutations, setInternalAssetControlDetail } =
  internalAssetControlSlice.actions;

export default internalAssetControlSlice.reducer;
