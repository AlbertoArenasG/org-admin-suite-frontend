import { createAsyncThunk } from '@reduxjs/toolkit';
import type { Service } from './servicesSlice';

export const fetchServices = createAsyncThunk<Service[]>('services/fetchAll', async () => {
  // TODO: replace with API call
  throw new Error('fetchServices thunk not implemented yet');
});

export const createService = createAsyncThunk<Service, Partial<Service>>(
  'services/create',
  async () => {
    // TODO: replace with API call
    throw new Error('createService thunk not implemented yet');
  }
);
