'use client';

import { useMemo } from 'react';
import type { ServiceEntrySurveyListItem } from '@/features/serviceEntrySurveys/serviceEntrySurveysThunks';

export interface ServiceEntrySurveyTableRow {
  id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  categoryName: string;
  serviceOrder: string;
  submittedAt: string;
  ratings: Record<string, string>;
  observations: string;
}

export function useServiceEntrySurveyTableData(
  items: ServiceEntrySurveyListItem[]
): ServiceEntrySurveyTableRow[] {
  return useMemo(
    () =>
      items.map((item) => ({
        id: item.surveyId,
        companyName: item.companyName,
        contactName: item.contactName,
        contactEmail: item.contactEmail,
        categoryName: item.categoryName,
        serviceOrder: item.serviceOrderIdentifier,
        submittedAt: item.submittedAt,
        ratings: Object.fromEntries(
          item.answers.map((answer) => [answer.questionId, answer.value])
        ),
        observations: item.observations ?? '',
      })),
    [items]
  );
}
