'use client';

import { create } from 'zustand';
import { jsonRequest } from '@/lib/api-client';
import { API_BASE_URL } from '@/config/env';
import type {
  PublicServiceEntryDetail,
  PublicServiceEntryDownloadStatus,
  PublicServiceEntryFile,
  PublicServiceEntrySurveyStatus,
  SurveySubmissionAnswer,
} from '@/features/publicServiceEntry/types';
import { SURVEY_RATING_VALUES } from '@/features/publicServiceEntry/constants';

interface ApiSurveyTemplate {
  template_id: string;
  version: number;
}

interface ApiServiceEntryResponse {
  service_entry_id: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  service_order_identifier: string;
  category_id: string;
  category_name: string;
  calibration_certificate_file_id: string | null;
  attachment_file_ids: string[];
  status_id: string;
  status_name: string;
  survey_access_id: string | null;
  survey_template: ApiSurveyTemplate | null;
  created_at: string;
  updated_at: string | null;
  files_metadata?: {
    calibration_certificate?: PublicServiceEntryFile | null;
    attachments?: PublicServiceEntryFile[] | null;
  };
  survey_status?: PublicServiceEntrySurveyStatus | null;
  download_status?: PublicServiceEntryDownloadStatus | null;
}

interface SurveySubmissionResponse {
  survey_id: string;
  service_entry_id: string;
  access_id: string;
  template: ApiSurveyTemplate;
  answers: SurveySubmissionAnswer[];
  observations: string | null;
  submitted_at: string;
}

interface PublicServiceEntryState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  entry: PublicServiceEntryDetail | null;
  surveySubmitting: boolean;
  surveyError: string | null;
  downloadsEnabled: boolean;
  downloadingFileId: string | null;
  fetchEntry: (token: string) => Promise<void>;
  submitSurvey: (
    token: string,
    payload: { answers: SurveySubmissionAnswer[]; observations?: string }
  ) => Promise<void>;
  downloadFile: (file: PublicServiceEntryFile) => Promise<void>;
  reset: () => void;
}

function mapServiceEntryResponse(entry: ApiServiceEntryResponse): PublicServiceEntryDetail {
  return {
    serviceEntryId: entry.service_entry_id,
    companyName: entry.company_name,
    contactName: entry.contact_name,
    contactEmail: entry.contact_email,
    serviceOrderIdentifier: entry.service_order_identifier,
    categoryId: entry.category_id,
    categoryName: entry.category_name,
    calibrationCertificateFile: entry.files_metadata?.calibration_certificate ?? null,
    attachmentFiles: entry.files_metadata?.attachments ?? [],
    statusId: entry.status_id,
    statusName: entry.status_name,
    surveyAccessId: entry.survey_access_id,
    surveyTemplate: entry.survey_template
      ? {
          templateId: entry.survey_template.template_id,
          version: entry.survey_template.version,
        }
      : null,
    createdAt: entry.created_at,
    updatedAt: entry.updated_at,
    surveyStatus: entry.survey_status ?? null,
    downloadStatus: entry.download_status ?? null,
  };
}

function resolveLanguage(): string {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('lang');
    if (attr) {
      return attr;
    }
  }
  if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
    return navigator.language;
  }
  return 'es';
}

export const usePublicServiceEntryStore = create<PublicServiceEntryState>((set, get) => ({
  status: 'idle',
  error: null,
  entry: null,
  surveySubmitting: false,
  surveyError: null,
  downloadsEnabled: false,
  downloadingFileId: null,
  async fetchEntry(token) {
    set({ status: 'loading', error: null, entry: null, downloadsEnabled: false });
    try {
      const response = await jsonRequest<ApiServiceEntryResponse>(
        `/v1/public/service-entry/${token}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const entry = mapServiceEntryResponse(response.data);
      set({
        status: 'success',
        entry,
        downloadsEnabled: Boolean(entry.surveyStatus?.completed),
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Unable to load service entry.';
      set({ status: 'error', error: message, entry: null, downloadsEnabled: false });
    }
  },
  async submitSurvey(token, payload) {
    const { entry } = get();
    if (!entry) {
      return;
    }
    const sanitizedAnswers = payload.answers
      .filter((answer) => !!answer.value)
      .map((answer) => ({
        question_id: answer.questionId,
        type: answer.type,
        value: answer.value,
      }));

    set({ surveySubmitting: true, surveyError: null });

    try {
      const response = await jsonRequest<SurveySubmissionResponse>(
        `/v1/public/service-entry/${token}/survey`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: {
            answers: sanitizedAnswers,
            observations: payload.observations ?? '',
          },
        }
      );

      set((state) => ({
        surveySubmitting: false,
        surveyError: null,
        downloadsEnabled: true,
        entry: state.entry
          ? {
              ...state.entry,
              surveyStatus: {
                completed: true,
                submitted_at: response.data.submitted_at ?? new Date().toISOString(),
              },
            }
          : state.entry,
      }));
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Unable to submit the survey.';
      set({ surveySubmitting: false, surveyError: message });
      throw error;
    }
  },
  async downloadFile(file) {
    const state = get();
    if (!state.entry) {
      throw new Error('No service entry available.');
    }
    if (!state.downloadsEnabled) {
      throw new Error('Downloads are not enabled yet.');
    }

    set({ downloadingFileId: file.file_id });
    const language = resolveLanguage();

    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/files/${file.file_id}/download?service_entry_id=${state.entry.serviceEntryId}`,
        {
          headers: {
            Accept: 'application/octet-stream',
            'x-user-lang': language,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Unable to download the file.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.original_name ?? 'download';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      set((current) => ({
        downloadingFileId: null,
        entry: current.entry
          ? {
              ...current.entry,
              downloadStatus: {
                has_download: true,
                download_count: (current.entry.downloadStatus?.download_count ?? 0) + 1,
                last_downloaded_at: new Date().toISOString(),
              },
            }
          : current.entry,
      }));
    } catch (error) {
      set({ downloadingFileId: null });
      throw error;
    }
  },
  reset() {
    set({
      status: 'idle',
      error: null,
      entry: null,
      surveySubmitting: false,
      surveyError: null,
      downloadsEnabled: false,
      downloadingFileId: null,
    });
  },
}));

export function isValidSurveyRating(value: string): value is (typeof SURVEY_RATING_VALUES)[number] {
  return SURVEY_RATING_VALUES.includes(value as (typeof SURVEY_RATING_VALUES)[number]);
}
