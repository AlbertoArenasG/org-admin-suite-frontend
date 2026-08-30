import { createSlice } from '@reduxjs/toolkit';
import type { CustomerServiceRecordsState } from './types';
import {
  createCustomerServiceRecord,
  deleteCustomerServiceRecord,
  fetchCustomerServiceRecordById,
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
  updateCustomerServiceRecord,
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
  detail: { item: null, status: 'idle', error: null, currentRecordId: null },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    message: null,
    lastCreatedRecordId: null,
    currentRecordId: null,
  },
};
const customerServiceRecordsSlice = createSlice({
  name: 'customerServiceRecords',
  initialState,
  reducers: {},
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
      .addCase(fetchCustomerServiceRecordById.pending, (state, action) => {
        state.detail = {
          item: null,
          status: 'loading',
          error: null,
          currentRecordId: action.meta.arg.recordId,
        };
      })
      .addCase(fetchCustomerServiceRecordById.fulfilled, (state, action) => {
        state.detail = {
          item: action.payload.record,
          status: 'succeeded',
          error: null,
          currentRecordId: action.meta.arg.recordId,
        };
      })
      .addCase(fetchCustomerServiceRecordById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener el registro';
      })
      .addCase(createCustomerServiceRecord.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
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
      .addCase(updateCustomerServiceRecord.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.currentRecordId = action.meta.arg.recordId;
      })
      .addCase(updateCustomerServiceRecord.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.detail.item = action.payload.record;
      })
      .addCase(updateCustomerServiceRecord.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          action.payload ?? action.error.message ?? 'No fue posible actualizar el registro';
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
        if (state.detail.currentRecordId === action.payload.recordId) {
          state.detail.item = null;
        }
      })
      .addCase(deleteCustomerServiceRecord.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          action.payload ?? action.error.message ?? 'No fue posible eliminar el registro';
      });
  },
});
export default customerServiceRecordsSlice.reducer;
