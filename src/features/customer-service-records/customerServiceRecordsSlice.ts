import { createSlice } from '@reduxjs/toolkit';
import type { CustomerServiceRecordsState } from './types';
import {
  createCustomerServiceRecord,
  deleteCustomerServiceRecord,
  fetchCustomerServiceRecordDetail,
  fetchCustomerServiceRecordDetailOptions,
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
  updateCustomerServiceRecordDetails,
} from './customerServiceRecordsThunks';

const initialState: CustomerServiceRecordsState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 1,
  },
  options: {
    serviceTypes: [],
    providers: [],
    status: 'idle',
    error: null,
  },
  detail: {
    record: null,
    status: 'idle',
    error: null,
    currentRecordId: null,
  },
  detailOptions: {
    serviceTypes: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    message: null,
    lastCreatedRecordId: null,
    currentRecordId: null,
    updateDetailsStatus: 'idle',
    updateDetailsError: null,
  },
};
const customerServiceRecordsSlice = createSlice({
  name: 'customerServiceRecords',
  initialState,
  reducers: {
    resetCustomerServiceRecordCreateMutation: (state) => {
      state.mutations.createStatus = 'idle';
      state.mutations.error = null;
      state.mutations.message = null;
      state.mutations.lastCreatedRecordId = null;
    },
    resetCustomerServiceRecordDetail: (state) => {
      state.detail = initialState.detail;
      state.detailOptions = initialState.detailOptions;
      state.mutations.updateDetailsStatus = 'idle';
      state.mutations.updateDetailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerServiceRecords.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchCustomerServiceRecords.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.page;
        state.list.perPage = action.payload.perPage;
        state.list.total = action.payload.total;
        state.list.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCustomerServiceRecords.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener los registros de servicio';
      })
      .addCase(fetchCustomerServiceRecordOptions.pending, (state) => {
        state.options.status = 'loading';
        state.options.error = null;
      })
      .addCase(fetchCustomerServiceRecordOptions.fulfilled, (state, action) => {
        state.options.status = 'succeeded';
        state.options.serviceTypes = action.payload.serviceTypes;
        state.options.providers = action.payload.providers;
      })
      .addCase(fetchCustomerServiceRecordOptions.rejected, (state, action) => {
        state.options.status = 'failed';
        state.options.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener las opciones del listado';
      })
      .addCase(fetchCustomerServiceRecordDetail.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentRecordId = action.meta.arg.recordId;
        state.detail.record = null;
      })
      .addCase(fetchCustomerServiceRecordDetail.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.record = action.payload;
      })
      .addCase(fetchCustomerServiceRecordDetail.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener el registro de servicio';
      })
      .addCase(fetchCustomerServiceRecordDetailOptions.pending, (state) => {
        state.detailOptions.status = 'loading';
        state.detailOptions.error = null;
      })
      .addCase(fetchCustomerServiceRecordDetailOptions.fulfilled, (state, action) => {
        state.detailOptions.status = 'succeeded';
        state.detailOptions.serviceTypes = action.payload.serviceTypes;
      })
      .addCase(fetchCustomerServiceRecordDetailOptions.rejected, (state, action) => {
        state.detailOptions.status = 'failed';
        state.detailOptions.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener las opciones de detalles';
      })
      .addCase(createCustomerServiceRecord.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.lastCreatedRecordId = null;
      })
      .addCase(createCustomerServiceRecord.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedRecordId = action.payload.record.customerServiceRecordId;
      })
      .addCase(createCustomerServiceRecord.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          action.payload ?? action.error.message ?? 'No fue posible crear el registro';
      })
      .addCase(deleteCustomerServiceRecord.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.currentRecordId = action.meta.arg.recordId;
      })
      .addCase(deleteCustomerServiceRecord.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.list.items = state.list.items.filter(
          (record) => record.customerServiceRecordId !== action.payload.recordId
        );
      })
      .addCase(deleteCustomerServiceRecord.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          action.payload ?? action.error.message ?? 'No fue posible eliminar el registro';
      })
      .addCase(updateCustomerServiceRecordDetails.pending, (state) => {
        state.mutations.updateDetailsStatus = 'loading';
        state.mutations.updateDetailsError = null;
      })
      .addCase(updateCustomerServiceRecordDetails.fulfilled, (state, action) => {
        state.mutations.updateDetailsStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateCustomerServiceRecordDetails.rejected, (state, action) => {
        state.mutations.updateDetailsStatus = 'failed';
        state.mutations.updateDetailsError =
          action.payload ?? action.error.message ?? 'No fue posible actualizar el registro';
      });
  },
});
export const { resetCustomerServiceRecordCreateMutation, resetCustomerServiceRecordDetail } =
  customerServiceRecordsSlice.actions;
export default customerServiceRecordsSlice.reducer;
