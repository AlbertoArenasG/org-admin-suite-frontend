import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest, ApiError } from '@/lib/api-client';
import type { AuthUser } from './types';

export interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponseUser {
  id: string;
  name: string;
  lastname: string;
  email: string;
  role: string;
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
  message: string | null;
}

function mapLoginUser(user: LoginResponseUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    role: user.role,
    status: user.status,
    cellPhone: user.cell_phone
      ? {
          countryCode: user.cell_phone.country_code,
          number: user.cell_phone.number,
        }
      : null,
  };
}

export const login = createAsyncThunk<LoginResult, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data, successMessage } = await jsonRequest<LoginResponseData>('/v1/auth/login', {
        method: 'POST',
        body: payload,
      });

      return {
        token: data.access_token,
        user: mapLoginUser(data.user),
        message: successMessage,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return rejectWithValue(error.message || 'Correo electrónico o contraseña inválidos');
      }
      return rejectWithValue('No fue posible iniciar sesión');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk<AuthUser>('auth/fetchCurrentUser', async () => {
  // TODO: replace with real API integration
  throw new Error('fetchCurrentUser thunk not implemented yet');
});
