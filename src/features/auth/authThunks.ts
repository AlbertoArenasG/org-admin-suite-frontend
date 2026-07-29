import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest, ApiError } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  AuthAuthorization,
  AuthModuleAccess,
  AuthPermissionAccess,
  AuthRoleMetadata,
  AuthSystemRole,
  AuthUser,
} from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  system_role: AuthSystemRole;
  role_id: string | null;
  status: string;
  cell_phone: null | {
    country_code: string;
    number: string;
  };
}

interface LoginResponseData {
  access_token: string;
  user: LoginResponseUser;
}

export interface LoginResult {
  token: string;
  user: AuthUser;
  authorization: AuthAuthorization;
  message: string | null;
}

interface PermissionsResponseRole {
  id: string;
  code: string;
  name: string;
  scope: string;
  is_system: boolean;
  is_default: boolean;
  is_immutable: boolean;
  status: string;
}

interface PermissionsResponseModule {
  code: string;
  name: string;
  name_key: string;
}

interface PermissionsResponsePermission {
  module: string;
  module_name: string;
  module_name_key: string;
  operation: string;
  operation_name: string;
  operation_name_key: string;
}

interface PermissionsResponseData {
  system_role: AuthSystemRole;
  role: PermissionsResponseRole | null;
  modules: PermissionsResponseModule[];
  permissions: PermissionsResponsePermission[];
}

export interface PasswordResetRequestPayload {
  email: string;
  lang?: string;
}

export interface PasswordResetConfirmPayload {
  token: string;
  password: string;
  lang?: string;
}

function mapLoginUser(user: LoginResponseUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    systemRole: user.system_role,
    roleId: user.role_id,
    status: user.status,
    cellPhone: user.cell_phone
      ? {
          countryCode: user.cell_phone.country_code,
          number: user.cell_phone.number,
        }
      : null,
  };
}

function mapAuthorizationRole(role: PermissionsResponseRole | null): AuthRoleMetadata | null {
  if (!role) {
    return null;
  }

  return {
    id: role.id,
    code: role.code,
    name: role.name,
    scope: role.scope,
    isSystem: role.is_system,
    isDefault: role.is_default,
    isImmutable: role.is_immutable,
    status: role.status,
  };
}

function mapAuthorizationModule(module: PermissionsResponseModule): AuthModuleAccess {
  return {
    code: module.code,
    name: module.name,
    nameKey: module.name_key,
  };
}

function mapAuthorizationPermission(
  permission: PermissionsResponsePermission
): AuthPermissionAccess {
  return {
    module: permission.module,
    moduleName: permission.module_name,
    moduleNameKey: permission.module_name_key,
    operation: permission.operation,
    operationName: permission.operation_name,
    operationNameKey: permission.operation_name_key,
  };
}

async function requestMyPermissions(token: string): Promise<AuthAuthorization> {
  const { data } = await jsonRequest<PermissionsResponseData>('/v1/auth/me/permissions', {
    method: 'GET',
    token,
  });

  return {
    role: mapAuthorizationRole(data.role),
    modules: Array.isArray(data.modules) ? data.modules.map(mapAuthorizationModule) : [],
    permissions: Array.isArray(data.permissions)
      ? data.permissions.map(mapAuthorizationPermission)
      : [],
  };
}

export const login = createAsyncThunk<
  LoginResult,
  LoginPayload,
  { rejectValue: string; state: RootState }
>('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data, successMessage } = await jsonRequest<LoginResponseData>('/v1/auth/login', {
      method: 'POST',
      body: payload,
      skipAuthRedirect: true,
    });

    const authorization = await requestMyPermissions(data.access_token);

    return {
      token: data.access_token,
      user: mapLoginUser(data.user),
      authorization,
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message || 'Correo electrónico o contraseña inválidos');
    }
    return rejectWithValue('No fue posible iniciar sesión');
  }
});

export const fetchCurrentUser = createAsyncThunk<AuthUser, void, { state: RootState }>(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      if (!token) {
        return rejectWithValue('Sesión no encontrada');
      }

      const { data } = await jsonRequest<LoginResponseUser>('/v1/auth/me', {
        method: 'GET',
        token,
      });

      return mapLoginUser(data);
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message || 'No fue posible recuperar la sesión');
      }
      return rejectWithValue('No fue posible recuperar la sesión');
    }
  }
);

export const fetchMyPermissions = createAsyncThunk<
  AuthAuthorization,
  void,
  { state: RootState; rejectValue: string }
>('auth/fetchMyPermissions', async (_, { rejectWithValue, getState }) => {
  try {
    const token = getState().auth.token;

    if (!token) {
      return rejectWithValue('Sesión no encontrada');
    }

    return await requestMyPermissions(token);
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(error.message || 'No fue posible recuperar los permisos.');
    }
    return rejectWithValue('No fue posible recuperar los permisos.');
  }
});

export interface PasswordResetRequestResult {
  message: string | null;
}

export const requestPasswordReset = createAsyncThunk<
  PasswordResetRequestResult,
  PasswordResetRequestPayload,
  { rejectValue: string }
>('auth/requestPasswordReset', async (payload, { rejectWithValue }) => {
  try {
    const { successMessage } = await jsonRequest<unknown>('/v1/auth/password-reset/request', {
      method: 'POST',
      body: { email: payload.email },
      headers: {
        'Content-Type': 'application/json',
        'x-user-lang': payload.lang ?? 'es',
      },
    });

    return {
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(
        error.message || 'No fue posible solicitar el restablecimiento de contraseña.'
      );
    }
    return rejectWithValue('No fue posible solicitar el restablecimiento de contraseña.');
  }
});

export interface PasswordResetConfirmResult {
  message: string | null;
}

export const confirmPasswordReset = createAsyncThunk<
  PasswordResetConfirmResult,
  PasswordResetConfirmPayload,
  { rejectValue: string }
>('auth/confirmPasswordReset', async (payload, { rejectWithValue }) => {
  try {
    const { successMessage } = await jsonRequest<unknown>('/v1/auth/password-reset/confirm', {
      method: 'POST',
      body: { token: payload.token, password: payload.password },
      headers: {
        'Content-Type': 'application/json',
        'x-user-lang': payload.lang ?? 'es',
      },
    });

    return {
      message: successMessage,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      return rejectWithValue(
        error.message || 'El token para restablecer la contraseña no es válido.'
      );
    }
    return rejectWithValue('No fue posible restablecer la contraseña.');
  }
});
