import { createAsyncThunk } from '@reduxjs/toolkit';

import { ApiError, jsonRequest } from '@/lib/api-client';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type {
  CustomerAvailableUser,
  CustomerRelatedUser,
  CustomerRelatedUsersResult,
  UserCustomerRelationshipMutationError,
} from './types';

interface ApiUser {
  id: string;
  name: string;
  lastname: string;
  full_name?: string;
  email: string;
  system_role_name?: string;
  status: string;
  status_name: string;
}

interface AuthenticatedState {
  auth: { token: string | null };
}

function getToken(state: AuthenticatedState) {
  return state.auth.token ?? readPersistedAuthToken();
}

function mapRelatedUser(user: ApiUser): CustomerRelatedUser {
  const fullName = user.full_name ?? [user.name, user.lastname].filter(Boolean).join(' ');

  return {
    id: user.id,
    name: user.name,
    lastname: user.lastname,
    fullName,
    email: user.email,
    systemRoleName: user.system_role_name ?? 'USER',
    status: user.status,
    statusName: user.status_name,
  };
}

export const fetchCustomerRelatedUsers = createAsyncThunk<
  CustomerRelatedUsersResult,
  {
    customerId: string;
    page: number;
    limit: number;
    search: string;
    sorts: Array<{ field: string; direction: 'asc' | 'desc' }>;
  },
  { state: AuthenticatedState }
>(
  'userCustomerRelationships/fetchRelated',
  async ({ customerId, page, limit, search, sorts }, thunkAPI) => {
    const token = getToken(thunkAPI.getState());
    if (!token)
      return thunkAPI.rejectWithValue({ message: 'No hay token de autenticación', status: null });

    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      items_per_page: String(limit),
    });
    if (search.trim()) query.set('search', search.trim());
    sorts.forEach((sort, index) => {
      query.set(`sort[${index}][field]`, sort.field);
      query.set(`sort[${index}][direction]`, sort.direction);
    });
    const response = await jsonRequest<
      ApiUser[],
      { pagination?: { page: number; per_page: number; total: number; total_pages: number } }
    >(`/v1/customers/${customerId}/users?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });
    const pagination = response.meta?.pagination ?? {
      page,
      per_page: limit,
      total: response.data.length,
      total_pages: 1,
    };
    return {
      users: response.data.map(mapRelatedUser),
      pagination: {
        page: pagination.page,
        perPage: pagination.per_page,
        total: pagination.total,
        totalPages: pagination.total_pages,
      },
    };
  }
);

export const fetchCustomerAvailableUsers = createAsyncThunk<
  { customerId: string; users: CustomerAvailableUser[] },
  { customerId: string },
  { state: AuthenticatedState }
>('userCustomerRelationships/fetchAvailable', async ({ customerId }, thunkAPI) => {
  const token = getToken(thunkAPI.getState());
  if (!token)
    return thunkAPI.rejectWithValue({ message: 'No hay token de autenticación', status: null });
  const response = await jsonRequest<ApiUser[]>(`/v1/customers/${customerId}/available-users`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    token,
  });
  return {
    customerId,
    users: response.data.map((user) => ({
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      fullName: user.full_name ?? [user.name, user.lastname].filter(Boolean).join(' '),
      email: user.email,
    })),
  };
});

export const addCustomerUser = createAsyncThunk<
  { customerId: string; message: string | null },
  { customerId: string; userId: string },
  { state: AuthenticatedState; rejectValue: UserCustomerRelationshipMutationError }
>('userCustomerRelationships/add', async ({ customerId, userId }, thunkAPI) => {
  const token = getToken(thunkAPI.getState());
  if (!token)
    return thunkAPI.rejectWithValue({ message: 'No hay token de autenticación', status: null });
  try {
    const response = await jsonRequest<null>(`/v1/customers/${customerId}/users`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: { user_id: userId },
      token,
    });
    return { customerId, message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue({
      message: error instanceof Error ? error.message : 'No fue posible agregar al usuario',
      status: error instanceof ApiError ? error.status : null,
    });
  }
});

export const removeCustomerUser = createAsyncThunk<
  { customerId: string; message: string | null },
  { customerId: string; userId: string },
  { state: AuthenticatedState; rejectValue: UserCustomerRelationshipMutationError }
>('userCustomerRelationships/remove', async ({ customerId, userId }, thunkAPI) => {
  const token = getToken(thunkAPI.getState());
  if (!token)
    return thunkAPI.rejectWithValue({ message: 'No hay token de autenticación', status: null });
  try {
    const response = await jsonRequest<null>(`/v1/customers/${customerId}/users/${userId}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
      token,
    });
    return { customerId, message: response.successMessage };
  } catch (error) {
    return thunkAPI.rejectWithValue({
      message: error instanceof Error ? error.message : 'No fue posible remover al usuario',
      status: error instanceof ApiError ? error.status : null,
    });
  }
});
