import { createSlice } from '@reduxjs/toolkit';
import {
  fetchClientAccessCustomerServiceRecordDetail,
  fetchClientAccessCustomerServiceRecords,
  fetchClientAccessFilterOptions,
} from './customerServiceRecordsClientAccessThunks';
import type { ClientAccessCustomerServiceRecordsState } from './types';
import {
  fetchClientAccessTimeline,
  fetchClientAccessGanttChunk,
} from './clientAccessTimelineThunks';

const initialState: ClientAccessCustomerServiceRecordsState = {
  ganttTimeline: { chunks: {}, retainedRange: null },
  timeline: { items: [], status: 'idle', error: null, key: null, requestId: null },
  options: { customers: [], serviceTypes: [], status: 'idle', error: null },
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
    retainClientAccessGanttChunks: (
      state,
      action: { payload: { first: number; last: number } }
    ) => {
      state.ganttTimeline.retainedRange = action.payload;
      for (const id of Object.keys(state.ganttTimeline.chunks)) {
        const index = Number(id);
        if (index < action.payload.first || index > action.payload.last)
          delete state.ganttTimeline.chunks[index];
      }
    },
    resetClientAccessTimeline: (state) => {
      state.timeline = initialState.timeline;
      state.ganttTimeline = initialState.ganttTimeline;
    },
    resetClientAccessCustomerServiceRecordDetail: (state) => {
      state.detail = initialState.detail;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientAccessGanttChunk.pending, (state, action) => {
        state.ganttTimeline.chunks[action.meta.arg] = {
          items: [],
          status: 'loading',
          error: null,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchClientAccessGanttChunk.fulfilled, (state, action) => {
        const id = action.meta.arg;
        if (state.ganttTimeline.chunks[id]?.requestId !== action.meta.requestId) return;
        const range = state.ganttTimeline.retainedRange;
        if (range && (id < range.first || id > range.last)) {
          delete state.ganttTimeline.chunks[id];
          return;
        }
        state.ganttTimeline.chunks[id] = {
          items: action.payload.items,
          status: 'succeeded',
          error: null,
          requestId: null,
        };
      })
      .addCase(fetchClientAccessGanttChunk.rejected, (state, action) => {
        const id = action.meta.arg;
        if (state.ganttTimeline.chunks[id]?.requestId !== action.meta.requestId) return;
        state.ganttTimeline.chunks[id] = {
          items: [],
          status: 'failed',
          error: action.payload ?? action.error.message ?? 'No fue posible obtener el Gantt',
          requestId: null,
        };
      })
      .addCase(fetchClientAccessTimeline.pending, (state, action) => {
        state.timeline = {
          items: [],
          status: 'loading',
          error: null,
          key: `${action.meta.arg.from}:${action.meta.arg.to}:${action.meta.arg.match}`,
          requestId: action.meta.requestId,
        };
      })
      .addCase(fetchClientAccessTimeline.fulfilled, (state, action) => {
        if (state.timeline.requestId !== action.meta.requestId) return;
        state.timeline = {
          items: action.payload.items,
          status: 'succeeded',
          error: null,
          key: action.payload.key,
          requestId: null,
        };
      })
      .addCase(fetchClientAccessTimeline.rejected, (state, action) => {
        if (state.timeline.requestId !== action.meta.requestId) return;
        state.timeline.status = 'failed';
        state.timeline.error =
          action.payload ?? action.error.message ?? 'No fue posible obtener el calendario';
        state.timeline.requestId = null;
      })
      .addCase(fetchClientAccessFilterOptions.pending, (state) => {
        state.options.status = 'loading';
        state.options.error = null;
      })
      .addCase(fetchClientAccessFilterOptions.fulfilled, (state, action) => {
        state.options.status = 'succeeded';
        state.options.customers = action.payload.customers;
        state.options.serviceTypes = action.payload.serviceTypes;
      })
      .addCase(fetchClientAccessFilterOptions.rejected, (state, action) => {
        state.options.status = 'failed';
        state.options.error = action.payload ?? action.error.message ?? null;
      })
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

export const {
  resetClientAccessCustomerServiceRecordDetail,
  retainClientAccessGanttChunks,
  resetClientAccessTimeline,
} = customerServiceRecordsClientAccessSlice.actions;
export default customerServiceRecordsClientAccessSlice.reducer;
