import { createSlice } from '@reduxjs/toolkit';

export interface DashboardMetrics {
  totalUsers: number;
  activeServices: number;
  pendingInvites: number;
}

export interface DashboardState {
  metrics: DashboardMetrics | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  status: 'idle',
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    resetDashboardState(state) {
      state.metrics = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: () => {
    // register async thunk handlers in future iterations
  },
});

export const { resetDashboardState } = dashboardSlice.actions;
export default dashboardSlice.reducer;
