'use client';

import { createSlice } from '@reduxjs/toolkit';
import type {
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
  ServicePackageRecordListItem,
  ServicePackageRecordRequestStatus,
  ServicePackageRecordServiceTypeOption,
} from '@/features/servicePackagesRecords/types';
import {
  deleteServicePackageRecord,
  fetchServicePackageRecordDetail,
  fetchServicePackageRecordServiceTypeOptions,
  fetchServicePackagesRecords,
} from '@/features/servicePackagesRecords/servicePackagesRecordsThunks';

export interface ServicePackagesRecordsState {
  list: {
    items: ServicePackageRecordListItem[];
    status: ServicePackageRecordRequestStatus;
    error: string | null;
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    activeRequestId: string | null;
  };
  options: {
    serviceTypes: ServicePackageRecordServiceTypeOption[];
    status: ServicePackageRecordRequestStatus;
    error: string | null;
  };
  mutations: {
    deleteStatus: ServicePackageRecordRequestStatus;
    error: string | null;
    message: string | null;
    currentRecordId: string | null;
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
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
    activeRequestId: null,
  },
  options: {
    serviceTypes: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    deleteStatus: 'idle',
    error: null,
    message: null,
    currentRecordId: null,
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
    resetServicePackageRecordDeleteMutation(state) {
      state.mutations = {
        deleteStatus: 'idle',
        error: null,
        message: null,
        currentRecordId: null,
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
      .addCase(fetchServicePackagesRecords.pending, (state, action) => {
        state.list.status = 'loading';
        state.list.error = null;
        state.list.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchServicePackagesRecords.fulfilled, (state, action) => {
        if (state.list.activeRequestId !== action.meta.requestId) return;

        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.page;
        state.list.perPage = action.payload.perPage;
        state.list.total = action.payload.total;
        state.list.totalPages = action.payload.totalPages;
        state.list.activeRequestId = null;
      })
      .addCase(fetchServicePackagesRecords.rejected, (state, action) => {
        if (state.list.activeRequestId !== action.meta.requestId) return;

        state.list.status = 'failed';
        state.list.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener los registros de servicio.';
        state.list.activeRequestId = null;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.pending, (state) => {
        state.options.status = 'loading';
        state.options.error = null;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.fulfilled, (state, action) => {
        state.options.status = 'succeeded';
        state.options.serviceTypes = action.payload;
      })
      .addCase(fetchServicePackageRecordServiceTypeOptions.rejected, (state, action) => {
        state.options.status = 'failed';
        state.options.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener los tipos de servicio.';
      })
      .addCase(deleteServicePackageRecord.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecordId = action.meta.arg.recordId;
      })
      .addCase(deleteServicePackageRecord.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.list.items = state.list.items.filter(
          (record) => record.id !== action.payload.recordId
        );
      })
      .addCase(deleteServicePackageRecord.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          action.payload ?? action.error.message ?? 'No fue posible eliminar el registro.';
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
      });
  },
});

export const { resetServicePackageRecordDeleteMutation, resetServicePackageRecordDetail } =
  servicePackagesRecordsSlice.actions;

export default servicePackagesRecordsSlice.reducer;
