'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, differenceInCalendarDays } from 'date-fns';
import {
  fetchCustomerServiceRecordGanttChunk,
  retainGanttTimelineChunks,
} from '@/features/customer-service-records';
import {
  ganttChunkId,
  ganttChunkIds,
  ganttChunkRange,
} from '@/features/customer-service-records/ganttTimelineChunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { civilDate } from './roadmapDates';

type Viewport = { from: Date; to: Date };

export function useGanttTimeline(active: boolean) {
  const dispatch = useAppDispatch();
  const chunks = useAppSelector((state) => state.customerServiceRecords.ganttTimeline.chunks);
  const retainedRange = useAppSelector(
    (state) => state.customerServiceRecords.ganttTimeline.retainedRange
  );
  const [viewport, setViewportState] = useState<Viewport | null>(null);
  const setViewport = useCallback((next: Viewport) => {
    setViewportState((current) =>
      current &&
      ganttChunkId(current.from) === ganttChunkId(next.from) &&
      ganttChunkId(current.to) === ganttChunkId(next.to)
        ? current
        : next
    );
  }, []);

  const wanted = useMemo(() => {
    if (!active || !viewport) return null;
    const width = Math.max(1, differenceInCalendarDays(viewport.to, viewport.from));
    const prefetchDays = Math.max(84, Math.ceil(width / 2));
    const keepDays = Math.max(168, width);
    return {
      visible: ganttChunkIds(viewport.from, viewport.to),
      critical: ganttChunkIds(addDays(viewport.from, -42), addDays(viewport.to, 42)),
      fetch: ganttChunkIds(
        addDays(viewport.from, -prefetchDays),
        addDays(viewport.to, prefetchDays)
      ),
      first: ganttChunkId(addDays(viewport.from, -keepDays)),
      last: ganttChunkId(addDays(viewport.to, keepDays)),
    };
  }, [active, viewport]);

  useEffect(() => {
    if (!wanted) return;
    if (retainedRange?.first !== wanted.first || retainedRange?.last !== wanted.last) {
      dispatch(retainGanttTimelineChunks({ first: wanted.first, last: wanted.last }));
    }
  }, [dispatch, retainedRange?.first, retainedRange?.last, wanted]);

  useEffect(() => {
    if (!wanted) return;
    const inFlight = wanted.fetch.filter((id) => chunks[id]?.status === 'loading').length;
    const slots = Math.max(0, 4 - inFlight);
    const center = (wanted.visible[0] + wanted.visible.at(-1)!) / 2;
    const missing = wanted.fetch
      .filter((id) => !chunks[id])
      .sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
    for (const id of missing.slice(0, slots))
      void dispatch(fetchCustomerServiceRecordGanttChunk(id));
  }, [chunks, dispatch, wanted]);

  const visibleReady =
    !!wanted && wanted.critical.every((id) => chunks[id]?.status === 'succeeded');
  const visibleError = wanted?.critical.find((id) => chunks[id]?.status === 'failed');
  const error = visibleError === undefined ? null : chunks[visibleError]?.error;
  const loading =
    !!wanted && wanted.fetch.some((id) => !chunks[id] || chunks[id].status === 'loading');
  const records = useMemo(() => {
    const unique = new Map<string, (typeof chunks)[number]['items'][number]>();
    for (const [key, chunk] of Object.entries(chunks)) {
      const id = Number(key);
      if (chunk.status !== 'succeeded' || !wanted || id < wanted.first || id > wanted.last)
        continue;
      for (const record of chunk.items) unique.set(record.id, record);
    }
    return [...unique.values()].sort((a, b) => a.id.localeCompare(b.id));
  }, [chunks, wanted]);
  const bounds = useMemo(() => {
    if (!wanted || !visibleReady) return undefined;
    let first = wanted.visible[0];
    let last = wanted.visible.at(-1)!;
    while (chunks[first - 1]?.status === 'succeeded') first--;
    while (chunks[last + 1]?.status === 'succeeded') last++;
    return {
      from: civilDate(ganttChunkRange(first).from),
      to: civilDate(ganttChunkRange(last).to),
    };
  }, [chunks, visibleReady, wanted]);

  const retry = () => {
    if (visibleError !== undefined)
      void dispatch(fetchCustomerServiceRecordGanttChunk(visibleError));
  };

  return {
    viewport,
    setViewport,
    records,
    bounds,
    visibleReady,
    visibleError,
    error,
    loading,
    retry,
  };
}
