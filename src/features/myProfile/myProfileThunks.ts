'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';

export interface MyProfile {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  roleName: string;
  status: string;
  statusName: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
  createdAt: string | null;
}

interface ApiProfileResponse {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
  role_name: string;
  status: string;
  status_name: string;
  cell_phone: {
    country_code: string;
    number: string;
  } | null;
  created_at: string | null;
}

function mapProfile(data: ApiProfileResponse): MyProfile {
  return {
    id: data.id,
    name: data.name,
    lastname: data.lastname,
    email: data.email,
    role: data.role,
    roleName: data.role_name,
    status: data.status,
    statusName: data.status_name,
    cellPhone: data.cell_phone
      ? {
          countryCode: data.cell_phone.country_code,
          number: data.cell_phone.number,
        }
      : null,
    createdAt: data.created_at,
  };
}

export const fetchMyProfile = createAsyncThunk<MyProfile, void, { state: RootState }>(
  'myProfile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue('Sesión no encontrada');
    }

    const { data } = await jsonRequest<ApiProfileResponse>('/v1/users/me', {
      method: 'GET',
      token,
    });

    return mapProfile(data);
  }
);

export interface UpdateMyProfilePayload {
  name: string;
  lastname: string;
  cellPhone: {
    countryCode: string;
    number: string;
  } | null;
  password?: string;
}

interface UpdateMyProfileRequestBody {
  name: string;
  lastname: string;
  cell_phone: {
    country_code: string;
    number: string;
  } | null;
  password?: string;
}

export const updateMyProfile = createAsyncThunk<
  MyProfile,
  UpdateMyProfilePayload,
  { state: RootState }
>('myProfile/updateProfile', async (payload, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) {
    return rejectWithValue('Sesión no encontrada');
  }

  const normalizedName = payload.name.trim();
  const normalizedLastname = payload.lastname.trim();
  const normalizedCellPhone = payload.cellPhone
    ? {
        countryCode: payload.cellPhone.countryCode.trim(),
        number: payload.cellPhone.number.trim(),
      }
    : null;

  const body: UpdateMyProfileRequestBody = {
    name: normalizedName,
    lastname: normalizedLastname,
    cell_phone:
      normalizedCellPhone && (normalizedCellPhone.countryCode || normalizedCellPhone.number)
        ? {
            country_code: normalizedCellPhone.countryCode,
            number: normalizedCellPhone.number,
          }
        : null,
  };

  if (payload.password && payload.password.trim().length > 0) {
    body.password = payload.password.trim();
  }

  const { data } = await jsonRequest<ApiProfileResponse>('/v1/users/me', {
    method: 'PATCH',
    token,
    body,
  });

  return mapProfile(data);
});
