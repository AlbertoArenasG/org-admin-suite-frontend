import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type {
  CommunicationChannel,
  CreateRecipientGroupPayload,
  DeleteRecipientGroupPayload,
  FetchRecipientGroupsParams,
  FetchRecipientGroupsResult,
  RecipientGroupActorSummary,
  RecipientGroupContactSummary,
  RecipientGroupDetail,
  RecipientGroupListItem,
  RecipientGroupMutationPayload,
  UpdateRecipientGroupPayload,
} from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface ApiCommunicationChannel {
  code: string;
  name: string;
  name_key: string;
}

interface ApiRecipientGroupActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiRecipientGroupContactSummary {
  contact_id: string;
  type: RecipientGroupContactSummary['type'];
  user_id: string | null;
  full_name: string;
  company_name: string | null;
  primary_email: string | null;
  primary_cell_phone: string | null;
  status_id: RecipientGroupContactSummary['statusId'];
  status_name: string;
}

interface ApiRecipientGroupListItem {
  recipient_group_id: string;
  name: string;
  code: string;
  description: string | null;
  enabled_channels: ApiCommunicationChannel[];
  contacts_count: number;
  status_id: RecipientGroupListItem['statusId'];
  status_name: string;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiRecipientGroupDetail extends ApiRecipientGroupListItem {
  contacts: ApiRecipientGroupContactSummary[];
  created_by: ApiRecipientGroupActorSummary | null;
  updated_by: ApiRecipientGroupActorSummary | null;
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

const mapCommunicationChannel = (channel: ApiCommunicationChannel): CommunicationChannel => ({
  code: channel.code,
  name: channel.name,
  nameKey: channel.name_key,
});

const mapActorSummary = (
  actor: ApiRecipientGroupActorSummary | null
): RecipientGroupActorSummary | null =>
  actor
    ? {
        userId: actor.user_id,
        name: actor.name,
        email: actor.email,
      }
    : null;

const mapContactSummary = (
  contact: ApiRecipientGroupContactSummary
): RecipientGroupContactSummary => ({
  contactId: contact.contact_id,
  type: contact.type,
  userId: contact.user_id,
  fullName: contact.full_name,
  companyName: contact.company_name,
  primaryEmail: contact.primary_email,
  primaryCellPhone: contact.primary_cell_phone,
  statusId: contact.status_id,
  statusName: contact.status_name,
});

const mapRecipientGroupListItem = (item: ApiRecipientGroupListItem): RecipientGroupListItem => ({
  recipientGroupId: item.recipient_group_id,
  name: item.name,
  code: item.code,
  description: item.description,
  enabledChannels: Array.isArray(item.enabled_channels)
    ? item.enabled_channels.map(mapCommunicationChannel)
    : [],
  contactsCount: item.contacts_count,
  statusId: item.status_id,
  statusName: item.status_name,
  createdAt: item.created_at,
  updatedAt: item.updated_at,
});

const mapRecipientGroupDetail = (item: ApiRecipientGroupDetail): RecipientGroupDetail => ({
  ...mapRecipientGroupListItem(item),
  contacts: Array.isArray(item.contacts) ? item.contacts.map(mapContactSummary) : [],
  createdBy: mapActorSummary(item.created_by),
  updatedBy: mapActorSummary(item.updated_by),
});

function buildMutationBody(payload: RecipientGroupMutationPayload) {
  return {
    name: payload.name,
    ...(payload.description ? { description: payload.description } : {}),
    enabled_channels: payload.enabledChannels,
    contact_ids: payload.contactIds,
  };
}

export const fetchCommunicationChannels = createAsyncThunk<
  CommunicationChannel[],
  void,
  { state: RootState }
>('recipientGroups/fetchCommunicationChannels', async (_, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiCommunicationChannel[]>('/v1/communication-channels', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });

    return Array.isArray(response.data) ? response.data.map(mapCommunicationChannel) : [];
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener los canales de comunicación';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRecipientGroups = createAsyncThunk<
  FetchRecipientGroupsResult,
  FetchRecipientGroupsParams | undefined,
  { state: RootState }
>('recipientGroups/fetchAll', async (params = {}, thunkAPI) => {
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

  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<
      ApiRecipientGroupListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/recipient-groups?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });

    const items = Array.isArray(response.data) ? response.data.map(mapRecipientGroupListItem) : [];
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
        : 'No fue posible obtener los grupos de destinatarios';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRecipientGroupById = createAsyncThunk<
  { recipientGroup: RecipientGroupDetail },
  { recipientGroupId: string },
  { state: RootState }
>('recipientGroups/fetchById', async ({ recipientGroupId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRecipientGroupDetail>(
      `/v1/recipient-groups/${recipientGroupId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return { recipientGroup: mapRecipientGroupDetail(response.data) };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener el grupo de destinatarios';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createRecipientGroup = createAsyncThunk<
  { recipientGroup: RecipientGroupDetail; message: string | null },
  CreateRecipientGroupPayload,
  { state: RootState }
>('recipientGroups/createOne', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRecipientGroupDetail>('/v1/recipient-groups', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: buildMutationBody(payload),
      token,
    });

    return {
      recipientGroup: mapRecipientGroupDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible crear el grupo de destinatarios';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRecipientGroup = createAsyncThunk<
  { recipientGroup: RecipientGroupDetail; message: string | null },
  UpdateRecipientGroupPayload,
  { state: RootState }
>('recipientGroups/updateOne', async ({ recipientGroupId, ...payload }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRecipientGroupDetail>(
      `/v1/recipient-groups/${recipientGroupId}`,
      {
        method: 'PATCH',
        headers: { Accept: 'application/json' },
        body: buildMutationBody(payload),
        token,
      }
    );

    return {
      recipientGroup: mapRecipientGroupDetail(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar el grupo de destinatarios';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteRecipientGroup = createAsyncThunk<
  { recipientGroupId: string; message: string | null },
  DeleteRecipientGroupPayload,
  { state: RootState }
>('recipientGroups/deleteOne', async ({ recipientGroupId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/recipient-groups/${recipientGroupId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      token,
    });

    return {
      recipientGroupId,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el grupo de destinatarios';
    return thunkAPI.rejectWithValue(message);
  }
});
