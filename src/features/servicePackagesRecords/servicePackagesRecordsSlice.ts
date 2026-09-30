'use client';

import { createSlice } from '@reduxjs/toolkit';
import type {
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
  ServicePackageRecordRequestStatus,
} from '@/features/servicePackagesRecords/types';
import { fetchServicePackageRecordDetail } from '@/features/servicePackagesRecords/servicePackagesRecordsThunks';

export interface ServicePackagesRecordsState {
  detail: {
    record: ServicePackageRecordDetail | null;
    status: ServicePackageRecordRequestStatus;
    error: ServicePackageRecordDetailError | null;
    currentRecordId: string | null;
    activeRequestId: string | null;
  };
}

const initialState: ServicePackagesRecordsState = {
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

export const { resetServicePackageRecordDetail } = servicePackagesRecordsSlice.actions;

export default servicePackagesRecordsSlice.reducer;
