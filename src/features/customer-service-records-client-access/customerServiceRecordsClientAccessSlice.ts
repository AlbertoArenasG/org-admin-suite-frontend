import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClientAccessCustomerServiceRecordDetail,
  fetchClientAccessCustomerServiceRecords,
} from './customerServiceRecordsClientAccessThunks';
import type { ClientAccessCustomerServiceRecordsState } from './types';

const initialState: ClientAccessCustomerServiceRecordsState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    activeRequestId: null,
  },
  detail: {
    record: null,
    status: 'idle',
    error: null,
    currentRecordId: null,
    activeRequestId: null,
  },
};

const customerServiceRecordsClientAccessSlice = createSlice({
  name: 'customerServiceRecordsClientAccess',
  initialState,
  reducers: {
    resetClientAccessCustomerServiceRecordDetail: (state) => {
      state.detail = initialState.detail;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAccessCustomerServiceRecords.pending, (state, action) => {
        state.list.status = 'loading';
        state.list.error = null;
        state.list.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchClientAccessCustomerServiceRecords.fulfilled, (state, action) => {
        if (state.list.activeRequestId !== action.meta.requestId) return;
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.page;
        state.list.perPage = action.payload.perPage;
        state.list.total = action.payload.total;
        state.list.totalPages = action.payload.totalPages;
        state.list.activeRequestId = null;
      })
      .addCase(fetchClientAccessCustomerServiceRecords.rejected, (state, action) => {
        if (state.list.activeRequestId !== action.meta.requestId) return;
        state.list.status = 'failed';
        state.list.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener los servicios';
        state.list.activeRequestId = null;
      })
      .addCase(fetchClientAccessCustomerServiceRecordDetail.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentRecordId = action.meta.arg.recordId;
        state.detail.activeRequestId = action.meta.requestId;
        state.detail.record = null;
      })
      .addCase(fetchClientAccessCustomerServiceRecordDetail.fulfilled, (state, action) => {
        if (state.detail.activeRequestId !== action.meta.requestId) return;
        state.detail.status = 'succeeded';
        state.detail.record = action.payload;
        state.detail.activeRequestId = null;
      })
      .addCase(fetchClientAccessCustomerServiceRecordDetail.rejected, (state, action) => {
        if (state.detail.activeRequestId !== action.meta.requestId) return;
        state.detail.status = 'failed';
        state.detail.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener el servicio';
        state.detail.activeRequestId = null;
      });
  },
});

export const { resetClientAccessCustomerServiceRecordDetail } =
  customerServiceRecordsClientAccessSlice.actions;
export default customerServiceRecordsClientAccessSlice.reducer;
