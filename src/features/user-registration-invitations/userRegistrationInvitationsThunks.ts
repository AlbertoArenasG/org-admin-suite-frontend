import { createAsyncThunk } from '@reduxjs/toolkit';

import type { AuthSystemRole } from '@/features/auth/types';
import { readPersistedAuthToken } from '@/features/auth/persistence';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type { CustomerRelationshipSummary } from '@/features/customers';

import type {
  CreateUserRegistrationInvitationPayload,
  FetchUserRegistrationInvitationsParams,
  FetchUserRegistrationInvitationsResult,
  InvitationDeliveryStatus,
  UserRegistrationInvitation,
  UserRegistrationInvitationMutationError,
  UserRegistrationInvitationStatus,
} from './types';

interface ApiInvitationDelivery {
  last_attempt_at: string | null;
  last_attempt_status: InvitationDeliveryStatus;
}

interface ApiUserRegistrationInvitation {
  invitation_id: string;
  email: string;
  status: UserRegistrationInvitationStatus;
  status_name: string;
  system_role: Exclude<AuthSystemRole, 'MASTER_ADMIN'>;
  system_role_name: string;
  role_id: string | null;
  role_name: string | null;
  created_at: string | null;
  consumed_at: string | null;
  revoked_at: string | null;
  email_delivery?: ApiInvitationDelivery | null;
  resend_count?: number | null;
  customers?: Array<{
    customer_id: string;
    company_name: string;
    status: string;
    status_name: string;
  }>;
}

interface ApiInvitationCreateResponse {
  email: string;
  role_id: string | null;
  name: string | null;
  lastname: string | null;
  cell_phone: {
    country_code: string;
    number: string;
  } | null;
  invitation_token: string;
}

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

function getAuthToken(state: RootState) {
  return state.auth.token ?? readPersistedAuthToken();
}

function mapInvitation(item: ApiUserRegistrationInvitation): UserRegistrationInvitation {
  return {
    invitationId: item.invitation_id,
    email: item.email,
    status: item.status,
    statusName: item.status_name,
    systemRole: item.system_role,
    systemRoleName: item.system_role_name,
    roleId: item.role_id,
    roleName: item.role_name,
    createdAt: item.created_at,
    consumedAt: item.consumed_at,
    revokedAt: item.revoked_at,
    emailDelivery: {
      lastAttemptAt: item.email_delivery?.last_attempt_at ?? null,
      lastAttemptStatus: item.email_delivery?.last_attempt_status ?? null,
    },
    resendCount: item.resend_count ?? 0,
    ...(item.customers === undefined
      ? {}
      : {
          customers: item.customers.map<CustomerRelationshipSummary>((customer) => ({
            id: customer.customer_id,
            companyName: customer.company_name,
            status: customer.status,
            statusName: customer.status_name,
          })),
        }),
  };
}

function mapMutationError(
  error: unknown,
  fallbackMessage: string
): UserRegistrationInvitationMutationError {
  if (error instanceof ApiError) {
    return {
      message: error.message || fallbackMessage,
      status: error.status,
    };
  }

  return {
    message: error instanceof Error && error.message ? error.message : fallbackMessage,
    status: null,
  };
}

export const fetchUserRegistrationInvitations = createAsyncThunk<
  FetchUserRegistrationInvitationsResult,
  FetchUserRegistrationInvitationsParams | undefined,
  { state: RootState }
>('userRegistrationInvitations/fetchAll', async (params = {}, thunkAPI) => {
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
      ApiUserRegistrationInvitation[],
      { pagination?: PaginationMeta }
    >(`/v1/user-registration-invitations?${query.toString()}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    const items = Array.isArray(response.data) ? response.data.map(mapInvitation) : [];
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
        : 'No fue posible obtener las invitaciones';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchUserRegistrationInvitationById = createAsyncThunk<
  { invitation: UserRegistrationInvitation },
  { invitationId: string },
  { state: RootState }
>('userRegistrationInvitations/fetchById', async ({ invitationId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiUserRegistrationInvitation>(
      `/v1/user-registration-invitations/${invitationId}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return { invitation: mapInvitation(response.data) };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener la invitación';
    return thunkAPI.rejectWithValue(message);
  }
});

export const createUserRegistrationInvitation = createAsyncThunk<
  ApiInvitationCreateResponse,
  CreateUserRegistrationInvitationPayload,
  { state: RootState }
>('userRegistrationInvitations/create', async (payload, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiInvitationCreateResponse>(
      `/v1/user-registration-invitations`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: {
          email: payload.email,
          system_role: payload.systemRole,
          ...(payload.roleId ? { role_id: payload.roleId } : {}),
          name: payload.name,
          lastname: payload.lastname,
          cell_phone: payload.cellPhone
            ? {
                country_code: payload.cellPhone.countryCode,
                number: payload.cellPhone.number,
              }
            : null,
          ...(payload.systemRole === 'USER' ? { customer_ids: payload.customerIds ?? [] } : {}),
        },
        token,
      }
    );

    return response.data;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible enviar la invitación';
    return thunkAPI.rejectWithValue(message);
  }
});

export const resendUserRegistrationInvitation = createAsyncThunk<
  { invitation: UserRegistrationInvitation; message: string | null },
  { invitationId: string },
  { state: RootState; rejectValue: UserRegistrationInvitationMutationError }
>('userRegistrationInvitations/resend', async ({ invitationId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue({
      message: 'No hay token de autenticación',
      status: null,
    });
  }

  try {
    const response = await jsonRequest<ApiUserRegistrationInvitation>(
      `/v1/user-registration-invitations/${invitationId}/resend`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return {
      invitation: mapInvitation(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      mapMutationError(error, 'No fue posible reenviar la invitación')
    );
  }
});

export const revokeUserRegistrationInvitation = createAsyncThunk<
  { invitation: UserRegistrationInvitation; message: string | null },
  { invitationId: string },
  { state: RootState; rejectValue: UserRegistrationInvitationMutationError }
>('userRegistrationInvitations/revoke', async ({ invitationId }, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue({
      message: 'No hay token de autenticación',
      status: null,
    });
  }

  try {
    const response = await jsonRequest<ApiUserRegistrationInvitation>(
      `/v1/user-registration-invitations/${invitationId}/revoke`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    return {
      invitation: mapInvitation(response.data),
      message: response.successMessage,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      mapMutationError(error, 'No fue posible revocar la invitación')
    );
  }
});
