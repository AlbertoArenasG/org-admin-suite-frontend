import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createRecipientGroup,
  deleteRecipientGroup,
  fetchCommunicationChannels,
  fetchRecipientGroupById,
  fetchRecipientGroups,
  updateRecipientGroup,
} from './recipientGroupsThunks';
import type {
  RecipientGroupDetail,
  RecipientGroupListFilters,
  RecipientGroupListItem,
  RecipientGroupListSort,
  RecipientGroupsState,
} from './types';

const initialFilters: RecipientGroupListFilters = {
  status: null,
};

const initialSorts: RecipientGroupListSort[] = [{ field: 'created_at', direction: 'desc' }];

const initialState: RecipientGroupsState = {
  list: {
    items: [],
    status: 'idle',
    error: null,
    page: 1,
    perPage: 10,
    total: 0,
    totalPages: 0,
    search: '',
    filters: initialFilters,
    sorts: initialSorts,
  },
  detail: {
    item: null,
    status: 'idle',
    error: null,
    currentRecipientGroupId: null,
  },
  catalogs: {
    communicationChannels: [],
    status: 'idle',
    error: null,
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    lastCreatedRecipientGroupId: null,
    currentRecipientGroupId: null,
    message: null,
  },
};

function upsertListItem(items: RecipientGroupListItem[], item: RecipientGroupListItem) {
  const index = items.findIndex((entry) => entry.recipientGroupId === item.recipientGroupId);
  if (index >= 0) {
    items[index] = item;
    return;
  }
  items.unshift(item);
}

function toListItem(detail: RecipientGroupDetail): RecipientGroupListItem {
  return {
    recipientGroupId: detail.recipientGroupId,
    name: detail.name,
    code: detail.code,
    description: detail.description,
    enabledChannels: detail.enabledChannels,
    contactsCount: detail.contacts.length,
    statusId: detail.statusId,
    statusName: detail.statusName,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

const recipientGroupsSlice = createSlice({
  name: 'recipientGroups',
  initialState,
  reducers: {
    resetRecipientGroupMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: null,
        lastCreatedRecipientGroupId: null,
        currentRecipientGroupId: null,
        message: null,
      };
    },
    setRecipientGroupDetail(state, action: PayloadAction<RecipientGroupDetail | null>) {
      state.detail.item = action.payload;
      state.detail.currentRecipientGroupId = action.payload?.recipientGroupId ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommunicationChannels.pending, (state) => {
        state.catalogs.status = 'loading';
        state.catalogs.error = null;
      })
      .addCase(fetchCommunicationChannels.fulfilled, (state, action) => {
        state.catalogs.status = 'succeeded';
        state.catalogs.communicationChannels = action.payload;
      })
      .addCase(fetchCommunicationChannels.rejected, (state, action) => {
        state.catalogs.status = 'failed';
        state.catalogs.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los canales de comunicación';
      })
      .addCase(fetchRecipientGroups.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchRecipientGroups.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchRecipientGroups.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los grupos de destinatarios';
      })
      .addCase(fetchRecipientGroupById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentRecipientGroupId = action.meta.arg.recipientGroupId;
      })
      .addCase(fetchRecipientGroupById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.item = action.payload.recipientGroup;
        state.detail.currentRecipientGroupId = action.payload.recipientGroup.recipientGroupId;
        upsertListItem(state.list.items, toListItem(action.payload.recipientGroup));
      })
      .addCase(fetchRecipientGroupById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el grupo de destinatarios';
      })
      .addCase(createRecipientGroup.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecipientGroupId = null;
      })
      .addCase(createRecipientGroup.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedRecipientGroupId =
          action.payload.recipientGroup.recipientGroupId;
        state.mutations.currentRecipientGroupId = action.payload.recipientGroup.recipientGroupId;
        upsertListItem(state.list.items, toListItem(action.payload.recipientGroup));
      })
      .addCase(createRecipientGroup.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el grupo de destinatarios';
      })
      .addCase(updateRecipientGroup.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecipientGroupId = action.meta.arg.recipientGroupId;
      })
      .addCase(updateRecipientGroup.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecipientGroupId = action.payload.recipientGroup.recipientGroupId;
        if (
          state.detail.currentRecipientGroupId === action.payload.recipientGroup.recipientGroupId
        ) {
          state.detail.item = action.payload.recipientGroup;
        }
        upsertListItem(state.list.items, toListItem(action.payload.recipientGroup));
      })
      .addCase(updateRecipientGroup.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el grupo de destinatarios';
      })
      .addCase(deleteRecipientGroup.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentRecipientGroupId = action.meta.arg.recipientGroupId;
      })
      .addCase(deleteRecipientGroup.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentRecipientGroupId = action.payload.recipientGroupId;
        state.list.items = state.list.items.filter(
          (item) => item.recipientGroupId !== action.payload.recipientGroupId
        );
        if (state.detail.currentRecipientGroupId === action.payload.recipientGroupId) {
          state.detail.item = null;
        }
      })
      .addCase(deleteRecipientGroup.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el grupo de destinatarios';
      });
  },
});

export const { resetRecipientGroupMutations, setRecipientGroupDetail } =
  recipientGroupsSlice.actions;

export default recipientGroupsSlice.reducer;
