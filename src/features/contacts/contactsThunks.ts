import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type {
  ContactDetail,
  ContactListItem,
  ContactMutationPayload,
  ContactSearchItem,
  CreateContactPayload,
  DeleteContactPayload,
  FetchContactsParams,
  FetchContactsResult,
  SearchContactsParams,
  UpdateContactPayload,
} from './types';

interface ApiContactValue {
  value: string;
}

interface ApiContactActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiContactListItem {
  contact_id: string;
  is_internal_staff: boolean;
  user_id: string | null;
  name: string;
  lastname: string;
  full_name: string;
  company_name: string | null;
  primary_email: string | null;
  primary_cell_phone: string | null;
  status_id: ContactListItem['statusId'];
  status_name: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiContactDetail extends ApiContactListItem {
  emails: ApiContactValue[];
  phones: ApiContactValue[];
  cell_phones: ApiContactValue[];
  created_by: ApiContactActorSummary | null;
  updated_by: ApiContactActorSummary | null;
}

interface ApiContactSearchItem {
  contact_id: string;
  is_internal_staff: boolean;
  user_id: string | null;
  full_name: string;
  company_name: string | null;
  primary_email: string | null;
  primary_cell_phone: string | null;
}

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

const mapActorSummary = (
  actor: ApiContactActorSummary | null
): ContactDetail['createdBy'] | ContactDetail['updatedBy'] =>
  actor
    ? {
        userId: actor.user_id,
        name: actor.name,
        email: actor.email,
      }
    : null;

const mapContactListItem = (item: ApiContactListItem): ContactListItem => ({
  contactId: item.contact_id,
  isInternalStaff: item.is_internal_staff,
  userId: item.user_id,
  name: item.name,
  lastname: item.lastname,
  fullName: item.full_name,
  companyName: item.company_name,
  primaryEmail: item.primary_email,
  primaryCellPhone: item.primary_cell_phone,
  statusId: item.status_id,
  statusName: item.status_name,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const mapContactDetail = (item: ApiContactDetail): ContactDetail => ({
  ...mapContactListItem(item),
  emails: item.emails ?? [],
  phones: item.phones ?? [],
  cellPhones: item.cell_phones ?? [],
  createdBy: mapActorSummary(item.created_by),
  updatedBy: mapActorSummary(item.updated_by),
});

const mapSearchItem = (item: ApiContactSearchItem): ContactSearchItem => ({
  contactId: item.contact_id,
  isInternalStaff: item.is_internal_staff,
  userId: item.user_id,
  fullName: item.full_name,
  companyName: item.company_name,
  primaryEmail: item.primary_email,
  primaryCellPhone: item.primary_cell_phone,
});

function buildMutationBody(payload: ContactMutationPayload) {
  return {
    name: payload.name,
    lastname: payload.lastname,
    ...(payload.companyName ? { company_name: payload.companyName } : {}),
    emails: payload.emails,
    phones: payload.phones,
    cell_phones: payload.cellPhones,
    ...(payload.isInternalStaff === undefined
      ? {}
      : { is_internal_staff: payload.isInternalStaff }),
  };
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

export const fetchContacts = createAsyncThunk<
  FetchContactsResult,
  FetchContactsParams | undefined,
  { state: RootState }
>('contacts/fetchAll', async (params = {}, thunkAPI) => {
  const { page = 1, limit = 10, itemsPerPage, search, filters = {}, sorts = [] } = params;
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    items_per_page: String(itemsPerPage ?? limit),
  });

  if (search?.trim()) {
    query.set('search', search.trim());
  }

  if (filters.status) {
    query.set('status', filters.status);
  }

  if (filters.isInternalStaff !== undefined && filters.isInternalStaff !== null) {
    query.set('is_internal_staff', String(filters.isInternalStaff));
  }

  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<ApiContactListItem[], { pagination?: PaginationMeta }>(
      `/v1/contacts?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    const items = Array.isArray(response.data) ? response.data.map(mapContactListItem) : [];
    const pagination = response.meta?.pagination ?? {
      page,
      per_page: limit,
      total: items.length,
      total_pages: 1,
    };

    return {
      items,
      pagination: {
        page: pagination.page,
        perPage: pagination.per_page,
        total: pagination.total,
        totalPages: pagination.total_pages,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener los contactos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const searchContacts = createAsyncThunk<
  ContactSearchItem[],
  SearchContactsParams,
  { state: RootState }
>('contacts/search', async ({ q, limit = 10 }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    q: q.trim(),
    limit: String(limit),
  });

  try {
    const response = await jsonRequest<ApiContactSearchItem[]>(
      `/v1/contacts/search?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return Array.isArray(response.data) ? response.data.map(mapSearchItem) : [];
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible buscar contactos';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchContactById = createAsyncThunk<
  { contact: ContactDetail },
  { contactId: string },
  { state: RootState }
>('contacts/fetchById', async ({ contactId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiContactDetail>(`/v1/contacts/${contactId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return { contact: mapContactDetail(response.data) };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener el contacto';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createContact = createAsyncThunk<
  { contact: ContactDetail; message: string | null },
  CreateContactPayload,
  { state: RootState }
>('contacts/createOne', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiContactDetail>('/v1/contacts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: buildMutationBody(payload),
      token,
    });

    return {
      contact: mapContactDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible crear el contacto';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateContact = createAsyncThunk<
  { contact: ContactDetail; message: string | null },
  UpdateContactPayload,
  { state: RootState }
>('contacts/updateOne', async ({ contactId, ...payload }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiContactDetail>(`/v1/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: buildMutationBody(payload),
      token,
    });

    return {
      contact: mapContactDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar el contacto';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteContact = createAsyncThunk<
  { contactId: string; message: string | null },
  DeleteContactPayload,
  { state: RootState }
>('contacts/deleteOne', async ({ contactId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/contacts/${contactId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return {
      contactId,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el contacto';
    return thunkAPI.rejectWithValue(message);
  }
});
