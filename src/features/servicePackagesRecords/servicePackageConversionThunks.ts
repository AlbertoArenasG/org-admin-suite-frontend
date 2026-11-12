'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiError, jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';

export interface ServicePackageConversionRecord {
  equipmentIndex: number;
  customerId: string;
  customerUserIds: string[];
  serviceTypeCode: string;
  requestedAt: string;
  receivedAt: string | null;
  asset: {
    name: string;
    identifier: string;
    brand: string;
    model: string;
    serialNumber: string;
    observations: string | null;
  };
  photoFileIds: string[];
}

export interface ServicePackageConversionResult {
  sourceRecordId: string;
  serviceOrder: string | null;
  records: Array<{
    equipmentIndex: number;
    customerServiceRecordId: string;
    serviceNumber: number;
    serviceNumberDisplay: string;
  }>;
}

export interface ServicePackageConversionError {
  message: string;
  status: number;
  uncertain: boolean;
}

export interface ServicePackageConversionOption {
  value: string;
  label: string;
}

function getToken(state: RootState) {
  return state.auth.token;
}

function toError(error: unknown): ServicePackageConversionError {
  if (error instanceof ApiError) {
    return { message: error.message, status: error.status, uncertain: false };
  }
  return {
    message: error instanceof Error ? error.message : 'Network error',
    status: 0,
    uncertain: true,
  };
}

export const fetchServicePackageConversionOptions = createAsyncThunk<
  { customers: ServicePackageConversionOption[]; serviceTypes: ServicePackageConversionOption[] },
  void,
  { state: RootState; rejectValue: ServicePackageConversionError }
>('servicePackagesRecords/conversionOptions', async (_, api) => {
  const token = getToken(api.getState());
  if (!token)
    return api.rejectWithValue({
      message: 'No hay token de autenticación',
      status: 401,
      uncertain: false,
    });
  try {
    const [customers, serviceTypes] = await Promise.all([
      jsonRequest<Array<{ customer_id: string; company_name: string }>>('/v1/customers/options', {
        token,
      }),
      jsonRequest<Array<{ code: string; name: string }>>(
        '/v1/customer-service-record-service-types/options',
        { token }
      ),
    ]);
    return {
      customers: customers.data.map((item) => ({
        value: item.customer_id,
        label: item.company_name,
      })),
      serviceTypes: serviceTypes.data.map((item) => ({ value: item.code, label: item.name })),
    };
  } catch (error) {
    return api.rejectWithValue(toError(error));
  }
});

export const fetchServicePackageConversionCustomerUsers = createAsyncThunk<
  { customerId: string; users: ServicePackageConversionOption[] },
  { customerId: string },
  { state: RootState; rejectValue: ServicePackageConversionError }
>('servicePackagesRecords/conversionCustomerUsers', async ({ customerId }, api) => {
  const token = getToken(api.getState());
  if (!token)
    return api.rejectWithValue({
      message: 'No hay token de autenticación',
      status: 401,
      uncertain: false,
    });
  try {
    const response = await jsonRequest<
      Array<{ id: string; full_name?: string; name?: string; lastname?: string }>
    >(`/v1/customers/${encodeURIComponent(customerId)}/users/options`, { token });
    return {
      customerId,
      users: response.data.map((item) => ({
        value: item.id,
        label: item.full_name ?? [item.name, item.lastname].filter(Boolean).join(' '),
      })),
    };
  } catch (error) {
    return api.rejectWithValue(toError(error));
  }
});

export const convertServicePackageRecord = createAsyncThunk<
  ServicePackageConversionResult,
  { recordId: string; records: ServicePackageConversionRecord[] },
  { state: RootState; rejectValue: ServicePackageConversionError }
>(
  'servicePackagesRecords/convert',
  async ({ recordId, records }, api) => {
    const token = getToken(api.getState());
    if (!token)
      return api.rejectWithValue({
        message: 'No hay token de autenticación',
        status: 401,
        uncertain: false,
      });
    try {
      const response = await jsonRequest<{
        source_record_id: string;
        service_order: string | null;
        records: Array<{
          equipment_index: number;
          customer_service_record_id: string;
          service_number: number;
          service_number_display: string;
        }>;
      }>(`/v1/service-packages/records/${encodeURIComponent(recordId)}/customer-service-records`, {
        method: 'POST',
        token,
        body: {
          records: records.map((record) => ({
            equipment_index: record.equipmentIndex,
            customer: { customer_id: record.customerId, customer_user_ids: record.customerUserIds },
            service_type_code: record.serviceTypeCode,
            requested_at: record.requestedAt,
            received_at: record.receivedAt,
            asset: {
              name: record.asset.name.trim(),
              identifier: record.asset.identifier.trim(),
              brand: record.asset.brand.trim(),
              model: record.asset.model.trim(),
              serial_number: record.asset.serialNumber.trim(),
              observations: record.asset.observations?.trim() || null,
            },
            photo_file_ids: record.photoFileIds,
          })),
        },
      });
      return {
        sourceRecordId: response.data.source_record_id,
        serviceOrder: response.data.service_order,
        records: response.data.records.map((item) => ({
          equipmentIndex: item.equipment_index,
          customerServiceRecordId: item.customer_service_record_id,
          serviceNumber: item.service_number,
          serviceNumberDisplay: item.service_number_display,
        })),
      };
    } catch (error) {
      return api.rejectWithValue(toError(error));
    }
  },
  {
    condition: (_, { getState }) =>
      getState().servicePackagesRecords.conversion.status !== 'loading',
  }
);
