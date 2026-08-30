import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type { CustomerServiceRecordListItem } from './types';

interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

function getAuthToken(state: RootState) {
  return state.auth.token;
}

export const fetchCustomerServiceRecords = createAsyncThunk<
  { items: CustomerServiceRecordListItem[]; page: number; perPage: number; total: number },
  { page?: number; itemsPerPage?: number; search?: string } | undefined,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchAll', async (params = {}, thunkAPI) => {
  const token = getAuthToken(thunkAPI.getState());

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const query = new URLSearchParams({
      page: String(params.page ?? 1),
      items_per_page: String(params.itemsPerPage ?? 10),
    });

    if (params.search?.trim()) {
      query.set('search', params.search.trim());
    }

    const response = await jsonRequest<
      CustomerServiceRecordListItem[],
      { pagination?: PaginationMeta }
    >(`/v1/customer-service-records?${query.toString()}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      token,
    });
    const pagination = response.meta?.pagination;

    return {
      items: Array.isArray(response.data) ? response.data : [],
      page: pagination?.page ?? params.page ?? 1,
      perPage: pagination?.per_page ?? params.itemsPerPage ?? 10,
      total: pagination?.total ?? response.data.length,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener los registros de servicio'
    );
  }
});
