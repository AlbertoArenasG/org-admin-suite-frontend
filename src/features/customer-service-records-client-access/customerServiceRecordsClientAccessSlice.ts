import { createSlice } from '@reduxjs/toolkit';
import { fetchClientAccessCustomerServiceRecords } from './customerServiceRecordsClientAccessThunks';
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
};

const customerServiceRecordsClientAccessSlice = createSlice({
  name: 'customerServiceRecordsClientAccess',
  initialState,
  reducers: {},
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
      });
  },
});

export default customerServiceRecordsClientAccessSlice.reducer;
