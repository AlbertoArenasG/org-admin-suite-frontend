import { createSlice } from '@reduxjs/toolkit';
import type { CustomerServiceRecordsState } from './types';
import { fetchCustomerServiceRecordTimeline } from './customerServiceRecordsTimelineThunks';
import {
  createCustomerServiceRecord,
  deleteCustomerServiceRecord,
  fetchCustomerServiceRecordDetail,
  fetchCustomerServiceRecordDetailOptions,
  fetchCustomerServiceRecordCustomerDeliveryOptions,
  fetchCustomerServiceRecordCustomerUsers,
  fetchCustomerServiceRecordOptions,
  fetchCustomerServiceRecordBillingStatusOptions,
  fetchCustomerServiceRecords,
  submitCustomerServiceRecordToBilling,
  updateCustomerServiceRecordDetails,
  updateCustomerServiceRecordCustomerDelivery,
  updateCustomerServiceRecordAsset,
  fetchCustomerServiceRecordProviderOptions,
  updateCustomerServiceRecordProvider,
  updateCustomerServiceRecordDocument,
} from './customerServiceRecordsThunks';

const initialState: CustomerServiceRecordsState = {
  timeline: { items: [], status: 'idle', error: null, key: null, requestId: null },
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
  billingStatusOptions: {
    items: [],
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
  detailProviderOptions: {
    providers: [],
    statusPolicies: [],
    notificationPolicies: [],
    recipientGroups: [],
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
    updateAssetStatus: 'idle',
    updateAssetError: null,
    updateProviderStatus: 'idle',
    updateProviderError: null,
    updateDocumentStatus: 'idle',
    updateDocumentError: null,
    updateBillingStatus: 'idle',
    updateBillingError: null,
    updateBillingErrorStatus: null,
    updateBillingRecordId: null,
  },
};
const customerServiceRecordsSlice = createSlice({
  name: 'customerServiceRecords',
  initialState,
  reducers: {
    resetCustomerServiceRecordTimeline: (state) => {
      state.timeline = initialState.timeline;
    },
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
      state.detailProviderOptions = initialState.detailProviderOptions;
      state.mutations.updateDetailsStatus = 'idle';
      state.mutations.updateDetailsError = null;
      state.mutations.updateCustomerDeliveryStatus = 'idle';
      state.mutations.updateCustomerDeliveryError = null;
      state.mutations.updateAssetStatus = 'idle';
      state.mutations.updateAssetError = null;
      state.mutations.updateProviderStatus = 'idle';
      state.mutations.updateProviderError = null;
      state.mutations.updateDocumentStatus = 'idle';
      state.mutations.updateDocumentError = null;
      state.mutations.updateBillingStatus = 'idle';
      state.mutations.updateBillingError = null;
      state.mutations.updateBillingErrorStatus = null;
      state.mutations.updateBillingRecordId = null;
    },
    resetCustomerServiceRecordBillingMutation: (state) => {
      state.mutations.updateBillingStatus = 'idle';
      state.mutations.updateBillingError = null;
      state.mutations.updateBillingErrorStatus = null;
      state.mutations.updateBillingRecordId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerServiceRecordTimeline.pending, (state, action) => {
        state.timeline.status = 'loading';
        state.timeline.error = null;
        state.timeline.items = [];
        state.timeline.key = `${action.meta.arg.from}:${action.meta.arg.to}:${action.meta.arg.match}`;
        state.timeline.requestId = action.meta.requestId;
      })
      .addCase(fetchCustomerServiceRecordTimeline.fulfilled, (state, action) => {
        if (state.timeline.requestId !== action.meta.requestId) return;
        state.timeline.status = 'succeeded';
        state.timeline.items = action.payload.items;
        state.timeline.requestId = null;
      })
      .addCase(fetchCustomerServiceRecordTimeline.rejected, (state, action) => {
        if (state.timeline.requestId !== action.meta.requestId) return;
        state.timeline.status = 'failed';
        state.timeline.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener el cronograma';
        state.timeline.requestId = null;
      })
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
      .addCase(fetchCustomerServiceRecordBillingStatusOptions.pending, (state) => {
        state.billingStatusOptions.status = 'loading';
        state.billingStatusOptions.error = null;
      })
      .addCase(fetchCustomerServiceRecordBillingStatusOptions.fulfilled, (state, action) => {
        state.billingStatusOptions.status = 'succeeded';
        state.billingStatusOptions.items = action.payload;
      })
      .addCase(fetchCustomerServiceRecordBillingStatusOptions.rejected, (state, action) => {
        state.billingStatusOptions.status = 'failed';
        state.billingStatusOptions.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener los estados de facturación';
      })
      .addCase(submitCustomerServiceRecordToBilling.pending, (state, action) => {
        state.mutations.updateBillingStatus = 'loading';
        state.mutations.updateBillingError = null;
        state.mutations.updateBillingErrorStatus = null;
        state.mutations.updateBillingRecordId = action.meta.arg.recordId;
      })
      .addCase(submitCustomerServiceRecordToBilling.fulfilled, (state, action) => {
        state.mutations.updateBillingStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        const record = action.payload.record;
        if (state.detail.record?.customerServiceRecordId === record.customerServiceRecordId) {
          state.detail.record = record;
        }
        const row = state.list.items.find(
          (item) => item.customerServiceRecordId === record.customerServiceRecordId
        );
        if (row) {
          row.billingStatus = record.billingStatus;
          row.billingNotification = record.billingNotification;
        }
      })
      .addCase(submitCustomerServiceRecordToBilling.rejected, (state, action) => {
        state.mutations.updateBillingStatus = 'failed';
        state.mutations.updateBillingError =
          action.payload?.message ?? action.error.message ?? 'No fue posible enviar a facturación';
        state.mutations.updateBillingErrorStatus = action.payload?.status ?? null;
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
      })
      .addCase(updateCustomerServiceRecordAsset.pending, (state) => {
        state.mutations.updateAssetStatus = 'loading';
        state.mutations.updateAssetError = null;
      })
      .addCase(updateCustomerServiceRecordAsset.fulfilled, (state, action) => {
        state.mutations.updateAssetStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateCustomerServiceRecordAsset.rejected, (state, action) => {
        state.mutations.updateAssetStatus = 'failed';
        state.mutations.updateAssetError =
          action.payload ?? action.error.message ?? 'No fue posible actualizar el equipo';
      })
      .addCase(fetchCustomerServiceRecordProviderOptions.pending, (state) => {
        state.detailProviderOptions.status = 'loading';
        state.detailProviderOptions.error = null;
      })
      .addCase(fetchCustomerServiceRecordProviderOptions.fulfilled, (state, action) => {
        state.detailProviderOptions.status = 'succeeded';
        state.detailProviderOptions.providers = action.payload.providers;
        state.detailProviderOptions.statusPolicies = action.payload.statusPolicies;
        state.detailProviderOptions.notificationPolicies = action.payload.notificationPolicies;
        state.detailProviderOptions.recipientGroups = action.payload.recipientGroups;
      })
      .addCase(fetchCustomerServiceRecordProviderOptions.rejected, (state, action) => {
        state.detailProviderOptions.status = 'failed';
        state.detailProviderOptions.error =
          action.payload ??
          action.error.message ??
          'No fue posible obtener las opciones de proveedor';
      })
      .addCase(updateCustomerServiceRecordProvider.pending, (state) => {
        state.mutations.updateProviderStatus = 'loading';
        state.mutations.updateProviderError = null;
      })
      .addCase(updateCustomerServiceRecordProvider.fulfilled, (state, action) => {
        state.mutations.updateProviderStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateCustomerServiceRecordProvider.rejected, (state, action) => {
        state.mutations.updateProviderStatus = 'failed';
        state.mutations.updateProviderError =
          action.payload ??
          action.error.message ??
          'No fue posible actualizar proveedor y seguimiento';
      })
      .addCase(updateCustomerServiceRecordDocument.pending, (state) => {
        state.mutations.updateDocumentStatus = 'loading';
        state.mutations.updateDocumentError = null;
      })
      .addCase(updateCustomerServiceRecordDocument.fulfilled, (state, action) => {
        state.mutations.updateDocumentStatus = 'succeeded';
        state.detail.record = action.payload.record;
      })
      .addCase(updateCustomerServiceRecordDocument.rejected, (state, action) => {
        state.mutations.updateDocumentStatus = 'failed';
        state.mutations.updateDocumentError =
          action.payload ?? action.error.message ?? 'No fue posible actualizar los documentos';
      });
  },
});
export const {
  resetCustomerServiceRecordTimeline,
  resetCustomerServiceRecordCreateMutation,
  resetCustomerServiceRecordDetail,
  resetCustomerServiceRecordBillingMutation,
} = customerServiceRecordsSlice.actions;
export default customerServiceRecordsSlice.reducer;
