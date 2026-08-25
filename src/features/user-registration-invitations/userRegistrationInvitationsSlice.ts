import { createSlice } from '@reduxjs/toolkit';

import {
  createUserRegistrationInvitation,
  fetchUserRegistrationInvitations,
  resendUserRegistrationInvitation,
  revokeUserRegistrationInvitation,
} from './userRegistrationInvitationsThunks';
import type { UserRegistrationInvitation, UserRegistrationInvitationsState } from './types';

const initialState: UserRegistrationInvitationsState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
  },
  mutations: {
    create: {
      status: 'idle',
      error: null,
      message: null,
    },
    resend: {
      status: 'idle',
      targetId: null,
      error: null,
      message: null,
    },
    revoke: {
      status: 'idle',
      targetId: null,
      error: null,
      message: null,
    },
  },
};

function replaceListItem(
  items: UserRegistrationInvitation[],
  invitation: UserRegistrationInvitation
) {
  const index = items.findIndex((item) => item.invitationId === invitation.invitationId);
  if (index >= 0) {
    items[index] = invitation;
  }
}

const userRegistrationInvitationsSlice = createSlice({
  name: 'userRegistrationInvitations',
  initialState,
  reducers: {
    resetUserRegistrationInvitationMutations(state) {
      state.mutations = initialState.mutations;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserRegistrationInvitations.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchUserRegistrationInvitations.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchUserRegistrationInvitations.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener las invitaciones';
      })
      .addCase(createUserRegistrationInvitation.pending, (state) => {
        state.mutations.create = {
          status: 'loading',
          error: null,
          message: null,
        };
      })
      .addCase(createUserRegistrationInvitation.fulfilled, (state) => {
        state.mutations.create = {
          status: 'succeeded',
          error: null,
          message: null,
        };
      })
      .addCase(createUserRegistrationInvitation.rejected, (state, action) => {
        state.mutations.create = {
          status: 'failed',
          error:
            (action.payload as string | undefined) ??
            action.error.message ??
            'No fue posible enviar la invitación',
          message: null,
        };
      })
      .addCase(resendUserRegistrationInvitation.pending, (state, action) => {
        state.mutations.resend = {
          status: 'loading',
          targetId: action.meta.arg.invitationId,
          error: null,
          message: null,
        };
      })
      .addCase(resendUserRegistrationInvitation.fulfilled, (state, action) => {
        replaceListItem(state.list.items, action.payload.invitation);
        state.mutations.resend = {
          status: 'succeeded',
          targetId: action.payload.invitation.invitationId,
          error: null,
          message: action.payload.message,
        };
      })
      .addCase(resendUserRegistrationInvitation.rejected, (state, action) => {
        state.mutations.resend = {
          status: 'failed',
          targetId: action.meta.arg.invitationId,
          error:
            (action.payload as string | undefined) ??
            action.error.message ??
            'No fue posible reenviar la invitación',
          message: null,
        };
      })
      .addCase(revokeUserRegistrationInvitation.pending, (state, action) => {
        state.mutations.revoke = {
          status: 'loading',
          targetId: action.meta.arg.invitationId,
          error: null,
          message: null,
        };
      })
      .addCase(revokeUserRegistrationInvitation.fulfilled, (state, action) => {
        replaceListItem(state.list.items, action.payload.invitation);
        state.mutations.revoke = {
          status: 'succeeded',
          targetId: action.payload.invitation.invitationId,
          error: null,
          message: action.payload.message,
        };
      })
      .addCase(revokeUserRegistrationInvitation.rejected, (state, action) => {
        state.mutations.revoke = {
          status: 'failed',
          targetId: action.meta.arg.invitationId,
          error:
            (action.payload as string | undefined) ??
            action.error.message ??
            'No fue posible revocar la invitación',
          message: null,
        };
      });
  },
});

export const { resetUserRegistrationInvitationMutations } =
  userRegistrationInvitationsSlice.actions;

export default userRegistrationInvitationsSlice.reducer;
