import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  Provider,
  ProviderBankingInfo,
  ProviderBillingContact,
  ProviderContact,
  ProviderFileMetadata,
  ProviderFiscalAddress,
  ProvidersPagination,
} from '@/features/providers/providersSlice';

export interface FetchProvidersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ApiProvider {
  provider_id: string;
  company_name: string;
  provider_code: string;
  provider_status_id: string;
  provider_status_name: string;
  public_access_token?: string | null;
  public_access_url?: string | null;
  contact?: ApiProviderContact | null;
  created_at: string;
  updated_at: string;
  fiscal_profile?: ApiProviderFiscalProfile | null;
  banking_info?: ApiProviderBankingInfo | null;
}

interface ApiProviderContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface ApiProviderFiscalProfile {
  profile_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiProviderFiscalFormData | null;
  tax_status_certificate_file_id?: string | null;
  tax_compliance_opinion_file_id?: string | null;
  address_proof_file_id?: string | null;
  files_metadata?: ApiProviderFiscalFilesMetadata | null;
}

interface ApiProviderFiscalFormData {
  businessName?: string | null;
  rfc?: string | null;
  address?: ApiProviderFiscalAddress | null;
  billingContact?: ApiProviderBillingContact | null;
  notes?: string | null;
}

interface ApiProviderFiscalAddress {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
}

interface ApiProviderBillingContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface ApiProviderFiscalFilesMetadata {
  tax_status_certificate?: ApiFileMetadata | null;
  tax_compliance_opinion?: ApiFileMetadata | null;
  address_proof?: ApiFileMetadata | null;
}

interface ApiProviderBankingInfo {
  banking_info_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiProviderBankingFormData | null;
  bank_statement_file_id?: string | null;
  files_metadata?: ApiProviderBankingFilesMetadata | null;
}

interface ApiProviderBankingFormData {
  beneficiary?: string | null;
  bank?: string | null;
  accountNumber?: string | null;
  clabe?: string | null;
  creditGranted?: string | null;
  notes?: string | null;
}

interface ApiProviderBankingFilesMetadata {
  bank_statement?: ApiFileMetadata | null;
}

interface ApiFileMetadata {
  file_id: string;
  original_name: string;
  extension: string;
  download_url: string;
}

interface FetchProvidersApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface FetchProvidersResponseMeta {
  pagination: FetchProvidersApiPagination;
}

export interface FetchProvidersResult {
  providers: Provider[];
  pagination: ProvidersPagination;
}

export interface CreateProviderPayload {
  companyName: string;
  providerCode: string;
}

export interface CreateProviderResult {
  provider: Provider;
  message: string | null;
}

export interface UpdateProviderPayload {
  id: string;
  companyName: string;
  providerCode: string;
}

export interface UpdateProviderResult {
  provider: Provider;
  message: string | null;
}

export interface DeleteProviderPayload {
  id: string;
}

export interface DeleteProviderResult {
  id: string;
  message: string | null;
}

function mapContact(contact?: ApiProviderContact | null): ProviderContact | null {
  if (!contact) {
    return null;
  }
  return {
    name: contact.name ?? null,
    phone: contact.phone ?? null,
    email: contact.email ?? null,
  };
}

function mapAddress(address?: ApiProviderFiscalAddress | null): ProviderFiscalAddress | null {
  if (!address) {
    return null;
  }
  return {
    street: address.street ?? null,
    number: address.number ?? null,
    neighborhood: address.neighborhood ?? null,
    city: address.city ?? null,
    state: address.state ?? null,
    postalCode: address.postalCode ?? null,
  };
}

function mapBillingContact(
  contact?: ApiProviderBillingContact | null
): ProviderBillingContact | null {
  if (!contact) {
    return null;
  }
  return {
    name: contact.name ?? null,
    phone: contact.phone ?? null,
    email: contact.email ?? null,
  };
}

function mapFileMetadata(file?: ApiFileMetadata | null): ProviderFileMetadata | null {
  if (!file) {
    return null;
  }
  return {
    fileId: file.file_id,
    originalName: file.original_name,
    extension: file.extension,
    downloadUrl: file.download_url,
  };
}

