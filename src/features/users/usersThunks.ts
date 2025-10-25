import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type { User, UserRoleInfo } from './usersSlice';
import { parseUserRole } from '@/features/users/roles';
import type { UserRole } from '@/features/users/roles';
import { readPersistedAuthToken } from '@/features/auth/persistence';

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  search?: string;
  sorts?: Array<{ field: string; direction: 'asc' | 'desc' }>;
}

export interface FetchUserByIdResult {
  user: User;
}

export interface UpdateUserPayload {
  id: string;
  data: {
    name: string;
    lastname: string;
    email: string;
    roleId: UserRole;
    statusId: string;
    cellPhone: {
      countryCode: string;
      number: string;
    } | null;
  };
}

export interface UpdateUserResult {
  user: User;
  message: string | null;
}

interface ApiUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  role_name: string;
  status: string;
  status_name: string;
  cell_phone: null | {
    country_code: string;
    number: string;
  };
  created_at: string;
}

interface FetchUsersApiResponse {
  data: ApiUser[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface FetchUsersResult {
  users: User[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

const mapUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  lastname: user.lastname,
  fullName: [user.name, user.lastname].filter(Boolean).join(' ').trim() || user.email,
  role: user.role,
  roleName: user.role_name,
  status: user.status,
  statusName: user.status_name,
  cellPhone: user.cell_phone
    ? {
        countryCode: user.cell_phone.country_code,
        number: user.cell_phone.number,
      }
    : null,
  createdAt: user.created_at,
});

export const fetchUsers = createAsyncThunk<
  FetchUsersResult,
  FetchUsersParams | undefined,
  { state: RootState }
>('users/fetchAll', async (params = {}, thunkAPI) => {
  const { page = 1, limit = 10, itemsPerPage, search, sorts = [] } = params;
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    items_per_page: String(itemsPerPage ?? limit),
  });

  if (search && search.trim().length > 0) {
    query.set('search', search.trim());
  }

  sorts
    .filter((sort) => sort.field && sort.direction)
    .forEach((sort, index) => {
      query.set(`sort[${index}][field]`, sort.field);
      query.set(`sort[${index}][direction]`, sort.direction);
    });

  const response = await jsonRequest<
    ApiUser[],
    { pagination?: FetchUsersApiResponse['pagination'] }
  >(`/v1/users?${query.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    token,
  });

  const apiUsers = Array.isArray(response.data) ? response.data : [];

  const paginationFromMeta = response.meta?.pagination as
    | FetchUsersApiResponse['pagination']
    | undefined;

  const apiPagination = paginationFromMeta ?? {
    page,
    per_page: limit,
    total: apiUsers.length,
    total_pages: 1,
  };

  const users = apiUsers.map(mapUser);

  return {
    users,
    pagination: {
      page: apiPagination.page,
      perPage: apiPagination.per_page,
      total: apiPagination.total,
      totalPages: apiPagination.total_pages,
    },
  };
});

export const fetchUserById = createAsyncThunk<
  FetchUserByIdResult,
  { id: string },
  { state: RootState }
>('users/fetchById', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const tokenFromState = state.auth.token;
  const token = tokenFromState ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiUser>(`/v1/users/${id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    const user = mapUser(response.data);

    return { user, message: response.successMessage ?? null };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible obtener el usuario';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUser = createAsyncThunk<
  UpdateUserResult,
  UpdateUserPayload,
  { state: RootState }
>('users/updateOne', async ({ id, data }, thunkAPI) => {
  const state = thunkAPI.getState();
  const tokenFromState = state.auth.token;
  const token = tokenFromState ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiUser>(`/v1/users/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        role_id: data.roleId,
        status_id: data.statusId,
        cell_phone: data.cellPhone
          ? {
              country_code: data.cellPhone.countryCode,
              number: data.cellPhone.number,
            }
          : null,
      },
      token,
    });

    const user = mapUser(response.data);

    return { user, message: response.successMessage ?? null };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar la información del usuario';
    return thunkAPI.rejectWithValue(message);
  }
});

export const inviteUser = createAsyncThunk<User, { email: string }>('users/invite', async () => {
  // TODO: replace with API call
  throw new Error('inviteUser thunk not implemented yet');
});

interface ApiUserRole {
  id: string;
  name: string;
  description?: string | null;
  rank?: number | null;
}

export const fetchUserRoles = createAsyncThunk<UserRoleInfo[], void, { state: RootState }>(
  'users/fetchRoles',
  async (_void, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiUserRole[]>(`/v1/users/roles`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      });

      const roles = Array.isArray(response.data) ? response.data : [];

      return roles.map((role) => ({
        id: parseUserRole(role.id),
        rawId: role.id,
        name: role.name,
        description: role.description ?? null,
        rank: typeof role.rank === 'number' ? role.rank : null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No fue posible obtener los roles';
      return thunkAPI.rejectWithValue(message);
    }
  }
);
