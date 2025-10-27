'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import { readPersistedAuthToken } from '@/features/auth/persistence';

export type SurveyRatingValue = 'EXCELENTE' | 'MUY_BUENO' | 'BUENO' | 'REGULAR' | 'MALO';

export interface ServiceEntrySurveyAnswer {
  questionId: string;
  type: 'RATING' | 'TEXT';
  value: string;
}

export interface ServiceEntrySurveyListItem {
  surveyId: string;
  serviceEntryId: string;
  accessId: string;
  templateId: string;
  templateVersion: number;
  submittedAt: string;
  answers: ServiceEntrySurveyAnswer[];
  observations: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  serviceOrderIdentifier: string;
  categoryId: string;
  categoryName: string;
}

export interface ServiceEntrySurveyListResult {
  items: ServiceEntrySurveyListItem[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface FetchServiceEntrySurveyListParams {
  from: string;
  to: string;
  templateId?: string | null;
  templateVersion?: number | null;
  page?: number;
  perPage?: number;
}

interface ApiSurveyAnswer {
  question_id: string;
  type: 'RATING' | 'TEXT';
  value: string;
}

interface ApiSurveyListItem {
  survey: {
    survey_id: string;
    service_entry_id: string;
    access_id: string;
    template: {
      template_id: string;
      version: number;
    };
    answers: ApiSurveyAnswer[];
    observations: string;
    submitted_at: string;
  };
  service_entry: {
    service_entry_id: string;
    company_name: string;
    contact_name: string;
    contact_email: string;
    service_order_identifier: string;
    category_id: string;
    category_name: string;
  };
}

type ApiSurveyListResponse = ApiSurveyListItem[];

interface ApiSurveyListPagination {
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
}

interface ApiSurveyStatsResponse {
  total_responses: number;
  range: {
    from: string;
    to: string;
  };
  templates: Array<{
    template_id: string;
    template_version: number;
    template_name: string | null;
    category_id: string;
    category_name: string;
    total_responses: number;
    question_stats: Array<{
      question_id: string;
      question_text: string;
      type: 'RATING' | 'TEXT';
      response_count: number;
      average_rating: number | null;
      rating_distribution: Record<SurveyRatingValue, number> | null;
      responses: string[] | null;
    }>;
  }>;
}

export type ServiceEntrySurveyStats = ApiSurveyStatsResponse;

function mapSurveyListItem(item: ApiSurveyListItem): ServiceEntrySurveyListItem {
  return {
    surveyId: item.survey.survey_id,
    serviceEntryId: item.survey.service_entry_id,
    accessId: item.survey.access_id,
    templateId: item.survey.template.template_id,
    templateVersion: item.survey.template.version,
    submittedAt: item.survey.submitted_at,
    answers: item.survey.answers.map((answer) => ({
      questionId: answer.question_id,
      type: answer.type,
      value: answer.value,
    })),
    observations: item.survey.observations ?? '',
    companyName: item.service_entry.company_name,
    contactName: item.service_entry.contact_name,
    contactEmail: item.service_entry.contact_email,
    serviceOrderIdentifier: item.service_entry.service_order_identifier,
    categoryId: item.service_entry.category_id,
    categoryName: item.service_entry.category_name,
  };
}

export const fetchServiceEntrySurveyList = createAsyncThunk<
  ServiceEntrySurveyListResult,
  FetchServiceEntrySurveyListParams,
  { state: RootState }
>('serviceEntrySurveys/fetchList', async (params, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
    page: String(params.page ?? 1),
    per_page: String(params.perPage ?? 10),
  });

  if (params.templateId) {
    query.set('template_id', params.templateId);
  }
  if (params.templateVersion != null) {
    query.set('template_version', String(params.templateVersion));
  }

  const response = await jsonRequest<
    ApiSurveyListResponse,
    { pagination?: ApiSurveyListPagination }
  >(`/v1/services/service-entry/surveys?${query.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    token,
  });

  const apiData = response.data ?? [];
  const pagination =
    response.meta?.pagination ?? (response.raw.pagination as ApiSurveyListPagination | undefined);

  const fallbackPage = params.page ?? 1;
  const fallbackPerPage = Math.max(params.perPage ?? 10, 1);
  const resolvedPerPage = pagination?.per_page ?? fallbackPerPage;
  const safePagination = {
    page: pagination?.page ?? fallbackPage,
    perPage: resolvedPerPage,
    total: pagination?.total ?? apiData.length,
    totalPages:
      pagination?.total_pages ??
      (apiData.length ? Math.ceil(apiData.length / Math.max(resolvedPerPage, 1)) : 0),
  };

  return {
    items: apiData.map(mapSurveyListItem),
    pagination: safePagination,
  };
});

export interface FetchServiceEntrySurveyStatsParams {
  from: string;
  to: string;
  templateId?: string | null;
  templateVersion?: number | null;
}

export const fetchServiceEntrySurveyStats = createAsyncThunk<
  ServiceEntrySurveyStats,
  FetchServiceEntrySurveyStatsParams,
  { state: RootState }
>('serviceEntrySurveys/fetchStats', async (params, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token ?? readPersistedAuthToken();

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    from: params.from,
    to: params.to,
  });

  if (params.templateId) {
    query.set('template_id', params.templateId);
  }
  if (params.templateVersion != null) {
    query.set('template_version', String(params.templateVersion));
  }

  const response = await jsonRequest<ApiSurveyStatsResponse>(
    `/v1/services/service-entry/surveys/stats?${query.toString()}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      token,
    }
  );

  return response.data;
});
