import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type { User, UserRoleInfo } from './usersSlice';
import { parseUserRole } from '@/features/users/roles';

export interface FetchUsersParams {
  page?: number;
  limit?: number;
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
  const { page = 1, limit = 10 } = params;
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await jsonRequest<
    ApiUser[],
    { pagination?: FetchUsersApiResponse['pagination'] }
  >(`/v1/users?${query.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-user-lang': typeof document !== 'undefined' ? document.documentElement.lang || 'es' : 'es',
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
          'x-user-lang':
            typeof document !== 'undefined' ? document.documentElement.lang || 'es' : 'es',
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
