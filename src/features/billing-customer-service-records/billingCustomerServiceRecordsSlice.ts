import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBillingCustomerServiceRecordDetail,
  fetchBillingCustomerServiceRecordStatusOptions,
  fetchBillingCustomerServiceRecords,
  markBillingCustomerServiceRecordInvoiced,
  updateBillingCustomerServiceRecordInvoice,
  uploadBillingCustomerServiceRecordFiles,
} from './billingCustomerServiceRecordsThunks';
import type { BillingCustomerServiceRecordsState } from './types';

const initialState: BillingCustomerServiceRecordsState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  },
  detail: { record: null, status: 'idle', error: null, currentRecordId: null },
  options: { items: [], status: 'idle', error: null },
  mutations: {
    invoiceStatus: 'idle',
    invoiceError: null,
    billingStatus: 'idle',
    billingError: null,
    uploadStatus: 'idle',
    uploadError: null,
  },
};

const billingCustomerServiceRecordsSlice = createSlice({
  name: 'billingCustomerServiceRecords',
  initialState,
  reducers: {
    resetBillingCustomerServiceRecordDetail: (state) => {
      state.detail = initialState.detail;
      state.mutations = initialState.mutations;
    },
    resetBillingCustomerServiceRecords: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingCustomerServiceRecords.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchBillingCustomerServiceRecords.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        Object.assign(state.list, action.payload);
      })
      .addCase(fetchBillingCustomerServiceRecords.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener los registros';
      })
      .addCase(fetchBillingCustomerServiceRecordDetail.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        if (state.detail.currentRecordId !== action.meta.arg.recordId) state.detail.record = null;
        state.detail.currentRecordId = action.meta.arg.recordId;
      })
      .addCase(fetchBillingCustomerServiceRecordDetail.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.record = action.payload;
      })
      .addCase(fetchBillingCustomerServiceRecordDetail.rejected, (state, action) => {
        state.detail.status = 'failed';
        if (action.payload?.status === 404 || action.payload?.status === 403)
          state.detail.record = null;
        state.detail.error =
          action.payload?.message ?? action.error.message ?? 'No fue posible obtener el registro';
      })
      .addCase(fetchBillingCustomerServiceRecordStatusOptions.pending, (state) => {
        state.options.status = 'loading';
        state.options.error = null;
      })
      .addCase(fetchBillingCustomerServiceRecordStatusOptions.fulfilled, (state, action) => {
        state.options.status = 'succeeded';
        state.options.items = action.payload;
      })
      .addCase(fetchBillingCustomerServiceRecordStatusOptions.rejected, (state, action) => {
        state.options.status = 'failed';
        state.options.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener opciones';
      })
      .addCase(updateBillingCustomerServiceRecordInvoice.pending, (state) => {
        state.mutations.invoiceStatus = 'loading';
        state.mutations.invoiceError = null;
      })
      .addCase(updateBillingCustomerServiceRecordInvoice.fulfilled, (state, action) => {
        state.mutations.invoiceStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateBillingCustomerServiceRecordInvoice.rejected, (state, action) => {
        state.mutations.invoiceStatus = 'failed';
        state.mutations.invoiceError =
          action.payload?.message ?? action.error.message ?? 'No fue posible guardar la factura';
      })
      .addCase(markBillingCustomerServiceRecordInvoiced.pending, (state) => {
        state.mutations.billingStatus = 'loading';
        state.mutations.billingError = null;
      })
      .addCase(markBillingCustomerServiceRecordInvoiced.fulfilled, (state, action) => {
        state.mutations.billingStatus = 'succeeded';
        state.detail.record = action.payload.record;
        const row = state.list.items.find(
          (item) => item.customerServiceRecordId === action.payload.record.customerServiceRecordId
        );
        if (row) {
          row.billingStatus = action.payload.record.billingStatus;
          row.billingNotification = action.payload.record.billingNotification;
        }
      })
      .addCase(markBillingCustomerServiceRecordInvoiced.rejected, (state, action) => {
        state.mutations.billingStatus = 'failed';
        state.mutations.billingError =
          action.payload?.message ?? action.error.message ?? 'No fue posible marcar como facturado';
      })
      .addCase(uploadBillingCustomerServiceRecordFiles.pending, (state) => {
        state.mutations.uploadStatus = 'loading';
        state.mutations.uploadError = null;
      })
      .addCase(uploadBillingCustomerServiceRecordFiles.fulfilled, (state) => {
        state.mutations.uploadStatus = 'succeeded';
      })
      .addCase(uploadBillingCustomerServiceRecordFiles.rejected, (state, action) => {
        state.mutations.uploadStatus = 'failed';
        state.mutations.uploadError =
          action.payload ?? action.error.message ?? 'No fue posible subir archivos';
      });
  },
});

export const { resetBillingCustomerServiceRecordDetail, resetBillingCustomerServiceRecords } =
  billingCustomerServiceRecordsSlice.actions;
export default billingCustomerServiceRecordsSlice.reducer;