function mapFiscalProfile(profile?: ApiProviderFiscalProfile | null): Provider['fiscalProfile'] {
  if (!profile) {
    return null;
  }

  return {
    id: profile.profile_id,
    statusId: profile.status_id,
    statusName: profile.status_name,
    submittedAt: profile.submitted_at ?? null,
    businessName: profile.form_data?.businessName ?? null,
    rfc: profile.form_data?.rfc ?? null,
    address: mapAddress(profile.form_data?.address),
    billingContact: mapBillingContact(profile.form_data?.billingContact),
    notes: profile.form_data?.notes ?? null,
    taxStatusCertificateFileId: profile.tax_status_certificate_file_id ?? null,
    taxComplianceOpinionFileId: profile.tax_compliance_opinion_file_id ?? null,
    addressProofFileId: profile.address_proof_file_id ?? null,
    filesMetadata: {
      taxStatusCertificate: mapFileMetadata(profile.files_metadata?.tax_status_certificate),
      taxComplianceOpinion: mapFileMetadata(profile.files_metadata?.tax_compliance_opinion),
      addressProof: mapFileMetadata(profile.files_metadata?.address_proof),
    },
  };
}

function mapBankingInfo(profile?: ApiProviderBankingInfo | null): ProviderBankingInfo | null {
  if (!profile) {
    return null;
  }

  return {
    id: profile.banking_info_id,
    statusId: profile.status_id,
    statusName: profile.status_name,
    submittedAt: profile.submitted_at ?? null,
    beneficiary: profile.form_data?.beneficiary ?? null,
    bank: profile.form_data?.bank ?? null,
    accountNumber: profile.form_data?.accountNumber ?? null,
    clabe: profile.form_data?.clabe ?? null,
    creditGranted: profile.form_data?.creditGranted ?? null,
    notes: profile.form_data?.notes ?? null,
    bankStatementFileId: profile.bank_statement_file_id ?? null,
    filesMetadata: {
      bankStatement: mapFileMetadata(profile.files_metadata?.bank_statement),
    },
  };
}

function mapProvider(provider: ApiProvider): Provider {
  return {
    id: provider.provider_id,
    companyName: provider.company_name,
    providerCode: provider.provider_code,
    statusId: provider.provider_status_id,
    statusName: provider.provider_status_name,
    publicAccessToken: provider.public_access_token ?? null,
    publicAccessUrl: provider.public_access_url ?? null,
    contact: mapContact(provider.contact),
    createdAt: provider.created_at,
    updatedAt: provider.updated_at,
    fiscalProfile: mapFiscalProfile(provider.fiscal_profile),
    bankingInfo: mapBankingInfo(provider.banking_info),
  };
}

export const fetchProviders = createAsyncThunk<
  FetchProvidersResult,
  FetchProvidersParams | undefined,
  { state: RootState }
>('providers/fetchAll', async (params = {}, thunkAPI) => {
  const { page = 1, limit = 12, search } = params;
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search && search.trim()) {
    query.set('search', search.trim());
  }

  try {
    const response = await jsonRequest<ApiProvider[], FetchProvidersResponseMeta>(
      `/v1/providers?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    const apiProviders = Array.isArray(response.data) ? response.data : [];
    const apiPagination = response.meta?.pagination ?? {
      page,
      per_page: limit,
      total: apiProviders.length,
      total_pages: 1,
    };

    return {
      providers: apiProviders.map(mapProvider),
      pagination: {
        page: apiPagination.page,
        perPage: apiPagination.per_page,
        total: apiPagination.total,
        totalPages: apiPagination.total_pages,
      },
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible obtener la lista de proveedores';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchProviderById = createAsyncThunk<Provider, { id: string }, { state: RootState }>(
  'providers/fetchById',
  async ({ id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiProvider>(`/v1/providers/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      });

      return mapProvider(response.data);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener el proveedor';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createProvider = createAsyncThunk<
  CreateProviderResult,
  CreateProviderPayload,
  { state: RootState }
>('providers/create', async ({ companyName, providerCode }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiProvider>(`/v1/providers`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: companyName,
        provider_code: providerCode,
      },
      token,
    });

    return {
      provider: mapProvider(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible crear el proveedor';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateProvider = createAsyncThunk<
  UpdateProviderResult,
  UpdateProviderPayload,
  { state: RootState }
>('providers/update', async ({ id, companyName, providerCode }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiProvider>(`/v1/providers/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: companyName,
        provider_code: providerCode,
      },
      token,
    });

    return {
      provider: mapProvider(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar el proveedor';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteProvider = createAsyncThunk<
  DeleteProviderResult,
  DeleteProviderPayload,
  { state: RootState }
>('providers/delete', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/providers/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
      token,
    });

    return {
      id,
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible eliminar el proveedor';
    return thunkAPI.rejectWithValue(message);
  }
});
