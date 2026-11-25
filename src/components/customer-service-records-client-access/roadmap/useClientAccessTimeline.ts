'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import {
  fetchClientAccessTimeline,
  resetClientAccessTimeline,
} from '@/features/customer-service-records-client-access';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useClientAccessRoadmapStore } from './useClientAccessRoadmapStore';

export function useClientAccessTimeline() {
  const dispatch = useAppDispatch();
  const view = useClientAccessRoadmapStore((state) => state.view);
  const scale = useClientAccessRoadmapStore((state) => state.scale);
  const anchor = useClientAccessRoadmapStore((state) => state.anchor);
  const timeline = useAppSelector((state) => state.customerServiceRecordsClientAccess.timeline);
  const range = useMemo(() => {
    const from = scale === 'week' ? startOfWeek(anchor, { weekStartsOn: 1 }) : startOfMonth(anchor);
    const to = scale === 'week' ? endOfWeek(anchor, { weekStartsOn: 1 }) : endOfMonth(anchor);
    return { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd'), start: from };
  }, [anchor, scale]);
  const match = 'periods' as const;
  const key = `${range.from}:${range.to}:${match}`;
  const fetch = useCallback(
    () => dispatch(fetchClientAccessTimeline({ from: range.from, to: range.to, match })),
    [dispatch, range.from, range.to, match]
  );
  useEffect(() => {
    if (view !== 'calendar') return;
    const promise = fetch();
    return () => promise.abort();
  }, [fetch, view]);
  useEffect(
    () => () => {
      dispatch(resetClientAccessTimeline());
    },
    [dispatch]
  );
  return { timeline, range, key, refetch: fetch };
}
