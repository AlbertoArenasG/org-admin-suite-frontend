'use client';

import { create } from 'zustand';
import { jsonRequest } from '@/lib/api-client';
import { API_BASE_URL } from '@/config/env';
import type {
  PublicProviderProfile,
  PublicProviderProfileAddress,
  PublicProviderProfileContact,
  PublicProviderProfileSubmissionPayload,
  PublicProviderUploadedFile,
} from '@/features/publicProviderProfile/types';

interface ApiProviderProfileResponse {
  provider_id: string;
  company_name: string;
  provider_code: string;
  provider_status_id: string;
  provider_status_name: string;
  public_access_token: string;
  public_access_url: string;
  contact?: ApiContact | null;
  created_at: string;
  updated_at: string;
  fiscal_profile?: ApiFiscalProfile | null;
  banking_info?: ApiBankingInfo | null;
}

interface ApiFiscalProfile {
  profile_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiFiscalFormData | null;
  tax_status_certificate_file_id?: string | null;
  tax_compliance_opinion_file_id?: string | null;
  address_proof_file_id?: string | null;
  files_metadata?: {
    tax_status_certificate?: ApiFileMetadata | null;
    tax_compliance_opinion?: ApiFileMetadata | null;
    address_proof?: ApiFileMetadata | null;
  } | null;
}

interface ApiFiscalFormData {
  businessName?: string | null;
  business_name?: string | null;
  rfc?: string | null;
  address?: ApiAddress | null;
  billingContact?: ApiContact | null;
  billing_contact?: ApiContact | null;
  notes?: string | null;
}

interface ApiBankingInfo {
  banking_info_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiBankingFormData | null;
  bank_statement_file_id?: string | null;
  files_metadata?: {
    bank_statement?: ApiFileMetadata | null;
  } | null;
}

interface ApiBankingFormData {
  beneficiary?: string | null;
  bank?: string | null;
  accountNumber?: string | null;
  account_number?: string | null;
  clabe?: string | null;
  creditGranted?: string | null;
  credit_granted?: string | null;
  notes?: string | null;
}

interface ApiAddress {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  postal_code?: string | null;
}

interface ApiContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface ApiFileMetadata {
  file_id: string;
  original_name: string;
  download_url?: string | null;
}

interface PublicProviderProfileState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  profile: PublicProviderProfile | null;
  submitting: boolean;
  submitError: string | null;
  fetchProfile: (token: string) => Promise<void>;
  submitProfile: (
    token: string,
    payload: PublicProviderProfileSubmissionPayload
  ) => Promise<PublicProviderProfile | null>;
  uploadFiles: (files: File[]) => Promise<PublicProviderUploadedFile[]>;
  reset: () => void;
}

function mapContact(contact?: ApiContact | null): PublicProviderProfileContact | null {
  if (!contact) {
    return null;
  }
  return {
    name: contact.name ?? null,
    phone: contact.phone ?? null,
    email: contact.email ?? null,
  };
}

function mapAddress(address?: ApiAddress | null): PublicProviderProfileAddress | null {
  if (!address) {
    return null;
  }
  return {
    street: address.street ?? null,
    number: address.number ?? null,
    neighborhood: address.neighborhood ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    postalCode: address.postalCode ?? address.postal_code ?? null,
  };
}

