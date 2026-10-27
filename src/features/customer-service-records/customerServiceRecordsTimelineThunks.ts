import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import {
  mapTimelineRecord,
  type ApiTimelineRecord,
  type TimelineRecord,
} from './customerServiceRecordTimelineMapper';

export type TimelineParams = { from: string; to: string; match: 'periods' | 'customer_milestones' };

export const fetchCustomerServiceRecordTimeline = createAsyncThunk<
  { items: TimelineRecord[]; key: string },
  TimelineParams,
  { state: RootState; rejectValue: string }
>('customerServiceRecords/fetchTimeline', async (params, api) => {
  const token = api.getState().auth.token;
  if (!token) return api.rejectWithValue('No hay token de autenticación');
  const key = `${params.from}:${params.to}:${params.match}`;
  try {
    const all: TimelineRecord[] = [];
    let page = 1;
    let pages = 1;
    do {
      const query = new URLSearchParams({ ...params, page: String(page), limit: '100' });
      const response = await jsonRequest<
        ApiTimelineRecord[],
        { pagination?: { total_pages: number } }
      >(`/v1/customer-service-records/timeline?${query}`, {
        method: 'GET',
        token,
        signal: api.signal,
      });
      if (api.signal.aborted) throw new Error('La consulta fue cancelada');
      all.push(...response.data.map(mapTimelineRecord));
      pages = response.meta?.pagination?.total_pages ?? 0;
      if (pages > 10000)
        throw new Error('El periodo contiene demasiados registros para mostrarlo completo');
      page++;
    } while (page <= pages);
    return { items: all, key };
  } catch (error) {
    return api.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el cronograma'
    );
  }
});
