import { createSlice } from '@reduxjs/toolkit';
import {
  addCustomerUser,
  fetchCustomerAvailableUsers,
  fetchCustomerRelatedUsers,
  removeCustomerUser,
} from './userCustomerRelationshipsThunks';
import type { UserCustomerRelationshipsState } from './types';

const initialState: UserCustomerRelationshipsState = {
  related: { status: 'idle', error: null, customerId: null, users: [], pagination: null },
  available: { status: 'idle', error: null, customerId: null, users: [] },
  mutation: { status: 'idle', error: null, customerId: null },
};

const getError = (action: { payload?: unknown; error: { message?: string } }) =>
  (typeof action.payload === 'string' ? action.payload : undefined) ??
  action.error.message ??
  'No fue posible completar la operación';

const userCustomerRelationshipsSlice = createSlice({
  name: 'userCustomerRelationships',
  initialState,
  reducers: { resetUserCustomerRelationships: () => initialState },
  extraReducers: (builder) =>
    builder
      .addCase(fetchCustomerRelatedUsers.pending, (state, action) => {
        state.related.status = 'loading';
        state.related.error = null;
        state.related.customerId = action.meta.arg.customerId;
      })
      .addCase(fetchCustomerRelatedUsers.fulfilled, (state, action) => {
        state.related.status = 'succeeded';
        state.related.customerId = action.meta.arg.customerId;
        state.related.users = action.payload.users;
        state.related.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomerRelatedUsers.rejected, (state, action) => {
        state.related.status = 'failed';
        state.related.error = getError(action);
      })
      .addCase(fetchCustomerAvailableUsers.pending, (state, action) => {
        state.available.status = 'loading';
        state.available.error = null;
        state.available.customerId = action.meta.arg.customerId;
      })
      .addCase(fetchCustomerAvailableUsers.fulfilled, (state, action) => {
        state.available.status = 'succeeded';
        state.available.customerId = action.payload.customerId;
        state.available.users = action.payload.users;
      })
      .addCase(fetchCustomerAvailableUsers.rejected, (state, action) => {
        state.available.status = 'failed';
        state.available.error = getError(action);
      })
      .addCase(addCustomerUser.pending, (state, action) => {
        state.mutation = { status: 'loading', error: null, customerId: action.meta.arg.customerId };
      })
      .addCase(removeCustomerUser.pending, (state, action) => {
        state.mutation = { status: 'loading', error: null, customerId: action.meta.arg.customerId };
      })
      .addMatcher(
        (action) =>
          addCustomerUser.fulfilled.match(action) || removeCustomerUser.fulfilled.match(action),
        (state, action) => {
          state.mutation = {
            status: 'succeeded',
            error: null,
            customerId: action.payload.customerId,
          };
        }
      )
      .addMatcher(
        (action) =>
          addCustomerUser.rejected.match(action) || removeCustomerUser.rejected.match(action),
        (state, action) => {
          state.mutation = {
            status: 'failed',
            error: getError(action),
            customerId: action.meta.arg.customerId,
          };
        }
      ),
});

export const { resetUserCustomerRelationships } = userCustomerRelationshipsSlice.actions;
export default userCustomerRelationshipsSlice.reducer;
