import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type { TimelineRecord } from '@/features/customer-service-records/customerServiceRecordTimelineMapper';
import { ganttChunkRange } from '@/features/customer-service-records/ganttTimelineChunks';
import {
  mapClientAccessTimelineRecord,
  type ApiClientAccessTimelineRecord,
} from './clientAccessTimelineMapper';

export type ClientAccessTimelineParams = {
  from: string;
  to: string;
  match: 'periods' | 'customer_milestones';
};

async function loadTimeline(
  params: ClientAccessTimelineParams,
  token: string,
  signal: AbortSignal
): Promise<TimelineRecord[]> {
  const all: TimelineRecord[] = [];
  let page = 1;
  let pages = 1;
  do {
    const query = new URLSearchParams({ ...params, page: String(page), limit: '100' });
    const response = await jsonRequest<
      ApiClientAccessTimelineRecord[],
      { pagination?: { total_pages: number } }
    >(`/v1/customer-service-records-client-access/timeline?${query}`, {
      method: 'GET',
      token,
      signal,
    });
    if (signal.aborted) throw new Error('La consulta fue cancelada');
    all.push(...response.data.map(mapClientAccessTimelineRecord));
    pages = response.meta?.pagination?.total_pages ?? 0;
    if (pages > 10000)
      throw new Error('El período contiene demasiados registros para mostrarlo completo');
    page++;
  } while (page <= pages);
  return all;
}

export const fetchClientAccessTimeline = createAsyncThunk<
  { items: TimelineRecord[]; key: string },
  ClientAccessTimelineParams,
  { state: RootState; rejectValue: string }
>('customerServiceRecordsClientAccess/fetchTimeline', async (params, api) => {
  const token = api.getState().auth.token;
  if (!token) return api.rejectWithValue('No hay token de autenticación');
  try {
    return {
      items: await loadTimeline(params, token, api.signal),
      key: `${params.from}:${params.to}:${params.match}`,
    };
  } catch (error) {
    return api.rejectWithValue(
      error instanceof Error ? error.message : 'No fue posible obtener el calendario'
    );
  }
});

export const fetchClientAccessGanttChunk = createAsyncThunk<
  { id: number; items: TimelineRecord[] },
  number,
  { state: RootState; rejectValue: string }
>(
  'customerServiceRecordsClientAccess/fetchGanttChunk',
  async (id, api) => {
    const token = api.getState().auth.token;
    if (!token) return api.rejectWithValue('No hay token de autenticación');
    try {
      return {
        id,
        items: await loadTimeline({ ...ganttChunkRange(id), match: 'periods' }, token, api.signal),
      };
    } catch (error) {
      return api.rejectWithValue(
        error instanceof Error ? error.message : 'No fue posible obtener el Gantt'
      );
    }
  },
  {
    condition: (id, api) => {
      const status =
        api.getState().customerServiceRecordsClientAccess.ganttTimeline.chunks[id]?.status;
      return status !== 'loading' && status !== 'succeeded';
    },
  }
);
