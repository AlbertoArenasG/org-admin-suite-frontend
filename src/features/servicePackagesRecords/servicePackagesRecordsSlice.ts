'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  ServicePackageRecord,
  ServicePackagesRecordsPagination,
} from '@/features/servicePackagesRecords/types';
import {
  deleteServicePackageRecord,
  fetchServicePackageRecordById,
  fetchServicePackagesRecords,
} from '@/features/servicePackagesRecords/servicePackagesRecordsThunks';

export interface ServicePackagesRecordsState {
  entities: ServicePackageRecord[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  pagination: ServicePackagesRecordsPagination | null;
  detail: {
    record: ServicePackageRecord | null;
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

const initialState: ServicePackagesRecordsState = {
  entities: [],
  status: 'idle',
  error: null,
  pagination: null,
  detail: {
    record: null,
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

const servicePackagesRecordsSlice = createSlice({
  name: 'servicePackagesRecords',
  initialState,
  reducers: {
    addServicePackageRecord(state, action: PayloadAction<ServicePackageRecord>) {
      state.entities.unshift(action.payload);
    },
    resetServicePackagesRecordsState() {
      return initialState;
    },
    resetServicePackageRecordDetail(state) {
      state.detail = {
        record: null,
        status: 'idle',
        error: null,
      };
    },
    resetServicePackageRecordDelete(state) {
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
      .addCase(fetchServicePackageRecordById.pending, (state) => {
        state.detail.status = 'loading';
        state.detail.error = null;
      })
      .addCase(fetchServicePackageRecordById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.record = action.payload;
        state.detail.error = null;
      })
      .addCase(fetchServicePackageRecordById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el registro.';
        state.detail.record = null;
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
  resetServicePackageRecordDetail,
  resetServicePackageRecordDelete,
} = servicePackagesRecordsSlice.actions;

export default servicePackagesRecordsSlice.reducer;
