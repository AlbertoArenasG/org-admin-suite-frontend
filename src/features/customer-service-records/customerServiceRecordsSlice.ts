import { createSlice } from '@reduxjs/toolkit';
import type { CustomerServiceRecordsState } from './types';
const initialState: CustomerServiceRecordsState = {
  list: { items: [], status: 'idle', error: null, page: 1, perPage: 10, total: 0 },
};
const customerServiceRecordsSlice = createSlice({
  name: 'customerServiceRecords',
  initialState,
  reducers: {},
});
export default customerServiceRecordsSlice.reducer;
