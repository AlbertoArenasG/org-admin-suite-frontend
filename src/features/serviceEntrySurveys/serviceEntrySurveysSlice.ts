'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchServiceEntrySurveyList,
  fetchServiceEntrySurveyStats,
  type ServiceEntrySurveyListItem,
  type ServiceEntrySurveyListResult,
  type ServiceEntrySurveyStats,
} from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';

export interface ServiceEntrySurveysState {
  list: {
    items: ServiceEntrySurveyListItem[];
    pagination: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
  stats: {
    data: ServiceEntrySurveyStats | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  };
}

const initialState: ServiceEntrySurveysState = {
  list: {
    items: [],
    pagination: null,
    status: 'idle',
    error: null,
  },
  stats: {
    data: null,
    status: 'idle',
    error: null,
  },
};

const serviceEntrySurveysSlice = createSlice({
  name: 'serviceEntrySurveys',
  initialState,
  reducers: {
    resetServiceEntrySurveysState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServiceEntrySurveyList.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(
        fetchServiceEntrySurveyList.fulfilled,
        (state, action: PayloadAction<ServiceEntrySurveyListResult>) => {
          state.list.status = 'succeeded';
          state.list.items = action.payload.items;
          state.list.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchServiceEntrySurveyList.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las encuestas.';
      })
      .addCase(fetchServiceEntrySurveyStats.pending, (state) => {
        state.stats.status = 'loading';
        state.stats.error = null;
      })
      .addCase(
        fetchServiceEntrySurveyStats.fulfilled,
        (state, action: PayloadAction<ServiceEntrySurveyStats>) => {
          state.stats.status = 'succeeded';
          state.stats.data = action.payload;
        }
      )
      .addCase(fetchServiceEntrySurveyStats.rejected, (state, action) => {
        state.stats.status = 'failed';
        state.stats.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las estadísticas.';
      });
  },
});

export const { resetServiceEntrySurveysState } = serviceEntrySurveysSlice.actions;

export default serviceEntrySurveysSlice.reducer;
