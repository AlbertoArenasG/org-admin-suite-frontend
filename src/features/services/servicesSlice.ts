import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Service {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface ServicesState {
  entities: Service[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ServicesState = {
  entities: [],
  status: 'idle',
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    addService(state, action: PayloadAction<Service>) {
      state.entities.push(action.payload);
    },
    resetServicesState(state) {
      state.entities = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: () => {
    // register async thunk handlers in future iterations
  },
});

export const { addService, resetServicesState } = servicesSlice.actions;
export default servicesSlice.reducer;
