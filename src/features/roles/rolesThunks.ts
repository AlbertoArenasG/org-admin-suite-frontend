'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import type {
  ChangeRoleStatusPayload,
  CreateRolePayload,
  DeleteRolePayload,
  FetchRolesParams,
  FetchRolesResult,
  RoleActorSummary,
  RoleDetail,
  RoleListItem,
  RoleModuleCatalogItem,
  RolePermission,
  UpdateRolePayload,
} from './types';

interface ApiRolePermission {
  module: string;
  operation: string;
}

interface ApiRoleActorSummary {
  user_id: string;
  name: string | null;
  email: string | null;
}

interface ApiRoleItem {
  role_id: string;
  name: string;
  code: string;
  scope: 'MASTER_ADMIN' | 'ADMIN' | 'USER';
  is_system: boolean;
  is_immutable: boolean;
  is_default: boolean;
  status_id: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  permissions: ApiRolePermission[];
  created_by: ApiRoleActorSummary | null;
  updated_by: ApiRoleActorSummary | null;
  created_at: string | null;
  updated_at: string | null;
}

interface ApiRoleModuleItem {
  module_id: string;
  module_code: string;
  module_name: string;
  module_name_key: string;
  status_id: string;
  is_system: boolean;
  operations: Array<{
    operation_id: string;
    operation_code: string;
    operation_name: string;
    operation_name_key: string;
    status_id: string;
    is_system: boolean;
  }>;
}

interface PaginationMeta {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

function requireToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

function mapPermission(permission: ApiRolePermission): RolePermission {
  return {
    module: permission.module,
    operation: permission.operation,
  };
}

function mapActorSummary(actor: ApiRoleActorSummary | null): RoleActorSummary | null {
  if (!actor) {
    return null;
  }

  return {
    userId: actor.user_id,
    name: actor.name,
    email: actor.email,
  };
}

function mapRoleItem(role: ApiRoleItem): RoleListItem {
  return {
    roleId: role.role_id,
    name: role.name,
    code: role.code,
    scope: role.scope,
    isSystem: role.is_system,
    isImmutable: role.is_immutable,
    isDefault: role.is_default,
    statusId: role.status_id,
    permissions: Array.isArray(role.permissions) ? role.permissions.map(mapPermission) : [],
    createdBy: mapActorSummary(role.created_by),
    updatedBy: mapActorSummary(role.updated_by),
    createdAt: role.created_at,
    updatedAt: role.updated_at,
  };
}

function mapRoleModuleItem(module: ApiRoleModuleItem): RoleModuleCatalogItem {
  return {
    moduleId: module.module_id,
    moduleCode: module.module_code,
    moduleName: module.module_name,
    moduleNameKey: module.module_name_key,
    statusId: module.status_id,
    isSystem: module.is_system,
    operations: Array.isArray(module.operations)
      ? module.operations.map((operation) => ({
          operationId: operation.operation_id,
          operationCode: operation.operation_code,
          operationName: operation.operation_name,
          operationNameKey: operation.operation_name_key,
          statusId: operation.status_id,
          isSystem: operation.is_system,
        }))
      : [],
  };
}

export const fetchRoles = createAsyncThunk<
  FetchRolesResult,
  FetchRolesParams | undefined,
  { state: RootState }
>('roles/fetchAll', async (params = {}, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const { page = 1, limit = 10, search, filters, sorts = [] } = params;
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search && search.trim().length > 0) {
    query.set('search', search.trim());
  }

  if (filters?.scope) {
    query.set('scope', filters.scope);
  }

  if (filters?.status) {
    query.set('status', filters.status);
  }

  if (filters?.isSystem !== null && filters?.isSystem !== undefined) {
    query.set('is_system', String(filters.isSystem));
  }

  sorts.forEach((sort, index) => {
    query.set(`sort[${index}][field]`, sort.field);
    query.set(`sort[${index}][direction]`, sort.direction);
  });

  try {
    const response = await jsonRequest<ApiRoleItem[], { pagination?: PaginationMeta }>(
      `/v1/roles?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    const roles = Array.isArray(response.data) ? response.data.map(mapRoleItem) : [];
    const pagination =
      response.meta?.pagination ?? (response.raw.pagination as PaginationMeta | undefined);

    return {
      items: roles,
      pagination: {
        page: pagination?.page ?? page,
        perPage: pagination?.per_page ?? limit,
        total: pagination?.total ?? roles.length,
        totalPages: pagination?.total_pages ?? (roles.length ? 1 : 0),
      },
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible obtener los roles';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRoleById = createAsyncThunk<RoleDetail, { roleId: string }, { state: RootState }>(
  'roles/fetchById',
  async ({ roleId }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = requireToken(state);

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiRoleItem>(`/v1/roles/${roleId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      });

      return mapRoleItem(response.data);
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'No fue posible obtener el rol';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchRoleModules = createAsyncThunk<
  RoleModuleCatalogItem[],
  void,
  { state: RootState }
>('roles/fetchModules', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRoleModuleItem[]>(`/v1/roles/modules`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return Array.isArray(response.data) ? response.data.map(mapRoleModuleItem) : [];
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener los módulos de roles';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createRole = createAsyncThunk<
  { role: RoleDetail; message: string | null },
  CreateRolePayload,
  { state: RootState }
>('roles/createOne', async (payload, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRoleItem>(`/v1/roles`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        name: payload.name,
        permissions: payload.permissions,
      },
      token,
    });

    return {
      role: mapRoleItem(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible crear el rol';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRole = createAsyncThunk<
  { role: RoleDetail; message: string | null },
  UpdateRolePayload,
  { state: RootState }
>('roles/updateOne', async ({ roleId, permissions }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRoleItem>(`/v1/roles/${roleId}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        permissions,
      },
      token,
    });

    return {
      role: mapRoleItem(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible actualizar el rol';
    return thunkAPI.rejectWithValue(message);
  }
});

export const changeRoleStatus = createAsyncThunk<
  { role: RoleDetail; message: string | null },
  ChangeRoleStatusPayload,
  { state: RootState }
>('roles/changeStatus', async ({ roleId, statusId }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiRoleItem>(`/v1/roles/${roleId}/status`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        status_id: statusId,
      },
      token,
    });

    return {
      role: mapRoleItem(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar el estado del rol';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteRole = createAsyncThunk<
  { roleId: string; message: string | null },
  DeleteRolePayload,
  { state: RootState }
>('roles/deleteOne', async ({ roleId }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = requireToken(state);

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/roles/${roleId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return {
      roleId,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible eliminar el rol';
    return thunkAPI.rejectWithValue(message);
  }
});
