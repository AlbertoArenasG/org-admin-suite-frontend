import { createAsyncThunk } from '@reduxjs/toolkit';
import { jsonRequest } from '@/lib/api-client';
import type { RootState } from '@/store';
import type {
  Customer,
  CustomerAddress,
  CustomerCfdiDetails,
  CustomerContact,
  CustomerFileMetadata,
  CustomersPagination,
} from '@/features/customers/customersSlice';

export interface FetchCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ApiCustomer {
  customer_id: string;
  company_name: string;
  client_code: string;
  customer_status_id: string;
  customer_status_name: string;
  public_access_token?: string | null;
  public_access_url?: string | null;
  created_at: string;
  updated_at: string;
  fiscal_profile?: ApiFiscalProfile | null;
}

interface ApiFiscalProfile {
  profile_id: string;
  status_id: string;
  status_name: string;
  submitted_at?: string | null;
  form_data?: ApiFiscalProfileFormData | null;
  tax_certificate_file_id?: string | null;
  invoice_requirements_file_id?: string | null;
  files_metadata?: ApiFiscalProfileFilesMetadata | null;
}

interface ApiFiscalProfileFormData {
  business_name?: string | null;
  rfc?: string | null;
  tax_regime?: string | null;
  address?: ApiFiscalProfileAddress | null;
  cfdi?: ApiFiscalProfileCfdi | null;
  billing_contact?: ApiFiscalProfileContact | null;
  accounts_payable_contact?: ApiFiscalProfileContact | null;
  requirements_notes?: string | null;
}

interface ApiFiscalProfileAddress {
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  delegation?: string | null;
  city?: string | null;
  postal_code?: string | null;
}

interface ApiFiscalProfileCfdi {
  use?: string | null;
  payment_method?: string | null;
  payment_form?: string | null;
}

interface ApiFiscalProfileContact {
  name?: string | null;
  phone?: string | null;
  email?: string | null;
}

interface ApiFiscalProfileFilesMetadata {
  tax_certificate?: ApiFileMetadata | null;
  invoice_requirements?: ApiFileMetadata | null;
}

interface ApiFileMetadata {
  file_id: string;
  original_name: string;
  extension: string;
  download_url: string;
}

interface FetchCustomersApiPagination {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

interface FetchCustomersResponseMeta {
  pagination: FetchCustomersApiPagination;
}

export interface FetchCustomersResult {
  customers: Customer[];
  pagination: CustomersPagination;
}

export interface CreateCustomerPayload {
  companyName: string;
  clientCode: string;
}

export interface CreateCustomerResult {
  customer: Customer;
  message: string | null;
}

export interface UpdateCustomerPayload {
  id: string;
  companyName: string;
  clientCode: string;
}

export interface UpdateCustomerResult {
  customer: Customer;
  message: string | null;
}

export interface DeleteCustomerPayload {
  id: string;
}

export interface DeleteCustomerResult {
  id: string;
  message: string | null;
}

function mapContact(contact?: ApiFiscalProfileContact | null): CustomerContact | null {
  if (!contact) {
    return null;
  }
  return {
    name: contact.name ?? null,
    phone: contact.phone ?? null,
    email: contact.email ?? null,
  };
}

function mapAddress(address?: ApiFiscalProfileAddress | null): CustomerAddress | null {
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

function mapCfdi(details?: ApiFiscalProfileCfdi | null): CustomerCfdiDetails | null {
  if (!details) {
    return null;
  }
  return {
    use: details.use ?? null,
    paymentMethod: details.payment_method ?? null,
    paymentForm: details.payment_form ?? null,
  };
}

function mapFileMetadata(file?: ApiFileMetadata | null): CustomerFileMetadata | null {
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

function mapFiscalProfile(profile?: ApiFiscalProfile | null): Customer['fiscalProfile'] {
  if (!profile) {
    return null;
  }

  return {
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
      taxCertificate: mapFileMetadata(profile.files_metadata?.tax_certificate),
      invoiceRequirements: mapFileMetadata(profile.files_metadata?.invoice_requirements),
    },
  };
}

function mapCustomer(customer: ApiCustomer): Customer {
  return {
    id: customer.customer_id,
    companyName: customer.company_name,
    clientCode: customer.client_code,
    statusId: customer.customer_status_id,
    statusName: customer.customer_status_name,
    publicAccessToken: customer.public_access_token ?? null,
    publicAccessUrl: customer.public_access_url ?? null,
    createdAt: customer.created_at,
    updatedAt: customer.updated_at,
    fiscalProfile: mapFiscalProfile(customer.fiscal_profile),
  };
}

export const fetchCustomers = createAsyncThunk<
  FetchCustomersResult,
  FetchCustomersParams | undefined,
  { state: RootState }
>('customers/fetchAll', async (params = {}, thunkAPI) => {
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
    const response = await jsonRequest<ApiCustomer[], FetchCustomersResponseMeta>(
      `/v1/customers?${query.toString()}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      }
    );

    const apiCustomers = Array.isArray(response.data) ? response.data : [];
    const apiPagination = response.meta?.pagination ?? {
      page,
      per_page: limit,
      total: apiCustomers.length,
      total_pages: 1,
    };

    return {
      customers: apiCustomers.map(mapCustomer),
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
        : 'No fue posible obtener la lista de clientes';
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchCustomerById = createAsyncThunk<Customer, { id: string }, { state: RootState }>(
  'customers/fetchById',
  async ({ id }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state.auth.token;

    if (!token) {
      return thunkAPI.rejectWithValue('No hay token de autenticación');
    }

    try {
      const response = await jsonRequest<ApiCustomer>(`/v1/customers/${id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        token,
      });

      return mapCustomer(response.data);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'No fue posible obtener el cliente';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createCustomer = createAsyncThunk<
  CreateCustomerResult,
  CreateCustomerPayload,
  { state: RootState }
>('customers/create', async ({ companyName, clientCode }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiCustomer>(`/v1/customers`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: companyName,
        client_code: clientCode,
      },
      token,
    });

    return {
      customer: mapCustomer(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message ? error.message : 'No fue posible crear el cliente';
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateCustomer = createAsyncThunk<
  UpdateCustomerResult,
  UpdateCustomerPayload,
  { state: RootState }
>('customers/update', async ({ id, companyName, clientCode }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<ApiCustomer>(`/v1/customers/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
      },
      body: {
        company_name: companyName,
        client_code: clientCode,
      },
      token,
    });

    return {
      customer: mapCustomer(response.data),
      message: response.successMessage ?? null,
    };
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'No fue posible actualizar el cliente';
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteCustomer = createAsyncThunk<
  DeleteCustomerResult,
  DeleteCustomerPayload,
  { state: RootState }
>('customers/delete', async ({ id }, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state.auth.token;

  if (!token) {
    return thunkAPI.rejectWithValue('No hay token de autenticación');
  }

  try {
    const response = await jsonRequest<null>(`/v1/customers/${id}`, {
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
        : 'No fue posible eliminar el cliente';
    return thunkAPI.rejectWithValue(message);
  }
});
