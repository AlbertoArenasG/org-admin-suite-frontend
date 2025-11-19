'use client';

import { create } from 'zustand';
import { jsonRequest } from '@/lib/api-client';
import { API_BASE_URL } from '@/config/env';
import type {
  PublicCustomerProfile,
  PublicCustomerProfileAddress,
  PublicCustomerProfileCfdi,
  PublicCustomerProfileContact,
  PublicCustomerProfileSubmissionPayload,
  PublicCustomerUploadedFile,
} from '@/features/publicCustomerProfile/types';

interface ApiCustomerProfileResponse {
  customer_id: string;
  company_name: string;
  client_code: string;
  customer_status_id: string;
  customer_status_name: string;
  public_access_token: string;
  public_access_url: string;
  created_at: string;
  updated_at: string;
  fiscal_profile?: ApiFiscalProfile | null;
}

interface ApiFiscalProfile {
  profile_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiFiscalFormData | null;
  tax_certificate_file_id?: string | null;
  invoice_requirements_file_id?: string | null;
  files_metadata?: {
    tax_certificate?: ApiFileMetadata | null;
    invoice_requirements?: ApiFileMetadata | null;
  } | null;
}

interface ApiFiscalFormData {
  business_name?: string | null;
  rfc?: string | null;
  tax_regime?: string | null;
  address?: ApiAddress | null;
  cfdi?: ApiCfdi | null;
  billing_contact?: ApiContact | null;
  accounts_payable_contact?: ApiContact | null;
  requirements_notes?: string | null;
}

interface ApiAddress {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  delegation?: string | null;
  city?: string | null;
  postal_code?: string | null;
}

interface ApiCfdi {
  use?: string | null;
  payment_method?: string | null;
  payment_form?: string | null;
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

interface PublicCustomerProfileState {
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  profile: PublicCustomerProfile | null;
  submitting: boolean;
  submitError: string | null;
  fetchProfile: (token: string) => Promise<void>;
  submitProfile: (
    token: string,
    payload: PublicCustomerProfileSubmissionPayload
  ) => Promise<PublicCustomerProfile | null>;
  uploadFiles: (files: File[]) => Promise<PublicCustomerUploadedFile[]>;
  reset: () => void;
}

function mapContact(contact?: ApiContact | null): PublicCustomerProfileContact | null {
  if (!contact) {
    return null;
  }
  return {
    name: contact.name ?? null,
    phone: contact.phone ?? null,
    email: contact.email ?? null,
  };
}

function mapAddress(address?: ApiAddress | null): PublicCustomerProfileAddress | null {
  if (!address) {
    return null;
  }
  return {
    street: address.street ?? null,
    number: address.number ?? null,
    neighborhood: address.neighborhood ?? null,
    delegation: address.delegation ?? null,
    city: address.city ?? null,
    postalCode: address.postal_code ?? null,
  };
}

function mapCfdi(cfdi?: ApiCfdi | null): PublicCustomerProfileCfdi | null {
  if (!cfdi) {
    return null;
  }
  return {
    use: cfdi.use ?? null,
    paymentMethod: cfdi.payment_method ?? null,
    paymentForm: cfdi.payment_form ?? null,
  };
}

function mapProfile(response: ApiCustomerProfileResponse): PublicCustomerProfile {
  const profile = response.fiscal_profile;
  return {
    customerId: response.customer_id,
    companyName: response.company_name,
    clientCode: response.client_code,
    statusId: response.customer_status_id,
    statusName: response.customer_status_name,
    publicAccessToken: response.public_access_token,
    publicAccessUrl: response.public_access_url,
    createdAt: response.created_at,
    updatedAt: response.updated_at,
    fiscalProfile: profile
      ? {
          id: profile.profile_id,
          statusId: profile.status_id,
          statusName: profile.status_name,
          submittedAt: profile.submitted_at ?? null,
          businessName: profile.form_data?.business_name ?? null,
          rfc: profile.form_data?.rfc ?? null,
          taxRegime: profile.form_data?.tax_regime ?? null,
          address: mapAddress(profile.form_data?.address),
          cfdi: mapCfdi(profile.form_data?.cfdi),
          billingContact: mapContact(profile.form_data?.billing_contact),
          accountsPayableContact: mapContact(profile.form_data?.accounts_payable_contact),
          requirementsNotes: profile.form_data?.requirements_notes ?? null,
          taxCertificateFileId: profile.tax_certificate_file_id ?? null,
          invoiceRequirementsFileId: profile.invoice_requirements_file_id ?? null,
          filesMetadata: {
            taxCertificate: profile.files_metadata?.tax_certificate
              ? {
                  fileId: profile.files_metadata.tax_certificate.file_id,
                  originalName: profile.files_metadata.tax_certificate.original_name,
                  downloadUrl: profile.files_metadata.tax_certificate.download_url ?? null,
                }
              : null,
            invoiceRequirements: profile.files_metadata?.invoice_requirements
              ? {
                  fileId: profile.files_metadata.invoice_requirements.file_id,
                  originalName: profile.files_metadata.invoice_requirements.original_name,
                  downloadUrl: profile.files_metadata.invoice_requirements.download_url ?? null,
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

export const usePublicCustomerProfileStore = create<PublicCustomerProfileState>((set) => ({
  status: 'idle',
  error: null,
  profile: null,
  submitting: false,
  submitError: null,
  async fetchProfile(token) {
    set({ status: 'loading', error: null, profile: null });
    try {
      const response = await jsonRequest<ApiCustomerProfileResponse>(
        `/v1/public/customer-fiscal-profiles/${token}`,
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
          : 'No fue posible obtener el perfil fiscal.';
      set({ status: 'error', error: message, profile: null });
    }
  },
  async submitProfile(token, payload) {
    set({ submitting: true, submitError: null });
    try {
      const response = await jsonRequest<ApiCustomerProfileResponse>(
        `/v1/public/customer-fiscal-profiles/${token}/submit`,
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
          : 'No fue posible enviar la información fiscal.';
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
