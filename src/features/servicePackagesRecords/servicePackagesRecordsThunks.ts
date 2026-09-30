'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  ServicePackageRecordDetail,
  ServicePackageRecordDetailError,
} from '@/features/servicePackagesRecords/types';
import {
  mapServicePackageRecordDetail,
  type ApiServicePackageRecordDetail,
} from '@/features/servicePackagesRecords/servicePackagesRecordsMappers';

export const fetchServicePackageRecordDetail = createAsyncThunk<
  ServicePackageRecordDetail,
  { recordId: string },
  { state: RootState; rejectValue: ServicePackageRecordDetailError }
>('servicePackagesRecords/fetchDetail', async ({ recordId }, thunkAPI) => {
  const token = thunkAPI.getState().auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue({
      message: 'No hay token de autenticación',
      status: 401,
    });
  }

  try {
    const response = await jsonRequest<ApiServicePackageRecordDetail>(
      `/v1/service-packages/records/${recordId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
        token,
      }
    );

    return mapServicePackageRecordDetail(response.data);
  } catch (error) {
    return thunkAPI.rejectWithValue({
      message:
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener el registro de servicio.',
      status: error instanceof ApiError ? error.status : 0,
    });
  }
});
