'use client';
import { useCallback, useEffect, useMemo } from 'react';
import { endOfMonth, endOfWeek, format, startOfMonth, startOfWeek } from 'date-fns';
import {
  fetchCustomerServiceRecordTimeline,
  resetCustomerServiceRecordTimeline,
} from '@/features/customer-service-records';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useCustomerServiceRecordRoadmapStore } from './useCustomerServiceRecordRoadmapStore';

export function useCustomerServiceRecordTimeline() {
  const dispatch = useAppDispatch();
  const view = useCustomerServiceRecordRoadmapStore((state) => state.view);
  const scale = useCustomerServiceRecordRoadmapStore((state) => state.scale);
  const anchor = useCustomerServiceRecordRoadmapStore((state) => state.anchor);
  const timeline = useAppSelector((state) => state.customerServiceRecords.timeline);
  const range = useMemo(() => {
    const from = scale === 'week' ? startOfWeek(anchor, { weekStartsOn: 1 }) : startOfMonth(anchor);
    const to = scale === 'week' ? endOfWeek(anchor, { weekStartsOn: 1 }) : endOfMonth(anchor);
    return { from: format(from, 'yyyy-MM-dd'), to: format(to, 'yyyy-MM-dd'), start: from };
  }, [anchor, scale]);
  const match = 'periods' as const;
  const key = `${range.from}:${range.to}:${match}`;
  const fetch = useCallback(
    () => dispatch(fetchCustomerServiceRecordTimeline({ from: range.from, to: range.to, match })),
    [dispatch, range.from, range.to, match]
  );
  useEffect(() => {
    if (view !== 'calendar' && view !== 'gantt') return;
    const promise = fetch();
    return () => promise.abort();
  }, [fetch, view]);
  useEffect(
    () => () => {
      dispatch(resetCustomerServiceRecordTimeline());
    },
    [dispatch]
  );
  return { timeline, range, key, refetch: fetch };
}
