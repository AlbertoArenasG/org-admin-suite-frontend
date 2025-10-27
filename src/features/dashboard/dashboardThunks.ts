import { createAsyncThunk } from '@reduxjs/toolkit';
import type { DashboardMetrics } from './dashboardSlice';

export const fetchDashboardMetrics = createAsyncThunk<DashboardMetrics>(
  'dashboard/fetchMetrics',
  async () => {
    // TODO: replace with API call
    throw new Error('fetchDashboardMetrics thunk not implemented yet');
  }
);
