'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
  ServicePackageRecordListItem,
  ServicePackageRecordRequestStatus,
  ServicePackagesRecordsPagination,
  ServicePackageRecordServiceTypeOption,
} from '@/features/servicePackagesRecords/types';
import {
  deleteServicePackageRecord,
  fetchServicePackageRecordDetail,
  fetchServicePackagesRecords,
  fetchServicePackageRecordServiceTypeOptions,
} from '@/features/servicePackagesRecords/servicePackagesRecordsThunks';

export interface ServicePackagesRecordsState {
  entities: ServicePackageRecordListItem[];
  status: ServicePackageRecordRequestStatus;
  error: string | null;
  pagination: ServicePackagesRecordsPagination | null;
  serviceTypeOptions: {
    items: ServicePackageRecordServiceTypeOption[];
    status: ServicePackageRecordRequestStatus;
    error: string | null;
  };
  delete: {
    status: ServicePackageRecordRequestStatus;
    error: string | null;
    targetId: string | null;
    message: string | null;
  };
  detail: {
    record: ServicePackageRecordDetail | null;
    status: ServicePackageRecordRequestStatus;
    error: ServicePackageRecordDetailError | null;
    currentRecordId: string | null;
    activeRequestId: string | null;
  };
}

const initialState: ServicePackagesRecordsState = {
  entities: [],
  status: 'idle',
  error: null,
  pagination: null,
  serviceTypeOptions: {
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
  detail: {
    record: null,
    status: 'idle',
    error: null,
    currentRecordId: null,
    activeRequestId: null,
  },
};

const servicePackagesRecordsSlice = createSlice({
  name: 'servicePackagesRecords',
  initialState,
  reducers: {
    addServicePackageRecord(state, action: PayloadAction<ServicePackageRecordListItem>) {
      state.entities.unshift(action.payload);
    },
    resetServicePackagesRecordsState() {
      return initialState;
    },
    resetServicePackageRecordDelete(state) {
      state.delete = {
        status: 'idle',
        error: null,
        targetId: null,
        message: null,
      };
    },
    resetServicePackageRecordDetail(state) {
      state.detail = {
        record: null,
        status: 'idle',
        error: null,
        currentRecordId: null,
        activeRequestId: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServicePackagesRecords.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchServicePackagesRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload.records;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchServicePackagesRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los registros de servicio.';
      })
      .addCase(fetchServicePackageRecordDetail.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.record = null;
        state.detail.currentRecordId = action.meta.arg.recordId;
        state.detail.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchServicePackageRecordDetail.fulfilled, (state, action) => {
        if (
          state.detail.activeRequestId !== action.meta.requestId ||
          state.detail.currentRecordId !== action.meta.arg.recordId
        ) {
          return;
        }

        state.detail.status = 'succeeded';
        state.detail.record = action.payload;
        state.detail.activeRequestId = null;
      })
      .addCase(fetchServicePackageRecordDetail.rejected, (state, action) => {
        if (
          state.detail.activeRequestId !== action.meta.requestId ||
          state.detail.currentRecordId !== action.meta.arg.recordId
        ) {
          return;
        }

        state.detail.status = 'failed';
        state.detail.error = action.payload ?? {
          message: action.error.message ?? 'No fue posible obtener el registro de servicio.',
          status: 0,
        };
        state.detail.activeRequestId = null;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.pending, (state) => {
        state.serviceTypeOptions.status = 'loading';
        state.serviceTypeOptions.error = null;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.fulfilled, (state, action) => {
        state.serviceTypeOptions.status = 'succeeded';
        state.serviceTypeOptions.items = action.payload;
        state.serviceTypeOptions.error = null;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.rejected, (state, action) => {
        state.serviceTypeOptions.status = 'failed';
        state.serviceTypeOptions.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los tipos de servicio.';
      })
      .addCase(deleteServicePackageRecord.pending, (state, action) => {
        state.delete.status = 'loading';
        state.delete.error = null;
        state.delete.targetId = action.meta.arg.id;
      })
      .addCase(deleteServicePackageRecord.fulfilled, (state, action) => {
        state.delete.status = 'succeeded';
        state.delete.message = action.payload.message;
        state.entities = state.entities.filter((record) => record.id !== action.payload.id);
      })
      .addCase(deleteServicePackageRecord.rejected, (state, action) => {
        state.delete.status = 'failed';
        state.delete.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el registro.';
      });
  },
});

export const {
  addServicePackageRecord,
  resetServicePackagesRecordsState,
  resetServicePackageRecordDelete,
  resetServicePackageRecordDetail,
} = servicePackagesRecordsSlice.actions;

export default servicePackagesRecordsSlice.reducer;
