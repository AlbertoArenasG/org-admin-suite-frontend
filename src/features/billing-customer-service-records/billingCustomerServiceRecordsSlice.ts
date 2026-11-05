import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  archiveBillingInvoice,
  createBillingPaymentComplement,
  createBillingRecordComment,
  fetchBillingInvoiceArchiveDetail,
  fetchBillingInvoiceArchives,
  fetchBillingInvoiceStatusOptions,
  fetchBillingRecordComments,
  updateBillingInvoiceStatus,
  updateBillingPaymentComplement,
  updateBillingPurchaseOrder,
  updateBillingRecordDetails,
} from './billingCustomerServiceRecordLifecycleThunks';
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
  invoiceStatusOptions: { items: [], status: 'idle', error: null },
  archives: {
    recordId: null,
    items: [],
    selected: null,
    status: 'idle',
    detailStatus: 'idle',
    error: null,
    page: 1,
    totalPages: 1,
  },
  comments: { recordId: null, items: [], status: 'idle', error: null, page: 1, totalPages: 1 },
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
    clearArchiveSelection: (state) => {
      state.archives.selected = null;
      state.archives.detailStatus = 'idle';
    },
    resetBillingCustomerServiceRecordDetail: (state) => {
      state.detail = initialState.detail;
      state.mutations = initialState.mutations;
      state.archives = initialState.archives;
      state.comments = initialState.comments;
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
      })
      .addCase(fetchBillingInvoiceStatusOptions.pending, (state) => {
        state.invoiceStatusOptions.status = 'loading';
        state.invoiceStatusOptions.error = null;
      })
      .addCase(fetchBillingInvoiceStatusOptions.fulfilled, (state, action) => {
        state.invoiceStatusOptions.status = 'succeeded';
        state.invoiceStatusOptions.items = action.payload;
      })
      .addCase(fetchBillingInvoiceStatusOptions.rejected, (state, action) => {
        state.invoiceStatusOptions.status = 'failed';
        state.invoiceStatusOptions.error = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(fetchBillingInvoiceArchives.pending, (state, action) => {
        state.archives.status = 'loading';
        state.archives.error = null;
        if (state.archives.recordId !== action.meta.arg.recordId) {
          state.archives.items = [];
          state.archives.selected = null;
        }
        state.archives.recordId = action.meta.arg.recordId;
      })
      .addCase(fetchBillingInvoiceArchives.fulfilled, (state, action) => {
        state.archives.status = 'succeeded';
        Object.assign(state.archives, action.payload);
      })
      .addCase(fetchBillingInvoiceArchives.rejected, (state, action) => {
        state.archives.status = 'failed';
        state.archives.error = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(fetchBillingInvoiceArchiveDetail.pending, (state) => {
        state.archives.detailStatus = 'loading';
        state.archives.error = null;
        state.archives.selected = null;
      })
      .addCase(fetchBillingInvoiceArchiveDetail.fulfilled, (state, action) => {
        state.archives.detailStatus = 'succeeded';
        state.archives.selected = action.payload;
      })
      .addCase(fetchBillingInvoiceArchiveDetail.rejected, (state, action) => {
        state.archives.detailStatus = 'failed';
        state.archives.error = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(fetchBillingRecordComments.pending, (state, action) => {
        state.comments.status = 'loading';
        state.comments.error = null;
        if (state.comments.recordId !== action.meta.arg.recordId) state.comments.items = [];
        state.comments.recordId = action.meta.arg.recordId;
      })
      .addCase(fetchBillingRecordComments.fulfilled, (state, action) => {
        state.comments.status = 'succeeded';
        Object.assign(state.comments, action.payload);
      })
      .addCase(fetchBillingRecordComments.rejected, (state, action) => {
        state.comments.status = 'failed';
        state.comments.error = action.payload?.message ?? action.error.message ?? null;
      })
      .addCase(createBillingRecordComment.fulfilled, (state, action) => {
        if (state.comments.page === 1) state.comments.items.unshift(action.payload);
      })
      .addCase(archiveBillingInvoice.fulfilled, (state, action) => {
        state.detail.record = action.payload.record;
        state.archives.status = 'idle';
        state.archives.selected = null;
      })
      .addMatcher(
        isAnyOf(
          updateBillingRecordDetails.fulfilled,
          updateBillingInvoiceStatus.fulfilled,
          updateBillingPurchaseOrder.fulfilled,
          createBillingPaymentComplement.fulfilled,
          updateBillingPaymentComplement.fulfilled
        ),
        (state, action) => {
          state.detail.record = action.payload.record;
        }
      );
  },
});

export const {
  clearArchiveSelection,
  resetBillingCustomerServiceRecordDetail,
  resetBillingCustomerServiceRecords,
} = billingCustomerServiceRecordsSlice.actions;
export default billingCustomerServiceRecordsSlice.reducer;