function mapProfile(response: ApiProviderProfileResponse): PublicProviderProfile {
  const fiscal = response.fiscal_profile;
  const banking = response.banking_info;

  return {
    providerId: response.provider_id,
    companyName: response.company_name,
    providerCode: response.provider_code,
    statusId: response.provider_status_id,
    statusName: response.provider_status_name,
    publicAccessToken: response.public_access_token,
    publicAccessUrl: response.public_access_url,
    contact: mapContact(response.contact),
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    fiscalProfile: fiscal
      ? {
          id: fiscal.profile_id,
          statusId: fiscal.status_id,
          statusName: fiscal.status_name,
          submittedAt: fiscal.submitted_at ?? null,
          businessName: fiscal.form_data?.businessName ?? fiscal.form_data?.business_name ?? null,
          rfc: fiscal.form_data?.rfc ?? null,
          address: mapAddress(fiscal.form_data?.address),
          billingContact: mapContact(
            fiscal.form_data?.billingContact ?? fiscal.form_data?.billing_contact
          ),
          notes: fiscal.form_data?.notes ?? null,
          taxStatusCertificateFileId: fiscal.tax_status_certificate_file_id ?? null,
          taxComplianceOpinionFileId: fiscal.tax_compliance_opinion_file_id ?? null,
          addressProofFileId: fiscal.address_proof_file_id ?? null,
          filesMetadata: {
            taxStatusCertificate: fiscal.files_metadata?.tax_status_certificate
              ? {
                  fileId: fiscal.files_metadata.tax_status_certificate.file_id,
                  originalName: fiscal.files_metadata.tax_status_certificate.original_name,
                  downloadUrl: fiscal.files_metadata.tax_status_certificate.download_url ?? null,
                }
              : null,
            taxComplianceOpinion: fiscal.files_metadata?.tax_compliance_opinion
              ? {
                  fileId: fiscal.files_metadata.tax_compliance_opinion.file_id,
                  originalName: fiscal.files_metadata.tax_compliance_opinion.original_name,
                  downloadUrl: fiscal.files_metadata.tax_compliance_opinion.download_url ?? null,
                }
              : null,
            addressProof: fiscal.files_metadata?.address_proof
              ? {
                  fileId: fiscal.files_metadata.address_proof.file_id,
                  originalName: fiscal.files_metadata.address_proof.original_name,
                  downloadUrl: fiscal.files_metadata.address_proof.download_url ?? null,
                }
              : null,
          },
        }
      : null,
    bankingInfo: banking
      ? {
          id: banking.banking_info_id,
          statusId: banking.status_id,
          statusName: banking.status_name,
          submittedAt: banking.submitted_at ?? null,
          beneficiary: banking.form_data?.beneficiary ?? null,
          bank: banking.form_data?.bank ?? null,
          accountNumber:
            banking.form_data?.accountNumber ?? banking.form_data?.account_number ?? null,
          clabe: banking.form_data?.clabe ?? null,
          creditGranted:
            banking.form_data?.creditGranted ?? banking.form_data?.credit_granted ?? null,
          notes: banking.form_data?.notes ?? null,
          bankStatementFileId: banking.bank_statement_file_id ?? null,
          filesMetadata: {
            bankStatement: banking.files_metadata?.bank_statement
              ? {
                  fileId: banking.files_metadata.bank_statement.file_id,
                  originalName: banking.files_metadata.bank_statement.original_name,
                  downloadUrl: banking.files_metadata.bank_statement.download_url ?? null,
                }
              : null,
          },
        }
      : null,
  };
}

function resolveLanguage(): string {
  if (typeof document !== 'undefined') {
    const lang = document.documentElement.getAttribute('lang');
    if (lang) {
      return lang;
    }
  }
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }
  return 'es';
}

export const usePublicProviderProfileStore = create<PublicProviderProfileState>((set) => ({
  status: 'idle',
  error: null,
  profile: null,
  submitting: false,
  submitError: null,
  async fetchProfile(token) {
    set({ status: 'loading', error: null, profile: null });
    try {
      const response = await jsonRequest<ApiProviderProfileResponse>(
        `/v1/public/provider-profiles/${token}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }
      );
      set({ status: 'success', profile: mapProfile(response.data), error: null });
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener el perfil del proveedor.';
      set({ status: 'error', error: message, profile: null });
    }
  },
  async submitProfile(token, payload) {
    set({ submitting: true, submitError: null });
    try {
      const response = await jsonRequest<ApiProviderProfileResponse>(
        `/v1/public/provider-profiles/${token}/submit`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: payload,
        }
      );
      const profile = mapProfile(response.data);
      set({ submitting: false, profile, submitError: null });
      return profile;
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible enviar la información del proveedor.';
      set({ submitting: false, submitError: message });
      throw error;
    }
  },
  async uploadFiles(files) {
    if (!files.length) {
      return [];
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const language = resolveLanguage();

    try {
      const response = await fetch(`${API_BASE_URL}/v1/files/public`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-user-lang': language,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('No fue posible subir los archivos.');
      }

      const payload = (await response.json()) as {
        data?: Array<{
          id: string;
          original_name: string;
          filename: string;
          mime_type: string;
          size: number;
          url?: string | null;
        }>;
      };

      return (payload.data ?? []).map((file) => ({
        id: file.id,
        originalName: file.original_name,
        filename: file.filename,
        mimeType: file.mime_type,
        downloadUrl: file.url ?? null,
        size: file.size,
      }));
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible subir los archivos.';
      throw new Error(message);
    }
  },
  reset() {
    set({
      status: 'idle',
      error: null,
      profile: null,
      submitting: false,
      submitError: null,
    });
  },
}));
