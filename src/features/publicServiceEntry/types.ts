export type SurveyRatingValue = 'EXCELENTE' | 'MUY_BUENO' | 'BUENO' | 'REGULAR' | 'MALO';

export interface PublicServiceEntryFile {
  file_id: string;
  original_name: string;
  extension: string;
  download_url: string;
}

export interface PublicServiceEntrySurveyStatus {
  completed: boolean;
  submitted_at: string | null;
}

export interface PublicServiceEntryDownloadStatus {
  has_download: boolean;
  last_downloaded_at: string | null;
  download_count: number;
}

export interface PublicServiceEntryDetail {
  serviceEntryId: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  serviceOrderIdentifier: string;
  categoryId: string;
  categoryName: string;
  calibrationCertificateFile: PublicServiceEntryFile | null;
  attachmentFiles: PublicServiceEntryFile[];
  statusId: string;
  statusName: string;
  surveyAccessId: string | null;
  surveyTemplate: {
    templateId: string;
    version: number;
  } | null;
  createdAt: string;
  updatedAt: string | null;
  surveyStatus: PublicServiceEntrySurveyStatus | null;
  downloadStatus: PublicServiceEntryDownloadStatus | null;
}

export interface SurveySubmissionAnswer {
  questionId: string;
  type: 'RATING' | 'TEXT';
  value: string;
}
