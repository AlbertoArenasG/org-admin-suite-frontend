import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createContact,
  deleteContact,
  fetchContactById,
  fetchContacts,
  searchContacts,
  updateContact,
} from './contactsThunks';
import type {
  ContactDetail,
  ContactListFilters,
  ContactListItem,
  ContactListSort,
  ContactsState,
} from './types';

const initialFilters: ContactListFilters = {
  status: null,
  type: null,
};

const initialSorts: ContactListSort[] = [{ field: 'created_at', direction: 'desc' }];

const initialState: ContactsState = {
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
    currentContactId: null,
  },
  search: {
    items: [],
    status: 'idle',
    error: null,
    query: '',
  },
  mutations: {
    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    error: null,
    lastCreatedContactId: null,
    currentContactId: null,
    message: null,
  },
};

function upsertListItem(items: ContactListItem[], item: ContactListItem) {
  const index = items.findIndex((entry) => entry.contactId === item.contactId);
  if (index >= 0) {
    items[index] = item;
    return;
  }
  items.unshift(item);
}

function toListItem(detail: ContactDetail): ContactListItem {
  return {
    contactId: detail.contactId,
    type: detail.type,
    userId: detail.userId,
    name: detail.name,
    lastname: detail.lastname,
    fullName: detail.fullName,
    companyName: detail.companyName,
    primaryEmail: detail.emails[0]?.value ?? null,
    primaryCellPhone: detail.cellPhones[0]?.value ?? null,
    statusId: detail.statusId,
    statusName: detail.statusName,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    resetContactsMutations(state) {
      state.mutations = {
        createStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        error: null,
        lastCreatedContactId: null,
        currentContactId: null,
        message: null,
      };
    },
    clearContactSearch(state) {
      state.search.items = [];
      state.search.status = 'idle';
      state.search.error = null;
      state.search.query = '';
    },
    setContactDetail(state, action: PayloadAction<ContactDetail | null>) {
      state.detail.item = action.payload;
      state.detail.currentContactId = action.payload?.contactId ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.list.status = 'loading';
        state.list.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.list.status = 'succeeded';
        state.list.items = action.payload.items;
        state.list.page = action.payload.pagination.page;
        state.list.perPage = action.payload.pagination.perPage;
        state.list.total = action.payload.pagination.total;
        state.list.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.list.status = 'failed';
        state.list.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener los contactos';
      })
      .addCase(searchContacts.pending, (state, action) => {
        state.search.status = 'loading';
        state.search.error = null;
        state.search.query = action.meta.arg.q;
      })
      .addCase(searchContacts.fulfilled, (state, action) => {
        state.search.status = 'succeeded';
        state.search.items = action.payload;
      })
      .addCase(searchContacts.rejected, (state, action) => {
        state.search.status = 'failed';
        state.search.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible buscar contactos';
      })
      .addCase(fetchContactById.pending, (state, action) => {
        state.detail.status = 'loading';
        state.detail.error = null;
        state.detail.currentContactId = action.meta.arg.contactId;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.detail.status = 'succeeded';
        state.detail.item = action.payload.contact;
        state.detail.currentContactId = action.payload.contact.contactId;
        upsertListItem(state.list.items, toListItem(action.payload.contact));
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.detail.status = 'failed';
        state.detail.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible obtener el contacto';
      })
      .addCase(createContact.pending, (state) => {
        state.mutations.createStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentContactId = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.mutations.createStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.lastCreatedContactId = action.payload.contact.contactId;
        state.mutations.currentContactId = action.payload.contact.contactId;
        upsertListItem(state.list.items, toListItem(action.payload.contact));
      })
      .addCase(createContact.rejected, (state, action) => {
        state.mutations.createStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible crear el contacto';
      })
      .addCase(updateContact.pending, (state, action) => {
        state.mutations.updateStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentContactId = action.meta.arg.contactId;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.mutations.updateStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentContactId = action.payload.contact.contactId;
        if (state.detail.currentContactId === action.payload.contact.contactId) {
          state.detail.item = action.payload.contact;
        }
        upsertListItem(state.list.items, toListItem(action.payload.contact));
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.mutations.updateStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible actualizar el contacto';
      })
      .addCase(deleteContact.pending, (state, action) => {
        state.mutations.deleteStatus = 'loading';
        state.mutations.error = null;
        state.mutations.message = null;
        state.mutations.currentContactId = action.meta.arg.contactId;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.mutations.deleteStatus = 'succeeded';
        state.mutations.message = action.payload.message;
        state.mutations.currentContactId = action.payload.contactId;
        state.list.items = state.list.items.filter(
          (item) => item.contactId !== action.payload.contactId
        );
        if (state.detail.currentContactId === action.payload.contactId) {
          state.detail.item = null;
        }
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.mutations.deleteStatus = 'failed';
        state.mutations.error =
          (action.payload as string | undefined) ??
          action.error.message ??
          'No fue posible eliminar el contacto';
      });
  },
});

export const { resetContactsMutations, clearContactSearch, setContactDetail } =
  contactsSlice.actions;

export default contactsSlice.reducer;
