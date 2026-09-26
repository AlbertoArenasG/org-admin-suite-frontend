import { createSlice } from '@reduxjs/toolkit';
import type { CustomerServiceRecordsState } from './types';
import {
  createCustomerServiceRecord,
  deleteCustomerServiceRecord,
  fetchCustomerServiceRecordDetail,
  fetchCustomerServiceRecordDetailOptions,
  fetchCustomerServiceRecordCustomerDeliveryOptions,
  fetchCustomerServiceRecordCustomerUsers,
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecords,
  updateCustomerServiceRecordDetails,
  updateCustomerServiceRecordCustomerDelivery,
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
  detailCustomerDeliveryOptions: {
    customers: [],
    statusPolicies: [],
    notificationPolicies: [],
    status: 'idle',
    error: null,
  },
  detailCustomerUsers: {
    customerId: null,
    users: [],
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
    updateCustomerDeliveryStatus: 'idle',
    updateCustomerDeliveryError: null,
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
      state.detailCustomerDeliveryOptions = initialState.detailCustomerDeliveryOptions;
      state.detailCustomerUsers = initialState.detailCustomerUsers;
      state.mutations.updateDetailsStatus = 'idle';
      state.mutations.updateDetailsError = null;
      state.mutations.updateCustomerDeliveryStatus = 'idle';
      state.mutations.updateCustomerDeliveryError = null;
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
      })
      .addCase(fetchCustomerServiceRecordCustomerDeliveryOptions.pending, (state) => {
        state.detailCustomerDeliveryOptions.status = 'loading';
        state.detailCustomerDeliveryOptions.error = null;
      })
      .addCase(fetchCustomerServiceRecordCustomerDeliveryOptions.fulfilled, (state, action) => {
        state.detailCustomerDeliveryOptions.status = 'succeeded';
        state.detailCustomerDeliveryOptions.customers = action.payload.customers;
        state.detailCustomerDeliveryOptions.statusPolicies = action.payload.statusPolicies;
        state.detailCustomerDeliveryOptions.notificationPolicies =
          action.payload.notificationPolicies;
      })
      .addCase(fetchCustomerServiceRecordCustomerDeliveryOptions.rejected, (state, action) => {
        state.detailCustomerDeliveryOptions.status = 'failed';
        state.detailCustomerDeliveryOptions.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener las opciones de cliente y entrega';
      })
      .addCase(fetchCustomerServiceRecordCustomerUsers.pending, (state, action) => {
        state.detailCustomerUsers.status = 'loading';
        state.detailCustomerUsers.error = null;
        state.detailCustomerUsers.customerId = action.meta.arg.customerId;
        state.detailCustomerUsers.users = [];
      })
      .addCase(fetchCustomerServiceRecordCustomerUsers.fulfilled, (state, action) => {
        state.detailCustomerUsers.status = 'succeeded';
        state.detailCustomerUsers.customerId = action.payload.customerId;
        state.detailCustomerUsers.users = action.payload.users;
      })
      .addCase(fetchCustomerServiceRecordCustomerUsers.rejected, (state, action) => {
        state.detailCustomerUsers.status = 'failed';
        state.detailCustomerUsers.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener los usuarios relacionados';
      })
      .addCase(updateCustomerServiceRecordCustomerDelivery.pending, (state) => {
        state.mutations.updateCustomerDeliveryStatus = 'loading';
        state.mutations.updateCustomerDeliveryError = null;
      })
      .addCase(updateCustomerServiceRecordCustomerDelivery.fulfilled, (state, action) => {
        state.mutations.updateCustomerDeliveryStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateCustomerServiceRecordCustomerDelivery.rejected, (state, action) => {
        state.mutations.updateCustomerDeliveryStatus = 'failed';
        state.mutations.updateCustomerDeliveryError =
          action.payload ?? action.error.message ?? 'No fue posible actualizar cliente y entrega';
      });
  },
});
export const { resetCustomerServiceRecordCreateMutation, resetCustomerServiceRecordDetail } =
  customerServiceRecordsSlice.actions;
export default customerServiceRecordsSlice.reducer;
